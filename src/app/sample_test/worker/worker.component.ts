import { Component, OnInit, provide, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import {RecordWAVService} from './record-wav.service';
import {SpeechRecognitionService} from './speech-recognition.service'
import {NgClass} from '@angular/common';
import { Subject, Observable } from 'rxjs/Rx';
import {SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import {EncodeToMp3Service} from './encode-to-mp3.service'
import { UPDATE_SENTENCE } from './../../transcription-reducer';
import {ActionCreatorService} from './../../action-creator.service';

//import {Window} from './window';
//import {Navigator} from './navigator';


provide(Window, { useValue: window });
provide(Navigator, { useValue: Navigator });




declare var window:any;
declare var navigator:any;
declare var firebase: any;

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css'],
  providers: [RecordWAVService, SpeechRecognitionService, EncodeToMp3Service],
  directives: [NgClass]
})


export class WorkerComponent implements OnInit {


  audio_src : SafeResourceUrl;
  audio_enabled : boolean;
  audio_context: any;
  transcript_sentence_arr : Observable<any>;
  audio_blob;

  recordable = false;
  under_recording = false;
  under_encoding = false;
  under_uploading = false;

  constructor( private record_wav: RecordWAVService,
              private speech_recog: SpeechRecognitionService ,
              private _ngZone: NgZone, 
              private sanitizer: DomSanitizationService,
              public store: Store<any>,
              public action_creator :ActionCreatorService,
              private encode_to_mp3: EncodeToMp3Service
              ) {}


  ngOnInit() {

      this.recordable = true;
      this.under_recording = false;
      this.under_encoding = false;
      this.under_uploading = false;

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
      window.URL = window.URL || window.webkitURL;

      this.audio_context = new window.AudioContext();
      navigator.getUserMedia({audio: true},
        this.callback_getusermedia.bind(this),
        (e)=>{
          console.log('No live audio input: ' + e);
          alert("you cannot use this system without activating the audio.")
        }
      );

// http://www.gcgate.jp/engineerblog/2014/03/28/874/
      this.record_wav.audio_source$.subscribe(
        (audio_blob)=>{
          this.audio_blob = audio_blob;
          this._ngZone.run(()=>{
            this.create_audio(audio_blob);
            this.show_transcription();
          });
        }
      )


      this.encode_to_mp3.encode_done$.subscribe(
        (mp3_uint_arr)=>{
          console.log("aaa");
          const storage = firebase.storage();
          const storage_ref = storage.ref();
          const audio_ref = storage_ref.child("audio/aaa.mp3");
          this._ngZone.run(()=>{
            this.under_encoding = false;
            this.under_uploading = true;
          });

          audio_ref.put(mp3_uint_arr).then((snapshot)=>{
            console.log("upload finished");
            this._ngZone.run(()=>{
              this.under_uploading = false;
            });
            return audio_ref.getDownloadURL();
          }).then((firebase_url)=>{
            console.log(firebase_url);
            const audio_element = new Audio();
            audio_element.src = firebase_url;
            audio_element.controls = true;
            const audio_container_element = document.getElementById("uploaded_audio");
            audio_container_element.insertBefore(audio_element, null);
          })

        }
      )
  }

  upload_file(){
    if(this.audio_blob){
      this.under_encoding = true;
      this.encode_to_mp3.encode_wav_to_mp3(this.audio_blob);
    }
  }


  show_transcription(){
    this.transcript_sentence_arr = this.store.select('transcript');
  }

  create_audio(audio_blob){
      let audio_src = window.URL.createObjectURL(audio_blob);
      const converted_audio_src = window.btoa(window.unescape(audio_src));
      console.log("converted_audio_src");
      console.log(converted_audio_src);
      console.log("audio src");
      console.log(audio_src);
      /*
      if(audio_src.indexOf("%3A") != -1){
        audio_src = audio_src.replace(/%3A/, ":");
        console.log("audio src converted with replace");
        console.log(audio_src);
      }else{
        console.log("not found");
      }
      */
      const santized_audio_src = this.sanitizer.bypassSecurityTrustResourceUrl( audio_src);
      console.log("santized url");
      console.log(santized_audio_src);

      const audio_element = new Audio();
      audio_element.controls = true;
      audio_element.src = audio_src;
      audio_element.addEventListener("play", ()=>{ this.Audio_Time_update("play", audio_element.currentTime)});
      audio_element.addEventListener("seeked", ()=>{ this.Audio_Time_update("seek", audio_element.currentTime)});
      audio_element.addEventListener("timeupdate", ()=>{ this.Audio_Time_update("time_update", audio_element.currentTime)});
      const audio_container_element = document.getElementById("audio_player");
      audio_container_element.insertBefore(audio_element, null);

  }

  prev_updated_time = 0;

  Audio_Time_update(type, current_time){

      console.log(current_time);
      current_time = current_time * 1000;

      if(type=="time_update"){
        var duration = current_time - this.prev_updated_time;
        console.log("duration " + duration);
        if(duration > 0.5){
          const obj = this.action_creator.transcription_play(current_time);
          this.store.dispatch(obj);
        }
      }else if (type=="seek"){
          const obj = this.action_creator.transcription_play(current_time);
          this.store.dispatch(obj);
      }else if (type=="play"){
          const obj = this.action_creator.transcription_play(0);
          this.store.dispatch(obj);
      }
  }
  

  callback_getusermedia = (stream) => {
      console.log("stream start");
      const input = this.audio_context.createMediaStreamSource(stream);
      this.record_wav.update_setting(input, {numChannels: 1}) 

      this._ngZone.run(()=>{
        this.audio_enabled = true;
      })
  }

  set_language(lang_str){

    this.speech_recog.set_language(lang_str);

  }


  startRecording = ()=>{
    console.log("start recording");
    this.record_wav.start_record();
    this.under_recording = true;
    this.recordable = false;
    this.speech_recog.start_recognition();
  }

  stopRecording = ()=>{
    console.log("stop recording");
    this.record_wav.stop_record();
    this.under_recording = false;
    this.recordable = true;
    this.speech_recog.stop_recognition();
  }

/*
  put_dummy_transcription = ()=>{
    this.speech_recog.put_dummy_transcript_data();
    this.show_transcription();
  }

  add_transcript_data = ()=>{
    this.speech_recog.add_transcript_data();
  }

*/
  update_each_sentence(id, sentence){
    var obj = this.action_creator.transcription_update_sentence(id,sentence);
    this.store.dispatch(obj);
  }

  edit_each_sentence(id){
    const obj = this.action_creator.transcription_editstatus(id);
    this.store.dispatch(obj);
  }


}

import { Component, OnInit, provide, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import {RecordMp3Service} from './record-mp3.service';
import {NgClass} from '@angular/common';
import { Subject } from 'rxjs/Rx';

//import {Window} from './window';
//import {Navigator} from './navigator';


provide(Window, { useValue: window });
provide(Navigator, { useValue: Navigator });


declare var window:any;
declare var navigator:any;

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css'],
  providers: [RecordMp3Service],
  directives: [NgClass],
  changeDetection: ChangeDetectionStrategy.Default
})
export class WorkerComponent implements OnInit {


  recordable : boolean;
  recording : boolean;
  audio_exist : boolean = false;
  audio_src : string;
  audio_enabled : boolean;
  text_data : string = "111";
  text_data2 : string = "sss";
  audio_context: any;

  constructor( private record_mp3: RecordMp3Service, private ref: ChangeDetectorRef, private _ngZone: NgZone) {

    this.text_data = "222";

    const that = this;


  }





  ngOnInit() {



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
      this.record_mp3.audio_source$.subscribe(
        (audio_blob)=>{
          const audio_src = window.URL.createObjectURL(audio_blob);
          this.audio_src = audio_src
          this.audio_exist = true;
          console.log("audio recorded");
        }
      )


    this.recordable = true;
    this.recording = false;

  }

  callback_getusermedia = (stream) => {
      console.log("stream start");
      const input = this.audio_context.createMediaStreamSource(stream);
      this.record_mp3.update_setting(input, {numChannels: 1}) 

      this._ngZone.run(()=>{
        console.log(this);
        this.audio_enabled = true;
        this.text_data = "444";
      })
  
      //this.ref.markForCheck();

  }



  update_data = ()=>{
    this.text_data2 = "777";
  }

/*
  test_test(){
    this.that.text_data = "666"
  }
  */


  startRecording = ()=>{
    console.log("start recording");
    this.record_mp3.start_record();
    this.recording = true;
    this.recordable = false;
  }

  stopRecording = ()=>{
    console.log("stop recording");
    this.record_mp3.stop_record();
    this.recording = false;
    this.recordable = true;
  }


}


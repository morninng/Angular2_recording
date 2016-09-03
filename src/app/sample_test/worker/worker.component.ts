import { Component, OnInit, provide } from '@angular/core';
import {RecordMp3Service} from './record-mp3.service';
import {NgClass} from '@angular/common';

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
  directives: [NgClass]
})
export class WorkerComponent implements OnInit {


  recordable : boolean;
  recording : boolean;
  audio_exist : boolean = false;
  audio_src : string;

  constructor( private record_mp3: RecordMp3Service) {

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
      window.URL = window.URL || window.webkitURL;

      const audio_context = new window.AudioContext();

      navigator.getUserMedia({audio: true},
        (stream)=>{
          console.log("stream start");
          const input = audio_context.createMediaStreamSource(stream);
          record_mp3.update_setting(input, {numChannels: 1})
        },
        (e)=>{
          console.log('No live audio input: ' + e);
        }
      );

// http://www.gcgate.jp/engineerblog/2014/03/28/874/
      record_mp3.audio_source$.subscribe(
        (audio_blob)=>{
          const audio_src = window.URL.createObjectURL(audio_blob);
          this.audio_src = audio_src
          this.audio_exist = true;
          console.log("audio recorded");
        }
      )
  }



  ngOnInit() {

    this.recordable = true;
    this.recording = false;

  }

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


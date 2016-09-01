import { Component, OnInit, provide } from '@angular/core';
import {RecordMp3Service} from './record-mp3.service';

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
  providers: [RecordMp3Service]
})
export class WorkerComponent implements OnInit {

  audio_context

  constructor( record_mp3: RecordMp3Service) {

    console.log("worker component constructor");

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

      window.URL = window.URL || window.webkitURL;

      this.audio_context = new window.AudioContext();

    navigator.getUserMedia({audio: true},
      (stream)=>{
        console.log("stream start");
        const input = this.audio_context.createMediaStreamSource(stream);
    //    record_mp3.update_setting(input, {aa:"bb"})


      },
      (e)=>{
        console.log('No live audio input: ' + e);
      }
    );


  }

  private startUserMedia = ()=>{
    
  }
  




  ngOnInit() {
  }

  startRecording = ()=>{
    console.log("start recording");
  }

  stopRecording = ()=>{
    console.log("stop recording");
  }

}


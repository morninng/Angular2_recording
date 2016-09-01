import { Injectable } from '@angular/core';


declare var Recorder:any;

@Injectable()
export class RecordMp3Service {

  recorder : any;
  enc_worker : any;
  recorder_worker: any;


  constructor() { 
    console.log("record mp3");
  }

  update_setting(input, cfg){

    console.log(cfg);
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    var numChannels = config.numChannels || 2;
//    this.recorder = new Recorder()

    this.enc_worker = new Worker('js/mp3Worker.js');
    this.recorder_worker = new Worker('js/recorderWorker.js');
    console.log("worker new done");

  }

  start_record(){
    this.enc_worker.postMessage("hello");
  }


}

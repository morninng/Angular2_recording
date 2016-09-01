import { Injectable } from '@angular/core';


declare var Recorder:any;

@Injectable()
export class RecordMp3Service {

  recorder

  constructor() { 
    console.log("record mp3");
  }

  update_setting(input, cfg){
    
    console.log(cfg);
    this.recorder = new Recorder()

  }

}

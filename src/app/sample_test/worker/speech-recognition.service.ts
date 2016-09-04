import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import { ADD_SENTENCE } from './../../transcription-reducer';
import {ActionCreatorService} from './../../action-creator.service';


declare var window:any;


@Injectable()
export class SpeechRecognitionService {

  recognition: any;
  available : boolean;
  speech_start_time: any;

  constructor(public store: Store<any>, public action_creator :ActionCreatorService) {
    if(!window.webkitSpeechRecognition){
      this.available = false;
      return;
    }
    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = "en-US";

    this.recognition.onresult = (e)=>{
    		const results = e.results;
    		for(var i = e.resultIndex; i<results.length; i++){
    			if(results[i].isFinal){
    				console.log(results[i][0].transcript);
            const new_sentence = results[i][0].transcript

            const current_time = new Date().getTime();
            const speech_time_spent = current_time - this.speech_start_time;
            const obj = this.action_creator.transcription_addsentence(new_sentence, speech_time_spent);
            this.store.dispatch(obj);
    			}
    		}
    }
    
  }

   set_language = (lang_str) => {
     this.recognition.lang = lang_str;
   }
   
   start_recognition(){
     this.recognition.start();
     this.speech_start_time = new Date().getTime();
   }

    stop_recognition(){

        setTimeout(() =>{
            console.log("--recognition stop--");
            console.log(this.recognition);
            this.recognition.stop();
        },1000);

    }

    put_dummy_transcript_data(){

      const obj_1 = this.action_creator.transcription_addsentence("aaa", 1000);
      this.store.dispatch(obj_1);
      const obj_2 = this.action_creator.transcription_addsentence("bbb", 2000);
      this.store.dispatch(obj_2);
      const obj_3 = this.action_creator.transcription_addsentence("ccc", 3000);
      this.store.dispatch(obj_3);

    }

    add_transcript_data(){

      const obj = this.action_creator.transcription_addsentence("ddd", 4000);
      this.store.dispatch(obj);

    }


}

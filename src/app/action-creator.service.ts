import {ADD_SENTENCE,UPDATE_SENTENCE,RESET_SENTENCE,UPDATE_TIME, EDIT_ITEM_STATUS } from "./transcription-reducer";



import { Injectable } from '@angular/core';

@Injectable()
export class ActionCreatorService {

  constructor() { }

  transcription_addsentence(sentence, end_time){
    const action_obj = {
      type:ADD_SENTENCE,
      payload: {
        id: this.generate_id(),
        sentence,
        end_time
      }
    }
    return action_obj;
  }

  transcription_update_sentence(id,sentence ){
    const action_obj = {
      type:UPDATE_SENTENCE,
      payload: {
        id,
        sentence
      }
    }
    return action_obj;
  }

  transcription_update_time(id,end_time ){
    const action_obj = {
      type:UPDATE_SENTENCE,
      payload: {
        id,
        end_time
      }
    }
    return action_obj;
  }



  transcription_editstatus(id){
    const action_obj = {
      type:EDIT_ITEM_STATUS,
      payload: {
        id
      }
    }
    return action_obj;
  }




  private generate_id(){
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

}

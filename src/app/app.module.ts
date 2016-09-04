import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provide } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { WorkerComponent } from './sample_test/worker/worker.component';

import { Store, StoreModule } from '@ngrx/store';
import {TranscriptionReducer} from './transcription-reducer';
import {ActionCreatorService} from './action-creator.service'


@NgModule({
  declarations: [
    AppComponent,
    WorkerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StoreModule.provideStore({  transcript: TranscriptionReducer }, {  transcript: [] })
  ],
  providers: [ActionCreatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }


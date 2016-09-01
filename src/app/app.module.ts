import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provide } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { WorkerComponent } from './sample_test/worker/worker.component';




@NgModule({
  declarations: [
    AppComponent,
    WorkerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

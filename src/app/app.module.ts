import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from './app.service';
import { TasksFinishedComponent } from './tasks-finished/tasks-finished.component';
import { TaskListComponent } from './task-list/task-list.component';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {
  FontAwesomeModule,
  FaIconLibrary
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, TasksFinishedComponent, TaskListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    NgbModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [CookieService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(libreary: FaIconLibrary) {
    libreary.addIconPacks(fas);
  }
}

import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TaskModel } from '../Model/TaskModel';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private taskListRet;

  constructor(private cookieService: CookieService) {}

  setCookie(taskList: Array<TaskModel>, TaskQueue: string): void {
    this.cookieService.set(TaskQueue, JSON.stringify(taskList));
  }

  getCookie(TaskQueue: string): Array<TaskModel> {
    return JSON.parse(this.cookieService.get(TaskQueue));
  }
}

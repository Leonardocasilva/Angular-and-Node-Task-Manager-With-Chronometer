import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskModel } from '../Model/TaskModel';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private taskListRet;
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getTasks() {
    return this.http.get<Array<TaskModel>>(`${this.api}/tasks/`);
  }

  setTask(task: TaskModel) {
    return this.http.post(`${this.api}/tasks/`, task);
  }

  editTask(task: TaskModel) {
    return this.http.put(`${this.api}/tasks/${task._id}`, task);
  }

  updateTime(task: TaskModel) {
    return this.http.put(`${this.api}/tasks/time/${task._id}`, task);
  }

  startTask(task: TaskModel) {
    return this.http.put<Array<TaskModel>>(`${this.api}/tasks/start/${task._id}`, task);
  }

  stopTask(task: TaskModel) {
    return this.http.put(`${this.api}/tasks/stop/${task._id}`, task);
  }

  finsihTask(task: TaskModel) {
    return this.http.put(`${this.api}/tasks/finish/${task._id}`, task);
  }

  reopenTask(task: TaskModel) {
    return this.http.put(`${this.api}/tasks/reopen/${task._id}`, task);
  }

  setCookie(taskList: Array<TaskModel>, TaskQueue: string): void {
    this.cookieService.set(TaskQueue, JSON.stringify(taskList));
  }

  getCookie(TaskQueue: string): Array<TaskModel> {
    return JSON.parse(this.cookieService.get(TaskQueue));
  }
}

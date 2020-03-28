import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private taskListRet;

  constructor(private cookieService: CookieService) { }

  setCookie(taskList): void {
    this.cookieService.set('TaskManagerList', JSON.stringify(taskList));
  }

  getCookie() {
    this.taskListRet = JSON.parse(this.cookieService.get('TaskManagerList'));

    return this.taskListRet;
  }

}

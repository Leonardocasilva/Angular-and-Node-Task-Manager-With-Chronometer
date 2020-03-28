import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { TaskModel } from 'src/Model/TaskModel';

@Component({
  selector: 'app-tasks-finished',
  templateUrl: './tasks-finished.component.html',
  styleUrls: ['./tasks-finished.component.scss']
})
export class TasksFinishedComponent implements OnInit {
  Tasks: Array<TaskModel> = [];
  taskTotalTime: string;


  constructor(private service: AppService) { }

  ngOnInit(): void {
    this.Tasks = this.service.getCookie();

    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    this.Tasks.forEach(t => {
      seconds += parseInt(t.seconds, 10);
      minutes += parseInt(t.minutes, 10);
      hours += parseInt(t.minutes, 10);
    });

    let RemainSeconds = (seconds / 60).toString();
    let RemainMinutes = Math.floor(seconds / 60) + minutes;
    let RemainHours = hours +  Math.floor(minutes);

    console.log(RemainSeconds);
  }

}

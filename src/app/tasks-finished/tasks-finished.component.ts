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

  constructor(private service: AppService) {}

  ngOnInit(): void {
    this.Tasks = this.service.getCookie();

    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    this.Tasks.forEach(t => {
      seconds += parseFloat(t.seconds);
      minutes += parseFloat(t.minutes);
      hours += parseFloat(t.hours);
    });

    let RemainSeconds = (seconds / 60 - Math.floor(seconds / 60))
      .toString()
      .substr(2, 2);

    let RemainMinutes = (
      (Math.floor(seconds / 60) + minutes) / 60 -
      Math.floor((Math.floor(seconds / 60) + minutes) / 60)
    )
      .toString()
      .substr(2, 2);

    let RemainHours = Math.floor(
      hours + (Math.floor(seconds / 60) + minutes) / 60
    ).toString();

    if (RemainSeconds.length === 1) {
      RemainSeconds = `0${RemainSeconds}`;
    }

    if (RemainMinutes.length === 1) {
      RemainMinutes = `0${RemainMinutes}`;
    }

    if (RemainHours.length === 1) {
      RemainHours = `0${RemainHours}`;
    }

    this.taskTotalTime = `${RemainHours}:${RemainMinutes}:${RemainSeconds}`;
  }
}

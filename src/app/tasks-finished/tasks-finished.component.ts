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
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    // TaskManagerList
    this.Tasks = this.service
      .getCookie('TaskManagerList')
      .filter((el, i, arr) => {
        return el.done === true;
      });

    this.Tasks.forEach(t => {
      seconds += parseFloat(t.seconds);
      minutes += parseFloat(t.minutes);
      hours += parseFloat(t.hours);
    });

    this.taskTotalTime = this.calculateTotal(hours, minutes, seconds);
  }

  calculateTotal(hours: number, minutes: number, seconds: number): string {
    let RemainSeconds = 0;
    let RemainMinutes = 0;
    let RemainHours = 0;

    let calculator;

    let ret: string;

    if (seconds >= 60) {
      calculator = this.remainDecimals(seconds / 60);

      RemainMinutes += calculator.integer;

      while (calculator.decimal >= 60) {
        calculator = this.remainDecimals(calculator.decimal / 60);

        if (calculator.integer > 0) {
          RemainMinutes += calculator.integer;
        }

        if (calculator.decimal < 60) {
          RemainSeconds = calculator.decimal;
          break;
        }
      }
    } else {
      RemainSeconds = seconds;
    }

    if (minutes >= 60) {
      calculator = this.remainDecimals((RemainMinutes + minutes) / 60);

      RemainHours += calculator.integer;

      while (calculator.decimal >= 60) {
        calculator = this.remainDecimals(calculator.decimal / 60);

        if (calculator.integer > 0) {
          RemainHours += calculator.integer;
        }

        if (calculator.decimal < 60) {
          RemainMinutes = calculator.decimal;
          break;
        }
      }
    } else {
      RemainMinutes = minutes;
    }

    RemainHours += hours;

    if (RemainHours.toString().length === 1) {
      ret = `0${RemainHours}`;
    } else {
      ret = `${RemainHours}`;
    }

    if (RemainMinutes.toString().length === 1) {
      ret += `:0${RemainMinutes}`;
    } else {
      ret += `:${RemainMinutes}`;
    }

    if (RemainSeconds.toString().length === 1) {
      ret += `:0${RemainSeconds}`;
    } else {
      ret += `:${RemainSeconds}`;
    }

    return ret;
  }

  remainDecimals(num: number) {
    const ret = num.toString().split('.');

    return {
      integer: parseFloat(ret[0]),
      decimal: parseFloat(ret[1].substring(0, 2))
    };
  }
}

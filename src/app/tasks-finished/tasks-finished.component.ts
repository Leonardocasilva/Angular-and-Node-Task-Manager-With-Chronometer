import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { TaskModel } from 'src/Model/TaskModel';
import Swal from 'sweetalert2';

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

    this.ValidationTasks();

    this.Tasks.forEach(t => {
      seconds += parseFloat(t.seconds);
      minutes += parseFloat(t.minutes);
      hours += parseFloat(t.hours);
    });

    this.taskTotalTime = this.calculateTotal(hours, minutes, seconds);
  }

  reopen(task: TaskModel): void {
    Swal.fire({
      title: 'Reopen Task',
      text: 'Are you sure that you want reopen this task?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!'
    }).then(result => {
      if (result.value) {
        this.service.getCookie('TaskManagerList').filter((el, i, arr) => {
          if (el.id === task.id) {
            el.done = false;
            this.Tasks = arr;
          }
        });

        this.service.setCookie(this.Tasks, 'TaskManagerList');
        this.ValidationTasks();

        Swal.fire(
          'Task Finished',
          'Your task was finished with success!',
          'success'
        );
      }
    });
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

  remainDecimals(num: number): object {
    const ret = num.toString().split('.');

    return {
      integer: parseFloat(ret[0]),
      decimal: parseFloat(ret[1].substring(0, 2))
    };
  }

  ValidationTasks(): void {
    let teste = this.service.getCookie('TaskManagerList');

    this.Tasks = this.service
      .getCookie('TaskManagerList')
      .filter((el, i, arr) => {
        return el.done === true;
      });
  }
}

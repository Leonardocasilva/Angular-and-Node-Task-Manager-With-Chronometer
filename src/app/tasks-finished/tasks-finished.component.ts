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

  constructor(private service: AppService) { }

  ngOnInit(): void {
    this.ValidationTasks();
  }

  reopen(task: TaskModel): void {
    Swal.fire({
      title: "Reopen Task",
      text: "Are you sure that you want reopen this task?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, do it!"
    }).then(result => {
      if (result.value) {
        this.service.getCookie("TaskManagerList").filter((el, i, arr) => {
          if (el.id === task.id) {
            el.done = false;
          }

          this.Tasks = arr;
        });

        this.service.setCookie(this.Tasks, "TaskManagerList");
        this.ValidationTasks();

        Swal.fire(
          "Task Finished",
          "Your task was finished with success!",
          "success"
        );
      }
    });
  }

  calculateTotal(): void {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    let RemainSeconds = 0;
    let RemainMinutes = 0;
    let RemainHours = 0;

    let calculator;

    let ret: string;

    this.Tasks.forEach(t => {
      seconds += parseFloat(t.seconds);
      minutes += parseFloat(t.minutes);
      hours += parseFloat(t.hours);
    });

    if (seconds > 59) {
      calculator = this.remainDecimals(seconds);

      RemainMinutes += calculator.integer;

      if (calculator.decimal > 59) {
        while (calculator.decimal > 59) {
          calculator = this.remainDecimals(calculator.decimal);

          if (calculator.integer > 0) {
            RemainMinutes += calculator.integer;
          }

          if (calculator.decimal < 60) {
            RemainSeconds += calculator.decimal;
            break;
          }
        }
      } else {
        RemainSeconds += calculator.decimal;
      }
    } else {
      RemainSeconds += seconds;
    }

    if (minutes > 59) {
      calculator = this.remainDecimals(RemainMinutes + minutes);

      RemainHours += calculator.integer;

      if (calculator.decimal > 59) {
        while (calculator.decimal > 59) {
          calculator = this.remainDecimals(calculator.decimal);

          if (calculator.integer > 0) {
            RemainHours += calculator.integer;
          }

          if (calculator.decimal < 60) {
            RemainMinutes += calculator.decimal;
            break;
          }
        }
      } else {
        RemainMinutes += calculator.decimal;
      }
    } else {
      RemainMinutes += minutes;
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

    this.taskTotalTime = ret;
  }

  remainDecimals(num: number): object {
    // const ret = num.toString().split('.');

    return {
      integer: parseFloat((num / 60).toString().split('.')[0]),
      decimal: parseFloat((num % 60).toString())
    };
  }

  ValidationTasks(): void {
    try {
      this.Tasks = this.service
        .getCookie('TaskManagerList')
        .filter((el, i, arr) => {
          return el.done === true;
        });

      this.calculateTotal();
    } catch (ex) {
      console.log(ex.error);
    }
  }
}

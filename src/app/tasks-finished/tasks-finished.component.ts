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
        this.service.reopenTask(task).subscribe( result => {
          Swal.fire(result['title'], result['message'], 'success');
          this.ValidationTasks();
        }, er => {
          Swal.fire(er['title'], er['message'], 'error');
        });
      }
    });
  }

  ValidationTasks(): void {
    this.service.getTasks().subscribe(
      result => {
        this.Tasks = result.filter((el, i, arr) => {
          return el.done === true;
        });

        this.calculateTotal();
      },
      er => {
        Swal.fire(er.title, er.message, "error");
      }
    );
  }

  private remainDecimals(num: number): object {
    return {
      integer: parseFloat((num / 60).toString().split('.')[0]),
      decimal: parseFloat((num % 60).toString())
    };
  }

  private calculateTotal(): void {
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
}

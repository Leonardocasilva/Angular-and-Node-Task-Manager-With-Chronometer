import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TaskModel } from "../../Model/TaskModel";
import { AppService } from "../app.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.component.html",
  styleUrls: ["./task-list.component.scss"]
})
export class TaskListComponent implements OnInit {
  TaskStarted: Array<any> = [];
  Tasks: Array<TaskModel> = [];

  constructor(private service: AppService) {}

  ngOnInit() {
    this.ValidationTasks(true);
  }

  creatTask(taskName): void {
    const task = new TaskModel();
    task.name = taskName;

    this.service.setTask(task).subscribe(
      result => {
        Swal.fire(result["title"], result["message"], "success");
      },
      er => {
        Swal.fire(er["title"], er["message"], "error");
      }
    );

    this.ValidationTasks();
  }

  StopTask(task: TaskModel): void {
    clearInterval(this.TaskStarted[task._id]);

    this.service.stopTask(task).subscribe(
      result => {
        this.ValidationTasks();
      },
      er => {
        Swal.fire(er.title, er.message, "error");
      }
    );
  }

  EditTask(task: TaskModel, newName: string): void {
    task.name = newName;

    this.service.editTask(task).subscribe(
      result => {
        Swal.fire(result["title"], result["message"], "success");
        this.ValidationTasks();
      },
      er => {
        Swal.fire(er["title"], er["message"], "error");
      }
    );
  }

  StartTask(task: TaskModel): void {
    let seconds: number = 0;
    let minutes: number = 0;
    let hours: number = 0;

    this.service.startTask(task).subscribe(result => {
      const TaskStr = setInterval(() => {
        this.Tasks = this.Tasks.filter((el, i, arr) => {
          if (el._id === task._id) {
            seconds = parseFloat(el.seconds) + 1;
            minutes = parseFloat(el.minutes) + 1;
            hours = parseFloat(el.hours) + 1;

            el.seconds =
              seconds.toString().length === 1
                ? "0" + seconds.toString()
                : seconds.toString();

            if (el.seconds === "60") {
              el.seconds = "00";
              el.minutes =
                minutes.toString().length === 1
                  ? "0" + minutes.toString()
                  : minutes.toString();
            }

            if (el.minutes === "60") {
              el.minutes = "00";
              el.hours =
                hours.toString().length === 1
                  ? "0" + hours.toString()
                  : hours.toString();
            }
          }

          return arr;
        });
        this.service.updateTime(task).subscribe();
      }, 1000);

      this.TaskStarted[task._id] = TaskStr;
      this.ValidationTasks();
    });
  }

  ValidationTasks(validateRunningTask: boolean = false): void {
    this.service.getTasks().subscribe(
      result => {
        this.Tasks = result.filter((el, i, arr) => {
          return el.done === false;
        });

        if (validateRunningTask) {
          this.Tasks.forEach(t => {
            if (t.stopped === false && t.new === false) {
              this.StartTask(t);
            }
          });
        }
      },
      er => {
        Swal.fire(er.title, er.message, "error");
      }
    );
  }

  create(): void {
    Swal.fire({
      title: "New Task",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      inputValidator: text =>
        (text.length >= 18 && "Max character is 18") ||
        (text.length < 3 && "Min Character is 3"),
      showCancelButton: true,
      confirmButtonText: "Save",
      showLoaderOnConfirm: true,
      preConfirm: taskName => {
        this.creatTask(taskName);
      }
    });
  }

  edit(task: TaskModel): void {
    Swal.fire({
      title: "Edit Task",
      input: "text",
      inputValue: task.name,
      inputAttributes: {
        autocapitalize: "off"
      },
      inputValidator: text =>
        (text.length > 18 && "Max character is 18") ||
        (text.length < 3 && "Min Character is 3"),
      showCancelButton: true,
      confirmButtonText: "Edit",
      showLoaderOnConfirm: true,
      preConfirm: taskName => {
        this.EditTask(task, taskName);
      }
    });
  }

  finish(task: TaskModel): void {
    Swal.fire({
      title: 'Finish Task',
      text: 'Are you sure that you want finish this task?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!'
    }).then(result => {
      if (result.value) {
        this.service.finsihTask(task).subscribe( result => {
          Swal.fire(result['title'], result['message'], 'success');
          this.ValidationTasks();
        }, er => {
          Swal.fire(er.title, er.message, "error");
        });
      }
    });
  }
}

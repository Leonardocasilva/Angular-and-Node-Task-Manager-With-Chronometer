import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskModel } from '../../Model/TaskModel';
import { AppService } from '../app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  TaskStarted: Array<any> = [];
  Tasks: Array<TaskModel> = [];
  Task: TaskModel;

  constructor(private service: AppService) {}

  ngOnInit() {
    this.ValidationTasks();
  }

  creatTask(taskName): void {
    this.Task = new TaskModel();
    this.Task.name = taskName;
    let localTasks: Array<TaskModel> = [];

    try {
      localTasks = this.service.getCookie('TaskManagerList');

      this.Task.id = localTasks.length;

      localTasks.push(this.Task);
    } catch (ex) {
      localTasks.push(this.Task);
    }

    this.service.setCookie(localTasks, 'TaskManagerList');
    this.ValidationTasks();
  }

  StopTask(task: TaskModel): void {
    clearInterval(this.TaskStarted[task.id]);

    try {
    this.Tasks = this.service.getCookie('TaskManagerList').filter((el, i, arr) => {
          if (el.id === task.id) {
            el.stopped = true;
          }

          return arr;
        });

    this.service.setCookie(this.Tasks, 'TaskManagerList');
    this.ValidationTasks();
    } catch (ex) {
      Swal.fire('Ops', 'Something went wrong!', 'error');
    }
  }

  EditTask(task: TaskModel, newName: string): void {
    try {
      this.Tasks = this.service.getCookie('TaskManagerList').filter((el, i, arr) => {
        if (el.id === task.id) {
          el.name = newName;
        }

        return arr;
      });

      this.service.setCookie(this.Tasks, 'TaskManagerList');
      this.ValidationTasks();
    } catch (ex) {
      Swal.fire('Ops', 'Something went wrong!', 'error');
    }
  }

  StartTask(task: TaskModel): void {
    try {
      this.Tasks = this.service.getCookie('TaskManagerList').filter((el, i, arr) => {
        if (el.id === task.id) {
          el.isNew = false;
          el.stopped = false;
        }

        return arr;
      });

      this.service.setCookie(this.Tasks, 'TaskManagerList');
      this.ValidationTasks();

      let seconds: number = 0;
      let minutes: number = 0;
      let hours: number = 0;

      const TaskStr = setInterval(() => {
        this.Tasks = this.service.getCookie('TaskManagerList').filter((el, i, arr) => {
          if (el.id === task.id) {
            seconds = parseFloat(el.seconds) + 1;
            minutes = parseFloat(el.minutes) + 1;
            hours = parseFloat(el.hours) + 1;

            el.seconds = seconds.toString().length === 1
            ? '0' + seconds.toString()
            : seconds.toString();

            if (el.seconds === '60') {
              el.seconds = '00';
              el.minutes =
                minutes.toString().length === 1
                  ? '0' + minutes.toString()
                  : minutes.toString();
            }

            if (el.minutes === '60') {
              el.minutes = '00';
              el.hours =
                hours.toString().length === 1
                  ? '0' + hours.toString()
                  : hours.toString();
            }
          }

          return arr;
        });

        this.service.setCookie(this.Tasks, 'TaskManagerList');
      }, 1000);

      this.TaskStarted[task.id] = TaskStr;
    } catch (ex) {
      Swal.fire('Ops', 'Something went wrong!', 'error');
    }

  }

  ValidationTasks(): void {
    try {
      this.Tasks = this.service
        .getCookie('TaskManagerList')
        .filter((el, i, arr) => {
          return el.done === false;
        });

      this.Tasks.forEach(t => {
        if (t.stopped === false && t.isNew === false) {
          this.StartTask(t);
        }
      });
    } catch (ex) {
    }
  }

  create(): void {
    Swal.fire({
      title: 'New Task',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      inputValidator: text =>
        (text.length >= 18 && 'Max character is 18') ||
        (text.length < 3 && 'Min Character is 3'),
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: taskName => {
        this.creatTask(taskName);

        Swal.fire(
          'Task Created',
          'Your task was created with success!',
          'success'
        );
      }
    });
  }

  edit(task: TaskModel): void {
    Swal.fire({
      title: 'Edit Task',
      input: 'text',
      inputValue: task.name,
      inputAttributes: {
        autocapitalize: 'off'
      },
      inputValidator: text =>
        (text.length > 18 && 'Max character is 18') ||
        (text.length < 3 && 'Min Character is 3'),
      showCancelButton: true,
      confirmButtonText: 'Edit',
      showLoaderOnConfirm: true,
      preConfirm: taskName => {
        this.EditTask(task, taskName);

        Swal.fire(
          'Task Edited',
          'Your task was edited with success!',
          'success'
        );
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
        try {
          this.Tasks = this.service.getCookie('TaskManagerList').filter((el, i, arr) => {
            if (el.id === task.id) {
              el.done = true;
              if (el.stopped === false) {
                el.stopped = true;
              }
            }

            return arr;
          });

          this.service.setCookie(this.Tasks, 'TaskManagerList');
          this.ValidationTasks();

          Swal.fire(
            'Task Finished',
            'Your task was finished with success!',
            'success'
          );
        }catch (ex) {
          Swal.fire('Ops', 'We find a error, let`s try again?');
          this.ValidationTasks();
        }
      }
    });
  }
}

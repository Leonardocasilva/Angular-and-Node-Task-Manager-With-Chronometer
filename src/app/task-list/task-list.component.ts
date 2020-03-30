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

    if (this.Tasks.length !== 0) {
      this.Task.id = this.Tasks.length + 1;
    }

    this.Tasks.push(this.Task);

    this.service.setCookie(this.Tasks, 'TaskManagerList');
  }

  StopTask(task: TaskModel): void {
    clearInterval(this.TaskStarted[task.id]);

    this.Tasks.filter((el, i, arr) => {
      if (el.id === task.id) {
        el.stopped = true;
        this.Tasks = arr;
      }
    });

    this.service.setCookie(this.Tasks, 'TaskManagerList');
  }

  EditTask(task: TaskModel, newName: string): void {
    this.Tasks.filter((el, i, arr) => {
      if (el.id === task.id) {
        el.name = newName;
        this.Tasks = arr;
      }
    });

    this.service.setCookie(this.Tasks, 'TaskManagerList');
  }

  StartTask(task: TaskModel): void {
    const taskIn = this.Tasks.filter((el, i, arr) => {
      if (el.id === task.id) {
        el.isNew = false;
        el.stopped = false;
        return el;
      }
    });

    const TaskStr = setInterval(() => {
      const seconds = parseFloat(taskIn[0].seconds) + 1;
      const minutes = parseFloat(taskIn[0].minutes) + 1;
      const hours = parseFloat(taskIn[0].hours) + 1;

      taskIn[0].seconds =
        seconds.toString().length === 1
          ? '0' + seconds.toString()
          : seconds.toString();

      if (taskIn[0].seconds === '60') {
        taskIn[0].seconds = '00';
        taskIn[0].minutes =
          minutes.toString().length === 1
            ? '0' + minutes.toString()
            : minutes.toString();
      }

      if (taskIn[0].minutes === '60') {
        taskIn[0].minutes = '00';
        taskIn[0].hours =
          hours.toString().length === 1
            ? '0' + hours.toString()
            : hours.toString();
      }

      this.Tasks.filter((el, i, arr) => {
        if (el.id === task.id) {
          this.Tasks = arr;
        }
      });

      this.service.setCookie(this.Tasks, 'TaskManagerList');
    }, 1000);

    this.TaskStarted[task.id] = TaskStr;
  }

  ValidationTasks(): void {
    try {
      debugger;
      let test = this.service.getCookie('TaskManagerList');

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
    } catch (ex) {}
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
        this.service.getCookie('TaskManagerList').filter((el, i, arr) => {
          if (el.id === task.id) {
            el.done = true;
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
}

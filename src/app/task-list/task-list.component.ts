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

  ngOnInit(): void {
    this.ValidationTasks();
  }

  creatTask(taskName) {
    this.Task = new TaskModel();

    this.Task.name = taskName;

    if (this.Tasks.length !== 0) {
      this.Task.id = this.Tasks.length + 1;
    }

    this.Tasks.push(this.Task);

    this.service.setCookie(this.Tasks, 'TaskManagerList');
  }

  StopTask(id) {
    clearInterval(this.TaskStarted[id]);

    this.Tasks.filter((el, i, arr) => {
      if (el.id === id) {
        el.stopped = true;
        this.Tasks = arr;
      }
    });

    this.service.setCookie(this.Tasks, 'TaskManagerList');
  }

  EditTask(task: TaskModel, newName: string) {
    this.Tasks.filter((el, i, arr) => {
      if (el.id === task.id) {
        el.name = newName;
        this.Tasks = arr;
      }
    });

    this.service.setCookie(this.Tasks, 'TaskManagerList');
  }

  StartTask(id) {
    const task = this.Tasks.filter((el, i, arr) => {
      if (el.id === id) {
        el.isNew = false;
        el.stopped = false;
        return el;
      }
    });

    const TaskStr = setInterval(() => {
      const seconds = parseFloat(task[0].seconds) + 1;
      const minutes = parseFloat(task[0].minutes) + 1;
      const hours = parseFloat(task[0].hours) + 1;

      task[0].seconds =
        seconds.toString().length === 1
          ? '0' + seconds.toString()
          : seconds.toString();

      if (task[0].seconds === '60') {
        task[0].seconds = '00';
        task[0].minutes =
          minutes.toString().length === 1
            ? '0' + minutes.toString()
            : minutes.toString();
      }

      if (task[0].minutes === '60') {
        task[0].minutes = '00';
        task[0].hours =
          hours.toString().length === 1
            ? '0' + hours.toString()
            : hours.toString();
      }

      this.Tasks.filter((el, i, arr) => {
        if (el.id === id) {
          this.Tasks = arr;
        }
      });

      this.service.setCookie(this.Tasks, 'TaskManagerList');
    }, 1000);

    this.TaskStarted[id] = TaskStr;
  }

  ValidationTasks() {
    const notDone: Array<any> = [];

    try {
      this.Tasks = this.service
        .getCookie('TaskManagerList')
        .filter((el, i, arr) => {
          return el.done === false;
        });

      this.Tasks.forEach(t => {
        if (t.stopped === false && t.isNew === false) {
          this.StartTask(t.id);
        }
      });
    } catch (ex) {}
  }

  create() {
    Swal.fire({
      title: 'New Task',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
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

  edit(task: TaskModel) {
    Swal.fire({
      title: 'Edit Task',
      input: 'text',
      inputValue: task.name,
      inputAttributes: {
        autocapitalize: 'off'
      },
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

  finish(task: TaskModel) {
    let taskDone: Array<TaskModel>;

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

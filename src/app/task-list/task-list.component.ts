import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskModel } from '../../Model/TaskModel';
import { AppService } from '../app.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  CloseResult = '';
  ModalTaskName = 'New Task';
  ModalEdit = false;
  TaskStarted: Array<any> = [];
  Tasks: Array<TaskModel> = [];
  EditableTaskId = null;
  Task: TaskModel;
  Form: FormGroup;

  constructor(private service: AppService, private modalService: NgbModal) { }

  ngOnInit(): void {

    this.Form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });

    // this.service.setCookie(teste);

    this.ValidationTasks();
  }

  creatTask(task: TaskModel) {
    this.Task = new TaskModel();

    this.Task.name = task.name;

    if (this.Tasks.length !== 0) {
      this.Task.id = this.Tasks.length + 1;
    }

    this.Tasks.push(this.Task);

    this.service.setCookie(this.Tasks);
  }

  StopTask(id) {
    clearInterval(this.TaskStarted[id]);

    this.Tasks.filter((el, i, arr) => {
      if (el.id === id) {
        el.stopped = true;
        this.Tasks = arr;
      }
    });

    this.service.setCookie(this.Tasks);
  }

  EditTask(task: TaskModel, content) {
    this.open(content);

    this.Form.patchValue({
      name: task.name
    });

    this.EditableTaskId = task.id;

    this.ModalTaskName = 'Edit';

    this.ModalEdit = true;
  }

  SubmitEditTask(task, content) {
    this.Tasks.filter((el, i, arr) => {
      if (el.id === this.EditableTaskId) {
        el.name = task.name;
        this.Tasks = arr;
      }
    });

    this.service.setCookie(this.Tasks);

    this.modalService.dismissAll(content);

    this.EditableTaskId = null;
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

        task[0].seconds = seconds.toString().length === 1 ?
          '0' + seconds.toString() : seconds.toString();

        if (task[0].seconds === '60') {
          task[0].seconds = '00';
          task[0].minutes = minutes.toString().length === 1 ?
            '0' + minutes.toString() : minutes.toString();
        }

        if (task[0].minutes === '60') {
          task[0].minutes = '00';
          task[0].hours = hours.toString().length === 1 ?
            '0' + hours.toString() : hours.toString();
        }

        this.Tasks.filter((el, i, arr) => {
          if (el.id === id) {
            this.Tasks = arr;
          }
        });

        this.service.setCookie(this.Tasks);
    }, 1000);

    this.TaskStarted[id] = TaskStr;
  }

  ValidationTasks() {
    const notDone: Array<any> = [];

    try {
      this.Tasks = this.service.getCookie();

      this.Tasks.filter((el, i, arr) => {
        if (!el.done) {
          notDone.push(el);
        }
      });

      this.Tasks = notDone;

      this.Tasks.forEach(t => {
        if (t.stopped === false && t.isNew === false) {
          this.StartTask(t.id);
        }
      });

    } catch (ex) { }
  }

  open(content) {
    this.ModalTaskName = 'New Task';

    this.ModalEdit = false;

    this.Form.patchValue({
      name: null
    });

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(result => {
      this.modalService.dismissAll(content);
    });
  }
}

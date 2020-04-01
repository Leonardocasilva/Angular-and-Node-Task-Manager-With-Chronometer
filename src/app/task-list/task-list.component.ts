import { Component, OnInit } from '@angular/core';
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


  constructor(private service: AppService) {}

  ngOnInit() {
    this.ValidationTasks();
  }

  creatTask(taskName): void {
    const task = new TaskModel();
    task.name = taskName;

    this.service.setTask(task).subscribe(
      result => {
        Swal.fire(result['title'], result['message'], 'success');
      },
      er => {
        Swal.fire(er['title'], er['message'], 'error');
      }
    );

    this.ValidationTasks();
  }

  StopTask(task: TaskModel): void {
    clearInterval(this.TaskStarted[task._id]);

    this.service.stopTask(task).subscribe(
      result => {
        // Note Implemented
      },
      er => {
        Swal.fire(er.title, er.message, 'error');
      }
    );
  }

  EditTask(task: TaskModel, newName: string): void {
    task.name = newName;

    this.service.editTask(task).subscribe(
      result => {
        Swal.fire(result['title'], result['message'], 'success');
      },
      er => {
        Swal.fire(er['title'], er['message'], 'error');
      }
    );
  }

  StartTask(task: TaskModel) {
    this.service.startTask(task)
    .subscribe(result => {
      // Not Implemented
    }, er => {
      Swal.fire(er.title, er.message, 'error');
    });
  }

  ValidationTasks() {
    setInterval(() => {
      this.service.getTasks().subscribe(
        result => {
          this.Tasks = result.filter((el, i, arr) => {
            return el.done === false;
          });
        },
        er => {
          Swal.fire(er.title, er.message, 'error');
        }
      );
    }, 1000);
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
        this.service.finsihTask(task)
        .subscribe( result => {
          Swal.fire(result['title'], result['message'], 'success');
        }, er => {
          Swal.fire(er.title, er.message, 'error');
        });
      }
    });
  }
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksFinishedComponent } from './tasks-finished/tasks-finished.component';
import { TaskListComponent } from './task-list/task-list.component';


const routes: Routes = [
  {path: '', component: TaskListComponent},
  {path: 'finished', component: TasksFinishedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

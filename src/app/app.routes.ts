import { Routes } from '@angular/router';
import { BodyComponent } from './main/shared/body/body.component';
import { TaskListComponent } from './main/task-list/task-list.component';
import { TaskFormComponent } from './main/task-form/task-form.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  {
    path: '',
    component: BodyComponent,
    children: [
      { path: 'tasks', component: TaskListComponent },
      { path: 'tasks/create', component: TaskFormComponent },
      { path: 'tasks/edit/:id', component: TaskFormComponent },
     
    ],
  },
  
];

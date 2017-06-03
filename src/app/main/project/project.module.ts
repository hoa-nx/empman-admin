import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { Routes, RouterModule } from '@angular/router';

const projectRoutes: Routes = [
  //localhost:4200/main/project
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/project/index
  { path: 'index', component: ProjectComponent }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(projectRoutes)
  ],
  declarations: [ProjectComponent]
})
export class ProjectModule { }

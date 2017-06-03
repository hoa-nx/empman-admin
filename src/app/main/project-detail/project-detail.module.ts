import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailComponent } from './project-detail.component';
import { Routes, RouterModule } from '@angular/router';

const projectdetalRoutes: Routes = [
  //localhost:4200/main/project-detail
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/project-detail/index
  { path: 'index', component: ProjectDetailComponent }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(projectdetalRoutes)
  ],
  declarations: [ProjectDetailComponent]
})
export class ProjectDetailModule { }

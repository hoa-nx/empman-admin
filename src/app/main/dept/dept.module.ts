import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeptComponent } from './dept.component';
import { Routes, RouterModule } from '@angular/router';

const deptRoutes: Routes = [
  //localhost:4200/main/dept
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/dept/index
  { path: 'index', component: DeptComponent }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(deptRoutes)
  ],
  declarations: [DeptComponent]
})
export class DeptModule { }

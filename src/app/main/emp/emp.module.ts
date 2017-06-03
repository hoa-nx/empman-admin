import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpComponent } from './emp.component';
import { Routes, RouterModule } from '@angular/router';

const empRoutes: Routes = [
   //localhost:4200/main/emp
  { path: '', redirectTo: 'index', pathMatch: 'full' },
   //localhost:4200/main/emp/index
  { path: 'index', component: EmpComponent}
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(empRoutes)
  ],
  declarations: [EmpComponent]
})
export class EmpModule { }

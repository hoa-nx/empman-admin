import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionComponent } from './position.component';
import { Routes, RouterModule } from '@angular/router';

const positionRoutes: Routes = [
  //localhost:4200/main/position
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/position/index
  { path: 'index', component: PositionComponent }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(positionRoutes)
  ],
  declarations: [PositionComponent]
})
export class PositionModule { }

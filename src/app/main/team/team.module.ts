import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team.component';
import { Routes, RouterModule } from '@angular/router';

const teamRoutes: Routes = [
  //localhost:4200/main/team
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/team/index
  { path: 'index', component: TeamComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(teamRoutes)
  ],
  declarations: [TeamComponent]
})
export class TeamModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommondataComponent } from './commondata.component';
import { Routes, RouterModule } from '@angular/router';

const commondataRoutes: Routes = [
  //localhost:4200/main/commondata
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/commondata/index
  { path: 'index', component: CommondataComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(commondataRoutes)
  ],
  declarations: [CommondataComponent]
})
export class CommondataModule { }

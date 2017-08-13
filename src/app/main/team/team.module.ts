import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { MdCheckboxModule, MdAutocompleteModule } from '@angular/material';
import { SharedModule } from '../../shared/module/shared.module';
import { CalendarModule } from 'primeng/primeng';
import { SessionService } from '../../core/services/session.service';
import { TeamComponent } from './team.component';

const teamRoutes: Routes = [
  //localhost:4200/main/team
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/team/index
  { path: 'index', component: TeamComponent }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forChild(teamRoutes),
    SharedModule,
    MdCheckboxModule,
    MdAutocompleteModule,
    CalendarModule
  ],
  declarations: [TeamComponent],
  providers: [DataService, NotificationService, UploadService , SessionService]
})
export class TeamModule { }

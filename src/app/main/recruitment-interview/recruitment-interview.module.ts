import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RecruitmentInterviewComponent } from './recruitment-interview.component';
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
import {MultiSelectModule} from 'primeng/primeng';

const recruitmentInterviewRoutes: Routes = [
  //localhost:4200/main/project
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/project/index
  { path: 'index', component: RecruitmentInterviewComponent }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forChild(recruitmentInterviewRoutes),
    SharedModule,
    MdCheckboxModule,
    MdAutocompleteModule,
    CalendarModule,
    MultiSelectModule
  ],
  declarations: [RecruitmentInterviewComponent],
  providers: [DataService, NotificationService, UploadService, SessionService]
})
export class RecruitmentInterviewModule { }

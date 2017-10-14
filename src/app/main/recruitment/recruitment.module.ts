import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruitmentComponent } from './recruitment.component';
import { Routes, RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { SessionService } from '../../core/services/session.service';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../shared/module/shared.module';
import { MdCheckboxModule, MdAutocompleteModule } from '@angular/material';
import { CalendarModule, MultiSelectModule } from 'primeng/primeng';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

const recruitmentRoutes: Routes = [
  //localhost:4200/main/recruiment
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/recruiment/index
  { path: 'index', component: RecruitmentComponent },
  { path: 'index/:id', component: RecruitmentComponent }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forChild(recruitmentRoutes),
    SharedModule,
    MdCheckboxModule,
    MdAutocompleteModule,
    CalendarModule,
    MultiSelectModule,
    MultiselectDropdownModule
  ],
  declarations: [RecruitmentComponent],
  providers: [DataService, NotificationService, UploadService, SessionService]
})
export class RecruitmentModule { }
 
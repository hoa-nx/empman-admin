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
import { RecruitmentStaffComponent } from './recruitment-staff.component';
import {AutoCompleteModule} from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/primeng';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { MappingService } from '../../shared/utils/mapping.service';
import { Ng2FileDropModule } from 'ng2-file-drop';

const recruitmentStaffRoutes: Routes = [
  //localhost:4200/main/project
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/project/index
  { path: 'index', component: RecruitmentStaffComponent },
  { path: 'index/:id', component: RecruitmentStaffComponent }
]


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forChild(recruitmentStaffRoutes),
    SharedModule,
    MdCheckboxModule,
    MdAutocompleteModule,
    CalendarModule,
    AutoCompleteModule,
    MultiSelectModule,
    MultiselectDropdownModule,
    Ng2FileDropModule
  ],
  declarations: [RecruitmentStaffComponent],
  providers: [DataService, NotificationService, UploadService, SessionService , MappingService]
})
export class RecruitmentStaffModule { }

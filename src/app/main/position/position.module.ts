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
import { MasterComponent } from "app/main/master-data/master.component";
import { PositionComponent } from './position.component';


const positionRoutes: Routes = [
  //localhost:4200/main/position
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/position/index
  { path: 'index', component: PositionComponent }
]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forChild(positionRoutes),
    SharedModule,
    MdCheckboxModule,
    MdAutocompleteModule,
    CalendarModule
  ],
  declarations: [PositionComponent],
  providers: [DataService, NotificationService, UploadService, SessionService]
})
export class PositionModule { }

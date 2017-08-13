import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { SearchModalComponent } from '../../shared/search-modal/search-modal.component';
import { OnReturnDirective } from '../../shared/directives/keyenter.directive';
import { CalendarModule } from 'primeng/primeng';

const companyRoutes: Routes = [
  //localhost:4200/main/company
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/company/index
  { path: 'index', component: CompanyComponent }
]

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    FormsModule,
    MultiselectDropdownModule,
    Daterangepicker,
    ModalModule.forRoot(),
    RouterModule.forChild(companyRoutes),
    CalendarModule
  ],
  declarations: [CompanyComponent, SearchModalComponent, OnReturnDirective],
  providers: [DataService, NotificationService, UploadService],
  entryComponents: [],
  bootstrap: []
})
export class CompanyModule { }

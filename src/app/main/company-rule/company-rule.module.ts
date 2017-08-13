import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

const companyRuleRoutes: Routes = [
  //localhost:4200/main/company-rule
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/company-rule/index
  { path: 'index', component: CompanyRuleComponent }
]

import { CompanyRuleComponent } from './company-rule.component';

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    FormsModule,
    MultiselectDropdownModule,
    Daterangepicker,
    ModalModule.forRoot(),
    RouterModule.forChild(companyRuleRoutes),
    CalendarModule
  ],
  declarations: [CompanyRuleComponent],
  providers: [DataService, NotificationService, UploadService],
})
export class CompanyRuleModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpComponent } from './emp.component';
import { Routes, RouterModule } from '@angular/router';
import { EmpListComponent } from './emp-list.component';
import { EmpCardComponent } from './emp-card.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule, TabsModule } from 'ngx-bootstrap';
import { MobileHideDirective } from '../../shared/directives/mobile-hide.directive';
import { ItemsService } from '../../shared/utils/items.service';
import { Daterangepicker } from 'ng2-daterangepicker';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { MdRadioModule, MdDatepickerModule, MdNativeDateModule, MdInputModule } from '@angular/material';
import { MdCheckboxModule } from '@angular/material';
import { MdAutocompleteModule } from '@angular/material';
import { SharedModule } from '../../shared/module/shared.module';
import { EmpExpandableComponent } from './emp-expandable.component';
import { DataService } from '../../core/services/data.service';
import { MappingService } from '../../shared/utils/mapping.service';
import { SessionService } from '../../core/services/session.service';
import { NotificationService } from '../../core/services/notification.service';
import { EmpBasicComponent } from './emp-basic.component';
import { EmpProfileComponent } from './emp-profile.component';
import { EmpProfileTechComponent } from './emp-profile-tech.component';
import { EmpProfileWorkComponent } from './emp-profile-work.component';
import { EmpContractComponent } from './emp-contract.component';
import { EmpSalaryComponent } from './emp-salary.component';
import { EmpAllowanceComponent } from './emp-allowance.component';
import { EmpDetailWorkComponent } from './emp-detail-work.component';
import { EmpOnsiteComponent } from './emp-onsite.component';
import { EmpSupportComponent } from './emp-support.component';
import { EmpEstimateComponent } from './emp-estimate.component';
import { TabsetComponent } from 'ngx-bootstrap';
import { AccordionModule } from 'primeng/primeng';     //accordion and accordion tab
import { CalendarModule } from 'primeng/primeng';     //CalendarModule
import { MenuItem } from 'primeng/primeng';            //api
import { PickListModule } from 'primeng/primeng';
import { DndModule } from 'ng2-dnd';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

const empRoutes: Routes = [
  //localhost:4200/main/emp
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'card-list', redirectTo: 'card-list', pathMatch: 'full' },
  { path: 'emp-expandable', redirectTo: 'emp-expandable', pathMatch: 'full' },
  { path: 'work', redirectTo: 'work', pathMatch: 'full' },
  //localhost:4200/main/emp/index
  { path: 'index', component: EmpComponent },
  { path: 'card-list', component: EmpListComponent },
  { path: 'card-list/:filter', component: EmpListComponent },
  { path: 'emp-expandable', component: EmpExpandableComponent },
  { path: 'emp-expandable/:group', component: EmpExpandableComponent },
  //{ path: ':id/emp-basic', component: EmpBasicComponent}
  { path: 'edit/:id/:action', component: EmpBasicComponent },
  { path: 'work', component: EmpDetailWorkComponent }

]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MultiselectDropdownModule,
    Daterangepicker,
    Ng2FileDropModule,
    MdRadioModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forChild(empRoutes),
    SharedModule,
    MdCheckboxModule,
    MdAutocompleteModule,
    TabsModule.forRoot(),
    AccordionModule,
    CalendarModule,
    PickListModule,
    MdCheckboxModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdAutocompleteModule,
    MdInputModule,
    MdRadioModule,
    DndModule.forRoot()
  ],
  declarations: [
    MobileHideDirective,
    EmpComponent,
    EmpCardComponent,
    EmpListComponent,
    EmpExpandableComponent,
    EmpBasicComponent,
    EmpProfileComponent,
    EmpProfileTechComponent,
    EmpProfileWorkComponent,
    EmpContractComponent,
    EmpSalaryComponent,
    EmpAllowanceComponent,
    EmpDetailWorkComponent,
    EmpOnsiteComponent,
    EmpSupportComponent,
    EmpEstimateComponent
  ],
  providers: [DataService, NotificationService, ItemsService, MappingService, SessionService]
})
export class EmpModule { }

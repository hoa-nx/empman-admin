import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule, TabsModule } from 'ngx-bootstrap';
import { MobileHideDirective } from '../../shared/directives/mobile-hide.directive';
import { ItemsService } from '../../shared/utils/items.service';
import { Daterangepicker } from 'ng2-daterangepicker';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { MdRadioModule } from '@angular/material';
import { MdCheckboxModule } from '@angular/material';
import { MdAutocompleteModule } from '@angular/material';
import { SharedModule } from '../../shared/module/shared.module';
import { DataService } from '../../core/services/data.service';
import { MappingService } from '../../shared/utils/mapping.service';
import { SessionService } from '../../core/services/session.service';
import { NotificationService } from '../../core/services/notification.service';
import { TabsetComponent } from 'ngx-bootstrap';
import { AccordionModule, AutoCompleteModule, MultiSelectModule } from 'primeng/primeng';     //accordion and accordion tab
import { CalendarModule } from 'primeng/primeng';     //CalendarModule
import { MenuItem } from 'primeng/primeng';            //api
import { EstimateComponent } from './estimate.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { EstimateEditComponent } from './estimate-edit.component';
import { LoaderService } from '../../shared/utils/spinner.service';
import { ChipsModule } from 'primeng/primeng';

const estimateRoutes: Routes = [
  //localhost:4200/main/estimate
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/estimate/index
  { path: 'index', component: EstimateComponent },
  //localhost:4200/main/estimate/edit/1/edit
  { path: 'edit/:id/:action', component: EstimateEditComponent }
]


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Daterangepicker,
    Ng2FileDropModule,
    MdRadioModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forChild(estimateRoutes),
    SharedModule,
    MdCheckboxModule,
    MdAutocompleteModule,
    TabsModule.forRoot(),
    AccordionModule,
    CalendarModule,
    AutoCompleteModule,
    MultiSelectModule,
    MultiselectDropdownModule,
    Ng2FileDropModule,
    ChipsModule
  ],
  declarations: [EstimateComponent, EstimateEditComponent],
  providers: [DataService, NotificationService, ItemsService, MappingService, SessionService]
})
export class EstimateModule { }
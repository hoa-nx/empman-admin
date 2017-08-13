import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueComponent } from './revenue.component';
import { Routes, RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RevenueEditComponent } from './revenue-edit.component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { ItemsService } from '../../shared/utils/items.service';
import { MappingService } from '../../shared/utils/mapping.service';
import { SharedModule } from '../../shared/module/shared.module';
import { RevenueListComponent } from './revenue-list.component';
import { RevenueGridComponent } from './revenue-grid.component';
import { DataTableModule, CalendarModule } from 'primeng/primeng';
import { SessionService } from '../../core/services/session.service';
import { MdCheckboxModule } from '@angular/material';
import { MdAutocompleteModule } from '@angular/material';

const revenueRoutes: Routes = [
  //localhost:4200/main/revenue
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/revenue/index
  { path: 'index', component: RevenueComponent },
  { path: 'list', component: RevenueListComponent },
  { path: 'grid', component: RevenueGridComponent },
  //localhost:4200/main/revenue/id/edit
  //{ path: ':id/edit', component: RevenueEditComponent}
  { path: 'edit/:id/:action', component: RevenueEditComponent }
]

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    FormsModule,
    MultiselectDropdownModule,
    Daterangepicker,
    ModalModule.forRoot(),
    RouterModule.forChild(revenueRoutes),
    SharedModule,
    MdCheckboxModule,
    MdAutocompleteModule,
    DataTableModule,
    CalendarModule
  ],
  declarations: [RevenueComponent, RevenueEditComponent, RevenueListComponent, RevenueGridComponent],
  providers: [DataService, NotificationService, ItemsService, MappingService, SessionService]
})
export class RevenueModule { }

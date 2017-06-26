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
const revenueRoutes: Routes = [
  //localhost:4200/main/revenue
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/revenue/index
  { path: 'index', component: RevenueComponent },
  //localhost:4200/main/revenue/id/edit
  { path: ':id/edit', component: RevenueEditComponent}
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
    SharedModule
  ],
  declarations: [RevenueComponent,RevenueEditComponent],
  providers : [DataService, NotificationService, ItemsService, MappingService]
})
export class RevenueModule { }

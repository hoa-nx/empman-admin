import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetComponent } from './target.component';
import { Routes, RouterModule } from '@angular/router';
import { TargetEditComponent } from './target-edit.component';
import { SharedModule } from '../../shared/module/shared.module';
import { ModalModule, TabsModule } from 'ngx-bootstrap';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { ItemsService } from '../../shared/utils/items.service';
import { MappingService } from '../../shared/utils/mapping.service';
import { TabsetComponent } from 'ngx-bootstrap';

const targetRoutes: Routes = [
  //localhost:4200/main/target
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/target/index
  { path: 'index', component: TargetComponent },
  //localhost:4200/main/target/id/edit
  { path: 'edit/:id/:action', component: TargetEditComponent}
]

@NgModule({
  imports: [
        CommonModule,
        PaginationModule,
        FormsModule,
        MultiselectDropdownModule,
        Daterangepicker,
        ModalModule.forRoot(),
        RouterModule.forChild(targetRoutes),
        SharedModule,
        TabsModule.forRoot()
  ],
  declarations: [TargetComponent ,TargetEditComponent],
  providers : [DataService, NotificationService, ItemsService, MappingService]
})
export class TargetModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/module/shared.module';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { ItemsService } from '../../shared/utils/items.service';
import { MappingService } from '../../shared/utils/mapping.service';
import { PaginationModule, TabsModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MdCheckboxModule } from '@angular/material';
//import * as FileSaver from 'file-saver';//https://stackoverflow.com/questions/40240796/angular-2-best-approach-to-use-filesaver-js
import { CalendarModule } from 'primeng/primeng';

const homeRoutes: Routes = [
  //localhost:4200/main/home
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/home/index
  { path: 'index', component: HomeComponent }
]

@NgModule({
  imports: [
    CommonModule,
        PaginationModule,
        FormsModule,
        MultiselectDropdownModule,
        Daterangepicker,
        ModalModule.forRoot(),
        RouterModule.forChild(homeRoutes),
        SharedModule,
        CalendarModule,
        MdCheckboxModule,
        TabsModule.forRoot()
  ],
  declarations: [HomeComponent],
  providers : [DataService, NotificationService, ItemsService, MappingService]
})
export class HomeModule { }

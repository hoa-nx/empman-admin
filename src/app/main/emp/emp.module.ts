import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpComponent } from './emp.component';
import { Routes, RouterModule } from '@angular/router';
import { EmpListComponent } from './emp-list.component';
import { EmpCardComponent } from './emp-card.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap';
import { MobileHideDirective } from '../../shared/directives/mobile-hide.directive';
import { ItemsService } from '../../shared/utils/items.service';
import { Daterangepicker } from 'ng2-daterangepicker';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { MdRadioModule } from '@angular/material';
import { SharedModule } from '../../shared/module/shared.module';

const empRoutes: Routes = [
  //localhost:4200/main/emp
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'card-list', redirectTo: 'card-list', pathMatch: 'full' },

  //localhost:4200/main/emp/index
  { path: 'index', component: EmpComponent },
  { path: 'card-list', component: EmpListComponent }
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
    RouterModule.forChild(empRoutes),
    SharedModule
  ],
  declarations: [
    MobileHideDirective,
    EmpComponent,
    EmpCardComponent,
    EmpListComponent
  ],
  providers: [
    ItemsService
  ]
})
export class EmpModule { }

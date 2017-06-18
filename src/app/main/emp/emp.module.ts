import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpComponent } from './emp.component';
import { Routes, RouterModule } from '@angular/router';
import { EmpListComponent } from './emp-list.component';
import { EmpCardComponent } from './emp-card.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { HighlightDirective } from '../../shared/directives/highlight.directive';
import { MobileHideDirective } from '../../shared/directives/mobile-hide.directive';
import { ItemsService } from '../../shared/utils/items.service';
import { Daterangepicker } from 'ng2-daterangepicker';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { MdRadioModule } from '@angular/material';

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
    RouterModule.forChild(empRoutes)
  ],
  declarations: [
    DateFormatPipe,
    HighlightDirective,
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

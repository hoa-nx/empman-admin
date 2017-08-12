import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { Routes, RouterModule } from '@angular/router';
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
import { ImportComponent } from './import.component';
import { MdCheckboxModule } from '@angular/material';
import { MdAutocompleteModule } from '@angular/material';
import { MdDatepickerModule } from '@angular/material';
import { MdNativeDateModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { DateAdapter } from '@angular/material';
import { MD_DATE_FORMATS } from '@angular/material';
import { NativeDateAdapter } from "@angular/material";
import { MdRadioModule } from '@angular/material';
import { DndModule } from 'ng2-dnd';
import { SessionService } from '../../core/services/session.service';

const targetRoutes: Routes = [
  //localhost:4200/main/setting
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/setting/index
  { path: 'index', component: SettingComponent },
  { path: 'index/:url', component: SettingComponent },
  //localhost:4200/main/setting/import
  { path: 'import', component: ImportComponent }

]

export class MyDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat == "input") {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    } else {
      return date.toDateString();
    }
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  dateInput: 'input',
  monthYearLabel: { year: 'numeric', month: 'short' },
  dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  monthYearA11yLabel: { year: 'numeric', month: 'long' },
};

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
    TabsModule.forRoot(),
    MdCheckboxModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdAutocompleteModule,
    MdInputModule,
    MdRadioModule,
    DndModule.forRoot()

  ],
  declarations: [SettingComponent, ImportComponent],
  providers: [DataService,
    NotificationService,
    ItemsService,
    SessionService,
    MappingService/*,
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MD_DATE_FORMATS, useValue: MY_DATE_FORMATS },*/
  ]
})

export class SettingModule { }


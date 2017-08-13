import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeRateComponent } from './exchange-rate.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { SharedModule} from '../../shared/module/shared.module';
import { Fab } from '../../shared/components/fab-button/fab';
import { FabButton } from '../../shared/components/fab-button/fabbutton';
import { FabToggle } from '../../shared/components/fab-button/fabtoggle';
import { CalendarModule } from 'primeng/primeng';

const exchangeRateRoutes: Routes = [
  //localhost:4200/main/company
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/company/index
  { path: 'index', component: ExchangeRateComponent }
]

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    FormsModule,
    Daterangepicker,
    ModalModule.forRoot(),
    SharedModule ,
    RouterModule.forChild(exchangeRateRoutes),
    CalendarModule
  ],
  declarations: [ExchangeRateComponent , Fab , FabButton, FabToggle ],
  providers: [DataService, NotificationService, UploadService],
  entryComponents: [],
  bootstrap: []
})
export class ExchangeRateModule { }

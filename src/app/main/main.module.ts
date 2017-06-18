import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { mainRoutes } from './main.routes';
import { RouterModule, Routes } from '@angular/router';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';
import { UtilityService } from '../core/services/utility.service';
import { AuthenService } from '../core/services/authen.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SidebarMenuComponent } from '../shared/sidebar-menu/sidebar-menu.component';
import { TopMenuComponent } from '../shared/top-menu/top-menu.component';
import { RightbarMenuComponent } from '../shared/rightbar-menu/rightbar-menu.component';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@NgModule({
  imports: [
    CommonModule,
    UserModule,
    HomeModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(mainRoutes)
  ],
  providers:[UtilityService,AuthenService],
  declarations: [MainComponent,SidebarMenuComponent,TopMenuComponent, RightbarMenuComponent]
})
export class MainModule { }

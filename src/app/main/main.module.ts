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
@NgModule({
  imports: [
    CommonModule,
    UserModule,
    HomeModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(mainRoutes)
  ],
  providers:[UtilityService,AuthenService],
  declarations: [MainComponent]
})
export class MainModule { }

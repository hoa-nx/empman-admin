import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { Routes, RouterModule } from '@angular/router';

const customerRoutes: Routes = [
   //localhost:4200/main/customer
  { path: '', redirectTo: 'index', pathMatch: 'full' },
   //localhost:4200/main/customer/index
  { path: 'index', component: CustomerComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(customerRoutes)
  ],
  declarations: [CustomerComponent]
})
export class CustomerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { Routes, RouterModule } from '@angular/router';

const companyRoutes: Routes = [
   //localhost:4200/main/company
  { path: '', redirectTo: 'index', pathMatch: 'full' },
   //localhost:4200/main/company/index
  { path: 'index', component: CompanyComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(companyRoutes)
  ],
  declarations: [CompanyComponent]
})
export class CompanyModule { }

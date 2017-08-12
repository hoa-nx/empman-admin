import { Routes } from '@angular/router';
import { MainComponent } from './main.component';

export const mainRoutes: Routes = [
    {
        //localhost:4200/main
        path: '', component: MainComponent, children: [
            //localhost:4200/main
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            //localhost:4200/main/home
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            //localhost:4200/main/role
            { path: 'role', loadChildren: './role/role.module#RoleModule' },
            //localhost:4200/main/user
            { path: 'user', loadChildren: './user/user.module#UserModule' },
            //localhost:4200/main/user
            { path: 'function', loadChildren: './function/function.module#FunctionModule' },
            //localhost:4200/main/user
            { path: 'product', loadChildren: './product/product.module#ProductModule' },
            //localhost:4200/main/user
            { path: 'product-category', loadChildren: './product-category/product-category.module#ProductCategoryModule' },
            //localhost:4200/main/emp
            { path: 'emp', loadChildren: './emp/emp.module#EmpModule' },
            //localhost:4200/main/company
            { path: 'company', loadChildren: './company/company.module#CompanyModule' },
            //localhost:4200/main/dept
            { path: 'dept', loadChildren: './dept/dept.module#DeptModule' },
            //localhost:4200/main/team
            { path: 'team', loadChildren: './team/team.module#TeamModule' },
            //localhost:4200/main/position
            { path: 'position', loadChildren: './position/position.module#PositionModule' },
            //localhost:4200/main/project
            { path: 'project', loadChildren: './project/project.module#ProjectModule' },
            //localhost:4200/main/project-detail
            { path: 'project-detail', loadChildren: './project-detail/project-detail.module#ProjectDetailModule' },
            //localhost:4200/main/commondata
            { path: 'master-data', loadChildren: './master-data/master-data.module#MasterDataModule' },
            //localhost:4200/main/revenue
            { path: 'revenue', loadChildren: './revenue/revenue.module#RevenueModule' },
            //localhost:4200/main/exchange-rate
            { path: 'exchange-rate', loadChildren: './exchange-rate/exchange-rate.module#ExchangeRateModule' },
            //localhost:4200/main/exchange-rate
            { path: 'customer', loadChildren: './customer/customer.module#CustomerModule' },
            //localhost:4200/main/exchange-rate
            { path: 'customer-unitprice', loadChildren: './customer-unitprice/customer-unitprice.module#CustomerUnitpriceModule' },
            //localhost:4200/main/target
            { path: 'target', loadChildren: './target/target.module#TargetModule' },
            //localhost:4200/main/setting
            { path: 'setting', loadChildren: './setting/setting.module#SettingModule' },
        ]
    }

]
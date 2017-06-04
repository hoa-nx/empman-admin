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
            { path: 'commondata', loadChildren: './commondata/commondata.module#CommondataModule' }
        ]
    }

]
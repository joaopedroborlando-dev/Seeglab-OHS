import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './core/guards/auth-guard.service';
import { DepartmentComponent } from './features/business/department/department.component';
import { RoleComponent } from './features/business/role/role.component';
import { EmployeeComponent } from './features/business/employee/employee.component';
import { HazardInventoryComponent } from './features/pgr/hazard-inventory/hazard-inventory.component';
import { HazardAssessmentComponent } from './features/pgr/hazard-assessment/hazard-assessment.component';
import { DepartmentInclusionComponent } from './features/pgr/department-inclusion/department-inclusion.component';
import { EpiComponent } from './features/epi-control/epi/epi.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'pgr/work-unit-inclusion', component: HazardInventoryComponent, canActivate: [AuthGuard], },
  { path: 'pgr/work-unit-inclusion/:inventoryId', component: DepartmentInclusionComponent, canActivate: [AuthGuard], },
  { path: 'pgr/assessment', component: HazardAssessmentComponent, canActivate: [AuthGuard], },
  { path: 'pgr/epi', component: EpiComponent, canActivate: [AuthGuard], },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], },
  { path: 'business/department', component: DepartmentComponent, canActivate: [AuthGuard], },
  { path: 'business/role', component: RoleComponent, canActivate: [AuthGuard], },
  { path: 'business/employee', component: EmployeeComponent, canActivate: [AuthGuard], },
  { path: '**', redirectTo: 'home' },
];

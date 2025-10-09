import { Routes } from '@angular/router';
import { MerchantRegisterComponent } from './merchant/merchant-register.component';
import { MerchantStatusComponent } from './merchant/merchant-status.component';
import { DashboardComponent } from './officer/dashboard.component';
import { AdminRegisterComponent } from './officer/admin-register.component';
import { ManageAdminsComponent } from './officer/manage-admins.component';
import { ViewApplicationComponent } from './officer/view-application.component';
import { LoginComponent } from './officer/login/login.component';
import { authGuard } from './guards/auth.guard';       

export const routes: Routes = [
  { path: '', redirectTo: '/merchant/register', pathMatch: 'full' },

  // Merchant routes (Public)
  { path: 'merchant/register', component: MerchantRegisterComponent },
  { path: 'merchant/status', component: MerchantStatusComponent },

  // Officer routes (Protected)
  { path: 'officer/login', component: LoginComponent }, // <-- 3. Add the new login route
  { 
    path: 'officer/dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] // <-- 4. Protect this route
  },
  { 
    path: 'officer/register', 
    component: AdminRegisterComponent,
    canActivate: [authGuard] // <-- 4. Protect this route
  },
  { 
    path: 'officer/manage', 
    component: ManageAdminsComponent,
    canActivate: [authGuard] // <-- 4. Protect this route
  },
  { 
    path: 'officer/view/:id', 
    component: ViewApplicationComponent,
    canActivate: [authGuard] // <-- 4. Protect this route
  },

  { path: '**', redirectTo: '/merchant/register' } // Default fallback
];
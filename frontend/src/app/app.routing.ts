import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './landing/login';
import { RegisterComponent } from './landing/register';
import { CustomerComponent } from './customer';
import { LandingComponent } from './landing';
import { AuthGuard } from './_guards';
import { VerificationComponent } from './landing/verification';
import { ChangePasswordComponent } from './customer/change-password';
import { ProfileComponent } from './customer/profile';
import { ForgotPasswordComponent } from './landing/forgot-password';

import { AdminComponent } from './admin'
import { RestaurantApplicationsComponent } from './admin/restaurant-applications'
import { Role } from './_models';
import { from } from 'rxjs';
import { RestaurantRegisterComponent } from './landing/restaurant-register';

const appRoutes: Routes = [
    {
        path: 'home',
        component: CustomerComponent,
        children: [
            {path: 'changePassword', component: ChangePasswordComponent},
            {path: 'profile', component: ProfileComponent},
        ],
        canActivate: [AuthGuard],
        data: { roles: ['1'] },

    },
    {
        path: '',
        component: LandingComponent,
        children: [
            {path:'login',component:LoginComponent},
            {path:'register',component: RegisterComponent},
            {path:'confirmation/:token',component:VerificationComponent},
            {path:'iforgot',component:ForgotPasswordComponent},
            {path:'restaurant-register',component:RestaurantRegisterComponent}
        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [
            {path: 'restaurantApplications', component: RestaurantApplicationsComponent},
        ],
        data: { roles: ['2'] },
    },
    // otherwise redirect to landing page
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './landing/login/login.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './landing/register/register.component';
import { VerificationComponent } from './landing/verification/verification.component';
import { ChangePasswordComponent } from './home/change-password/change-password.component';
import { ProfileComponent } from './home/profile/profile.component';
import { ForgotPasswordComponent } from './landing/forgot-password/forgot-password.component';
import { RestaurantRegisterComponent } from './landing/restaurant-register/restaurant-register.component';

@NgModule({
  imports: [
  BrowserModule,
  ReactiveFormsModule,
  HttpClientModule,
  routing
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LandingComponent,
    RegisterComponent,
    VerificationComponent,
    ChangePasswordComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    RestaurantRegisterComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

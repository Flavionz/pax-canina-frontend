import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import {ProfileComponent} from './features/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
  { path: 'calendar', loadChildren: () => import('./features/calendar/calendar.routes').then(m => m.CALENDAR_ROUTES) },
  { path: 'contact', loadChildren: () => import('./features/contact/contact.routes').then(m => m.CONTACT_ROUTES) },
  { path: 'profile', component: ProfileComponent }

];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'validate-email/:token',
    loadComponent: () =>
      import('./validate-email/validate-email.component').then(m => m.ValidateEmailComponent)
  }
];

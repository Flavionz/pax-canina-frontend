import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ProfileComponent } from './features/profile/profile.component';

const routes: Routes = [
  // Redirect root path (fuori dai children!)
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./features/home/home.routes').then(m => m.HOME_ROUTES)
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
      },
      {
        path: 'courses',
        loadChildren: () =>
          import('./features/courses/courses.routes').then(m => m.COURSES_ROUTES)
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('./features/calendar/calendar.routes').then(m => m.CALENDAR_ROUTES)
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/contact/contact.routes').then(m => m.CONTACT_ROUTES)
      },
      { path: 'profile', component: ProfileComponent }
    ]
  },

  // Rotte errori (403 e fallback 404)
  {
    path: 'error',
    loadChildren: () =>
      import('./features/errors/errors.routes').then(m => m.ERRORS_ROUTES)
  },

  // Wildcard route: tutto ciò che non corrisponde va a /error (404)
  { path: '**', redirectTo: '/error' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    provideHttpClient()
  ]
};

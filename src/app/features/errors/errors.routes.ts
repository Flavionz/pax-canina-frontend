import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

export const ERRORS_ROUTES: Routes = [
  { path: '403', component: ForbiddenComponent },
  { path: '', component: NotFoundComponent } // fallback per 404
];

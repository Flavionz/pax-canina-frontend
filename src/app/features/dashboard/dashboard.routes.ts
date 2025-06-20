import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardCoachComponent } from './dashboard-coach/dashboard-coach.component';
import { DashboardProprietaireComponent } from './dashboard-proprietaire/dashboard-proprietaire.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'admin', component: DashboardAdminComponent },
      { path: 'coach', component: DashboardCoachComponent },
      { path: 'proprietaire', component: DashboardProprietaireComponent }
    ]
  }
];

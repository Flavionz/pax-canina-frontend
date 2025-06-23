import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { AdminUsersComponent } from './dashboard-admin/users/admin-users/admin-users.component';
import { DashboardCoachComponent } from './dashboard-coach/dashboard-coach.component';
import { DashboardProprietaireComponent } from './dashboard-proprietaire/dashboard-proprietaire.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'admin',
        component: DashboardAdminComponent,
        children: [
          { path: '', redirectTo: 'utilisateurs', pathMatch: 'full' },
          { path: 'utilisateurs', component: AdminUsersComponent },
          // qui puoi aggiungere altre sezioni in futuro!
        ]
      },
      { path: 'coach', component: DashboardCoachComponent },
      { path: 'proprietaire', component: DashboardProprietaireComponent }
    ]
  }
];

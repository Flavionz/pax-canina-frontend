import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

// --- COMPONENTI ADMIN ---
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { AdminOverviewComponent } from './dashboard-admin/admin-overview/admin-overview.component';
import { AdminUsersComponent } from './dashboard-admin/users/admin-users/admin-users.component';
import { AdminCoursesComponent } from './dashboard-admin/courses/admin-courses/admin-courses.component';
import { AdminSessionsComponent } from './dashboard-admin/sessions/admin-sessions/admin-sessions.component';
import { AdminDogsComponent } from './dashboard-admin/dogs/admin-dogs/admin-dogs.component';
import { AdminSpecialisationsComponent } from './dashboard-admin/specialisations/admin-specialisations/admin-specialisations.component';

// --- DASHBOARD RUOLI ---
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
          // Overview home (shortcut cards)
          { path: '', component: AdminOverviewComponent, pathMatch: 'full' },

          // Sezioni gestionali
          { path: 'utilisateurs', component: AdminUsersComponent },
          { path: 'cours', component: AdminCoursesComponent },
          { path: 'sessions', component: AdminSessionsComponent },
          { path: 'chiens', component: AdminDogsComponent },
          { path: 'specialisations', component: AdminSpecialisationsComponent },
        ]
      },
      {
        path: 'coach',
        component: DashboardCoachComponent
      },
      {
        path: 'proprietaire',
        component: DashboardProprietaireComponent
      },
      // (Opzionale) Redirect automatico se vuoi andare sulla dashboard corretta
      // { path: '', redirectTo: 'admin', pathMatch: 'full' }
    ]
  }
];

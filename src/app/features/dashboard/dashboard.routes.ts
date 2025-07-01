import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

// --- ADMIN COMPONENTS ---
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { AdminOverviewComponent } from './dashboard-admin/admin-overview/admin-overview.component';
import { AdminUsersComponent } from './dashboard-admin/users/admin-users/admin-users.component';
import { AdminCoursesComponent } from './dashboard-admin/courses/admin-courses/admin-courses.component';
import { AdminSessionsComponent } from './dashboard-admin/sessions/admin-sessions/admin-sessions.component';
import { AdminDogsComponent } from './dashboard-admin/dogs/admin-dogs/admin-dogs.component';
import { AdminSpecialisationsComponent } from './dashboard-admin/specialisations/admin-specialisations/admin-specialisations.component';

// --- ROLE DASHBOARDS ---
import { DashboardCoachComponent } from './dashboard-coach/dashboard-coach.component';
import { DashboardOwnerComponent } from './dashboard-owner/dashboard-owner.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'admin',
        component: DashboardAdminComponent,
        children: [
          { path: '', component: AdminOverviewComponent, pathMatch: 'full' },
          { path: 'users', component: AdminUsersComponent },
          { path: 'courses', component: AdminCoursesComponent },
          { path: 'sessions', component: AdminSessionsComponent },
          { path: 'dogs', component: AdminDogsComponent },
          { path: 'specialisations', component: AdminSpecialisationsComponent }
        ]
      },
      {
        path: 'coach',
        component: DashboardCoachComponent
      },
      {
        path: 'owner',
        component: DashboardOwnerComponent
      }
      // Optional: default redirect
      // { path: '', redirectTo: 'admin', pathMatch: 'full' }
    ]
  }
];

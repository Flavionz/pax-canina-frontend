import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

// --- ADMIN COMPONENTS ---
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { AdminOverviewComponent } from './dashboard-admin/admin-overview/admin-overview.component';
import { AdminUsersComponent } from './dashboard-admin/users/admin-users/admin-users.component';
import { AdminCoursesComponent } from './dashboard-admin/courses/admin-courses/admin-courses.component';
import { AdminSessionsComponent } from './dashboard-admin/sessions/admin-sessions/admin-sessions.component';
import { AdminDogsComponent } from './dashboard-admin/dogs/admin-dogs/admin-dogs.component';
import { AdminSpecializationsComponent } from './dashboard-admin/specializations/admin-specializations/admin-specializations.component';

// --- ROLE DASHBOARDS ---
import { DashboardCoachComponent } from './dashboard-coach/dashboard-coach.component';
import { DashboardOwnerComponent } from './dashboard-owner/dashboard-owner.component';

/**
 * Dashboard routes
 * - Admin area: full CRUD sections as child routes
 * - Coach area: minimal CRUD for sessions (standalone components, lazy-loaded)
 * - Owner area: profile & dogs
 *
 * Keep all coach CRUD under /dashboard/coach/... to avoid global route pollution.
 */
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      // =====================
      // ADMIN
      // =====================
      {
        path: 'admin',
        component: DashboardAdminComponent,
        children: [
          { path: '', component: AdminOverviewComponent, pathMatch: 'full' },
          { path: 'users', component: AdminUsersComponent },
          { path: 'courses', component: AdminCoursesComponent },
          { path: 'sessions', component: AdminSessionsComponent },
          { path: 'dogs', component: AdminDogsComponent },
          { path: 'specializations', component: AdminSpecializationsComponent }
        ]
      },

      // =====================
      // COACH
      // =====================
      {
        path: 'coach',
        children: [
          // Simple coach dashboard (welcome + shortcuts)
          { path: '', component: DashboardCoachComponent, pathMatch: 'full' },

          // Sessions list (only the coach's own sessions)
          {
            path: 'sessions',
            loadComponent: () =>
              import('./dashboard-coach/sessions/coach-sessions/coach-sessions.component')
                .then(m => m.CoachSessionsComponent)
          },

          // Create session
          {
            path: 'sessions/add',
            loadComponent: () =>
              import('./dashboard-coach/sessions/coach-session-form/coach-session-form.component')
                .then(m => m.CoachSessionFormComponent)
          },

          // Edit session
          {
            path: 'sessions/:id/edit',
            loadComponent: () =>
              import('./dashboard-coach/sessions/coach-session-form/coach-session-form.component')
                .then(m => m.CoachSessionFormComponent)
          }
        ]
      },

      // =====================
      // OWNER
      // =====================
      { path: 'owner', component: DashboardOwnerComponent },

      // Default: send to admin (works for jury demo)
      { path: '', redirectTo: 'admin', pathMatch: 'full' }
    ]
  }
];

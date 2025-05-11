import {Routes} from '@angular/router';
import {CalendarComponent} from '@app/features/calendar/calendar.component';

export const CALENDAR_ROUTES: Routes = [
  {
    path: '',  // Lascia vuoto questo path
    component: CalendarComponent
  }
];

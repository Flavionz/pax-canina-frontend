import { Component, OnInit } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: '<router-outlet></router-outlet>',
  imports: [
    RouterOutlet
  ],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const role = this.authService.role; // o .getRole()
    if (role === 'ADMIN') {
      this.router.navigate(['/dashboard/admin']);
    } else if (role === 'COACH') {
      this.router.navigate(['/dashboard/coach']);
    } else {
      this.router.navigate(['/dashboard/proprietaire']);
    }
  }
}

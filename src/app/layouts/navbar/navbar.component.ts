import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/features/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileView = false;
  isMenuOpen = false;
  isLoggedIn = false;
  private authSub?: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.setupResponsiveBehavior();
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  private setupResponsiveBehavior() {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.TabletPortrait,
      '(max-width: 768px)'
    ]).subscribe(result => {
      this.isMobileView = result.matches;
      if (!this.isMobileView) {
        this.isMenuOpen = false;
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    if (this.isMobileView && this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  isLoginPage(): boolean {
    return this.router.url === '/auth/login';
  }

  isRegisterPage(): boolean {
    return this.router.url === '/auth/register';
  }
}

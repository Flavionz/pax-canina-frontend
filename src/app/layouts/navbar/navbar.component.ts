import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMobileView = false;
  isMenuOpen = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit() {
    this.setupResponsiveBehavior();
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
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    if (this.isMobileView && this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  logout() {
    console.log('Logout effectuate');
    this.router.navigate(['/auth/logout']);
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}

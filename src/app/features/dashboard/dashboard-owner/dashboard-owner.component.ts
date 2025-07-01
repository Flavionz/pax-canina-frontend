import { Component, OnInit } from '@angular/core';
import { Owner } from '@models/owner.model';
import { Dog } from '@models/dog.model';
import { Registration } from '@models/registration.model';
import { OwnerService } from '@core/services/owner.service';
import { environment } from '@environments/environment';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-owner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-owner.component.html',
  styleUrl: './dashboard-owner.component.scss'
})
export class DashboardOwnerComponent implements OnInit {
  owner: Owner | null = null;
  dogs: Dog[] = [];
  registrations: Registration[] = [];
  loading = true;

  constructor(
    private ownerService: OwnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.ownerService.getProfile().subscribe({
      next: (owner: Owner) => {
        this.owner = owner;
        this.dogs = owner.dogs || [];
        this.registrations = owner.registrations || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  /** Returns avatar url or a fallback */
  getAvatarUrl(owner: Owner | null): string {
    if (!owner?.avatarUrl) return 'assets/images/default-avatar.png';
    return owner.avatarUrl.startsWith('http')
      ? owner.avatarUrl
      : `${environment.mediaUrl}/${owner.avatarUrl}`;
  }

  /** Navigates to profile with add-dog tab open */
  goToAddDogTab() {
    this.router.navigate(['/profile'], {
      queryParams: {
        tab: 'dogs',
        addDog: 1
      }
    });
  }
}

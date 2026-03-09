import { Component, OnInit } from '@angular/core';
import { Owner } from '@models/owner.model';
import { Dog } from '@models/dog.model';
import { RegistrationFlat } from '@models/registration-flat.model';
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
  registrations: RegistrationFlat[] = [];
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
        // registrations ora è un array di RegistrationFlat (non più annidata)
        this.registrations = (owner as any).registrations || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getAvatarUrl(owner: Owner | null): string {
    if (!owner?.avatarUrl) return 'assets/images/default-avatar.png';
    return owner.avatarUrl.startsWith('http')
      ? owner.avatarUrl
      : `${environment.mediaUrl}/${owner.avatarUrl}`;
  }

  goToAddDogTab() {
    this.router.navigate(['/profile'], {
      queryParams: {
        tab: 'dogs',
        addDog: 1
      }
    });
  }
}

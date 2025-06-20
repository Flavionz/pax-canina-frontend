import { Component, OnInit } from '@angular/core';
import { Proprietaire } from '@models/proprietaire.model';
import { Dog } from '@models/dog.model';
import { Registration } from '@models/registration.model';
import { ProprietaireService } from '@core/services/proprietaire.service';
import { DogService } from '@core/services/dog.service';
import { environment } from '@environments/environment';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-proprietaire',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-proprietaire.component.html',
  styleUrl: './dashboard-proprietaire.component.scss'
})
export class DashboardProprietaireComponent implements OnInit {
  proprietaire: Proprietaire | null = null;
  dogs: Dog[] = [];
  inscriptions: Registration[] = [];
  loading = true;

  constructor(
    private proprietaireService: ProprietaireService,
    private dogService: DogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.proprietaireService.getProfile().subscribe({
      next: (proprietaire: Proprietaire) => {
        this.proprietaire = proprietaire;
        this.dogs = proprietaire.chiens || [];
        this.inscriptions = proprietaire.inscriptions || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getAvatarUrl(proprietaire: Proprietaire | null): string {
    if (!proprietaire?.avatarUrl) return 'assets/images/default-avatar.png';
    return `${environment.mediaUrl}/${proprietaire.avatarUrl}`;
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

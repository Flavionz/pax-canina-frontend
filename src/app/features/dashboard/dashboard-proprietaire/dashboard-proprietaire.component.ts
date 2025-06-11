import { Component, OnInit } from '@angular/core';
import { User } from '@models/user.model';
import { Dog } from '@models/dog.model';
import { Registration } from '@models/registration.model';
import { UserService } from '@core/services/user.service';
import { DogService } from '@core/services/dog.service';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-proprietaire',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-proprietaire.component.html',
  styleUrl: './dashboard-proprietaire.component.scss'
})
export class DashboardProprietaireComponent implements OnInit {
  user: User | null = null;
  dogs: Dog[] = [];
  inscriptions: Registration[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private dogService: DogService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userService.getUserProfile().subscribe({
      next: (user: User) => {
        this.user = user;
        this.dogs = user.chiens || [];
        this.inscriptions = user.inscriptions || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
    // Se vuoi puoi anche usare direttamente dogService.getMyDogs()
  }
}

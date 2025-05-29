// src/app/features/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '@core/services/user.service';
import { DogService } from '@core/services/dog.service';
import { AddDogDialogComponent } from '@features/dog/add-dog-dialog/add-dog-dialog.component';
import { Dog } from '@models/dog.model';
import { User } from '@models/user.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editingProfile = false;
  backupUser: User | null = null;

  constructor(
    private userService: UserService,
    private dogService: DogService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: user => {
        console.log('Profilo caricato:', user);
        this.user = user;
        if (!this.user.chiens) {
          this.user.chiens = [];
        }
      },
      error: err => {
        console.error('Errore caricamento profilo:', err);
        // Se vuoi, mostra un messaggio di errore a schermo
      }
    });
  }

  startEditProfile(): void {
    this.backupUser = this.user ? { ...this.user } : null;
    this.editingProfile = true;
  }

  saveProfile(): void {
    if (this.user) {
      this.userService.updateUserProfile(this.user).subscribe((updatedUser: User) => {
        this.user = updatedUser;
        this.editingProfile = false;
      });
    }
  }

  cancelEditProfile(): void {
    this.user = this.backupUser ? { ...this.backupUser } : null;
    this.editingProfile = false;
  }

  openAddDogDialog(): void {
    const dialogRef = this.dialog.open(AddDogDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: Dog) => {
      if (result && result.nom && result.race) {
        this.dogService.addDog(result).subscribe(() => {
          this.reloadDogs();
        });
      }
    });
  }

  editDog(dog: Dog): void {
    const dialogRef = this.dialog.open(AddDogDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { dog }
    });

    dialogRef.afterClosed().subscribe((result: Dog) => {
      if (result && result.nom && result.race && dog.idChien) {
        this.dogService.updateDog({ ...dog, ...result }).subscribe(() => {
          this.reloadDogs();
        });
      }
    });
  }

  deleteDog(dog: Dog): void {
    if (dog.idChien) {
      this.dogService.deleteDog(dog.idChien).subscribe(() => {
        this.reloadDogs();
      });
    }
  }

  reloadDogs(): void {
    this.dogService.getMyDogs().subscribe((dogs: Dog[]) => {
      if (this.user) {
        this.user.chiens = dogs;
      }
    });
  }

  getDogAge(dateNaissance: string | Date): string {
    if (!dateNaissance) return '';
    const birth = new Date(dateNaissance);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years > 0) {
      return `${years} an(s) et ${months} mois`;
    } else {
      return `${months} mois`;
    }
  }
}

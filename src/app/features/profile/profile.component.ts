import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '@core/services/user.service';
import { DogService, Dog } from '@core/services/dog.service';
import { AddDogDialogComponent } from '@features/dog/add-dog-dialog/add-dog-dialog.component';

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
  user: any;
  editingProfile = false;
  backupUser: any;

  constructor(
    private userService: UserService,
    private dogService: DogService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.user = this.userService.getUserProfile();
      if (!this.user.dogs) {
        this.user.dogs = [];
      }
    }
  }

  startEditProfile(): void {
    this.backupUser = { ...this.user }; // backup per annullare modifiche se serve
    this.editingProfile = true;
  }

  saveProfile(): void {
    this.userService.updateUserProfile(this.user).subscribe((updatedUser: any) => {
      this.user = updatedUser;
      this.editingProfile = false;
    });
  }

  cancelEditProfile(): void {
    this.user = { ...this.backupUser };
    this.editingProfile = false;
  }

  openAddDogDialog(): void {
    const dialogRef = this.dialog.open(AddDogDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: Dog) => {
      if (result && result.nom && result.race) {
        this.dogService.addDog(result).subscribe(newDog => {
          this.user.dogs.push(newDog);
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
      if (result && result.nom && result.race) {
        const index = this.user.dogs.findIndex((d: Dog) => d === dog);
        if (index !== -1) {
          this.user.dogs[index] = result;
        }
      }
    });
  }

  deleteDog(dog: Dog): void {
    this.user.dogs = this.user.dogs.filter((d: Dog) => d !== dog);
// Puoi aggiungere qui la chiamata al backend se vuoi
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

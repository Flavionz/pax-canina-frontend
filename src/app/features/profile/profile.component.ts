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
  activeTab: unknown;
  user: any;

  constructor(
    private userService: UserService,
    private dogService: DogService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.user = this.userService.getUserProfile();

      // Inizializza user.dogs se non esiste
      if (!this.user.dogs) {
        this.user.dogs = [];
      }
    }
  }

  openAddDogDialog(): void {
    const dialogRef = this.dialog.open(AddDogDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: Dog) => {
      // Aggiungi solo se il risultato è valido e ha almeno nome e razza
      if (result && result.nom && result.race) {
        this.dogService.addDog(result).subscribe(newDog => {
          this.user.dogs.push(newDog);
        });
      }
    });
  }

  /**
   * Calcola l'età del cane in anni e mesi a partire dalla data di nascita.
   * @param dateNaissance string | Date - la data di nascita del cane
   * @returns string - età formattata ("1 an(s) et 3 mois" oppure "8 mois")
   */
  getDogAge(dateNaissance: string | Date): string {
    if (!dateNaissance) return '';
    const birth = new Date(dateNaissance);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      // Calcola i giorni nel mese precedente
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

  editDog(dog: Dog): void {
    // Da implementare: logica per modificare il cane
    console.log('Modifica cane:', dog);
  }

  deleteDog(dog: Dog): void {
    // Da implementare: logica per eliminare il cane
    // Esempio di rimozione lato front-end:
    this.user.dogs = this.user.dogs.filter((d: Dog) => d !== dog);
    // In un'app reale, chiama anche il servizio per eliminare dal backend!
    console.log('Elimina cane:', dog);
  }
}

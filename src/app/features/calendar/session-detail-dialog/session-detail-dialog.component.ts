import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegistrationService } from '@core/services/registration.service';
import { Dog } from '@core/models/dog.model';
import { Session } from '@core/models/session.model';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-session-detail-dialog',
  templateUrl: './session-detail-dialog.component.html',
  imports: [
    DatePipe,
    MatIcon,
    MatButton,
    MatIcon,
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./session-detail-dialog.component.scss']
})
export class SessionDetailDialogComponent {
  enrolling = false;
  enrollError: string | null = null;
  enrollSuccess = false;
  selectedDogId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<SessionDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      session: Session;
      myDogs: Dog[];
    },
    private registrationService: RegistrationService
  ) {
    // Se c'è un solo cane, preselezionalo
    if (data.myDogs.length === 1) {
      this.selectedDogId = data.myDogs[0].idDog ?? null;
    }
  }

  enrollToSession() {
    this.enrollError = null;
    this.enrollSuccess = false;
    this.enrolling = true;

    if (
      typeof this.data.session.idSession !== 'number' ||
      typeof this.selectedDogId !== 'number'
    ) {
      this.enrollError = "Sélection de session ou de chien invalide.";
      this.enrolling = false;
      return;
    }

    this.registrationService.subscribeToSession(
      this.data.session.idSession,
      this.selectedDogId
    ).subscribe({
      next: () => {
        this.enrollSuccess = true;
        this.enrolling = false;

        // Mostra il messaggio, poi chiudi la dialog dopo 1.2s
        setTimeout(() => this.dialogRef.close({ success: true }), 1200);
      },
      error: (err: any) => {
        this.enrolling = false;
        this.enrollError = err?.error?.message || "Erreur lors de l'inscription à la session.";
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}

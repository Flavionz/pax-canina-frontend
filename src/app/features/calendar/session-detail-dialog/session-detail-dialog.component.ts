import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegistrationService } from '@core/services/registration.service';
import { Dog } from '@core/models/dog.model';
import { Session } from '@core/models/session.model';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-session-detail-dialog',
  templateUrl: './session-detail-dialog.component.html',
  imports: [DatePipe, MatIcon, MatButton, FormsModule, NgForOf, NgIf, NgClass],
  styleUrls: ['./session-detail-dialog.component.scss']
})
export class SessionDetailDialogComponent {
  enrolling = false;
  enrollError: string | null = null;
  enrollSuccess = false;
  selectedDogId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<SessionDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { session: Session; myDogs: Dog[]; },
    private registrationService: RegistrationService
  ) {
    // Preseleziona se c'è un solo cane
    if (data.myDogs.length === 1) {
      this.selectedDogId = data.myDogs[0].idDog ?? null;
    }
  }

  /** UX: traduce il code errore in messaggio amichevole */
  private translateError(code?: string): string {
    switch (code) {
      case 'DOG_TOO_YOUNG':
        return "Votre chien est trop jeune pour cette session.";
      case 'DOG_TOO_OLD':
        return "Votre chien dépasse la tranche d'âge de cette session.";
      case 'SESSION_FULL':
        return "La session est complète.";
      case 'ALREADY_REGISTERED':
        return "Votre chien est déjà inscrit à cette session.";
      default:
        return "Inscription impossible. Réessayez.";
    }
  }

  /** UX: traduzione label gruppi d’età */
  translateAgeGroup(name: string): string {
    switch ((name || '').toUpperCase()) {
      case 'PUPPY': return 'Chiot';
      case 'JUNIOR': return 'Junior';
      case 'YOUNG_ADULT': return 'Jeune adulte';
      case 'ADULT': return 'Adulte';
      case 'SENIOR': return 'Senior';
      default: return name;
    }
  }

  /** Calcola età in mesi tra birthDate e la data della sessione */
  private ageInMonths(birthISO?: string, referenceISO?: string): number | null {
    if (!birthISO || !referenceISO) return null;
    const b = new Date(birthISO);
    const r = new Date(referenceISO);
    if (isNaN(b.getTime()) || isNaN(r.getTime())) return null;
    return (r.getFullYear() - b.getFullYear()) * 12 + (r.getMonth() - b.getMonth());
  }

  /** Pre-check: se il cane selezionato non è eleggibile, spiega il perché */
  get disableReason(): string | null {
    const g = this.data.session.ageGroup;
    const d = this.data.myDogs.find(x => x.idDog === this.selectedDogId);
    if (!g || !d || !d.birthDate) return null;

    const months = this.ageInMonths(d.birthDate, this.data.session.date);
    if (months == null) return null;

    if (g.minAge != null && months < g.minAge) {
      return `Votre chien a ${months} mois (≥ ${g.minAge} mois requis).`;
    }
    if (g.maxAge != null && months > g.maxAge) {
      return `Votre chien a ${months} mois (≤ ${g.maxAge} mois requis).`;
    }
    return null;
  }

  enrollToSession() {
    this.enrollError = null;
    this.enrollSuccess = false;
    this.enrolling = true;

    if (typeof this.data.session.idSession !== 'number' || typeof this.selectedDogId !== 'number') {
      this.enrollError = "Sélection de session ou de chien invalide.";
      this.enrolling = false;
      return;
    }

    this.registrationService
      .subscribeToSession(this.data.session.idSession, this.selectedDogId)
      .subscribe({
        next: () => {
          this.enrollSuccess = true;
          this.enrolling = false;
          setTimeout(() => this.dialogRef.close({ success: true }), 1200);
        },
        error: (err: any) => {
          this.enrolling = false;
          const code = err?.error?.error;
          const msg = err?.error?.message;
          this.enrollError = this.translateError(code) || msg || "Erreur lors de l'inscription à la session.";
        }
      });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}

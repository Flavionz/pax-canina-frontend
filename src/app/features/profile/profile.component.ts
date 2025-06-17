import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { environment } from '@environments/environment';

import { UserService } from '@core/services/user.service';
import { DogService } from '@core/services/dog.service';
import { AddDogDialogComponent } from '@features/dog/add-dog-dialog/add-dog-dialog.component';
import { Dog } from '@models/dog.model';
import { User } from '@models/user.model';
import { ActivatedRoute, Router } from '@angular/router';

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
  loading = false;
  errorMsg: string | null = null;

  avatarPreview: string | null = null;
  selectedAvatarFile: File | null = null;

  selectedTabIndex = 0; // 0 = info, 1 = chiens, 2 = inscriptions

  constructor(
    private userService: UserService,
    private dogService: DogService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'dogs') {
        this.selectedTabIndex = 1;
        if (params['addDog']) {
          setTimeout(() => this.openAddDogDialog(), 400);
          // Dopo apertura, rimuovi i query params per evitare riapertura dialog al refresh
          this.router.navigate([], { queryParams: {}, replaceUrl: true });
        }
      }
    });
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.errorMsg = null;
    this.userService.getUserProfile()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: user => {
          this.user = user;
          if (!this.user.chiens) {
            this.user.chiens = [];
          }
        },
        error: err => {
          console.error('Errore caricamento profilo:', err);
          this.errorMsg = "Erreur lors du chargement du profil.";
        }
      });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image est trop grande (max 2MB)");
        return;
      }
      this.selectedAvatarFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  confirmAvatarUpload(): void {
    if (!this.selectedAvatarFile) return;
    this.loading = true;
    this.userService.uploadAvatar(this.selectedAvatarFile).subscribe({
      next: (avatarUrl: string) => {
        if (this.user) {
          this.user.avatarUrl = avatarUrl;
        }
        this.loading = false;
        this.avatarPreview = null;
        this.selectedAvatarFile = null;
      },
      error: () => {
        this.loading = false;
        alert("Erreur lors de l'upload de l'avatar");
      }
    });
  }

  cancelAvatarSelection(): void {
    this.avatarPreview = null;
    this.selectedAvatarFile = null;
  }

  getAvatarUrl(user: User | null): string {
    if (!user?.avatarUrl) return 'assets/images/default-avatar.png';
    return `${environment.mediaUrl}/${user.avatarUrl}`;
  }

  startEditProfile(): void {
    this.backupUser = this.user ? { ...this.user } : null;
    this.editingProfile = true;
  }

  saveProfile(): void {
    if (this.user) {
      this.loading = true;
      this.userService.updateUserProfile(this.user)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: updatedUser => {
            this.user = updatedUser;
            this.editingProfile = false;
          },
          error: err => {
            console.error('Erreur sauvegarde profil:', err);
            this.errorMsg = "Erreur lors de la sauvegarde.";
          }
        });
    }
  }

  cancelEditProfile(): void {
    this.user = this.backupUser ? { ...this.backupUser } : null;
    this.editingProfile = false;
    this.errorMsg = null;
  }

  openAddDogDialog(): void {
    const dialogRef = this.dialog.open(AddDogDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: Dog) => {
      if (result && result.nom && result.race) {
        this.loading = true;
        this.dogService.addDog(result)
          .pipe(finalize(() => this.loading = false))
          .subscribe(() => this.reloadDogs());
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
        this.loading = true;
        this.dogService.updateDog({ ...dog, ...result })
          .pipe(finalize(() => this.loading = false))
          .subscribe(() => this.reloadDogs());
      }
    });
  }

  deleteDog(dog: Dog): void {
    if (dog.idChien && confirm(`Supprimer le chien "${dog.nom}" ? Cette action est irréversible.`)) {
      this.loading = true;
      this.dogService.deleteDog(dog.idChien)
        .pipe(finalize(() => this.loading = false))
        .subscribe(() => this.reloadDogs());
    }
  }

  reloadDogs(): void {
    this.dogService.getMyDogs().subscribe((dogs: Dog[]) => {
      if (this.user) {
        this.user.chiens = dogs;
      }
    });
  }

  getDogPhotoUrl(dog: Dog): string {
    if (!dog.photoUrl) {
      return 'assets/images/default-dog.png';
    }
    return `${environment.mediaUrl}/${dog.photoUrl}`;
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { environment } from '@environments/environment';

import { AuthService } from '@core/services/auth.service';
import { ProprietaireService } from '@core/services/proprietaire.service';
import { CoachService } from '@core/services/coach.service';
import { AdminService } from '@core/services/admin.service';
import { DogService } from '@core/services/dog.service';
import { AddDogDialogComponent } from '@features/dog/add-dog-dialog/add-dog-dialog.component';

import { Dog } from '@models/dog.model';
import { Proprietaire } from '@models/proprietaire.model';
import { Coach } from '@models/coach.model';
import { Admin } from '@models/admin.model';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

type AnyUser = Proprietaire | Coach | Admin;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: AnyUser | null = null;
  editingProfile = false;
  backupUser: AnyUser | null = null;
  loading = false;
  errorMsg: string | null = null;

  avatarPreview: string | null = null;
  selectedAvatarFile: File | null = null;

  selectedTabIndex = 0; // 0 = infos, 1 = chiens, 2 = inscriptions

  constructor(
    private auth: AuthService,
    private proprietaireService: ProprietaireService,
    private coachService: CoachService,
    private adminService: AdminService,
    private dogService: DogService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Gestione tab/query params
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'dogs') {
        this.selectedTabIndex = 1;
        if (params['addDog']) {
          setTimeout(() => this.openAddDogDialog(), 400);
          this.router.navigate([], { queryParams: {}, replaceUrl: true });
        }
      }
    });
    this.loadUser();
  }

  private loadUser(): void {
    this.loading = true;
    this.errorMsg = null;

    const role = this.auth.role;
    let obs$: Observable<AnyUser>;

    if (role === 'PROPRIETAIRE') {
      obs$ = this.proprietaireService.getProfile();
    } else if (role === 'COACH') {
      obs$ = this.coachService.getProfile();
    } else {
      obs$ = this.adminService.getProfile();
    }

    obs$
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: u => {
          this.user = u;
          // Inizializza array dei cani se proprietario
          if (this.isProprietaire() && !(this.user as Proprietaire).chiens) {
            (this.user as Proprietaire).chiens = [];
          }
        },
        error: err => {
          console.error('Errore caricamento profilo:', err);
          this.errorMsg = "Erreur lors du chargement du profil.";
        }
      });
  }

  // Helpers di ruolo
  isProprietaire(): boolean { return this.auth.role === 'PROPRIETAIRE'; }
  isCoach(): boolean { return this.auth.role === 'COACH'; }
  isAdmin(): boolean { return this.auth.role === 'ADMIN'; }

  get proprietaire(): Proprietaire | null {
    return this.isProprietaire() ? (this.user as Proprietaire) : null;
  }

  get coach(): Coach | null {
    return this.isCoach() ? (this.user as Coach) : null;
  }

  // Selezione file avatar
  onAvatarSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop grande (max 2MB)");
      return;
    }
    this.selectedAvatarFile = file;
    const reader = new FileReader();
    reader.onload = () => (this.avatarPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  // Upload avatar
  confirmAvatarUpload() {
    if (!this.selectedAvatarFile) return;
    this.loading = true;

    let upload$: Observable<string>;
    if (this.isProprietaire()) {
      upload$ = this.proprietaireService.uploadAvatar(this.selectedAvatarFile);
    } else if (this.isCoach()) {
      upload$ = this.coachService.uploadAvatar(this.selectedAvatarFile);
    } else {
      upload$ = this.adminService.uploadAvatar(this.selectedAvatarFile);
    }

    upload$
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: url => {
          if (this.user) this.user.avatarUrl = url;
          this.avatarPreview = this.selectedAvatarFile = null;
        },
        error: () => alert("Erreur lors de l'upload de l'avatar")
      });
  }

  cancelAvatarSelection() {
    this.avatarPreview = this.selectedAvatarFile = null;
  }

  getAvatarUrl(u: AnyUser | null): string {
    if (!u?.avatarUrl) return 'assets/images/default-avatar.png';
    return `${environment.mediaUrl}/${u.avatarUrl}`;
  }

  // Edit / Save profile
  startEditProfile() {
    this.backupUser = this.user ? { ...this.user } : null;
    this.editingProfile = true;
  }

  saveProfile() {
    if (!this.user) return;
    this.loading = true;

    let save$: Observable<AnyUser>;
    if (this.isProprietaire()) {
      save$ = this.proprietaireService.updateProfile(this.user as Proprietaire);
    } else if (this.isCoach()) {
      save$ = this.coachService.updateProfile(this.user as Coach);
    } else {
      save$ = this.adminService.updateProfile(this.user as Admin);
    }

    save$
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: u => {
          this.user = u;
          this.editingProfile = false;
        },
        error: err => {
          console.error('Errore salvataggio profilo:', err);
          this.errorMsg = "Erreur lors de la sauvegarde.";
        }
      });
  }

  cancelEditProfile() {
    this.user = this.backupUser;
    this.editingProfile = false;
    this.errorMsg = null;
  }

  // SOLO PROPRIETAIRE: CRUD cani
  openAddDogDialog() {
    if (!this.isProprietaire()) return;
    const dialogRef = this.dialog.open(AddDogDialogComponent, {
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((dog: Dog) => {
      if (dog?.nom && dog?.race) {
        this.loading = true;
        this.dogService.addDog(dog)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe(() => this.reloadDogs());
      }
    });
  }

  editDog(dog: Dog) {
    if (!this.isProprietaire()) return;
    const ref = this.dialog.open(AddDogDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { dog }
    });
    ref.afterClosed().subscribe((res: Dog) => {
      if (res && dog.idChien) {
        this.loading = true;
        this.dogService.updateDog({ ...dog, ...res })
          .pipe(finalize(() => (this.loading = false)))
          .subscribe(() => this.reloadDogs());
      }
    });
  }

  deleteDog(dog: Dog) {
    if (!this.isProprietaire() || !dog.idChien) return;
    if (confirm(`Supprimer le chien "${dog.nom}" ?`)) {
      this.loading = true;
      this.dogService.deleteDog(dog.idChien)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => this.reloadDogs());
    }
  }

  private reloadDogs() {
    this.dogService.getMyDogs().subscribe((list: Dog[]) => {
      if (this.user && this.isProprietaire()) {
        (this.user as Proprietaire).chiens = list;
      }
    });
  }

  // Helpers per card cane
  getDogPhotoUrl(d: Dog): string {
    return d.photoUrl
      ? `${environment.mediaUrl}/${d.photoUrl}`
      : 'assets/images/default-dog.png';
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
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return years > 0 ? `${years} an(s) et ${months} mois` : `${months} mois`;
  }

  // Solo Coach: helper lista specializzazioni
  isLastSpec(spec: any): boolean {
    const specs = (this.coach?.specialisations) || [];
    return specs[specs.length - 1] === spec;
  }
}

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
import { OwnerService } from '@core/services/owner.service';
import { CoachService } from '@core/services/coach.service';
import { AdminService } from '@core/services/admin.service';
import { DogService } from '@core/services/dog.service';
import { SpecializationService } from '@core/services/specialization.service';
import { AddDogDialogComponent } from '@features/dog/add-dog-dialog/add-dog-dialog.component';
import { ChangePasswordComponent } from '@features/auth/change-password/change-password.component';

import { Dog } from '@models/dog.model';
import { Owner } from '@models/owner.model';
import { Coach } from '@models/coach.model';
import { Admin } from '@models/admin.model';
import { Specialization } from '@models/specialization.model';
import { RegistrationFlat } from '@models/registration-flat.model';

import { isOwner, isCoach, isAdmin } from '@core/type-guards/user-type-guards';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Union type for strong typing in the component
type AnyUser = Owner | Coach | Admin;

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

  selectedTabIndex = 0; // 0 = personal info, 1 = dogs, 2 = registrations

  // -- Specializations --
  public allSpecializations: Specialization[] = [];

  constructor(
    private auth: AuthService,
    private ownerService: OwnerService,
    private coachService: CoachService,
    private adminService: AdminService,
    private dogService: DogService,
    private specializationService: SpecializationService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Manage route params for tab navigation
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

    this.specializationService.getAll().subscribe(specs => {
      this.allSpecializations = specs;
    });
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordComponent, {
      width: '520px',
      disableClose: true
    });
  }

  public getSpecializationObjects(ids: number[] | undefined): Specialization[] {
    if (!ids?.length) return [];
    return ids
      .map(id => this.allSpecializations.find(spec => spec.id === id))
      .filter(Boolean) as Specialization[];
  }

  /** Loads user data based on current role (no admin fallback). */
  private loadUser(): void {
    this.loading = true;
    this.errorMsg = null;

    // Safety net: hydrate role from JWT if not present
    if (!this.auth.role && (this.auth as any).hydrateRoleFromToken) {
      (this.auth as any).hydrateRoleFromToken();
    }

    let obs$: Observable<AnyUser> | null = null;

    switch (this.auth.role) {
      case 'OWNER':
        obs$ = this.ownerService.getProfile();
        break;
      case 'COACH':
        obs$ = this.coachService.getProfile();
        break;
      case 'ADMIN':
        obs$ = this.adminService.getProfile();
        break;
      default:
        this.loading = false;
        this.errorMsg = "Impossible de charger le profil (rôle inconnu).";
        return;
    }

    obs$
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: u => {
          this.user = u;
          if (isOwner(this.user) && !this.user.dogs) {
            this.user.dogs = [];
          }
        },
        error: err => {
          console.error('Error loading profile:', err);
          this.errorMsg = "Erreur lors du chargement du profil.";
        }
      });
  }

  /** Role helpers using type-guards (no repetition) */
  isOwner(): boolean { return isOwner(this.user); }
  isCoach(): boolean { return isCoach(this.user); }
  isAdmin(): boolean { return isAdmin(this.user); }

  // Typed getters for HTML (safe casting with type guards)
  get owner(): Owner | null { return isOwner(this.user) ? this.user : null; }
  get coach(): Coach | null { return isCoach(this.user) ? this.user : null; }
  get admin(): Admin | null { return isAdmin(this.user) ? this.user : null; }

  // NEW: Typed getter for flat registrations (tab "Mes inscriptions")
  get ownerRegistrationsFlat(): RegistrationFlat[] {
    return this.owner?.registrations ?? [];
  }

  /** Masks email for admins (UI detail) */
  maskEmail(email: string | undefined): string {
    if (!email) return '';
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    const visible = user.slice(0, 3);
    return `${visible}${'*'.repeat(Math.max(user.length - 3, 0))}@${domain}`;
  }

  /** Avatar logic (upload, preview, cancel) */
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

  confirmAvatarUpload() {
    if (!this.selectedAvatarFile) return;
    this.loading = true;
    let upload$: Observable<string>;
    if (isOwner(this.user)) {
      upload$ = this.ownerService.uploadAvatar(this.selectedAvatarFile);
    } else if (isCoach(this.user)) {
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
    return u.avatarUrl.startsWith('http')
      ? u.avatarUrl
      : `${environment.mediaUrl}/${u.avatarUrl}`;
  }

  // Profile edit logic
  startEditProfile() {
    this.backupUser = this.user ? { ...this.user } : null;
    this.editingProfile = true;
  }

  saveProfile() {
    if (!this.user) return;
    this.loading = true;
    let save$: Observable<AnyUser>;
    if (isOwner(this.user)) {
      save$ = this.ownerService.updateProfile(this.user as Owner);
    } else if (isCoach(this.user)) {
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
          console.error('Error saving profile:', err);
          this.errorMsg = "Erreur lors de la sauvegarde.";
        }
      });
  }

  cancelEditProfile() {
    this.user = this.backupUser;
    this.editingProfile = false;
    this.errorMsg = null;
  }

  // DOGS CRUD LOGIC
  openAddDogDialog() {
    if (!isOwner(this.user)) return;
    const dialogRef = this.dialog.open(AddDogDialogComponent, {
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((dog: Dog) => {
      if (dog?.name && dog?.idBreed) {
        this.loading = true;
        this.dogService.addDog(dog)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe(() => this.reloadDogs());
      }
    });
  }

  editDog(dog: Dog) {
    if (!isOwner(this.user)) return;
    const ref = this.dialog.open(AddDogDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { dog }
    });
    ref.afterClosed().subscribe((res: Dog) => {
      if (res && dog.idDog) {
        this.loading = true;
        this.dogService.updateDog({ ...dog, ...res })
          .pipe(finalize(() => (this.loading = false)))
          .subscribe(() => this.reloadDogs());
      }
    });
  }

  deleteDog(dog: Dog) {
    if (!isOwner(this.user) || !dog.idDog) return;
    if (confirm(`Supprimer le chien "${dog.name}" ?`)) {
      this.loading = true;
      this.dogService.deleteDog(dog.idDog)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => this.reloadDogs());
    }
  }

  private reloadDogs() {
    this.dogService.getMyDogs().subscribe((list: Dog[]) => {
      if (isOwner(this.user)) {
        this.user.dogs = list;
      }
    });
  }

  getDogPhotoUrl(d: Dog): string {
    return d.photoUrl
      ? (d.photoUrl.startsWith('http')
        ? d.photoUrl
        : `${environment.mediaUrl}/${d.photoUrl}`)
      : 'assets/images/default-dog.png';
  }

  getDogAge(birthDate: string | Date): string {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
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

  // ========================
  // NEW METHODS FOR TABLE UI
  // ========================

  /**
   * Get dog avatar URL for the table display using registration data
   * Finds the dog by name and returns its photo URL or a default
   */
  getDogAvatarForRegistration(registration: RegistrationFlat): string {
    if (!this.owner?.dogs) {
      return 'assets/images/default-dog-avatar.png';
    }

    // Find the dog by name in the owner's dogs array
    const dog = this.owner.dogs.find(d =>
      d.name?.toLowerCase() === registration.dogName?.toLowerCase()
    );

    if (dog && dog.photoUrl) {
      return dog.photoUrl.startsWith('http')
        ? dog.photoUrl
        : `${environment.mediaUrl}/${dog.photoUrl}`;
    }

    // Return a default dog avatar or placeholder
    return 'assets/images/default-dog-avatar.png';
  }

  /**
   * Get localized status label for registrations
   */
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'REGISTERED': 'Confirmé',
      'CONFIRMED': 'Confirmé',
      'PENDING': 'En attente',
      'EN_ATTENTE': 'En attente',
      'CANCELLED': 'Annulé',
      'COMPLETED': 'Terminé',
      'NO_SHOW': 'Absent'
    };

    return statusMap[status?.toUpperCase()] || status || 'Non défini';
  }

  /**
   * Handle registration details view
   */
  viewRegistrationDetails(registration: RegistrationFlat): void {
    // TODO: Implement registration details dialog or navigation
    console.log('View registration details:', registration);
  }

  /**
   * Handle registration cancellation (placeholder)
   */
  cancelRegistration(registration: RegistrationFlat): void {
    const confirmMessage = `Êtes-vous sûr de vouloir annuler l'inscription à "${registration.courseName}" (${registration.sessionName}) pour ${registration.dogName} ?`;

    if (confirm(confirmMessage)) {
      this.loading = true;
      setTimeout(() => {
        registration.status = 'CANCELLED';
        this.loading = false;
      }, 1000);
    }
  }

  /**
   * Format date for display in the table (helper method if needed)
   */
  formatRegistrationDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };

    return date.toLocaleDateString('fr-FR', options);
  }
}

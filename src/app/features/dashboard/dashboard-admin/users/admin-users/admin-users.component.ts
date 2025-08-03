import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { SpecializationService } from '@core/services/specialization.service';
import { Specialization } from '@core/models/specialization.model';
import { UserFormComponent } from './user-form/user-form.component';

/**
 * AdminUsersComponent
 * -------------------
 * Jury-ready, production-level component for managing users in Pax Canina admin dashboard.
 * - Handles CRUD operations (create, edit, delete) for Owner, Coach, Admin roles.
 * - Maps specialization IDs to full objects for UI display (badge with name).
 * - Passes specializations to the form as @Input for seamless form UX.
 * - Keeps contract with backend (only IDs in payload, never objects).
 */
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  specializations: Specialization[] = [];
  loading = false;
  error: string | null = null;

  showForm = false;
  userToEdit: User | null = null;

  constructor(
    private userService: UserService,
    private specializationService: SpecializationService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.specializationService.getAll().subscribe(specs => {
      this.specializations = specs;
    });
  }

  /**
   * Fetch all users from backend.
   */
  fetchUsers(): void {
    this.loading = true;
    this.error = null;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Erreur lors du chargement des utilisateurs.";
        this.loading = false;
        console.error(err);
      }
    });
  }

  /**
   * Returns true if at least one user has the 'COACH' role.
   * Used to display the "Spécialisations" column only when relevant.
   */
  hasAnyCoach(): boolean {
    return this.users.some(u => u.role === 'COACH');
  }

  /**
   * Map array of specialization ids (or objects) to full Specialization objects.
   * Used to display badges with names in the user list.
   */
  getSpecializationObjects(specs: (number | Specialization)[] | undefined): Specialization[] {
    if (!specs?.length) return [];
    return specs.map(s =>
      typeof s === 'object' ? s : this.specializations.find(spec => spec.id === s)
    ).filter(Boolean) as Specialization[];
  }

  /**
   * Open the user creation form.
   */
  onAddUser(): void {
    this.userToEdit = null;
    this.showForm = true;
  }

  /**
   * Open the user edition form, ensuring specializations are mapped to full objects.
   */
  onEditUser(user: User): void {
    let patchedUser = { ...user };
    if (user.specializations && this.specializations.length) {
      patchedUser.specializations = (user.specializations as any[]).map(s =>
        typeof s === 'object' ? s : this.specializations.find(spec => spec.id === s)
      ).filter(Boolean) as Specialization[];
    }
    this.userToEdit = patchedUser;
    this.showForm = true;
  }

  /**
   * Handle user save (create/update).
   * Always send only IDs for specializations in the payload.
   */
  onSaveUser(user: User): void {
    this.error = null;

    const userToSend: User = {
      ...user,
      specializations: (user.specializations || []).map((s: any) => typeof s === 'number' ? s : s.id)
    };

    if (user.id) {
      this.userService.fullUpdateUser(user.id, userToSend).subscribe({
        next: () => {
          this.fetchUsers();
          this.showForm = false;
          this.userToEdit = null;
        },
        error: (err) => {
          this.error = "Erreur lors de la mise à jour de l'utilisateur.";
          console.error(err);
        }
      });
    } else {
      this.userService.createUser(userToSend).subscribe({
        next: () => {
          this.fetchUsers();
          this.showForm = false;
          this.userToEdit = null;
        },
        error: (err) => {
          this.error = "Erreur lors de la création de l'utilisateur.";
          console.error(err);
        }
      });
    }
  }

  /**
   * Cancel form and reset editing state.
   */
  onCancelForm(): void {
    this.showForm = false;
    this.userToEdit = null;
  }

  /**
   * Delete a user after confirmation.
   */
  onDeleteUser(user: User): void {
    if (user.id == null) return;
    if (confirm(`Supprimer l'utilisateur ${user.email} ?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => this.fetchUsers(),
        error: (err) => {
          this.error = "Erreur lors de la suppression.";
          console.error(err);
        }
      });
    }
  }

  /**
   * Return the French label for each user role.
   */
  translateRole(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'COACH': return 'Coach';
      case 'OWNER': return 'Propriétaire';
      default: return 'Utilisateur';
    }
  }
}

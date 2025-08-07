import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { SpecializationService } from '@core/services/specialization.service';
import { Specialization } from '@core/models/specialization.model';
import { UserFormComponent } from './user-form/user-form.component';
import {RouterLink} from '@angular/router';

/**
 * AdminUsersComponent
 * -------------------
 * CRUD users (Admin, Coach, Owner) for Pax Canina dashboard.
 * - Specializations are always number[] in the model.
 * - Mapping to objects only for UI (badges, select, ecc).
 */
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, UserFormComponent, RouterLink],
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

  hasAnyCoach(): boolean {
    return this.users.some(u => u.role === 'COACH');
  }

  /**
   * Mapping da array di id (number[]) a Specialization[] (solo per badge/visualizzazione)
   */
  getSpecializationObjects(ids: number[] | undefined): Specialization[] {
    if (!ids?.length) return [];
    return ids
      .map(id => this.specializations.find(spec => spec.id === id))
      .filter((s): s is Specialization => !!s);
  }

  onAddUser(): void {
    this.userToEdit = null;
    this.showForm = true;
  }

  onEditUser(user: User): void {
    // NON convertire mai a oggetti, lasciali sempre number[]
    this.userToEdit = { ...user };
    this.showForm = true;
  }

  onSaveUser(user: User): void {
    this.error = null;

    // Trasformazione sempre: ids ONLY!
    const userToSend: User = {
      ...user,
      specializations: (user.specializations || [])
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

  onCancelForm(): void {
    this.showForm = false;
    this.userToEdit = null;
  }

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

  translateRole(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'COACH': return 'Coach';
      case 'OWNER': return 'Propriétaire';
      default: return 'Utilisateur';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { UserFormComponent } from './user-form/user-form.component';

/**
 * Admin Users Management Component
 * Handles display, creation, editing, and deletion of users (admin, coach, owner).
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
  loading = false;
  error: string | null = null;

  showForm = false;
  userToEdit: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
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

  onAddUser(): void {
    this.userToEdit = null;
    this.showForm = true;
  }

  onEditUser(user: User): void {
    this.userToEdit = { ...user };
    this.showForm = true;
  }

  onSaveUser(user: User): void {
    if (user.idUser) {
      this.userService.updateUser(user.idUser, user).subscribe({
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
      this.userService.createUser(user).subscribe({
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
    if (confirm(`Supprimer l'utilisateur ${user.email} ?`)) {
      this.userService.deleteUser(user.idUser).subscribe({
        next: () => this.fetchUsers(),
        error: (err) => {
          this.error = "Erreur lors de la suppression.";
          console.error(err);
        }
      });
    }
  }

  /**
   * Translate backend role to French label for UI
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

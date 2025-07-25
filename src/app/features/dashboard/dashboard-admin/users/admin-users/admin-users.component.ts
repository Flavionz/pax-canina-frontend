/**
 * AdminUsersComponent
 *
 * Component responsible for displaying, creating, editing, and deleting users
 * in the admin dashboard. Handles CRUD operations by interacting with UserService.
 * Normalizes data before sending to the backend (e.g., mapping 'specializations'
 * to a list of IDs as expected by the API).
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { UserFormComponent } from './user-form/user-form.component';

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

  /**
   * Loads all users on component initialization.
   */
  ngOnInit(): void {
    this.fetchUsers();
  }

  /**
   * Fetches the user list from the API and handles loading/error state.
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
   * Opens the user form in 'add' mode.
   */
  onAddUser(): void {
    this.userToEdit = null;
    this.showForm = true;
  }

  /**
   * Opens the user form in 'edit' mode, pre-filling with the selected user's data.
   * @param user The user to edit
   */
  onEditUser(user: User): void {
    this.userToEdit = { ...user };
    this.showForm = true;
  }

  /**
   * Handles form submission for both creating and updating a user.
   * Normalizes the 'specializations' field by extracting only IDs, since
   * the backend expects an array of integers rather than an array of objects.
   * @param user The user object from the form
   */
  onSaveUser(user: User): void {
    this.error = null;

    // Normalize 'specializations': map to an array of IDs (integers)
    const userToSend: User = {
      ...user,
      specializations: (user.specializations || []).map((s: any) => typeof s === 'number' ? s : s.id)
    };

    // For debugging: log payload sent to the backend
    // console.log('User sent to backend:', userToSend);

    if (user.id) {
      // Update existing user (uses dedicated fullUpdateUser endpoint)
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
      // Create new user
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
   * Cancels the form and resets editing state.
   */
  onCancelForm(): void {
    this.showForm = false;
    this.userToEdit = null;
  }

  /**
   * Deletes a user after confirmation and refreshes the list.
   * @param user The user to delete
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
   * Returns the French label for each user role.
   * @param role The role string
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule,UserFormComponent],
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
      error: () => {
        this.error = "Erreur lors du chargement des utilisateurs.";
        this.loading = false;
      }
    });
  }

  onAddUser(): void {
    this.userToEdit = null;
    this.showForm = true;
  }

  onEditUser(user: User): void {
    // Attenzione: clona l'oggetto per non mutare la tabella direttamente!
    this.userToEdit = { ...user };
    this.showForm = true;
  }

  onSaveUser(user: User): void {
    if (user.idUtilisateur) {
      this.userService.updateUser(user.idUtilisateur, user).subscribe({
        next: () => {
          this.fetchUsers();
          this.showForm = false;
        },
        error: () => this.error = "Erreur lors de la mise à jour de l'utilisateur."
      });
    } else {
      this.userService.createUser(user).subscribe({
        next: () => {
          this.fetchUsers();
          this.showForm = false;
        },
        error: () => this.error = "Erreur lors de la création de l'utilisateur."
      });
    }
  }

  onCancelForm(): void {
    this.showForm = false;
  }

  onDeleteUser(user: User): void {
    if (confirm(`Supprimer l'utilisateur ${user.email} ?`)) {
      this.userService.deleteUser(user.idUtilisateur).subscribe({
        next: () => this.fetchUsers(),
        error: () => this.error = "Erreur lors de la suppression."
      });
    }
  }
}

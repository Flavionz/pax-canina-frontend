import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

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

  onAddUser() {
    // Qui in futuro apri il dialog/form per la creazione utente
    alert('TODO: Apri il form di creazione utente (Coach, Admin, Proprietaire)');
  }

  // Qui puoi aggiungere onEditUser(user: User), onDeleteUser(user: User) ecc.
}

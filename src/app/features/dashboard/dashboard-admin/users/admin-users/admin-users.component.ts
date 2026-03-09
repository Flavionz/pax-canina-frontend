import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← IMPORTANTE!
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { SpecializationService } from '@core/services/specialization.service';
import { Specialization } from '@core/models/specialization.model';
import { UserFormComponent } from './user-form/user-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormComponent, RouterLink],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  specializations: Specialization[] = [];
  loading = false;
  error: string | null = null;

  showForm = false;
  userToEdit: User | null = null;

  searchTerm = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

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
        this.applyFilters();
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
    this.userToEdit = { ...user };
    this.showForm = true;
  }

  onSaveUser(user: User): void {
    this.error = null;
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

  // Ricerca + sort insieme!
  applyFilters(): void {
    let data = [...this.users];
    if (this.searchTerm) {
      const term = this.searchTerm.trim().toLowerCase();
      data = data.filter(u =>
        u.firstName?.toLowerCase().includes(term) ||
        u.lastName?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        this.translateRole(u.role).toLowerCase().includes(term)
      );
    }
    if (this.sortColumn) {
      data.sort((a, b) => {
        let aValue = (a as any)[this.sortColumn];
        let bValue = (b as any)[this.sortColumn];
        if (this.sortColumn === 'role') {
          aValue = this.translateRole(a.role);
          bValue = this.translateRole(b.role);
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase(); bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    this.filteredUsers = data;
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortArrow(column: string): string {
    if (this.sortColumn !== column) return '⇅';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogService } from '@core/services/dog.service';
import { Dog } from '@core/models/dog.model';

/**
 * Admin dogs management component.
 * Displays all registered dogs with options to edit or delete.
 * Field/model names are in English (backend consistency).
 * UI text and labels are in French.
 */
@Component({
  selector: 'app-admin-dogs',
  standalone: true,
  templateUrl: './admin-dogs.component.html',
  styleUrls: ['./admin-dogs.component.scss'],
  imports: [CommonModule]
})
export class AdminDogsComponent implements OnInit {
  dogs: Dog[] = [];
  loading = false;
  errorMsg: string | null = null;

  constructor(private dogService: DogService) {}

  /**
   * Loads all dogs on init.
   */
  ngOnInit(): void {
    this.loadDogs();
  }

  /**
   * Loads dogs from API.
   */
  loadDogs() {
    this.loading = true;
    this.errorMsg = null;
    this.dogService.getAllDogs().subscribe({
      next: list => {
        this.dogs = list;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = "Erreur lors du chargement des chiens.";
        this.loading = false;
      }
    });
  }

  /**
   * Deletes a dog by ID after confirmation.
   */
  deleteDog(id: number | undefined) {
    if (!id) return;
    if (confirm("Supprimer ce chien ?")) {
      this.dogService.deleteDog(id).subscribe({
        next: () => this.loadDogs(),
        error: () => alert("Erreur lors de la suppression du chien.")
      });
    }
  }
}

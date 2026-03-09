import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpecializationService } from '@core/services/specialization.service';
import { Specialization } from '@core/models/specialization.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin-specializations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-specializations.component.html',
  styleUrls: ['./admin-specializations.component.scss']
})
export class AdminSpecializationsComponent implements OnInit {
  specializations: Specialization[] = [];
  form: FormGroup;
  editing: Specialization | null = null;
  loading = false;
  error = '';

  constructor(
    private specializationService: SpecializationService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.specializationService.getAll().subscribe({
      next: (data) => {
        this.specializations = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement.';
        this.loading = false;
      }
    });
  }

  startEdit(s: Specialization) {
    this.editing = s;
    this.form.patchValue({ name: s.name, description: s.description });
  }

  startAdd() {
    this.editing = null;
    this.form.reset();
  }

  save() {
    if (this.form.invalid) return;
    const value = this.form.value;
    if (this.editing) {
      this.specializationService.update(this.editing.id, value).subscribe({
        next: () => {
          this.loadAll();
          this.editing = null;
          this.form.reset();
        }
      });
    } else {
      this.specializationService.create(value).subscribe({
        next: () => {
          this.loadAll();
          this.form.reset();
        }
      });
    }
  }

  remove(id: number) {
    if (!confirm('Confirmer la suppression ?')) return;
    this.specializationService.delete(id).subscribe(() => {
      this.loadAll();
    });
  }

  cancel() {
    this.editing = null;
    this.form.reset();
  }
}

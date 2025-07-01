import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
  MatDialogActions
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
  provideNativeDateAdapter
} from '@angular/material/core';

import { DogService } from '@core/services/dog.service';
import { BreedService } from '@core/services/breed.service';
import { Dog } from '@core/models/dog.model';

export const FRENCH_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-dog-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: FRENCH_DATE_FORMATS }
  ],
  templateUrl: './add-dog-dialog.component.html',
  styleUrls: ['./add-dog-dialog.component.scss']
})
export class AddDogDialogComponent implements OnInit {
  dogForm!: FormGroup;
  isEditMode = false;
  selectedPhotoFile: File | null = null;
  breeds: { idBreed: number; name: string }[] = []; // List of available breeds

  constructor(
    private fb: FormBuilder,
    private dogService: DogService,
    private breedService: BreedService, // inject the BreedService
    public dialogRef: MatDialogRef<AddDogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dog?: Dog }
  ) {}

  ngOnInit(): void {
    // Form fields follow the English backend model
    this.dogForm = this.fb.group({
      name: ['', Validators.required],
      idBreed: ['', Validators.required], // breed select, required
      birthDate: ['', Validators.required],
      sex: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]],
      chipNumber: [''],
      photoUrl: ['']
    });

    // Load breeds from backend for select
    this.breedService.getBreeds().subscribe(breeds => {
      this.breeds = breeds;
    });

    if (this.data?.dog) {
      this.isEditMode = true;
      // Patch only fields that exist in the form
      this.dogForm.patchValue({
        name: this.data.dog.name,
        idBreed: this.data.dog.idBreed,
        birthDate: this.data.dog.birthDate,
        sex: this.data.dog.sex,
        weight: this.data.dog.weight,
        chipNumber: this.data.dog.chipNumber,
        photoUrl: this.data.dog.photoUrl
      });
    }
  }

  /**
   * Handles file selection for photo upload
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedPhotoFile = input.files[0];
      // We don't set photoUrl now; it will be set after upload
    }
  }

  /**
   * Handles form submit: uploads photo if present, then emits dog data
   */
  onSubmit(): void {
    if (this.dogForm.valid) {
      const dogData = this.dogForm.value;

      // If user selected a photo, upload it before saving the dog
      if (this.selectedPhotoFile) {
        this.dogService.uploadDogPhoto(this.selectedPhotoFile).subscribe({
          next: (photoUrl: string) => {
            dogData.photoUrl = photoUrl;
            this.dialogRef.close(dogData);
          },
          error: () => {
            console.error("Erreur lors de l'upload de l'image");
            this.dialogRef.close(dogData); // fallback: return even if upload fails
          }
        });
      } else {
        this.dialogRef.close(dogData);
      }
    }
  }

  /**
   * Closes the dialog without saving
   */
  cancel(): void {
    this.dialogRef.close();
  }
}

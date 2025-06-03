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

export interface Dog {
  nom: string;
  race: string;
  dateNaissance: string | Date;
  sexe: string;
  poids: number;
  numeroPuce?: string;
  photo_url?: string;
}

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
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions
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

  constructor(
    private fb: FormBuilder,
    private dogService: DogService,
    public dialogRef: MatDialogRef<AddDogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dog?: Dog }
  ) {}

  ngOnInit(): void {
    this.dogForm = this.fb.group({
      nom: ['', Validators.required],
      race: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      sexe: ['', Validators.required],
      poids: ['', [Validators.required, Validators.min(0)]],
      numeroPuce: [''],
      photo_url: ['']
    });

    if (this.data?.dog) {
      this.isEditMode = true;
      this.dogForm.patchValue(this.data.dog);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedPhotoFile = input.files[0];
      this.dogForm.patchValue({ photo_url: this.selectedPhotoFile.name });
    }
  }

  onSubmit(): void {
    if (this.dogForm.valid) {
      const dogData = this.dogForm.value;

      if (this.selectedPhotoFile) {
        this.dogService.uploadDogPhoto(this.selectedPhotoFile).subscribe({
          next: (photoUrl: string) => {
            dogData.photo_url = photoUrl;
            this.dialogRef.close(dogData);
          },
          error: () => {
            console.error("Erreur lors de l'upload de l'image");
            this.dialogRef.close(dogData);
          }
        });
      } else {
        this.dialogRef.close(dogData);
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

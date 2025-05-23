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
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

export interface Dog {
  nom: string;
  race: string;
  dateNaissance: string | Date;
  sexe: string;
  poids: number;
  numeroPuce?: string;
  photo_url?: string;
}

// Formato francese JJ/MM/AAAA
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

  constructor(
    private fb: FormBuilder,
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

    if (this.data && this.data.dog) {
      this.isEditMode = true;
      this.dogForm.patchValue(this.data.dog);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.dogForm.patchValue({
          photo_url: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.dogForm.valid) {
      this.dialogRef.close(this.dogForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

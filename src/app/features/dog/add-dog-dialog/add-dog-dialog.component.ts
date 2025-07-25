import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DogService } from '@core/services/dog.service';
import { BreedService } from '@core/services/breed.service';
import { Dog } from '@models/dog.model';

@Component({
  selector: 'app-add-dog-dialog',
  standalone: true,
  templateUrl: './add-dog-dialog.component.html',
  styleUrls: ['./add-dog-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class AddDogDialogComponent implements OnInit {
  dogForm!: FormGroup;
  isEditMode = false;
  selectedPhotoFile: File | null = null;
  photoPreview: string | null = null;
  breeds: { idBreed: number; name: string }[] = [];
  loading = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private dogService: DogService,
    private breedService: BreedService,
    public dialogRef: MatDialogRef<AddDogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dog?: Dog }
  ) {}

  ngOnInit(): void {
    this.dogForm = this.fb.group({
      name: ['', Validators.required],
      idBreed: ['', Validators.required],
      birthDate: ['', Validators.required],
      sex: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]],
      chipNumber: [''],
      photoUrl: ['']
    });

    this.breedService.getBreeds().subscribe(breeds => this.breeds = breeds);

    if (this.data?.dog) {
      this.isEditMode = true;
      this.dogForm.patchValue({
        name: this.data.dog.name,
        idBreed: this.data.dog.idBreed,
        birthDate: this.data.dog.birthDate,
        sex: this.data.dog.sex,
        weight: this.data.dog.weight,
        chipNumber: this.data.dog.chipNumber,
        photoUrl: this.data.dog.photoUrl
      });
      if (this.data.dog.photoUrl) {
        this.photoPreview = this.data.dog.photoUrl;
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedPhotoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedPhotoFile);
    }
  }

  triggerFile(): void {
    this.fileInput.nativeElement.click();
  }

  removePhoto(): void {
    this.selectedPhotoFile = null;
    this.photoPreview = null;
    this.dogForm.patchValue({ photoUrl: '' });
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  onSubmit(): void {
    if (this.dogForm.invalid) return;
    const dogData = this.dogForm.value;
    this.loading = true;
    if (this.selectedPhotoFile) {
      this.dogService.uploadDogPhoto(this.selectedPhotoFile).subscribe({
        next: (photoUrl: string) => {
          dogData.photoUrl = photoUrl;
          this.dialogRef.close(dogData);
        },
        error: () => {
          this.dialogRef.close(dogData); // fallback
        }
      });
    } else {
      this.dialogRef.close(dogData);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

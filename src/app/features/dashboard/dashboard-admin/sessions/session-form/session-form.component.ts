import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Session } from '@core/models/session.model';
import { Course } from '@core/models/course.model';

@Component({
  selector: 'app-session-form',
  standalone: true,
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class SessionFormComponent implements OnInit {
  @Input() session: Session | null = null;
  @Input() courses: Course[] = [];
  @Output() close = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Session>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      cours: [null, Validators.required],
      date: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      niveau: ['', Validators.required],
      capaciteMax: [1, [Validators.required, Validators.min(1)]],
      lieu: [''],
      description: [''],
      imgUrl: [''],
      trancheAge: [null, Validators.required]
      // Coach lo puoi lasciare vuoto per ora (se lo colleghi in un secondo momento)
    });

    if (this.session) {
      this.form.patchValue(this.session);
      this.form.get('cours')?.setValue(this.session.cours?.idCours);
    }
  }

  submit() {
    if (this.form.valid) {
      const value = { ...this.form.value };
      // Trasforma idCours in oggetto Course minimal
      value.cours = this.courses.find(c => c.idCours === value.cours) || null;
      this.save.emit({ ...this.session, ...value });
    }
  }

  closeModal() {
    this.close.emit(false);
  }
}

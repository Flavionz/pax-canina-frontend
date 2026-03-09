import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SessionService } from '@core/services/session.service';
import { CourseService } from '@core/services/course.service';
import { CoachService } from '@core/services/coach.service';
import { AgeGroupService } from '@core/services/age-group.service';

import { Session } from '@core/models/session.model';
import { Course } from '@core/models/course.model';
import { AgeGroup } from '@core/models/age-group.model';

@Component({
  standalone: true,
  selector: 'app-coach-session-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-session-form.component.html',
  styleUrls: ['./coach-session-form.component.scss']
})
export class CoachSessionFormComponent implements OnInit {
  loading = true;
  isEdit = false;

  form!: FormGroup;

  coachId!: number;
  sessionId?: number;

  /** Courses allowed for this coach (server-filtered by specialization) */
  courses: Course[] = [];
  /** Age groups (public GET) */
  ageGroups: AgeGroup[] = [];

  /** Quick guard to block tampering */
  allowedCourseIds = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sessionSvc: SessionService,
    private courseSvc: CourseService,
    private coachSvc: CoachService,
    private ageGroupSvc: AgeGroupService
  ) {}

  ngOnInit(): void {
    // form
    this.form = this.fb.group({
      courseId:    [null as number | null, Validators.required],
      ageGroupId:  [null as number | null, Validators.required],
      date:        [null as string | null, Validators.required],
      startTime:   ['', Validators.required],
      endTime:     ['', Validators.required],
      level:       ['BEGINNER', Validators.required],
      location:    ['', Validators.required],
      maxCapacity: [10, [Validators.required, Validators.min(1)]],
      description: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.sessionId = idParam ? +idParam : undefined;
    this.isEdit = !!this.sessionId;

    // 0) load age-groups immediately (indipendente dal coach)
    this.ageGroupSvc.getAgeGroups().subscribe({
      next: (ags: AgeGroup[]) => (this.ageGroups = ags || []),
      error: () => (this.ageGroups = [])
    });

    // 1) get coach id (to verify ownership on edit)
    this.coachSvc.getProfile().subscribe({
      next: coach => {
        this.coachId = coach.id!;

        // 2) load server-filtered courses for this coach
        this.courseSvc.getCoursesForCoachMe().subscribe({
          next: (list: Course[]) => {
            this.courses = list || [];
            this.allowedCourseIds = new Set(this.courses.map(c => c.idCourse));

            // 3) if edit: load session, verify ownership and course compatibility
            if (this.isEdit) {
              this.sessionSvc.getSessionById(this.sessionId!).subscribe({
                next: s => {
                  if (s.coach?.id !== this.coachId) {
                    alert('Vous ne pouvez modifier que vos propres sessions.');
                    this.router.navigateByUrl('/dashboard/coach/sessions');
                    return;
                  }
                  const cid = s.course?.idCourse;
                  if (!cid || !this.allowedCourseIds.has(cid)) {
                    alert('Cette session n’est pas compatible avec vos spécialisations.');
                    this.router.navigateByUrl('/dashboard/coach/sessions');
                    return;
                  }

                  this.form.patchValue({
                    courseId:    cid,
                    ageGroupId:  s.ageGroup?.idAgeGroup ?? null,
                    date:        s.date,
                    startTime:   s.startTime,
                    endTime:     s.endTime,
                    level:       s.level,
                    location:    s.location,
                    maxCapacity: s.maxCapacity,
                    description: s.description || ''
                  });

                  this.loading = false;
                },
                error: () => {
                  alert('Session introuvable.');
                  this.router.navigateByUrl('/dashboard/coach/sessions');
                }
              });
            } else {
              this.loading = false;
            }
          },
          error: () => {
            this.courses = [];
            this.allowedCourseIds.clear();
            this.loading = false;
          }
        });
      },
      error: () => {
        alert('Profil coach introuvable.');
        this.router.navigateByUrl('/dashboard/coach/sessions');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const selectedCourseId = this.form.value.courseId!;
    if (!this.allowedCourseIds.has(selectedCourseId)) {
      alert('Cours non autorisé pour vos spécialisations.');
      return;
    }

    const payload: Partial<Session> = {
      coach:  { id: this.coachId } as any,
      course: { idCourse: selectedCourseId } as any,
      ageGroup: { idAgeGroup: this.form.value.ageGroupId! } as any,
      date:        this.form.value.date!,
      startTime:   this.form.value.startTime!,
      endTime:     this.form.value.endTime!,
      level:       this.form.value.level!,
      location:    this.form.value.location!,
      maxCapacity: this.form.value.maxCapacity!,
      description: this.form.value.description || ''
    };

    const req$ = this.isEdit
      ? this.sessionSvc.updateSession(this.sessionId!, payload as Session)
      : this.sessionSvc.createSession(payload as Session);

    req$.subscribe(() => this.router.navigateByUrl('/dashboard/coach/sessions'));
  }

  // small helper for UI
  translateAgeGroup(name: string): string {
    switch ((name || '').toUpperCase()) {
      case 'PUPPY': return 'Chiot';
      case 'JUNIOR': return 'Junior';
      case 'YOUNG_ADULT': return 'Jeune adulte';
      case 'ADULT': return 'Adulte';
      default: return name;
    }
  }
}

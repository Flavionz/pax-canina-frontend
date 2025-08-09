import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Course } from '@models/course.model';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private baseUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  /** Public list (all courses) */
  getCourses(): Observable<Course[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(dtos => dtos.map(this.dtoToCourse))
    );
  }

  /** One course by id */
  getCourseById(id: number): Observable<Course> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(this.dtoToCourse)
    );
  }

  /** NEW: only courses allowed for the logged-in coach (filtered by specializations) */
  getCoursesForCoachMe(): Observable<Course[]> {
    return this.http.get<any[]>(`${this.baseUrl}/for-coach/me`).pipe(
      map(dtos => dtos.map(this.dtoToCourse))
    );
  }

  /** Create / Update / Delete (admin use) */
  createCourse(course: Course): Observable<Course> {
    return this.http.post<any>(this.baseUrl, this.courseToDto(course)).pipe(
      map(this.dtoToCourse)
    );
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<any>(`${this.baseUrl}/${course.idCourse}`, this.courseToDto(course)).pipe(
      map(this.dtoToCourse)
    );
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ---------- mappers ----------
  private dtoToCourse = (dto: any): Course => ({
    idCourse: dto.idCourse,
    name: dto.name,
    description: dto.description,
    imageUrl: dto.imageUrl,
    // backend sends specializationIds; frontend model expects number[]
    specializations: dto.specializationIds ?? [],
    // sessions not needed here; keep optional as in your model
    sessions: dto.sessions
  });

  private courseToDto(course: Course): any {
    return {
      idCourse: course.idCourse,
      name: course.name,
      description: course.description,
      imageUrl: course.imageUrl,
      specializationIds: course.specializations ?? []
    };
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Course } from '@models/course.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private baseUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(dtos =>
        dtos.map(dto => ({
          ...dto,
          specializations: dto.specializationIds ?? []
        }))
      )
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(dto => ({
        ...dto,
        specializations: dto.specializationIds ?? []
      }))
    );
  }

  private toDto(course: Course): any {
    return {
      idCourse: course.idCourse,
      name: course.name,
      description: course.description,
      status: course.status,
      imageUrl: course.imageUrl,
      specializationIds: course.specializations ?? []
    };
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, this.toDto(course));
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${course.idCourse}`, this.toDto(course));
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

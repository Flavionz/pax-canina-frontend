import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Session } from '@core/models/session.model';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private baseUrl = `${environment.apiUrl}/sessions`;

  constructor(private http: HttpClient) {}

  getSessions(): Observable<Session[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}`)
      .pipe(map(dtos => (dtos || []).map(this.dtoToSession)));
  }

  getByCourse(courseId: number): Observable<Session[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/by-course/${courseId}`)
      .pipe(map(dtos => (dtos || []).map(this.dtoToSession)));
  }

  getByDate(date: string): Observable<Session[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/by-date/${date}`)
      .pipe(map(dtos => (dtos || []).map(this.dtoToSession)));
  }

  getSessionById(idSession: number): Observable<Session> {
    return this.http
      .get<any>(`${this.baseUrl}/${idSession}`)
      .pipe(map(this.dtoToSession));
  }

  createSession(session: Session): Observable<Session> {
    const dto = this.sessionToDto(session);
    return this.http
      .post<any>(`${this.baseUrl}`, dto)
      .pipe(map(this.dtoToSession));
  }

  updateSession(idSession: number, session: Session): Observable<Session> {
    const dto = this.sessionToDto(session);
    return this.http
      .put<any>(`${this.baseUrl}/${idSession}`, dto)
      .pipe(map(this.dtoToSession));
  }

  deleteSession(idSession: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idSession}`);
  }

  getById(id: number): Observable<Session> {
    return this.getSessionById(id);
  }
  create(payload: Session): Observable<Session> {
    return this.createSession(payload);
  }
  update(id: number, payload: Session): Observable<Session> {
    return this.updateSession(id, payload);
  }
  delete(id: number): Observable<void> {
    return this.deleteSession(id);
  }

  getMine(coachId: number): Observable<Session[]> {
    return this.getSessions().pipe(
      map(sessions => (sessions || []).filter(s => s.coach?.id === coachId))
    );
  }

  /** --- mapping DTO <-> model --- */
  private dtoToSession = (dto: any): Session => ({
    idSession: dto.idSession,
    date: dto.date,
    level: dto.level,
    startTime: dto.startTime,
    endTime: dto.endTime,
    maxCapacity: dto.maxCapacity,
    registrationsCount: dto.registrationsCount,
    description: dto.description,
    location: dto.location,
    imageUrl: dto.imageUrl,
    status: (dto.status === 'available' || dto.status === 'full') ? dto.status : undefined,
    course: dto.courseId
      ? { idCourse: dto.courseId, name: dto.courseName ?? '', imageUrl: dto.courseImageUrl }
      : undefined,
    coach: dto.coachId
      ? { id: dto.coachId, firstName: dto.coachFirstName ?? '', lastName: dto.coachLastName ?? '', avatarUrl: dto.coachAvatarUrl }
      : undefined,
    ageGroup: dto.ageGroupId
      ? {
        idAgeGroup: dto.ageGroupId,
        name: dto.ageGroupName ?? '',
        minAge: dto.minAge,
        maxAge: dto.maxAge
      }
      : undefined,
  });

  private sessionToDto(session: Session): any {
    return {
      idSession: session.idSession,
      date: session.date,
      level: session.level,
      startTime: session.startTime,
      endTime: session.endTime,
      maxCapacity: session.maxCapacity,
      registrationsCount: session.registrationsCount,
      description: session.description,
      location: session.location,
      imageUrl: session.imageUrl,
      status: session.status,


      courseId: session.course?.idCourse,
      courseName: session.course?.name,
      coachId: session.coach?.id,
      coachFirstName: session.coach?.firstName,
      coachLastName: session.coach?.lastName,

      ageGroupId: session.ageGroup?.idAgeGroup,
      ageGroupName: session.ageGroup?.name,

      minAge: session.ageGroup?.minAge,
      maxAge: session.ageGroup?.maxAge,
    };
  }
}

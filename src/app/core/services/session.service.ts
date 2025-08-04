import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Session } from '@core/models/session.model';
import { SessionDto } from '@models/session-dto.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private baseUrl = `${environment.apiUrl}/session`;

  constructor(private http: HttpClient) {}

  /** Fetch all sessions, mapping from DTO to Session model */
  getSessions(): Observable<Session[]> {
    return this.http.get<SessionDto[]>(`${this.baseUrl}`).pipe(
      map(dtos => dtos.map(dto => this.dtoToSession(dto)))
    );
  }

  /** Fetch sessions by course ID */
  getByCourse(courseId: number): Observable<Session[]> {
    return this.http.get<SessionDto[]>(`${this.baseUrl}/by-course/${courseId}`).pipe(
      map(dtos => dtos.map(dto => this.dtoToSession(dto)))
    );
  }

  /** Fetch sessions for a specific date (ISO yyyy-MM-dd) */
  getByDate(date: string): Observable<Session[]> {
    return this.http.get<SessionDto[]>(`${this.baseUrl}/by-date/${date}`).pipe(
      map(dtos => dtos.map(dto => this.dtoToSession(dto)))
    );
  }

  /** (Optional) Fetch a single session by its ID */
  getSessionById(idSession: number): Observable<Session> {
    return this.http.get<SessionDto>(`${this.baseUrl}/${idSession}`).pipe(
      map(dto => this.dtoToSession(dto))
    );
  }

  // === CRUD Operations ===

  /** Create a new session (send SessionDto, return mapped Session) */
  createSession(session: Session): Observable<Session> {
    const dto = this.sessionToDto(session);
    return this.http.post<SessionDto>(`${this.baseUrl}`, dto).pipe(
      map(dto => this.dtoToSession(dto))
    );
  }

  /** Update an existing session */
  updateSession(idSession: number, session: Session): Observable<Session> {
    const dto = this.sessionToDto(session);
    return this.http.put<SessionDto>(`${this.baseUrl}/${idSession}`, dto).pipe(
      map(dto => this.dtoToSession(dto))
    );
  }

  /** Delete a session by its ID */
  deleteSession(idSession: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idSession}`);
  }

  // === MAPPING UTILS ===

  /** Convert SessionDto to Session (with nested objects and default values) */
  private dtoToSession(dto: SessionDto): Session {
    return {
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
        ? { idCourse: dto.courseId, name: dto.courseName ?? '', imageUrl: undefined }
        : undefined,
      coach: dto.coachId
        ? {
          id: dto.coachId,
          firstName: dto.coachFirstName ?? '',
          lastName: dto.coachLastName ?? '',
          avatarUrl: undefined
        }
        : undefined,
      ageGroup: dto.ageGroupId
        ? {
          idAgeGroup: dto.ageGroupId,
          name: dto.ageGroupName ?? '',
          ageMin: dto.minAge,
          ageMax: dto.maxAge
        }
        : undefined,
    };
  }

  /** Convert Session model to SessionDto for backend */
  private sessionToDto(session: Session): SessionDto {
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
      minAge: session.ageGroup?.ageMin,
      maxAge: session.ageGroup?.ageMax,
    };
  }
}

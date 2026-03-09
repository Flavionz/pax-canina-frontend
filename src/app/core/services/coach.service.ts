import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coach } from '@models/coach.model';
import { environment } from '@environments/environment';
import { UploadService } from './upload.service';

@Injectable({ providedIn: 'root' })
export class CoachService {
  private baseUrl = `${environment.apiUrl}/coach`;

  constructor(
    private http: HttpClient,
    private uploadService: UploadService
  ) {}

  getProfile(): Observable<Coach> {
    return this.http.get<Coach>(`${this.baseUrl}/me`);
  }

  updateProfile(data: Partial<Coach>): Observable<Coach> {
    return this.http.put<Coach>(`${this.baseUrl}/me`, data);
  }

  uploadAvatar(file: File): Observable<string> {
    return this.uploadService
      .uploadAvatar(file)
      .pipe(map(url => url));
  }

  getCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(`${this.baseUrl}`);
  }
}

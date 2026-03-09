import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Admin } from '@models/admin.model';
import { environment } from '@environments/environment';
import { UploadService } from './upload.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(
    private http: HttpClient,
    private uploadService: UploadService
  ) {}

  getProfile(): Observable<Admin> {
    return this.http.get<Admin>(`${this.baseUrl}/me`);
  }

  updateProfile(data: Partial<Admin>): Observable<Admin> {
    return this.http.put<Admin>(`${this.baseUrl}/me`, data);
  }

  uploadAvatar(file: File): Observable<string> {
    return this.uploadService
      .uploadAvatar(file)
      .pipe(map(url => url));
  }
}

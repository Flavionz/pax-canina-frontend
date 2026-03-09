import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Owner } from '@models/owner.model';
import { environment } from '@environments/environment';
import { UploadService } from './upload.service';

@Injectable({ providedIn: 'root' })
export class OwnerService {
  private baseUrl = `${environment.apiUrl}/owner`;

  constructor(
    private http: HttpClient,
    private uploadService: UploadService
  ) {}

  getProfile(): Observable<Owner> {
    return this.http.get<Owner>(`${this.baseUrl}/me`);
  }

  updateProfile(data: Partial<Owner>): Observable<Owner> {
    return this.http.put<Owner>(`${this.baseUrl}/me`, data);
  }

  uploadAvatar(file: File): Observable<string> {
    return this.uploadService
      .uploadAvatar(file)
      .pipe(map(url => url));
  }
}

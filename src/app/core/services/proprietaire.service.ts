// src/app/core/services/proprietaire.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Proprietaire } from '@models/proprietaire.model';
import { environment } from '@environments/environment';
import { UploadService } from './upload.service';

@Injectable({ providedIn: 'root' })
export class ProprietaireService {
  private baseUrl = `${environment.apiUrl}/proprietaire`;

  constructor(
    private http: HttpClient,
    private uploadService: UploadService
  ) {}

  getProfile(): Observable<Proprietaire> {
    return this.http.get<Proprietaire>(`${this.baseUrl}/me`);
  }

  updateProfile(data: Partial<Proprietaire>): Observable<Proprietaire> {
    return this.http.put<Proprietaire>(`${this.baseUrl}/me`, data);
  }


  uploadAvatar(file: File): Observable<string> {
    return this.uploadService
      .uploadAvatar(file)
      .pipe(map(url => url));
  }
}

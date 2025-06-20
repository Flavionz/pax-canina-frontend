import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UploadService {
  uploadAvatar(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic', 'true');
    return this.http.post<{ url: string }>(`${environment.apiUrl}/upload`, formData)
      .pipe(map(res => res.url || (res as any as string)));
  }
  constructor(private http: HttpClient) {}
}

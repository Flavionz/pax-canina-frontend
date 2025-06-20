// src/app/core/services/dog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dog } from '@models/dog.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private baseUrl    = `${environment.apiUrl}/chien`;    // GET /api/chien → tutti i cani (admin)
  private myDogsUrl  = `${environment.apiUrl}/chien/me`; // GET /api/chien/me → miei cani
  private uploadUrl  = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  getAllDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(this.baseUrl);
  }

  getMyDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(this.myDogsUrl);
  }

  addDog(dog: Dog): Observable<Dog> {
    return this.http.post<Dog>(`${this.baseUrl}/me`, dog);
  }

  updateDog(dog: Dog): Observable<Dog> {
    if (!dog.idChien) {
      throw new Error('Dog ID is required for update');
    }
    return this.http.put<Dog>(`${this.baseUrl}/me/${dog.idChien}`, dog);
  }

  deleteDog(idChien: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/me/${idChien}`);
  }

  uploadDogPhoto(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('isPublic', 'true');
    return this.http.post<{ url: string }>(this.uploadUrl, form)
      .pipe(map(res => res.url));
  }
}

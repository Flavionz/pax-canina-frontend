// src/app/core/services/dog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dog } from '@models/dog.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private baseUrl = `${environment.apiUrl}/chiens`;

  constructor(private http: HttpClient) {}

  getMyDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${environment.apiUrl}/proprietaires/me/chiens`);
  }

  addDog(dog: Dog): Observable<Dog> {
    return this.http.post<Dog>(this.baseUrl, dog);
  }

  updateDog(dog: Dog): Observable<Dog> {
    return this.http.put<Dog>(`${this.baseUrl}/${dog.idChien}`, dog);
  }

  deleteDog(idChien: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idChien}`);
  }
}

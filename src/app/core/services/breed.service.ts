import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Breed } from '@core/models/breed.model';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class BreedService {
  private baseUrl = `${environment.apiUrl}/breeds`;

  constructor(private http: HttpClient) {}

  getBreeds(): Observable<{ idBreed: number; name: string }[]> {
    return this.http.get<{ idBreed: number; name: string }[]>(`${this.baseUrl}/lite`);
  }

}

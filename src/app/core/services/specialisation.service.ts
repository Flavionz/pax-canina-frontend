import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialization } from '@models/specialization.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecialisationService {
  private baseUrl = `${environment.apiUrl}/specialisation`; // o /specialisations

  constructor(private http: HttpClient) {}

  getSpecialisations(): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(this.baseUrl);
  }
}

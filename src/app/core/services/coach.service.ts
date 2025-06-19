import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coach } from '@models/coach.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private baseUrl = `${environment.apiUrl}/coach`; // adatta se il tuo endpoint è /coaches

  constructor(private http: HttpClient) {}

  getCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(this.baseUrl);
  }
}

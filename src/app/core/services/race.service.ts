import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Race } from '@models/race.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  private baseUrl = `${environment.apiUrl}/race`; // adatta se il tuo endpoint è /races

  constructor(private http: HttpClient) {}

  getRaces(): Observable<Race[]> {
    return this.http.get<Race[]>(this.baseUrl);
  }
}

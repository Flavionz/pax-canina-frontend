import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgeRange } from '@models/age-range.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgeRangeService {
  private baseUrl = `${environment.apiUrl}/tranche-age`; // adatta in base al tuo controller

  constructor(private http: HttpClient) {}

  getAgeRanges(): Observable<AgeRange[]> {
    return this.http.get<AgeRange[]>(this.baseUrl);
  }
}

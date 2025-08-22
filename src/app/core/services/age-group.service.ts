import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgeGroup } from '@core/models/age-group.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgeGroupService {
  private baseUrl = `${environment.apiUrl}/age-groups`;

  constructor(private http: HttpClient) {}

  getAgeGroups(): Observable<AgeGroup[]> {
    return this.http.get<AgeGroup[]>(this.baseUrl);
  }
}

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
  private myDogsUrl = `${environment.apiUrl}/proprietaires/me/chiens`;
  private uploadUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  getMyDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(this.myDogsUrl);
  }

  addDog(dog: Dog): Observable<Dog> {
    return this.http.post<Dog>(this.baseUrl, dog);
  }

  updateDog(dog: Dog): Observable<Dog> {
    if (!dog.idChien) {
      throw new Error('Dog ID is required for update');
    }
    return this.http.put<Dog>(`${this.baseUrl}/${dog.idChien}`, dog);
  }

  deleteDog(idChien: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idChien}`);
  }

  uploadDogPhoto(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic', 'true');
    return this.http.post(this.uploadUrl, formData, { responseType: 'text' });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dog } from '@models/dog.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private baseUrl = `${environment.apiUrl}/chien`; // NOTA: nessuna "s" finale!
  private myDogsUrl = `${environment.apiUrl}/chien/me`;
  private uploadUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  // Ottieni tutti i cani del proprietario loggato
  getMyDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(this.myDogsUrl);
  }

  // Aggiungi un nuovo cane per il proprietario loggato
  addDog(dog: Dog): Observable<Dog> {
    return this.http.post<Dog>(`${this.baseUrl}/me`, dog);
  }

  // Modifica un cane (solo se del proprietario loggato)
  updateDog(dog: Dog): Observable<Dog> {
    if (!dog.idChien) {
      throw new Error('Dog ID is required for update');
    }
    return this.http.put<Dog>(`${this.baseUrl}/me/${dog.idChien}`, dog);
  }

  // Elimina un cane (solo se del proprietario loggato)
  deleteDog(idChien: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/me/${idChien}`);
  }

  // Upload foto del cane
  uploadDogPhoto(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic', 'true');
    return this.http.post(this.uploadUrl, formData, { responseType: 'text' });
  }
}

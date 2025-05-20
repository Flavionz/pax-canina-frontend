// core/services/dog.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Dog {
  id?: string;
  nom: string;
  race: string;
  age: number;
  sexe: string;
  poids: number;
  numeroPuce?: string;
  photo_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private dogs: Dog[] = [];

  constructor() {}

  getUserDogs(userId: string): Observable<Dog[]> {
    // Dans un vrai service, cette méthode ferait un appel API
    // GET /api/users/{userId}/dogs
    return of(this.dogs);
  }

  addDog(dog: Dog): Observable<Dog> {
    // Dans un vrai service, cette méthode ferait un appel API
    // POST /api/dogs
    const newDog = { ...dog, id: Date.now().toString() };
    this.dogs.push(newDog);
    return of(newDog);
  }
}

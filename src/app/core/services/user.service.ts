import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUser: User = {
    id: 1,
    firstName: 'Flavio',
    lastName: 'Terenzi',
    email: 'flavio.terenzi@example.com',
    role: 'Propriétaire',
    telephone: '0612345678',
    avatar: 'assets/images/avatar.png',
    address: '5 Rue Principale',
    city: 'La Maxe',
    postalCode: '57140',
    bio: 'Passionné de dressage canin depuis plus de 5 ans. Propriétaire de deux bergers allemands et d\'un labrador.',
    memberSince: '2022-01-01',
    dogs: [
      { name: 'Rex', breed: 'Berger Allemand', age: 3 },
      { name: 'Luna', breed: 'Labrador', age: 2 }
    ],
    registrations: [
      { activity: 'Cours d\'obéissance', date: '2024-03-15', status: 'Confirmé' },
      { activity: 'Atelier agility', date: '2024-04-10', status: 'En attente' }
    ]
  };


  getUserProfile(): User {
    return this.mockUser;
  }

  isLoggedIn(): boolean {
    return true;
  }
}

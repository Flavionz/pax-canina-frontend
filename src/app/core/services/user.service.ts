// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<any>(`${environment.apiUrl}/proprietaires/me`).pipe(
      map(data => mapUserFromBackend(data))
    );
  }

  updateUserProfile(user: Partial<User>): Observable<User> {
    const payload = mapUserToBackend(user);
    return this.http.put<any>(`${environment.apiUrl}/proprietaires/me`, payload).pipe(
      map(data => mapUserFromBackend(data))
    );
  }
}

function mapUserFromBackend(data: any): User {
  return {
    idUtilisateur: data.id_utilisateur,
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    telephone: data.telephone,
    dateInscription: data.date_inscription,
    lastLogin: data.last_login,
    adresse: data.adresse,
    ville: data.ville,
    codePostal: data.code_postal,
    bio: data.bio,
    avatarUrl: data.avatar_url,
    chiens: data.chiens,
    inscriptions: data.inscriptions
  };
}

function mapUserToBackend(user: Partial<User>): any {
  return {
    id_utilisateur: user.idUtilisateur,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    date_inscription: user.dateInscription,
    last_login: user.lastLogin,
    adresse: user.adresse,
    ville: user.ville,
    code_postal: user.codePostal,
    bio: user.bio,
    avatar_url: user.avatarUrl,
  };
}

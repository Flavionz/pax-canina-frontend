import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/proprietaire/me`;

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(data => mapUserFromBackend(data))
    );
  }

  updateUserProfile(user: Partial<User>): Observable<User> {
    const payload = mapUserToBackend(user);
    return this.http.put<any>(this.baseUrl, payload).pipe(
      map(data => mapUserFromBackend(data))
    );
  }
}

// Mapping camelCase <-> camelCase
function mapUserFromBackend(data: any): User {
  return {
    idUtilisateur: data.id,
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    telephone: data.telephone,
    dateInscription: data.dateInscription ? new Date(data.dateInscription) : null,
    lastLogin: data.lastLogin ? new Date(data.lastLogin) : null,
    adresse: data.adresse,
    ville: data.ville,
    codePostal: data.codePostal,
    bio: data.bio,
    avatarUrl: data.avatarUrl,
    chiens: data.chiens,
    inscriptions: data.inscriptions // Se vuoi puoi anche fare un mapping più profondo qui
  };
}

function mapUserToBackend(user: Partial<User>): any {
  return {
    id: user.idUtilisateur,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    dateInscription: user.dateInscription,
    lastLogin: user.lastLogin,
    adresse: user.adresse,
    ville: user.ville,
    codePostal: user.codePostal,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
  };
}

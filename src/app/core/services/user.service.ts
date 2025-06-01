import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
    inscriptions: data.inscriptions ? data.inscriptions.map((reg: any) => ({
      idInscription: reg.id_inscription,
      dateInscription: reg.date_inscription,
      statut: reg.statut,
      dateAnnulation: reg.date_annulation,
      motifAnnulation: reg.motif_annulation,
      session: {
        idSession: reg.session?.id_session,
        date: reg.session?.date,
        niveau: reg.session?.niveau,
        heureDebut: reg.session?.heure_debut,
        heureFin: reg.session?.heure_fin,
        cours: {
          idCours: reg.session?.cours?.id_cours,
          nom: reg.session?.cours?.nom
        }
      },
      chien: {
        idChien: reg.chien?.id_chien,
        nom: reg.chien?.nom,
        photoUrl: reg.chien?.photo_url
      }
    })) : []
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

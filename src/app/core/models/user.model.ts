export interface User {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateInscription?: Date | string;
  lastLogin?: Date | string;
  avatarUrl?: string;
  bio?: string;

  role?: 'ADMIN' | 'COACH' | 'PROPRIETAIRE';

}

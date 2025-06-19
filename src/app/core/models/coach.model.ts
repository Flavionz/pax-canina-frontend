import { Specialisation } from './specialisation.model';

export interface Coach {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateInscription?: string;    // ISO date
  lastLogin?: string;          // ISO datetime
  avatarUrl?: string;
  bio?: string;
  specialisations?: Specialisation[]; // Many‐to‐Many
}

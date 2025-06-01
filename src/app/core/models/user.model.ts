import { Dog } from './dog.model';
import { Registration } from './registration.model';

export interface User {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateInscription: string;
  lastLogin?: string;

  adresse?: string;
  ville?: string;
  codePostal?: string;
  bio?: string;
  avatarUrl?: string;

  chiens?: Dog[];
  inscriptions?: Registration[];
}

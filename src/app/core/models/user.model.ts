// src/app/core/models/user.model.ts
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

  chiens?: any[];         // Array di Dog, se vuoi tipizzalo meglio
  inscriptions?: any[];   // Array di iscrizioni, se vuoi tipizzalo meglio
}

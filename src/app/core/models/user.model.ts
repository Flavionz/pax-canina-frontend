export interface User {
  // Campi da UTILISATEUR
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateInscription: string; // ISO string (es: '2022-01-01')
  lastLogin?: string;      // ISO string (es: '2024-05-28T15:00:00Z')

  // Campi da PROPRIETAIRE (opzionali, solo per i proprietari)
  adresse?: string;
  ville?: string;
  codePostal?: string;
  bio?: string;
  avatarUrl?: string;

  // Relazioni (puoi aggiungerle se il backend le espone)
  chiens?: any[];         // Array di Dog, se vuoi tipizzalo meglio
  inscriptions?: any[];   // Array di iscrizioni, se vuoi tipizzalo meglio
}

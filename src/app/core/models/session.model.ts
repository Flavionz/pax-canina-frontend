export interface Session {
  idSession: number;
  date: string;
  niveau: string;
  heureDebut: string;
  heureFin: string;
  capaciteMax: number;
  description?: string;
  lieu?: string;
  imgUrl?: string;

  cours: {
    idCours: number;
    nom: string;
    imgUrl?: string;
  };

  coach?: {
    idUtilisateur: number;
    nom: string;
    prenom: string;
    avatarUrl?: string;
  };

  trancheAge?: {
    idTranche: number;
    nom: string;
    ageMin: number;
    ageMax: number;
  };

  status?: 'available' | 'full';
}

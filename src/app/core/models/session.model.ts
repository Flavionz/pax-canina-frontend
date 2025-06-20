export interface Session {
  idSession: number;

  date: string;

  niveau: string;

  heureDebut: string;

  heureFin: string;

  capaciteMax: number;

  inscriptionsCount?: number;

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
    prenom: string;
    nom: string;
    avatarUrl?: string;
  };

  trancheAge: {
    idTranche: number;
    nom: string;
    ageMin: number;
    ageMax: number;
  };

  /**
   * Disponibilità calcolata:
   * - “available” se inscriptionsCount < capaciteMax
   * - “full” se >= capaciteMax
   */
  status: 'available' | 'full';
}

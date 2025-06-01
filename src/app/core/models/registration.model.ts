export interface Registration {
  idInscription?: number;
  dateInscription?: string;
  statut: string;
  dateAnnulation?: string;
  motifAnnulation?: string;

  session: {
    idSession: number;
    date: string;
    niveau: string;
    heureDebut: string;
    heureFin: string;
    cours: {
      idCours: number;
      nom: string;
    }
  };

  chien: {
    idChien: number;
    nom: string;
    photoUrl?: string;
  };
}

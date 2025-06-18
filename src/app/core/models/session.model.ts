// src/app/core/models/session.model.ts

export interface Session {
  /** Identificativo univoco della sessione */
  idSession: number;

  /** Data in formato ISO (YYYY-MM-DD) */
  date: string;

  /** Livello (es. “Débutant”, “Intermédiaire”…) */
  niveau: string;

  /** Orario di inizio (HH:MM:SS) */
  heureDebut: string;

  /** Orario di fine (HH:MM:SS) */
  heureFin: string;

  /** Capacità massima di partecipanti */
  capaciteMax: number;

  /** Numero attuale di iscritti (se fornito dal backend) */
  inscriptionsCount?: number;

  /** Testualità descrittiva della sessione */
  description?: string;

  /** Luogo dove si terrà */
  lieu?: string;

  /** Url dell’immagine di copertina */
  imgUrl?: string;

  /** Corso di cui questa sessione fa parte */
  cours: {
    idCours: number;
    nom: string;
    /** (Opzionale) url immagine del corso */
    imgUrl?: string;
  };

  /** Coach che propone la sessione */
  coach?: {
    idUtilisateur: number;
    prenom: string;
    nom: string;
    avatarUrl?: string;
  };

  /** Tranche d’età compatibile con questa sessione */
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

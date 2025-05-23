export interface Registration {
  cours: string;
  niveau: string;
  chien: {
    nom: string;
    avatar: string;
  };
  date: string;    // ISO string
  heure: string;   // es: "10:00 - 11:30"
  statut: string;  // es: "Confirmé", "En attente"
}

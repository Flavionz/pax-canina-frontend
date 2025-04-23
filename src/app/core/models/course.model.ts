export interface Course {
  id: number;
  nom: string;
  description: string;
  capacite_max: number;
  statut: string;
  niveau: string;
  id_type_cours: number;
  id_tranche: number;
  imageUrl: string;
}

// src/app/core/models/dog.model.ts
export interface Dog {
  idChien?: number;
  nom: string;
  race: string;
  dateNaissance: string;
  sexe: string;
  poids: number;
  numeroPuce?: string;
  photoUrl?: string;
}

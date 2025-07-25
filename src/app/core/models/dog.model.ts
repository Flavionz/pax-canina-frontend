export interface Dog {
  idDog?: number;
  name: string;
  birthDate: string;
  sex: string;
  photoUrl?: string;
  chipNumber?: string;
  weight: number;
  idOwner?: number;
  idBreed?: number;
  breedName?: string; // opzionale, backend può riempirlo
  ownerName?: string; // opzionale
}

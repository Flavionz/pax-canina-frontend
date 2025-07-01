export interface AgeGroup {
  idAgeGroup: number;
  name: string;        // Enum value: 'PUPPY', 'JUNIOR', 'ADULT', 'SENIOR'
  minAge?: number | null;
  maxAge?: number | null;
}

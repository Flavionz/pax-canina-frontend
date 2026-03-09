export interface Session {
  idSession?: number;
  date: string;
  level?: string;
  startTime?: string;
  endTime?: string;
  maxCapacity?: number;
  registrationsCount?: number;
  description?: string;
  location?: string;
  imageUrl?: string;

  course?: {
    idCourse: number;
    name: string;
    imageUrl?: string;
  };

  coach?: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };

  ageGroup?: {
    idAgeGroup: number;
    name: string;
    minAge?: number | null;
    maxAge?: number | null;
  };

  status?: 'available' | 'full';
}

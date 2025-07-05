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
    ageMin?: number;
    ageMax?: number;
  };

  status?: 'available' | 'full';
}

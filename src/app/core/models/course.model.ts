export interface Course {
  idCourse: number;
  name: string;
  description?: string;
  imageUrl?: string;
  specializations?: number[];
  sessions?: any[];
}

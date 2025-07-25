export interface Course {
  idCourse: number;
  name: string;
  description?: string;
  status?: string;
  imageUrl?: string;
  specializations?: number[];
  sessions?: any[];
}

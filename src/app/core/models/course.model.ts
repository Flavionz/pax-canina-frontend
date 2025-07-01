import { Specialization } from './specialization.model';
import { Session } from './session.model';

export interface Course {
  idCourse: number;
  name: string;
  description?: string;
  status?: string;
  imageUrl?: string;
  specializations?: Specialization[];
  sessions?: Session[];
}

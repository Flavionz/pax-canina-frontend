import { User } from './user.model';
import { Specialization } from './specialization.model';

export interface Coach extends User {
  specializations?: Specialization[];
}

import { User } from './user.model';
import { Specialisation } from './specialisation.model';

export interface Coach extends User {
  specialisations?: Specialisation[];
}

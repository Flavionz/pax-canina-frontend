import { User } from './user.model';
import { Dog } from './dog.model';
import { Registration } from './registration.model';

export interface Owner extends User {
  address?: string;
  city?: string;
  postalCode?: string;
  dogs?: Dog[];
  registrations?: Registration[];
}

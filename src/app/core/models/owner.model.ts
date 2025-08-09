import { User } from './user.model';
import { Dog } from './dog.model';
import { RegistrationFlat } from './registration-flat.model';

export interface Owner extends User {
  address?: string;
  city?: string;
  postalCode?: string;
  dogs?: Dog[];
  registrations?: RegistrationFlat[];
}

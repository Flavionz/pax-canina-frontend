import { User } from './user.model';
import { Dog } from './dog.model';
import {Registration} from '@models/registration.model';

export interface Proprietaire extends User {
  adresse?: string;
  ville?: string;
  codePostal?: string;
  chiens?: Dog[];
  inscriptions?: Registration[];

}

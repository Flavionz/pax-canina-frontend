import { Specialization } from './specialization.model';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  role: 'ADMIN' | 'COACH' | 'OWNER' | string;
  registrationDate?: string;
  specializations?: number[];
  emailVerified?: boolean;
}

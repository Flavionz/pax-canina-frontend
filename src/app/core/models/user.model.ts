export interface User {
  idUser: number;
  lastName: string;
  firstName: string;
  email: string;
  phone?: string;
  registrationDate?: Date | string;
  lastLogin?: Date | string;
  avatarUrl?: string;
  bio?: string;

  role: 'ADMIN' | 'COACH' | 'OWNER';
}

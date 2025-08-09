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
  emailVerified?: boolean;

  //(RGPD)
  isActive?: boolean;
  anonymizedAt?: string | null;
  lastPasswordChangeAt?: string | null;

  // Solo se l’utente è coach
  specializations?: number[];
}

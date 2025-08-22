import type { RegistrationDto } from './registration.dto';

export type RegistrationFlat =
  Omit<RegistrationDto, 'sessionName' | 'courseName' | 'dogName' | 'status'> & {
  sessionName: string;
  courseName: string;
  dogName: string;
  status: string;
};

export interface RegistrationDto {
  id: number;
  sessionId: number | null;
  courseId: number | null;
  dogId: number | null;
  sessionName: string | null;
  courseName: string | null;
  dogName: string | null;
  registrationDate: string;  // ISO
  status: string | null;
}

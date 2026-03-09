export interface Registration {
  idRegistration?: number;
  registrationDate?: string;
  status: string;

  cancellationDate?: string;
  cancellationReason?: string;

  session: {
    idSession: number;
    date: string;
    level?: string;
    startTime?: string;
    endTime?: string;
    course: {
      idCourse: number;
      name: string;
    }
  };

  dog: {
    idDog: number;
    name: string;
    photoUrl?: string;
  };
}

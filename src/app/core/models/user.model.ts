export interface Dog {
  name: string;
  breed: string;
  age: number;
}

export interface Registration {
  activity: string;
  date: string;  // o Date
  status: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  telephone: string;
  avatar?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  bio?: string;
  memberSince?: string; // o Date
  dogs?: Dog[];
  registrations?: Registration[];
}

export interface Session {
  id: number;
  date: string;
  title: string;
  status: 'available' | 'full';
}

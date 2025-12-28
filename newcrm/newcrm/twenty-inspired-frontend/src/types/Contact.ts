export interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  position: string;
  status: 'Active' | 'Inactive' | 'Lead';
}
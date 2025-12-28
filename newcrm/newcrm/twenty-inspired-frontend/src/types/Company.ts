export interface Company {
  id: number;
  name: string;
  industry: string;
  size: 'Small' | 'Medium' | 'Large';
  revenue: string;
  contacts: number;
}
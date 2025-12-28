export interface Opportunity {
  id: number;
  name: string;
  company: string;
  value: string;
  stage: 'Prospecting' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  closeDate: string;
  probability: string;
}
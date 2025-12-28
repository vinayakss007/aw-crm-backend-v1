// api/opportunities.ts
import { Opportunity } from '../types/Opportunity';

const OPPORTUNITIES_KEY = 'abetworks-opportunities';

// Mock API service for opportunities
export const opportunityService = {
  getAll: (): Opportunity[] => {
    const opportunities = localStorage.getItem(OPPORTUNITIES_KEY);
    return opportunities ? JSON.parse(opportunities) : [];
  },

  getById: (id: number): Opportunity | undefined => {
    const opportunities = opportunityService.getAll();
    return opportunities.find(opportunity => opportunity.id === id);
  },

  create: (opportunity: Omit<Opportunity, 'id'>): Opportunity => {
    const opportunities = opportunityService.getAll();
    const newOpportunity = { ...opportunity, id: Date.now() };
    opportunities.push(newOpportunity);
    localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opportunities));
    return newOpportunity;
  },

  update: (id: number, updatedOpportunity: Partial<Opportunity>): Opportunity | undefined => {
    const opportunities = opportunityService.getAll();
    const index = opportunities.findIndex(opportunity => opportunity.id === id);
    if (index !== -1) {
      opportunities[index] = { ...opportunities[index], ...updatedOpportunity };
      localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opportunities));
      return opportunities[index];
    }
    return undefined;
  },

  delete: (id: number): boolean => {
    const opportunities = opportunityService.getAll();
    const filteredOpportunities = opportunities.filter(opportunity => opportunity.id !== id);
    if (filteredOpportunities.length !== opportunities.length) {
      localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(filteredOpportunities));
      return true;
    }
    return false;
  }
};
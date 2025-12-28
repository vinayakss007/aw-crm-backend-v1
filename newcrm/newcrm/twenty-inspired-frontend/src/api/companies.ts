// api/companies.ts
import { Company } from '../types/Company';

const COMPANIES_KEY = 'abetworks-companies';

// Mock API service for companies
export const companyService = {
  getAll: (): Company[] => {
    const companies = localStorage.getItem(COMPANIES_KEY);
    return companies ? JSON.parse(companies) : [];
  },

  getById: (id: number): Company | undefined => {
    const companies = companyService.getAll();
    return companies.find(company => company.id === id);
  },

  create: (company: Omit<Company, 'id'>): Company => {
    const companies = companyService.getAll();
    const newCompany = { ...company, id: Date.now() };
    companies.push(newCompany);
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
    return newCompany;
  },

  update: (id: number, updatedCompany: Partial<Company>): Company | undefined => {
    const companies = companyService.getAll();
    const index = companies.findIndex(company => company.id === id);
    if (index !== -1) {
      companies[index] = { ...companies[index], ...updatedCompany };
      localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
      return companies[index];
    }
    return undefined;
  },

  delete: (id: number): boolean => {
    const companies = companyService.getAll();
    const filteredCompanies = companies.filter(company => company.id !== id);
    if (filteredCompanies.length !== companies.length) {
      localStorage.setItem(COMPANIES_KEY, JSON.stringify(filteredCompanies));
      return true;
    }
    return false;
  }
};
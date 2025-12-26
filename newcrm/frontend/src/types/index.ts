// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Lead types
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  jobTitle: string;
  leadSource: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'closed';
  leadScore: number;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Opportunity types
export interface Opportunity {
  id: string;
  name: string;
  description: string;
  accountId: string;
  contactId: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  amount: number;
  currency: string;
  closeDate: string;
  type: 'New Business' | 'Existing Business';
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Contact types
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  accountId: string;
  status: 'active' | 'inactive' | 'lead';
  leadSource: string;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Account types
export interface Account {
  id: string;
  name: string;
  description: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  size: 'Small' | 'Medium' | 'Large';
  annualRevenue: number;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Activity types
export interface Activity {
  id: string;
  subject: string;
  type: 'Call' | 'Meeting' | 'Email' | 'Task' | 'Note';
  description: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  startDate: string;
  endDate: string;
  accountId: string;
  contactId: string;
  opportunityId: string;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Custom Field types
export interface CustomField {
  id: string;
  entity: 'lead' | 'contact' | 'account' | 'opportunity' | 'activity' | 'user';
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  displayName: string;
  required: boolean;
  options?: string[];
  createdAt: string;
  updatedAt: string;
}
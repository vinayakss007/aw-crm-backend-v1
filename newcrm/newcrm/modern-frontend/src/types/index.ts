export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  department?: string;
  position?: string;
  phone?: string;
  avatar?: string;
}

export interface Account {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address: Address;
  owner: User;
  contacts: Contact[];
  opportunities: Opportunity[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'prospect';
  customFields?: Record<string, any>;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  accountId?: string;
  account?: Account;
  ownerId: string;
  owner?: User;
  leadSource?: string;
  status: 'active' | 'inactive' | 'converted';
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  leadSource: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  score: number;
  ownerId: string;
  owner?: User;
  accountId?: string;
  contactId?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
}

export interface Opportunity {
  id: string;
  name: string;
  description?: string;
  amount?: number;
  probability: number;
  stage: string;
  closeDate?: string;
  accountId: string;
  account?: Account;
  ownerId: string;
  owner?: User;
  leadId?: string;
  lead?: Lead;
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'won' | 'lost';
  customFields?: Record<string, any>;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  subject: string;
  description?: string;
  date: string;
  duration?: number;
  ownerId: string;
  owner?: User;
  relatedTo: 'lead' | 'contact' | 'account' | 'opportunity';
  relatedId: string;
  relatedEntity?: Lead | Contact | Account | Opportunity;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'textarea';
  entity: 'account' | 'contact' | 'lead' | 'opportunity' | 'activity';
  options?: string[];
  required: boolean;
  defaultValue?: any;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  entity: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
import LeadModel, { Lead } from '../models/LeadModel';
import ContactModel from '../models/ContactModel';
import AccountModel from '../models/AccountModel';
import { v4 as uuidv4 } from 'uuid';

export interface LeadRegistrationData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  jobTitle?: string;
  leadSource?: string;
  status?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  ownerId: string;
  assignedTo?: string;
  customFields?: Record<string, any>;
}

export interface LeadUpdateData {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  leadSource?: string;
  status?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  assignedTo?: string;
  customFields?: Record<string, any>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ConvertedLeadResult {
  contact: any; // Contact type
  account: any; // Account type
}

class LeadService {
  /**
   * Create a new lead
   */
  static async create(leadData: LeadRegistrationData): Promise<Lead> {
    // Check if lead already exists by email
    const existingLeads = await LeadModel.findByEmail(leadData.email);
    if (existingLeads.length > 0) {
      throw new Error('Lead with this email already exists');
    }

    return await LeadModel.create({
      ...leadData,
      status: leadData.status || 'new',
      leadSource: leadData.leadSource || 'web',
      assignedTo: leadData.assignedTo || leadData.ownerId,
      customFields: leadData.customFields || {}
    });
  }

  /**
   * Find lead by ID
   */
  static async findById(id: string): Promise<Lead | null> {
    return await LeadModel.findById(id);
  }

  /**
   * Find leads by owner ID
   */
  static async findByOwnerId(ownerId: string, page: number = 1, limit: number = 10): Promise<PaginatedResult<Lead>> {
    const result = await LeadModel.findByOwnerId(ownerId, page, limit);
    
    return {
      items: result.leads,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }

  /**
   * Find leads by assigned user ID
   */
  static async findByAssignedTo(assignedTo: string, page: number = 1, limit: number = 10): Promise<PaginatedResult<Lead>> {
    const result = await LeadModel.findByAssignedTo(assignedTo, page, limit);
    
    return {
      items: result.leads,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }

  /**
   * Find leads by status
   */
  static async findByStatus(status: string, page: number = 1, limit: number = 10): Promise<PaginatedResult<Lead>> {
    const result = await LeadModel.findByStatus(status, page, limit);
    
    return {
      items: result.leads,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }

  /**
   * Find all leads with pagination
   */
  static async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<Lead>> {
    const result = await LeadModel.getAll(page, limit);
    
    return {
      items: result.leads,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }

  /**
   * Search leads
   */
  static async search(searchTerm: string, page: number = 1, limit: number = 10): Promise<PaginatedResult<Lead>> {
    const result = await LeadModel.search(searchTerm, page, limit);
    
    return {
      items: result.leads,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }

  /**
   * Update lead
   */
  static async update(id: string, updateData: LeadUpdateData): Promise<Lead | null> {
    const updatePayload: Partial<Lead> = { ...updateData };
    
    return await LeadModel.update(id, updatePayload);
  }

  /**
   * Delete lead (soft delete)
   */
  static async delete(id: string): Promise<boolean> {
    return await LeadModel.delete(id);
  }

  /**
   * Convert lead to contact and account
   */
  static async convertLead(leadId: string): Promise<ConvertedLeadResult> {
    const lead = await LeadModel.findById(leadId);
    
    if (!lead) {
      throw new Error('Lead not found');
    }

    // Create a new contact from the lead
    const contact = await ContactModel.create({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      jobTitle: lead.jobTitle,
      ownerId: lead.ownerId,
      assignedTo: lead.assignedTo,
      status: 'active',
      description: lead.description,
      address: lead.address,
      city: lead.city,
      state: lead.state,
      zipCode: lead.zipCode,
      country: lead.country,
      customFields: lead.customFields
    });

    // Create a new account from the lead
    const account = await AccountModel.create({
      name: lead.company,
      description: lead.description,
      ownerId: lead.ownerId,
      assignedTo: lead.assignedTo,
      status: 'active',
      address: lead.address,
      city: lead.city,
      state: lead.state,
      zipCode: lead.zipCode,
      country: lead.country,
      customFields: lead.customFields
    });

    // Update the lead to mark it as converted
    await LeadModel.convertToContactAndAccount(leadId, contact.id, account.id);

    return { contact, account };
  }

  /**
   * Get lead statistics
   */
  static async getStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
  }> {
    const allLeads = await LeadModel.getAll(1, 10000); // Get all leads for stats
    
    // Calculate statistics
    const byStatus: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    
    allLeads.leads.forEach(lead => {
      // Count by status
      byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
      
      // Count by source
      const source = lead.leadSource || 'Unknown';
      bySource[source] = (bySource[source] || 0) + 1;
    });

    return {
      total: allLeads.total,
      byStatus,
      bySource
    };
  }
}

export default LeadService;
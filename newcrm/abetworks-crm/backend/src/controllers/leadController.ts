import { Response } from 'express';
import { AuthRequest } from '../types/express';
import LeadModel from '../models/LeadModel';
import ContactModel from '../models/ContactModel';
import AccountModel from '../models/AccountModel';

// Create a new lead
export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { firstName, lastName, company, email, phone, jobTitle, leadSource, status, description, address, city, state, zipCode, country } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !company || !email || !phone) {
      res.status(400).json({ message: 'First name, last name, company, email, and phone are required' });
      return;
    }

    // Create lead with the authenticated user as owner
    const lead = await LeadModel.create({
      firstName,
      lastName,
      company,
      email,
      phone,
      jobTitle,
      leadSource: leadSource || 'web',
      status: status || 'new',
      ownerId: req.user.id,
      assignedTo: req.body.assignedTo || req.user.id, // Default to owner if not specified
      description,
      address,
      city,
      state,
      zipCode,
      country
    });

    res.status(201).json({
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error while creating lead' });
  }
};

// Get lead by ID
export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Lead ID is required' });
      return;
    }

    const lead = await LeadModel.findById(id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    // Check if user has access to this lead
    if (req.user && (req.user.id === lead.ownerId || req.user.id === lead.assignedTo || req.user.role === 'admin')) {
      res.json({ lead });
    } else {
      res.status(403).json({ message: 'Not authorized to access this lead' });
    }
  } catch (error) {
    console.error('Get lead by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching lead' });
  }
};

// Get all leads for authenticated user
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = req.query.search as string || '';
    const status = req.query.status as string || '';

    if (page < 1 || limit < 1 || limit > 100) {
      res.status(400).json({ message: 'Invalid page or limit parameters' });
      return;
    }

    let result;

    if (searchTerm) {
      // Search leads
      result = await LeadModel.search(searchTerm, page, limit);
    } else if (status) {
      // Get leads by status
      result = await LeadModel.findByStatus(status, page, limit);
    } else if (req.user.role === 'admin') {
      // Admin can see all leads
      result = await LeadModel.getAll(page, limit);
    } else {
      // Regular user can see their own leads or assigned leads
      const ownerResult = await LeadModel.findByOwnerId(req.user.id, page, Math.ceil(limit / 2));
      const assignedResult = await LeadModel.findByAssignedTo(req.user.id, page, Math.floor(limit / 2));
      
      // Combine results, ensuring no duplicates
      const allLeads = [...ownerResult.leads, ...assignedResult.leads];
      const uniqueLeads = allLeads.filter((lead, index, self) => 
        index === self.findIndex(l => l.id === lead.id)
      );
      
      result = {
        leads: uniqueLeads.slice(0, limit),
        total: ownerResult.total + assignedResult.total
      };
    }

    res.json({
      leads: result.leads,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error while fetching leads' });
  }
};

// Update lead
export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      res.status(400).json({ message: 'Lead ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const lead = await LeadModel.findById(id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    // Check if user has permission to update this lead
    if (req.user.role !== 'admin' && req.user.id !== lead.ownerId && req.user.id !== lead.assignedTo) {
      res.status(403).json({ message: 'Not authorized to update this lead' });
      return;
    }

    // Only owner or admin can change ownership
    if (updateData.ownerId && req.user.role !== 'admin' && req.user.id !== lead.ownerId) {
      res.status(403).json({ message: 'Only owner or admin can change lead ownership' });
      return;
    }

    const updatedLead = await LeadModel.update(id, updateData);

    if (!updatedLead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    res.json({
      message: 'Lead updated successfully',
      lead: updatedLead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error while updating lead' });
  }
};

// Delete lead (soft delete)
export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Lead ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const lead = await LeadModel.findById(id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    // Check if user has permission to delete this lead
    if (req.user.role !== 'admin' && req.user.id !== lead.ownerId) {
      res.status(403).json({ message: 'Not authorized to delete this lead' });
      return;
    }

    const deleted = await LeadModel.delete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error while deleting lead' });
  }
};

// Convert lead to contact and account
export const convertLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Lead ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const lead = await LeadModel.findById(id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    // Check if user has permission to convert this lead
    if (req.user.role !== 'admin' && req.user.id !== lead.ownerId && req.user.id !== lead.assignedTo) {
      res.status(403).json({ message: 'Not authorized to convert this lead' });
      return;
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
      country: lead.country
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
      country: lead.country
    });

    // Update the lead to mark it as converted
    const converted = await LeadModel.convertToContactAndAccount(id, contact.id, account.id);

    if (!converted) {
      res.status(404).json({ message: 'Lead not found for conversion' });
      return;
    }

    res.json({
      message: 'Lead converted successfully',
      contact,
      account
    });
  } catch (error) {
    console.error('Convert lead error:', error);
    res.status(500).json({ message: 'Server error while converting lead' });
  }
};
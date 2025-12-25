import { Response } from 'express';
import { AuthRequest } from '../types/express';
import LeadService from '../services/LeadService';
import LeadModel from '../models/LeadModel';
import ContactModel from '../models/ContactModel';
import AccountModel from '../models/AccountModel';
import { ValidationError, AuthenticationError, AuthorizationError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

// Create a new lead
export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AuthenticationError();
    }

    const { firstName, lastName, company, email, phone, jobTitle, leadSource, status, description, address, city, state, zipCode, country, customFields } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !company || !email || !phone) {
      throw new ValidationError('First name, last name, company, email, and phone are required');
    }

    // Create lead with the authenticated user as owner
    const lead = await LeadService.create({
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
      country,
      customFields: customFields || {}
    });

    res.status(201).json({
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    logger.error('Create lead error:', { error, userId: req.user?.id, body: req.body });

    // Handle specific error types
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof AuthenticationError) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error while creating lead' });
    }
  }
};

// Get lead by ID
export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError('Lead ID is required');
    }

    const lead = await LeadModel.findById(id);

    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    // Check if user has access to this lead
    if (req.user && (req.user.id === lead.ownerId || req.user.id === lead.assignedTo || req.user.role === 'admin')) {
      res.json({ lead });
    } else {
      throw new AuthorizationError('Not authorized to access this lead');
    }
  } catch (error) {
    logger.error('Get lead by ID error:', { error, userId: req.user?.id, leadId: req.params.id });

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    } else if (error instanceof AuthorizationError) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error while fetching lead' });
    }
  }
};

// Get all leads for authenticated user
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AuthenticationError();
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = req.query.search as string || '';
    const status = req.query.status as string || '';

    if (page < 1 || limit < 1 || limit > 100) {
      throw new ValidationError('Invalid page or limit parameters');
    }

    let result;

    if (searchTerm) {
      // Search leads
      result = await LeadService.search(searchTerm, page, limit);
    } else if (status) {
      // Get leads by status
      result = await LeadService.findByStatus(status, page, limit);
    } else if (req.user.role === 'admin') {
      // Admin can see all leads
      result = await LeadService.getAll(page, limit);
    } else {
      // Regular user can see their own leads or assigned leads
      const ownerResult = await LeadService.findByOwnerId(req.user.id, page, Math.ceil(limit / 2));
      const assignedResult = await LeadService.findByAssignedTo(req.user.id, page, Math.floor(limit / 2));

      // Combine results, ensuring no duplicates
      const allLeads = [...ownerResult.items, ...assignedResult.items];
      const uniqueLeads = allLeads.filter((lead, index, self) =>
        index === self.findIndex(l => l.id === lead.id)
      );

      result = {
        items: uniqueLeads.slice(0, limit),
        total: ownerResult.total + assignedResult.total,
        page,
        limit,
        totalPages: Math.ceil((ownerResult.total + assignedResult.total) / limit)
      };
    }

    res.json({
      leads: result.items,
      total: result.total,
      page,
      limit,
      totalPages: result.totalPages
    });
  } catch (error) {
    logger.error('Get leads error:', { error, userId: req.user?.id, query: req.query });

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof AuthenticationError) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error while fetching leads' });
    }
  }
};

// Update lead
export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { customFields, ...updateData } = req.body;

    // Add customFields to updateData if present
    if (customFields) {
      (updateData as any).customFields = customFields;
    }

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

    const updatedLead = await LeadService.update(id, updateData);

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

    // Use the service to convert the lead
    const result = await LeadService.convertLead(id);

    res.json({
      message: 'Lead converted successfully',
      contact: result.contact,
      account: result.account
    });
  } catch (error) {
    console.error('Convert lead error:', error);
    res.status(500).json({ message: 'Server error while converting lead' });
  }
};
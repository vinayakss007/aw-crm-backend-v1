import { Response } from 'express';
import { AuthRequest } from '../types/express';
import ContactModel from '../models/ContactModel';

// Create a new contact
export const createContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { firstName, lastName, email, phone, jobTitle, department, accountId, assignedTo, status, leadSource, description, address, city, state, zipCode, country } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      res.status(400).json({ message: 'First name and last name are required' });
      return;
    }

    // Create contact with the authenticated user as owner
    const contact = await ContactModel.create({
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      department,
      accountId,
      ownerId: req.user.id,
      assignedTo: assignedTo || req.user.id, // Default to owner if not specified
      status: status || 'active',
      leadSource,
      description,
      address,
      city,
      state,
      zipCode,
      country
    });

    res.status(201).json({
      message: 'Contact created successfully',
      contact
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ message: 'Server error while creating contact' });
  }
};

// Get contact by ID
export const getContactById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Contact ID is required' });
      return;
    }

    const contact = await ContactModel.findById(id);

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    // Check if user has access to this contact
    if (req.user && (req.user.id === contact.ownerId || req.user.id === contact.assignedTo || req.user.role === 'admin')) {
      res.json({ contact });
    } else {
      res.status(403).json({ message: 'Not authorized to access this contact' });
    }
  } catch (error) {
    console.error('Get contact by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching contact' });
  }
};

// Get all contacts for authenticated user
export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = req.query.search as string || '';
    const accountId = req.query.accountId as string || '';

    if (page < 1 || limit < 1 || limit > 100) {
      res.status(400).json({ message: 'Invalid page or limit parameters' });
      return;
    }

    let result;

    if (searchTerm) {
      // Search contacts
      result = await ContactModel.search(searchTerm, page, limit);
    } else if (accountId) {
      // Get contacts for specific account
      result = await ContactModel.findByAccountId(accountId, page, limit);
    } else if (req.user.role === 'admin') {
      // Admin can see all contacts
      result = await ContactModel.getAll(page, limit);
    } else {
      // Regular user can see their own contacts or assigned contacts
      const ownerResult = await ContactModel.findByOwnerId(req.user.id, page, Math.ceil(limit / 2));
      const assignedResult = await ContactModel.findByAssignedTo(req.user.id, page, Math.floor(limit / 2));
      
      // Combine results, ensuring no duplicates
      const allContacts = [...ownerResult.contacts, ...assignedResult.contacts];
      const uniqueContacts = allContacts.filter((contact, index, self) => 
        index === self.findIndex(c => c.id === contact.id)
      );
      
      result = {
        contacts: uniqueContacts.slice(0, limit),
        total: ownerResult.total + assignedResult.total
      };
    }

    res.json({
      contacts: result.contacts,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error while fetching contacts' });
  }
};

// Update contact
export const updateContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      res.status(400).json({ message: 'Contact ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const contact = await ContactModel.findById(id);

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    // Check if user has permission to update this contact
    if (req.user.role !== 'admin' && req.user.id !== contact.ownerId && req.user.id !== contact.assignedTo) {
      res.status(403).json({ message: 'Not authorized to update this contact' });
      return;
    }

    // Only owner or admin can change ownership
    if (updateData.ownerId && req.user.role !== 'admin' && req.user.id !== contact.ownerId) {
      res.status(403).json({ message: 'Only owner or admin can change contact ownership' });
      return;
    }

    const updatedContact = await ContactModel.update(id, updateData);

    if (!updatedContact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.json({
      message: 'Contact updated successfully',
      contact: updatedContact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: 'Server error while updating contact' });
  }
};

// Delete contact (soft delete)
export const deleteContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Contact ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const contact = await ContactModel.findById(id);

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    // Check if user has permission to delete this contact
    if (req.user.role !== 'admin' && req.user.id !== contact.ownerId) {
      res.status(403).json({ message: 'Not authorized to delete this contact' });
      return;
    }

    const deleted = await ContactModel.delete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error while deleting contact' });
  }
};
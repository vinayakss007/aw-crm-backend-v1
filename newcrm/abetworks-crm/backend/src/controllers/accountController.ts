import { Response } from 'express';
import { AuthRequest } from '../types/express';
import AccountModel from '../models/AccountModel';

// Create a new account
export const createAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { name, description, industry, website, phone, email, address, city, state, zipCode, country, size, annualRevenue } = req.body;

    // Validate required fields
    if (!name) {
      res.status(400).json({ message: 'Account name is required' });
      return;
    }

    // Create account with the authenticated user as owner
    const account = await AccountModel.create({
      name,
      description,
      industry,
      website,
      phone,
      email,
      address,
      city,
      state,
      zipCode,
      country,
      size,
      annualRevenue,
      ownerId: req.user.id,
      assignedTo: req.body.assignedTo || req.user.id, // Default to owner if not specified
      status: req.body.status || 'active'
    });

    res.status(201).json({
      message: 'Account created successfully',
      account
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ message: 'Server error while creating account' });
  }
};

// Get account by ID
export const getAccountById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Account ID is required' });
      return;
    }

    const account = await AccountModel.findById(id);

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    // Check if user has access to this account
    if (req.user && (req.user.id === account.ownerId || req.user.id === account.assignedTo || req.user.role === 'admin')) {
      res.json({ account });
    } else {
      res.status(403).json({ message: 'Not authorized to access this account' });
    }
  } catch (error) {
    console.error('Get account by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching account' });
  }
};

// Get all accounts for authenticated user
export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = req.query.search as string || '';

    if (page < 1 || limit < 1 || limit > 100) {
      res.status(400).json({ message: 'Invalid page or limit parameters' });
      return;
    }

    let result;

    if (searchTerm) {
      // Search accounts
      result = await AccountModel.search(searchTerm, page, limit);
    } else if (req.user.role === 'admin') {
      // Admin can see all accounts
      result = await AccountModel.getAll(page, limit);
    } else {
      // Regular user can see their own accounts or assigned accounts
      const ownerResult = await AccountModel.findByOwnerId(req.user.id, page, Math.ceil(limit / 2));
      const assignedResult = await AccountModel.findByAssignedTo(req.user.id, page, Math.floor(limit / 2));
      
      // Combine results, ensuring no duplicates
      const allAccounts = [...ownerResult.accounts, ...assignedResult.accounts];
      const uniqueAccounts = allAccounts.filter((account, index, self) => 
        index === self.findIndex(a => a.id === account.id)
      );
      
      result = {
        accounts: uniqueAccounts.slice(0, limit),
        total: ownerResult.total + assignedResult.total
      };
    }

    res.json({
      accounts: result.accounts,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ message: 'Server error while fetching accounts' });
  }
};

// Update account
export const updateAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      res.status(400).json({ message: 'Account ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const account = await AccountModel.findById(id);

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    // Check if user has permission to update this account
    if (req.user.role !== 'admin' && req.user.id !== account.ownerId && req.user.id !== account.assignedTo) {
      res.status(403).json({ message: 'Not authorized to update this account' });
      return;
    }

    // Only owner or admin can change ownership
    if (updateData.ownerId && req.user.role !== 'admin' && req.user.id !== account.ownerId) {
      res.status(403).json({ message: 'Only owner or admin can change account ownership' });
      return;
    }

    const updatedAccount = await AccountModel.update(id, updateData);

    if (!updatedAccount) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    res.json({
      message: 'Account updated successfully',
      account: updatedAccount
    });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ message: 'Server error while updating account' });
  }
};

// Delete account (soft delete)
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Account ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const account = await AccountModel.findById(id);

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    // Check if user has permission to delete this account
    if (req.user.role !== 'admin' && req.user.id !== account.ownerId) {
      res.status(403).json({ message: 'Not authorized to delete this account' });
      return;
    }

    const deleted = await AccountModel.delete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error while deleting account' });
  }
};
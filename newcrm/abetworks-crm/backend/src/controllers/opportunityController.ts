import { Response } from 'express';
import { AuthRequest } from '../types/express';
import OpportunityModel from '../models/OpportunityModel';

// Create a new opportunity
export const createOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { name, description, accountId, contactId, stage, probability, amount, currency, closeDate, assignedTo, leadSource, type, priority, forecastCategory, nextStep } = req.body;

    // Validate required fields
    if (!name || !stage) {
      res.status(400).json({ message: 'Opportunity name and stage are required' });
      return;
    }

    // Create opportunity with the authenticated user as owner
    const opportunity = await OpportunityModel.create({
      name,
      description,
      accountId,
      contactId,
      stage,
      probability,
      amount,
      currency,
      closeDate,
      ownerId: req.user.id,
      assignedTo: assignedTo || req.user.id, // Default to owner if not specified
      leadSource,
      type,
      priority,
      forecastCategory,
      nextStep
    });

    res.status(201).json({
      message: 'Opportunity created successfully',
      opportunity
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ message: 'Server error while creating opportunity' });
  }
};

// Get opportunity by ID
export const getOpportunityById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Opportunity ID is required' });
      return;
    }

    const opportunity = await OpportunityModel.findById(id);

    if (!opportunity) {
      res.status(404).json({ message: 'Opportunity not found' });
      return;
    }

    // Check if user has access to this opportunity
    if (req.user && (req.user.id === opportunity.ownerId || req.user.id === opportunity.assignedTo || req.user.role === 'admin')) {
      res.json({ opportunity });
    } else {
      res.status(403).json({ message: 'Not authorized to access this opportunity' });
    }
  } catch (error) {
    console.error('Get opportunity by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching opportunity' });
  }
};

// Get all opportunities for authenticated user
export const getOpportunities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = req.query.search as string || '';
    const stage = req.query.stage as string || '';
    const accountId = req.query.accountId as string || '';

    if (page < 1 || limit < 1 || limit > 100) {
      res.status(400).json({ message: 'Invalid page or limit parameters' });
      return;
    }

    let result;

    if (searchTerm) {
      // Search opportunities
      result = await OpportunityModel.search(searchTerm, page, limit);
    } else if (stage) {
      // Get opportunities by stage
      result = await OpportunityModel.findByStage(stage, page, limit);
    } else if (accountId) {
      // Get opportunities for specific account
      result = await OpportunityModel.findByAccountId(accountId, page, limit);
    } else if (req.user.role === 'admin') {
      // Admin can see all opportunities
      result = await OpportunityModel.getAll(page, limit);
    } else {
      // Regular user can see their own opportunities or assigned opportunities
      const ownerResult = await OpportunityModel.findByOwnerId(req.user.id, page, Math.ceil(limit / 2));
      const assignedResult = await OpportunityModel.findByAssignedTo(req.user.id, page, Math.floor(limit / 2));
      
      // Combine results, ensuring no duplicates
      const allOpportunities = [...ownerResult.opportunities, ...assignedResult.opportunities];
      const uniqueOpportunities = allOpportunities.filter((opportunity, index, self) => 
        index === self.findIndex(o => o.id === opportunity.id)
      );
      
      result = {
        opportunities: uniqueOpportunities.slice(0, limit),
        total: ownerResult.total + assignedResult.total
      };
    }

    res.json({
      opportunities: result.opportunities,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ message: 'Server error while fetching opportunities' });
  }
};

// Update opportunity
export const updateOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      res.status(400).json({ message: 'Opportunity ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const opportunity = await OpportunityModel.findById(id);

    if (!opportunity) {
      res.status(404).json({ message: 'Opportunity not found' });
      return;
    }

    // Check if user has permission to update this opportunity
    if (req.user.role !== 'admin' && req.user.id !== opportunity.ownerId && req.user.id !== opportunity.assignedTo) {
      res.status(403).json({ message: 'Not authorized to update this opportunity' });
      return;
    }

    // Only owner or admin can change ownership
    if (updateData.ownerId && req.user.role !== 'admin' && req.user.id !== opportunity.ownerId) {
      res.status(403).json({ message: 'Only owner or admin can change opportunity ownership' });
      return;
    }

    const updatedOpportunity = await OpportunityModel.update(id, updateData);

    if (!updatedOpportunity) {
      res.status(404).json({ message: 'Opportunity not found' });
      return;
    }

    res.json({
      message: 'Opportunity updated successfully',
      opportunity: updatedOpportunity
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({ message: 'Server error while updating opportunity' });
  }
};

// Delete opportunity (soft delete)
export const deleteOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Opportunity ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const opportunity = await OpportunityModel.findById(id);

    if (!opportunity) {
      res.status(404).json({ message: 'Opportunity not found' });
      return;
    }

    // Check if user has permission to delete this opportunity
    if (req.user.role !== 'admin' && req.user.id !== opportunity.ownerId) {
      res.status(403).json({ message: 'Not authorized to delete this opportunity' });
      return;
    }

    const deleted = await OpportunityModel.delete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Opportunity not found' });
      return;
    }

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({ message: 'Server error while deleting opportunity' });
  }
};

// Get pipeline statistics
export const getPipelineStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const stats = await OpportunityModel.getPipelineStats();

    res.json({
      message: 'Pipeline statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get pipeline stats error:', error);
    res.status(500).json({ message: 'Server error while fetching pipeline stats' });
  }
};

// Get forecast by month
export const getForecast = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const months = parseInt(req.query.months as string) || 6;

    if (months < 1 || months > 24) {
      res.status(400).json({ message: 'Months parameter must be between 1 and 24' });
      return;
    }

    const forecast = await OpportunityModel.getForecastByMonth(months);

    res.json({
      message: 'Forecast retrieved successfully',
      forecast,
      months
    });
  } catch (error) {
    console.error('Get forecast error:', error);
    res.status(500).json({ message: 'Server error while fetching forecast' });
  }
};
import { Response } from 'express';
import { AuthRequest } from '../types/express';
import ActivityModel from '../models/ActivityModel';

// Create a new activity
export const createActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { subject, type, description, status, priority, startDate, endDate, duration, assignedTo, accountId, contactId, opportunityId, relatedToType, relatedToId, isAllDay, location, reminder } = req.body;

    // Validate required fields
    if (!subject || !type) {
      res.status(400).json({ message: 'Activity subject and type are required' });
      return;
    }

    // Create activity with the authenticated user as owner
    const activity = await ActivityModel.create({
      subject,
      type,
      description,
      status: status || 'Planned',
      priority: priority || 'Medium',
      startDate,
      endDate,
      duration,
      ownerId: req.user.id,
      assignedTo: assignedTo || req.user.id, // Default to owner if not specified
      accountId,
      contactId,
      opportunityId,
      relatedToType,
      relatedToId,
      isAllDay,
      location,
      reminder
    });

    res.status(201).json({
      message: 'Activity created successfully',
      activity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Server error while creating activity' });
  }
};

// Get activity by ID
export const getActivityById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Activity ID is required' });
      return;
    }

    const activity = await ActivityModel.findById(id);

    if (!activity) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    // Check if user has access to this activity
    if (req.user && (req.user.id === activity.ownerId || req.user.id === activity.assignedTo || req.user.role === 'admin')) {
      res.json({ activity });
    } else {
      res.status(403).json({ message: 'Not authorized to access this activity' });
    }
  } catch (error) {
    console.error('Get activity by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching activity' });
  }
};

// Get all activities for authenticated user
export const getActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = req.query.search as string || '';
    const type = req.query.type as string || '';
    const accountId = req.query.accountId as string || '';
    const contactId = req.query.contactId as string || '';
    const opportunityId = req.query.opportunityId as string || '';
    const startDate = req.query.startDate as string || '';
    const endDate = req.query.endDate as string || '';

    if (page < 1 || limit < 1 || limit > 100) {
      res.status(400).json({ message: 'Invalid page or limit parameters' });
      return;
    }

    let result;

    if (searchTerm) {
      // Search activities
      result = await ActivityModel.search(searchTerm, page, limit);
    } else if (type) {
      // Get activities by type
      result = await ActivityModel.findByType(type, page, limit);
    } else if (accountId) {
      // Get activities for specific account
      result = await ActivityModel.findByAccountId(accountId, page, limit);
    } else if (contactId) {
      // Get activities for specific contact
      result = await ActivityModel.findByContactId(contactId, page, limit);
    } else if (opportunityId) {
      // Get activities for specific opportunity
      result = await ActivityModel.findByOpportunityId(opportunityId, page, limit);
    } else if (startDate && endDate) {
      // Get activities by date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      result = await ActivityModel.findByDateRange(start, end, page, limit);
    } else if (req.user.role === 'admin') {
      // Admin can see all activities
      result = await ActivityModel.getAll(page, limit);
    } else {
      // Regular user can see their own activities or assigned activities
      const ownerResult = await ActivityModel.findByOwnerId(req.user.id, page, Math.ceil(limit / 2));
      const assignedResult = await ActivityModel.findByAssignedTo(req.user.id, page, Math.floor(limit / 2));
      
      // Combine results, ensuring no duplicates
      const allActivities = [...ownerResult.activities, ...assignedResult.activities];
      const uniqueActivities = allActivities.filter((activity, index, self) => 
        index === self.findIndex(a => a.id === activity.id)
      );
      
      result = {
        activities: uniqueActivities.slice(0, limit),
        total: ownerResult.total + assignedResult.total
      };
    }

    res.json({
      activities: result.activities,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error while fetching activities' });
  }
};

// Update activity
export const updateActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      res.status(400).json({ message: 'Activity ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const activity = await ActivityModel.findById(id);

    if (!activity) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    // Check if user has permission to update this activity
    if (req.user.role !== 'admin' && req.user.id !== activity.ownerId && req.user.id !== activity.assignedTo) {
      res.status(403).json({ message: 'Not authorized to update this activity' });
      return;
    }

    // Only owner or admin can change ownership
    if (updateData.ownerId && req.user.role !== 'admin' && req.user.id !== activity.ownerId) {
      res.status(403).json({ message: 'Only owner or admin can change activity ownership' });
      return;
    }

    const updatedActivity = await ActivityModel.update(id, updateData);

    if (!updatedActivity) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    res.json({
      message: 'Activity updated successfully',
      activity: updatedActivity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Server error while updating activity' });
  }
};

// Delete activity (soft delete)
export const deleteActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Activity ID is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const activity = await ActivityModel.findById(id);

    if (!activity) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    // Check if user has permission to delete this activity
    if (req.user.role !== 'admin' && req.user.id !== activity.ownerId) {
      res.status(403).json({ message: 'Not authorized to delete this activity' });
      return;
    }

    const deleted = await ActivityModel.delete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ message: 'Server error while deleting activity' });
  }
};
import { Router } from 'express';
import { createActivity, getActivityById, getActivities, updateActivity, deleteActivity } from '../controllers/activityController';

const router: Router = Router();

// Create a new activity
router.post('/', createActivity);

// Get all activities
router.get('/', getActivities);

// Get activity by ID
router.get('/:id', getActivityById);

// Update activity
router.put('/:id', updateActivity);

// Delete activity
router.delete('/:id', deleteActivity);

export default router;
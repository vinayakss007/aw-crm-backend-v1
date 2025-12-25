import { Router } from 'express';
import { getProfile, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';

const router: Router = Router();

// Get current user profile
router.get('/profile', getProfile);

// Get all users (admin only)
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user (admin only)
router.delete('/:id', deleteUser);

export default router;
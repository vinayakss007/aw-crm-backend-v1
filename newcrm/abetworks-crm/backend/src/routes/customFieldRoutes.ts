import { Router } from 'express';
import { 
  createCustomField, 
  getCustomFields, 
  getCustomFieldById, 
  updateCustomField, 
  deleteCustomField 
} from '../controllers/customFieldController';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = Router();

// Create a new custom field for an entity
router.post('/', authMiddleware, createCustomField);

// Get all custom fields for an entity
router.get('/:entity', getCustomFields);

// Get a specific custom field by ID
router.get('/field/:id', getCustomFieldById);

// Update a custom field
router.put('/:id', authMiddleware, updateCustomField);

// Delete a custom field
router.delete('/:id', authMiddleware, deleteCustomField);

export default router;
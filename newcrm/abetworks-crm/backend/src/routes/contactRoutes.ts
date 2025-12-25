import { Router } from 'express';
import { createContact, getContactById, getContacts, updateContact, deleteContact } from '../controllers/contactController';

const router: Router = Router();

// Create a new contact
router.post('/', createContact);

// Get all contacts
router.get('/', getContacts);

// Get contact by ID
router.get('/:id', getContactById);

// Update contact
router.put('/:id', updateContact);

// Delete contact
router.delete('/:id', deleteContact);

export default router;
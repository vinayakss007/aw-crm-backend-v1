import { Router } from 'express';
import { createLead, getLeadById, getLeads, updateLead, deleteLead, convertLead } from '../controllers/leadController';

const router: Router = Router();

// Create a new lead
router.post('/', createLead);

// Get all leads
router.get('/', getLeads);

// Get lead by ID
router.get('/:id', getLeadById);

// Update lead
router.put('/:id', updateLead);

// Delete lead
router.delete('/:id', deleteLead);

// Convert lead to contact and account
router.post('/:id/convert', convertLead);

export default router;
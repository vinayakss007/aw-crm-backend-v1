import { Router } from 'express';
import { importData, exportData, bulkDelete, bulkUpdate } from '../controllers/dataImportExportController';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = Router();

// Import data for an entity
router.post('/import', authMiddleware, importData);

// Export data for an entity
router.get('/export/:entity', authMiddleware, exportData);

// Bulk delete records
router.delete('/bulk-delete', authMiddleware, bulkDelete);

// Bulk update records
router.put('/bulk-update', authMiddleware, bulkUpdate);

export default router;
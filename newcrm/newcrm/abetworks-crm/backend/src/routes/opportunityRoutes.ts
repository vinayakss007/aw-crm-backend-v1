import { Router } from 'express';
import { 
  createOpportunity, 
  getOpportunityById, 
  getOpportunities, 
  updateOpportunity, 
  deleteOpportunity,
  getPipelineStats,
  getForecast
} from '../controllers/opportunityController';

const router: Router = Router();

// Create a new opportunity
router.post('/', createOpportunity);

// Get all opportunities
router.get('/', getOpportunities);

// Get opportunity by ID
router.get('/:id', getOpportunityById);

// Update opportunity
router.put('/:id', updateOpportunity);

// Delete opportunity
router.delete('/:id', deleteOpportunity);

// Get pipeline statistics
router.get('/pipeline-stats', getPipelineStats);

// Get forecast
router.get('/forecast', getForecast);

export default router;
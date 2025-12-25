import { Router } from 'express';
import { 
  uploadFile, 
  getFile, 
  getFileUrl, 
  deleteFile 
} from '../controllers/fileController';
import { 
  singleFileUpload, 
  fileUploadErrorHandler 
} from '../middleware/fileUploadMiddleware';

const router: Router = Router();

// Upload a file
router.post('/', singleFileUpload('file'), fileUploadErrorHandler, uploadFile);

// Get a file
router.get('/:fileName', getFile);

// Get a presigned URL for a file
router.get('/url/:fileName', getFileUrl);

// Delete a file
router.delete('/:fileName', deleteFile);

export default router;
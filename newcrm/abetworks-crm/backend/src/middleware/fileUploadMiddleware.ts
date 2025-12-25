import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Define allowed file types
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null as any, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, documents, and CSV files are allowed.') as any, false);
    }
  }
});

// Middleware to handle single file upload
const singleFileUpload = (fieldName: string) => {
  return upload.single(fieldName);
};

// Middleware to handle multiple file uploads
const multipleFileUpload = (fieldName: string, maxCount: number) => {
  return upload.array(fieldName, maxCount);
};

// Error handling middleware for file uploads
const fileUploadErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if ((err as multer.MulterError).code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        message: 'File too large. Maximum size is 10MB.'
      });
      return;
    }
  }

  res.status(400).json({
    message: err.message || 'File upload error'
  });
};

export { 
  singleFileUpload, 
  multipleFileUpload, 
  fileUploadErrorHandler 
};
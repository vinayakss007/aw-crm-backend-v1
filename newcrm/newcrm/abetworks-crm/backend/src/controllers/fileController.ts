import { Response } from 'express';
import { AuthRequest } from '../types/express';
import FileService from '../utils/fileService';

// Upload a file
export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { entityType, entityId } = req.body;

    if (!entityType || !entityId) {
      res.status(400).json({ message: 'Entity type and entity ID are required' });
      return;
    }

    // Validate entity type
    const validEntityTypes = ['account', 'contact', 'lead', 'opportunity', 'activity'];
    if (!validEntityTypes.includes(entityType)) {
      res.status(400).json({ message: 'Invalid entity type. Must be one of: account, contact, lead, opportunity, activity' });
      return;
    }

    const result = await FileService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.user.id,
      entityType,
      entityId
    );

    res.status(201).json({
      message: 'File uploaded successfully',
      file: result
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Server error while uploading file' });
  }
};

// Get file
export const getFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      res.status(400).json({ message: 'File name is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // In a real implementation, you would check if the user has permission to access this file
    // For now, we'll just return the file

    const fileBuffer = await FileService.getFile(fileName);
    const metadata = await FileService.getFileMetadata(fileName);

    // Set appropriate headers
    res.set('Content-Type', metadata.metaData['content-type']);
    res.set('Content-Disposition', `inline; filename="${fileName}"`);

    res.send(fileBuffer);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error while retrieving file' });
  }
};

// Get file URL (presigned URL)
export const getFileUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      res.status(400).json({ message: 'File name is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // In a real implementation, you would check if the user has permission to access this file
    // For now, we'll just return the URL

    const url = await FileService.generateFileUrl(fileName);
    
    res.json({
      url
    });
  } catch (error) {
    console.error('Get file URL error:', error);
    res.status(500).json({ message: 'Server error while generating file URL' });
  }
};

// Delete file
export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      res.status(400).json({ message: 'File name is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // In a real implementation, you would check if the user has permission to delete this file
    // For now, we'll just delete the file

    await FileService.deleteFile(fileName);

    res.json({
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error while deleting file' });
  }
};
import { Response } from 'express';
import { AuthRequest } from '../types/express';
import DataImportExportService from '../services/DataImportExportService';

// Import data for an entity
export const importData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { entity, data } = req.body;

    if (!entity || !data || !Array.isArray(data)) {
      res.status(400).json({ message: 'Entity and data array are required' });
      return;
    }

    // Only admin users can import user data
    if (entity === 'user' && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Only admin users can import user data' });
      return;
    }

    const result = await DataImportExportService.importData(entity, data, req.user.id);

    if (result.success) {
      res.status(200).json({
        message: result.message,
        importedCount: result.importedCount,
        errorCount: result.errorCount,
        errors: result.errors
      });
    } else {
      res.status(400).json({
        message: result.message,
        errors: result.errors
      });
    }
  } catch (error) {
    console.error('Import data error:', error);
    res.status(500).json({ message: 'Server error while importing data' });
  }
};

// Export data for an entity
export const exportData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { entity } = req.params;
    const { format, fields, filter, limit } = req.query;

    if (!entity) {
      res.status(400).json({ message: 'Entity parameter is required' });
      return;
    }

    // Validate format
    const validFormats = ['json', 'csv'];
    const exportFormat = (format as string) || 'json';
    if (!validFormats.includes(exportFormat)) {
      res.status(400).json({ message: `Invalid format. Valid formats are: ${validFormats.join(', ')}` });
      return;
    }

    // Only admin users can export user data
    if (entity === 'user' && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Only admin users can export user data' });
      return;
    }

    const options = {
      format: exportFormat as 'json' | 'csv',
      fields: fields ? (fields as string).split(',') : undefined,
      filter: filter ? JSON.parse(filter as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    };

    const data = await DataImportExportService.exportData(entity, options, req.user.id);

    if (exportFormat === 'json') {
      res.json({
        data,
        count: data.length
      });
    } else {
      // For CSV, we would need to convert the data to CSV format
      // For now, we'll just return JSON with CSV option as a placeholder
      res.json({
        data,
        count: data.length,
        message: 'CSV format not fully implemented yet, returning JSON'
      });
    }
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ message: 'Server error while exporting data' });
  }
};

// Bulk delete records
export const bulkDelete = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { entity, ids } = req.body;

    if (!entity || !ids || !Array.isArray(ids)) {
      res.status(400).json({ message: 'Entity and ids array are required' });
      return;
    }

    // Only admin users can bulk delete user data
    if (entity === 'user' && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Only admin users can bulk delete user data' });
      return;
    }

    const result = await DataImportExportService.bulkDelete(entity, ids, req.user.id);

    res.json({
      message: `Bulk delete completed`,
      deletedCount: result.deletedCount,
      errorCount: result.errorCount,
      errors: result.errors
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ message: 'Server error during bulk delete' });
  }
};

// Bulk update records
export const bulkUpdate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { entity, updates } = req.body;

    if (!entity || !updates || !Array.isArray(updates)) {
      res.status(400).json({ message: 'Entity and updates array are required' });
      return;
    }

    // Only admin users can bulk update user data
    if (entity === 'user' && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Only admin users can bulk update user data' });
      return;
    }

    const result = await DataImportExportService.bulkUpdate(entity, updates, req.user.id);

    res.json({
      message: `Bulk update completed`,
      updatedCount: result.updatedCount,
      errorCount: result.errorCount,
      errors: result.errors
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Server error during bulk update' });
  }
};
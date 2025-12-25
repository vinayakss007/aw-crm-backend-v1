import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import AccountModel from '../models/AccountModel';
import ContactModel from '../models/ContactModel';
import LeadModel from '../models/LeadModel';
import OpportunityModel from '../models/OpportunityModel';
import ActivityModel from '../models/ActivityModel';
import UserModel from '../models/UserModel';

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errorCount: number;
  errors: string[];
}

export interface ExportOptions {
  format: 'json' | 'csv';
  fields?: string[];
  filter?: Record<string, any>;
  limit?: number;
}

class DataImportExportService {
  // Import data based on entity type
  static async importData(entity: string, data: any[], userId: string): Promise<ImportResult> {
    const errors: string[] = [];
    let importedCount = 0;
    let errorCount = 0;

    try {
      // Validate entity type
      const validEntities = ['account', 'contact', 'lead', 'opportunity', 'activity', 'user'];
      if (!validEntities.includes(entity)) {
        return {
          success: false,
          message: `Invalid entity type: ${entity}. Valid types are: ${validEntities.join(', ')}`,
          importedCount: 0,
          errorCount: 1,
          errors: [`Invalid entity type: ${entity}`]
        };
      }

      // Process each record in the data array
      for (let i = 0; i < data.length; i++) {
        try {
          const record = data[i];
          
          // Set the owner ID to the importing user
          record.ownerId = userId;

          switch (entity) {
            case 'account':
              await AccountModel.create({
                ...record,
                ownerId: userId
              } as any);
              break;
            case 'contact':
              await ContactModel.create({
                ...record,
                ownerId: userId
              } as any);
              break;
            case 'lead':
              await LeadModel.create({
                ...record,
                ownerId: userId
              } as any);
              break;
            case 'opportunity':
              await OpportunityModel.create({
                ...record,
                ownerId: userId
              } as any);
              break;
            case 'activity':
              await ActivityModel.create({
                ...record,
                ownerId: userId
              } as any);
              break;
            case 'user':
              // Only admin users can import users
              const importingUser = await UserModel.findById(userId);
              if (importingUser?.role !== 'admin') {
                throw new Error('Only admin users can import user data');
              }
              await UserModel.create({
                ...record,
                password: record.password || 'TempPass123!' // Default password for imported users
              } as any);
              break;
          }
          importedCount++;
        } catch (error) {
          errorCount++;
          errors.push(`Record ${i + 1}: ${(error as Error).message}`);
        }
      }

      return {
        success: true,
        message: `Successfully imported ${importedCount} records, with ${errorCount} errors`,
        importedCount,
        errorCount,
        errors
      };
    } catch (error) {
      return {
        success: false,
        message: `Import failed: ${(error as Error).message}`,
        importedCount: 0,
        errorCount: data.length,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Export data based on entity type
  static async exportData(entity: string, options: ExportOptions, userId: string): Promise<any[]> {
    // Validate entity type
    const validEntities = ['account', 'contact', 'lead', 'opportunity', 'activity', 'user'];
    if (!validEntities.includes(entity)) {
      throw new Error(`Invalid entity type: ${entity}. Valid types are: ${validEntities.join(', ')}`);
    }

    let records: any[] = [];

    // Get records based on entity type
    switch (entity) {
      case 'account':
        // For accounts, only get accounts owned by or assigned to the user, or all if admin
        const accountResult = await AccountModel.findByOwnerId(userId);
        records = accountResult.accounts;
        break;
      case 'contact':
        // For contacts, only get contacts owned by or assigned to the user, or all if admin
        const contactResult = await ContactModel.findByOwnerId(userId);
        records = contactResult.contacts;
        break;
      case 'lead':
        // For leads, only get leads owned by or assigned to the user, or all if admin
        const leadResult = await LeadModel.findByOwnerId(userId);
        records = leadResult.leads;
        break;
      case 'opportunity':
        // For opportunities, only get opportunities owned by or assigned to the user, or all if admin
        const opportunityResult = await OpportunityModel.findByOwnerId(userId);
        records = opportunityResult.opportunities;
        break;
      case 'activity':
        // For activities, only get activities owned by or assigned to the user, or all if admin
        const activityResult = await ActivityModel.findByOwnerId(userId);
        records = activityResult.activities;
        break;
      case 'user':
        // Only admin users can export user data
        const exportingUser = await UserModel.findById(userId);
        if (exportingUser?.role !== 'admin') {
          throw new Error('Only admin users can export user data');
        }
        const userResult = await UserModel.getAll();
        records = userResult.users;
        break;
    }

    // Apply field filtering if specified
    if (options.fields && options.fields.length > 0) {
      records = records.map(record => {
        const filteredRecord: any = {};
        options.fields?.forEach(field => {
          filteredRecord[field] = record[field];
        });
        return filteredRecord;
      });
    }

    return records;
  }

  // Bulk delete records
  static async bulkDelete(entity: string, ids: string[], userId: string): Promise<{ deletedCount: number; errorCount: number; errors: string[] }> {
    const errors: string[] = [];
    let deletedCount = 0;
    let errorCount = 0;

    // Validate entity type
    const validEntities = ['account', 'contact', 'lead', 'opportunity', 'activity'];
    if (!validEntities.includes(entity)) {
      throw new Error(`Invalid entity type: ${entity}. Valid types are: ${validEntities.join(', ')}`);
    }

    for (const id of ids) {
      try {
        switch (entity) {
          case 'account':
            await AccountModel.delete(id);
            break;
          case 'contact':
            await ContactModel.delete(id);
            break;
          case 'lead':
            await LeadModel.delete(id);
            break;
          case 'opportunity':
            await OpportunityModel.delete(id);
            break;
          case 'activity':
            await ActivityModel.delete(id);
            break;
        }
        deletedCount++;
      } catch (error) {
        errorCount++;
        errors.push(`ID ${id}: ${(error as Error).message}`);
      }
    }

    return {
      deletedCount,
      errorCount,
      errors
    };
  }

  // Bulk update records
  static async bulkUpdate(entity: string, updates: Array<{ id: string; data: any }>, userId: string): Promise<{ updatedCount: number; errorCount: number; errors: string[] }> {
    const errors: string[] = [];
    let updatedCount = 0;
    let errorCount = 0;

    // Validate entity type
    const validEntities = ['account', 'contact', 'lead', 'opportunity', 'activity'];
    if (!validEntities.includes(entity)) {
      throw new Error(`Invalid entity type: ${entity}. Valid types are: ${validEntities.join(', ')}`);
    }

    for (const update of updates) {
      try {
        switch (entity) {
          case 'account':
            await AccountModel.update(update.id, update.data);
            break;
          case 'contact':
            await ContactModel.update(update.id, update.data);
            break;
          case 'lead':
            await LeadModel.update(update.id, update.data);
            break;
          case 'opportunity':
            await OpportunityModel.update(update.id, update.data);
            break;
          case 'activity':
            await ActivityModel.update(update.id, update.data);
            break;
        }
        updatedCount++;
      } catch (error) {
        errorCount++;
        errors.push(`ID ${update.id}: ${(error as Error).message}`);
      }
    }

    return {
      updatedCount,
      errorCount,
      errors
    };
  }
}

export default DataImportExportService;
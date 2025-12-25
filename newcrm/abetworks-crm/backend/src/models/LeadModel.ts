import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import CustomFieldService from '../services/CustomFieldService';
import AuditLogService from '../services/AuditLogService';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  jobTitle?: string;
  leadSource: string;
  status: string;
  leadScore?: number;
  ownerId: string;
  assignedTo?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  convertedToContact?: boolean;
  convertedToContactId?: string;
  convertedToAccount?: boolean;
  convertedToAccountId?: string;
  convertedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  customFields?: Record<string, any>;
}

class LeadModel {
  static tableName = 'leads';

  // Create a new lead
  static async create(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'convertedToContact' | 'convertedToAccount'>): Promise<Lead> {
    // Validate custom fields if they exist
    if (leadData.customFields && Object.keys(leadData.customFields).length > 0) {
      const validation = await CustomFieldService.validateCustomFields('lead', leadData.customFields);
      if (!validation.valid) {
        throw new Error(`Invalid custom fields: ${validation.errors?.join(', ')}`);
      }
    }

    const id = uuidv4();
    const now = new Date();

    const query = `
      INSERT INTO ${this.tableName} (
        id, "firstName", "lastName", company, email, phone, "jobTitle", "leadSource",
        status, "leadScore", "ownerId", "assignedTo", description, address, city,
        state, "zipCode", country, "custom_fields", "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      leadData.firstName,
      leadData.lastName,
      leadData.company,
      leadData.email,
      leadData.phone,
      leadData.jobTitle,
      leadData.leadSource,
      leadData.status || 'new',
      leadData.leadScore || 0,
      leadData.ownerId,
      leadData.assignedTo,
      leadData.description,
      leadData.address,
      leadData.city,
      leadData.state,
      leadData.zipCode,
      leadData.country,
      leadData.customFields || {},
      now,
      now
    ]);

    const createdLead = result.rows[0];

    // Log the creation in audit logs
    await AuditLogService.create(
      leadData.ownerId,  // Use the owner ID as the user performing the action
      'CREATE',
      'lead',
      createdLead.id,
      undefined, // No old value for creation
      createdLead
    );

    return createdLead;
  }

  // Find lead by ID
  static async findById(id: string): Promise<Lead | null> {
    const query = `SELECT *, "custom_fields" AS "customFields" FROM ${this.tableName} WHERE id = $1 AND "deletedAt" IS NULL`;
    const result = await pool.query(query, [id]);
    const lead = result.rows[0];

    if (!lead) return null;

    // Map custom_fields to customFields property
    if (lead.customFields) {
      lead.customFields = lead.customFields || {};
    } else {
      lead.customFields = {};
    }

    return lead;
  }

  // Find leads by owner ID
  static async findByOwnerId(ownerId: string, page: number = 1, limit: number = 10): Promise<{ leads: Lead[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "ownerId" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [ownerId]);
    const total = parseInt(countResult.rows[0].count);

    // Get leads
    const query = `
      SELECT *, "custom_fields" AS "customFields" FROM ${this.tableName}
      WHERE "ownerId" = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [ownerId, limit, offset]);

    // Process custom fields for each lead
    const leads = result.rows.map(lead => {
      lead.customFields = lead.customFields || {};
      return lead;
    });

    return {
      leads,
      total
    };
  }

  // Find leads by assigned user ID
  static async findByAssignedTo(assignedTo: string, page: number = 1, limit: number = 10): Promise<{ leads: Lead[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "assignedTo" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [assignedTo]);
    const total = parseInt(countResult.rows[0].count);

    // Get leads
    const query = `
      SELECT *, "custom_fields" AS "customFields" FROM ${this.tableName}
      WHERE "assignedTo" = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [assignedTo, limit, offset]);

    // Process custom fields for each lead
    const leads = result.rows.map(lead => {
      lead.customFields = lead.customFields || {};
      return lead;
    });

    return {
      leads,
      total
    };
  }

  // Find leads by status
  static async findByStatus(status: string, page: number = 1, limit: number = 10): Promise<{ leads: Lead[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE status = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [status]);
    const total = parseInt(countResult.rows[0].count);

    // Get leads
    const query = `
      SELECT *, "custom_fields" AS "customFields" FROM ${this.tableName}
      WHERE status = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [status, limit, offset]);

    // Process custom fields for each lead
    const leads = result.rows.map(lead => {
      lead.customFields = lead.customFields || {};
      return lead;
    });

    return {
      leads,
      total
    };
  }

  // Update lead
  static async update(id: string, leadData: Partial<Lead>): Promise<Lead | null> {
    // Validate custom fields if they exist
    if (leadData.customFields && Object.keys(leadData.customFields).length > 0) {
      const validation = await CustomFieldService.validateCustomFields('lead', leadData.customFields);
      if (!validation.valid) {
        throw new Error(`Invalid custom fields: ${validation.errors?.join(', ')}`);
      }
    }

    // Get the current lead to store old values for audit log
    const currentLead = await this.findById(id);
    if (!currentLead) return null;

    const updates = Object.keys(leadData).filter(key =>
      key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'deletedAt' &&
      key !== 'convertedToContact' && key !== 'convertedToAccount' && key !== 'convertedDate'
    );
    if (updates.length === 0) return null;

    // Handle custom fields separately to merge with existing ones
    let setClause = updates.map((key, index) => {
      if (key === 'customFields') {
        return `"custom_fields" = COALESCE("custom_fields", '{}'::jsonb) || $${index + 1}::jsonb`;
      }
      return `"${key}" = $${index + 1}`;
    }).join(', ');

    const values = updates.map(key => {
      if (key === 'customFields') {
        return JSON.stringify(leadData.customFields || {});
      }
      return leadData[key as keyof Lead];
    });
    values.push(new Date(), id);

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, "updatedAt" = $${updates.length + 1}
      WHERE id = $${updates.length + 2} AND "deletedAt" IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, values);
    const updatedLead = result.rows[0];

    if (updatedLead) {
      // Log the update in audit logs
      await AuditLogService.create(
        updatedLead.ownerId,  // Use the owner ID as the user performing the action
        'UPDATE',
        'lead',
        updatedLead.id,
        currentLead, // Old value
        updatedLead // New value
      );
    }

    return updatedLead || null;
  }

  // Soft delete lead
  static async delete(id: string): Promise<boolean> {
    // Get the current lead to store old values for audit log
    const currentLead = await this.findById(id);
    if (!currentLead) return false;

    const now = new Date();
    const query = `
      UPDATE ${this.tableName}
      SET "deletedAt" = $1, "updatedAt" = $1
      WHERE id = $2
    `;
    const result = await pool.query(query, [now, id]);

    if (result.rowCount !== 0) {
      // Log the deletion in audit logs
      await AuditLogService.create(
        currentLead.ownerId,  // Use the owner ID as the user performing the action
        'DELETE',
        'lead',
        currentLead.id,
        currentLead, // Old value
        undefined // No new value for deletion
      );
    }

    return result.rowCount !== 0;
  }

  // Get all leads with pagination
  static async getAll(page: number = 1, limit: number = 10): Promise<{ leads: Lead[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    // Get leads
    const query = `
      SELECT *, "custom_fields" AS "customFields" FROM ${this.tableName}
      WHERE "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    // Process custom fields for each lead
    const leads = result.rows.map(lead => {
      lead.customFields = lead.customFields || {};
      return lead;
    });

    return {
      leads,
      total
    };
  }

  // Search leads
  static async search(searchTerm: string, page: number = 1, limit: number = 10): Promise<{ leads: Lead[]; total: number }> {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm}%`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM ${this.tableName}
      WHERE ("deletedAt" IS NULL)
      AND (
        "firstName" ILIKE $1 OR
        "lastName" ILIKE $1 OR
        company ILIKE $1 OR
        email ILIKE $1 OR
        phone ILIKE $1 OR
        "custom_fields"::text ILIKE $1
      )
    `;
    const countResult = await pool.query(countQuery, [searchPattern]);
    const total = parseInt(countResult.rows[0].count);

    // Get leads
    const query = `
      SELECT *, "custom_fields" AS "customFields" FROM ${this.tableName}
      WHERE ("deletedAt" IS NULL)
      AND (
        "firstName" ILIKE $1 OR
        "lastName" ILIKE $1 OR
        company ILIKE $1 OR
        email ILIKE $1 OR
        phone ILIKE $1 OR
        "custom_fields"::text ILIKE $1
      )
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [searchPattern, limit, offset]);

    // Process custom fields for each lead
    const leads = result.rows.map(lead => {
      lead.customFields = lead.customFields || {};
      return lead;
    });

    return {
      leads,
      total
    };
  }

  // Convert lead to contact and account
  static async convertToContactAndAccount(leadId: string, contactId: string, accountId: string): Promise<boolean> {
    // Get the current lead to store old values for audit log
    const currentLead = await this.findById(leadId);
    if (!currentLead) return false;

    const now = new Date();
    const query = `
      UPDATE ${this.tableName}
      SET
        "convertedToContact" = true,
        "convertedToContactId" = $1,
        "convertedToAccount" = true,
        "convertedToAccountId" = $2,
        "convertedDate" = $3,
        "updatedAt" = $3
      WHERE id = $4
    `;
    const result = await pool.query(query, [contactId, accountId, now, leadId]);

    if (result.rowCount !== 0) {
      // Log the conversion in audit logs
      await AuditLogService.create(
        currentLead.ownerId,  // Use the owner ID as the user performing the action
        'CONVERT',
        'lead',
        currentLead.id,
        currentLead, // Old value
        {
          ...currentLead,
          convertedToContact: true,
          convertedToContactId: contactId,
          convertedToAccount: true,
          convertedToAccountId: accountId,
          convertedDate: now
        } // New value
      );
    }

    return result.rowCount !== 0;
  }
}

export default LeadModel;
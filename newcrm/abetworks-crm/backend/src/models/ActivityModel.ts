import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Activity {
  id: string;
  subject: string;
  type: string;
  description?: string;
  status: string;
  priority?: string;
  startDate?: Date;
  endDate?: Date;
  duration?: number; // Duration in minutes
  ownerId: string;
  assignedTo?: string;
  accountId?: string;
  contactId?: string;
  opportunityId?: string;
  relatedToType?: string; // 'Account', 'Contact', 'Opportunity', etc.
  relatedToId?: string; // ID of the related entity
  isAllDay?: boolean;
  location?: string;
  reminder?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  customFields?: Record<string, any>;
}

class ActivityModel {
  static tableName = 'activities';

  // Create a new activity
  static async create(activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Activity> {
    const id = uuidv4();
    const now = new Date();

    const query = `
      INSERT INTO ${this.tableName} (
        id, subject, type, description, status, priority, "startDate", "endDate",
        duration, "ownerId", "assignedTo", "accountId", "contactId", "opportunityId",
        "relatedToType", "relatedToId", "isAllDay", location, reminder, "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      activityData.subject,
      activityData.type,
      activityData.description,
      activityData.status || 'Planned',
      activityData.priority || 'Medium',
      activityData.startDate,
      activityData.endDate,
      activityData.duration,
      activityData.ownerId,
      activityData.assignedTo,
      activityData.accountId,
      activityData.contactId,
      activityData.opportunityId,
      activityData.relatedToType,
      activityData.relatedToId,
      activityData.isAllDay || false,
      activityData.location,
      activityData.reminder,
      now,
      now
    ]);

    return result.rows[0];
  }

  // Find activity by ID
  static async findById(id: string): Promise<Activity | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1 AND "deletedAt" IS NULL`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find activities by owner ID
  static async findByOwnerId(ownerId: string, page: number = 1, limit: number = 10): Promise<{ activities: Activity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "ownerId" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [ownerId]);
    const total = parseInt(countResult.rows[0].count);

    // Get activities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "ownerId" = $1 AND "deletedAt" IS NULL
      ORDER BY "startDate" DESC, "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [ownerId, limit, offset]);

    return {
      activities: result.rows,
      total
    };
  }

  // Find activities by assigned user ID
  static async findByAssignedTo(assignedTo: string, page: number = 1, limit: number = 10): Promise<{ activities: Activity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "assignedTo" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [assignedTo]);
    const total = parseInt(countResult.rows[0].count);

    // Get activities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "assignedTo" = $1 AND "deletedAt" IS NULL
      ORDER BY "startDate" DESC, "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [assignedTo, limit, offset]);

    return {
      activities: result.rows,
      total
    };
  }

  // Find activities by account ID
  static async findByAccountId(accountId: string, page: number = 1, limit: number = 10): Promise<{ activities: Activity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "accountId" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [accountId]);
    const total = parseInt(countResult.rows[0].count);

    // Get activities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "accountId" = $1 AND "deletedAt" IS NULL
      ORDER BY "startDate" DESC, "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [accountId, limit, offset]);

    return {
      activities: result.rows,
      total
    };
  }

  // Find activities by contact ID
  static async findByContactId(contactId: string, page: number = 1, limit: number = 10): Promise<{ activities: Activity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "contactId" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [contactId]);
    const total = parseInt(countResult.rows[0].count);

    // Get activities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "contactId" = $1 AND "deletedAt" IS NULL
      ORDER BY "startDate" DESC, "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [contactId, limit, offset]);

    return {
      activities: result.rows,
      total
    };
  }

  // Find activities by opportunity ID
  static async findByOpportunityId(opportunityId: string, page: number = 1, limit: number = 10): Promise<{ activities: Activity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "opportunityId" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [opportunityId]);
    const total = parseInt(countResult.rows[0].count);

    // Get activities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "opportunityId" = $1 AND "deletedAt" IS NULL
      ORDER BY "startDate" DESC, "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [opportunityId, limit, offset]);

    return {
      activities: result.rows,
      total
    };
  }

  // Find activities by type
  static async findByType(type: string, page: number = 1, limit: number = 10): Promise<{ activities: Activity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE type = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [type]);
    const total = parseInt(countResult.rows[0].count);

    // Get activities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE type = $1 AND "deletedAt" IS NULL
      ORDER BY "startDate" DESC, "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [type, limit, offset]);

    return {
      activities: result.rows,
      total
    };
  }

  // Find activities by date range
  static async findByDateRange(startDate: Date, endDate: Date, page: number = 1, limit: number = 10): Promise<{ activities: Activity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM ${this.tableName} 
      WHERE "deletedAt" IS NULL 
      AND (
        ("startDate" BETWEEN $1 AND $2) OR 
        ("endDate" BETWEEN $1 AND $2) OR 
        ("startDate" <= $1 AND "endDate" >= $2)
      )
    `;
    const countResult = await pool.query(countQuery, [startDate, endDate]);
    const total = parseInt(countResult.rows[0].count);

    // Get activities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "deletedAt" IS NULL 
      AND (
        ("startDate" BETWEEN $1 AND $2) OR 
        ("endDate" BETWEEN $1 AND $2) OR 
        ("startDate" <= $1 AND "endDate" >= $2)
      )
      ORDER BY "startDate" DESC, "createdAt" DESC
      LIMIT $3 OFFSET $4
    `;
    const result = await pool.query(query, [startDate, endDate, limit, offset]);

    return {
      activities: result.rows,
      total
    };
  }

  // Update activity
  static async update(id: string, activityData: Partial<Activity>): Promise<Activity | null> {
    const updates = Object.keys(activityData).filter(key => 
      key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'deletedAt'
    );
    if (updates.length === 0) return null;

    const setClause = updates.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = updates.map(key => activityData[key as keyof Activity]);
    values.push(new Date(), id);

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, "updatedAt" = $${updates.length + 1}
      WHERE id = $${updates.length + 2} AND "deletedAt" IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Soft delete activity
  static async delete(id: string): Promise<boolean> {
    const now = new Date();
    const query = `
      UPDATE ${this.tableName}
      SET "deletedAt" = $1, "updatedAt" = $1
      WHERE id = $2
    `;
    const result = await pool.query(query, [now, id]);
    return result.rowCount !== 0;
  }

  // Get all activities with pagination
  static async getAll(page: number = 1, limit: number = 10): Promise<{ activities: Activity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    // Get activities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "deletedAt" IS NULL
      ORDER BY "startDate" DESC, "createdAt" DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    return {
      activities: result.rows,
      total
    };
  }

  // Search activities
  static async search(searchTerm: string, page: number = 1, limit: number = 10): Promise<{ activities: Activity[]; total: number }> {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm}%`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM ${this.tableName}
      WHERE ("deletedAt" IS NULL)
      AND (
        subject ILIKE $1 OR
        description ILIKE $1 OR
        type ILIKE $1
      )
    `;
    const countResult = await pool.query(countQuery, [searchPattern]);
    const total = parseInt(countResult.rows[0].count);

    // Get activities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ("deletedAt" IS NULL)
      AND (
        subject ILIKE $1 OR
        description ILIKE $1 OR
        type ILIKE $1
      )
      ORDER BY "startDate" DESC, "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [searchPattern, limit, offset]);

    return {
      activities: result.rows,
      total
    };
  }
}

export default ActivityModel;
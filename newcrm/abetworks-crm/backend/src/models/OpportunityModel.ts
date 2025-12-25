import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Opportunity {
  id: string;
  name: string;
  description?: string;
  accountId?: string;
  contactId?: string;
  stage: string;
  probability?: number;
  amount?: number;
  currency?: string;
  closeDate?: Date;
  ownerId: string;
  assignedTo?: string;
  leadSource?: string;
  type?: string;
  priority?: string;
  forecastCategory?: string;
  nextStep?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  customFields?: Record<string, any>;
}

class OpportunityModel {
  static tableName = 'opportunities';

  // Create a new opportunity
  static async create(opportunityData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Opportunity> {
    const id = uuidv4();
    const now = new Date();

    const query = `
      INSERT INTO ${this.tableName} (
        id, name, description, "accountId", "contactId", stage, probability,
        amount, currency, "closeDate", "ownerId", "assignedTo", "leadSource",
        type, priority, "forecastCategory", "nextStep", "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      opportunityData.name,
      opportunityData.description,
      opportunityData.accountId,
      opportunityData.contactId,
      opportunityData.stage,
      opportunityData.probability || 10, // Default to 10% probability
      opportunityData.amount,
      opportunityData.currency || 'USD',
      opportunityData.closeDate,
      opportunityData.ownerId,
      opportunityData.assignedTo,
      opportunityData.leadSource,
      opportunityData.type || 'New Business',
      opportunityData.priority || 'Medium',
      opportunityData.forecastCategory || 'Pipeline',
      opportunityData.nextStep,
      now,
      now
    ]);

    return result.rows[0];
  }

  // Find opportunity by ID
  static async findById(id: string): Promise<Opportunity | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1 AND "deletedAt" IS NULL`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find opportunities by owner ID
  static async findByOwnerId(ownerId: string, page: number = 1, limit: number = 10): Promise<{ opportunities: Opportunity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "ownerId" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [ownerId]);
    const total = parseInt(countResult.rows[0].count);

    // Get opportunities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "ownerId" = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [ownerId, limit, offset]);

    return {
      opportunities: result.rows,
      total
    };
  }

  // Find opportunities by assigned user ID
  static async findByAssignedTo(assignedTo: string, page: number = 1, limit: number = 10): Promise<{ opportunities: Opportunity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "assignedTo" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [assignedTo]);
    const total = parseInt(countResult.rows[0].count);

    // Get opportunities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "assignedTo" = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [assignedTo, limit, offset]);

    return {
      opportunities: result.rows,
      total
    };
  }

  // Find opportunities by account ID
  static async findByAccountId(accountId: string, page: number = 1, limit: number = 10): Promise<{ opportunities: Opportunity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "accountId" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [accountId]);
    const total = parseInt(countResult.rows[0].count);

    // Get opportunities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "accountId" = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [accountId, limit, offset]);

    return {
      opportunities: result.rows,
      total
    };
  }

  // Find opportunities by stage
  static async findByStage(stage: string, page: number = 1, limit: number = 10): Promise<{ opportunities: Opportunity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE stage = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [stage]);
    const total = parseInt(countResult.rows[0].count);

    // Get opportunities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE stage = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [stage, limit, offset]);

    return {
      opportunities: result.rows,
      total
    };
  }

  // Update opportunity
  static async update(id: string, opportunityData: Partial<Opportunity>): Promise<Opportunity | null> {
    const updates = Object.keys(opportunityData).filter(key => 
      key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'deletedAt'
    );
    if (updates.length === 0) return null;

    const setClause = updates.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = updates.map(key => opportunityData[key as keyof Opportunity]);
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

  // Soft delete opportunity
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

  // Get all opportunities with pagination
  static async getAll(page: number = 1, limit: number = 10): Promise<{ opportunities: Opportunity[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    // Get opportunities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    return {
      opportunities: result.rows,
      total
    };
  }

  // Search opportunities
  static async search(searchTerm: string, page: number = 1, limit: number = 10): Promise<{ opportunities: Opportunity[]; total: number }> {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm}%`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM ${this.tableName}
      WHERE ("deletedAt" IS NULL)
      AND (
        name ILIKE $1 OR
        description ILIKE $1 OR
        type ILIKE $1
      )
    `;
    const countResult = await pool.query(countQuery, [searchPattern]);
    const total = parseInt(countResult.rows[0].count);

    // Get opportunities
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ("deletedAt" IS NULL)
      AND (
        name ILIKE $1 OR
        description ILIKE $1 OR
        type ILIKE $1
      )
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [searchPattern, limit, offset]);

    return {
      opportunities: result.rows,
      total
    };
  }

  // Get pipeline statistics by stage
  static async getPipelineStats(): Promise<Array<{ stage: string; count: number; totalAmount: number }>> {
    const query = `
      SELECT 
        stage,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as "totalAmount"
      FROM ${this.tableName}
      WHERE "deletedAt" IS NULL
      GROUP BY stage
      ORDER BY stage
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get forecast by month
  static async getForecastByMonth(months: number = 6): Promise<Array<{ month: string; forecast: number }>> {
    const query = `
      SELECT 
        TO_CHAR("closeDate", 'YYYY-MM') as month,
        COALESCE(SUM(amount * probability / 100), 0) as forecast
      FROM ${this.tableName}
      WHERE "deletedAt" IS NULL
        AND "closeDate" >= CURRENT_DATE
        AND "closeDate" <= CURRENT_DATE + INTERVAL '${months} months'
        AND "probability" > 0
      GROUP BY TO_CHAR("closeDate", 'YYYY-MM')
      ORDER BY month
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export default OpportunityModel;
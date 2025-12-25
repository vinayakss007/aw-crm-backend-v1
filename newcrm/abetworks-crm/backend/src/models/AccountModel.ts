import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import CustomFieldService from '../services/CustomFieldService';
import AuditLogService from '../services/AuditLogService';

export interface Account {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  size?: string;
  annualRevenue?: number;
  ownerId: string;
  assignedTo?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  customFields?: Record<string, any>;
}

class AccountModel {
  static tableName = 'accounts';

  // Create a new account
  static async create(accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Account> {
    const id = uuidv4();
    const now = new Date();

    const query = `
      INSERT INTO ${this.tableName} (
        id, name, description, industry, website, phone, email, address, city, state,
        "zipCode", country, size, "annualRevenue", "ownerId", "assignedTo", status,
        "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      accountData.name,
      accountData.description,
      accountData.industry,
      accountData.website,
      accountData.phone,
      accountData.email,
      accountData.address,
      accountData.city,
      accountData.state,
      accountData.zipCode,
      accountData.country,
      accountData.size,
      accountData.annualRevenue,
      accountData.ownerId,
      accountData.assignedTo,
      accountData.status || 'active',
      now,
      now
    ]);

    const createdAccount = result.rows[0];

    // Log the creation in audit logs
    await AuditLogService.create(
      accountData.ownerId,  // Use the owner ID as the user performing the action
      'CREATE',
      'account',
      createdAccount.id,
      undefined, // No old value for creation
      createdAccount
    );

    return createdAccount;
  }

  // Find account by ID
  static async findById(id: string): Promise<Account | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1 AND "deletedAt" IS NULL`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find accounts by owner ID
  static async findByOwnerId(ownerId: string, page: number = 1, limit: number = 10): Promise<{ accounts: Account[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "ownerId" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [ownerId]);
    const total = parseInt(countResult.rows[0].count);

    // Get accounts
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "ownerId" = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [ownerId, limit, offset]);

    return {
      accounts: result.rows,
      total
    };
  }

  // Find accounts by assigned user ID
  static async findByAssignedTo(assignedTo: string, page: number = 1, limit: number = 10): Promise<{ accounts: Account[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "assignedTo" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [assignedTo]);
    const total = parseInt(countResult.rows[0].count);

    // Get accounts
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "assignedTo" = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [assignedTo, limit, offset]);

    return {
      accounts: result.rows,
      total
    };
  }

  // Update account
  static async update(id: string, accountData: Partial<Account>): Promise<Account | null> {
    const updates = Object.keys(accountData).filter(key => 
      key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'deletedAt'
    );
    if (updates.length === 0) return null;

    const setClause = updates.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = updates.map(key => accountData[key as keyof Account]);
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

  // Soft delete account
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

  // Get all accounts with pagination
  static async getAll(page: number = 1, limit: number = 10): Promise<{ accounts: Account[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    // Get accounts
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    return {
      accounts: result.rows,
      total
    };
  }

  // Search accounts
  static async search(searchTerm: string, page: number = 1, limit: number = 10): Promise<{ accounts: Account[]; total: number }> {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm}%`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM ${this.tableName}
      WHERE ("deletedAt" IS NULL)
      AND (
        name ILIKE $1 OR
        description ILIKE $1 OR
        industry ILIKE $1 OR
        website ILIKE $1
      )
    `;
    const countResult = await pool.query(countQuery, [searchPattern]);
    const total = parseInt(countResult.rows[0].count);

    // Get accounts
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ("deletedAt" IS NULL)
      AND (
        name ILIKE $1 OR
        description ILIKE $1 OR
        industry ILIKE $1 OR
        website ILIKE $1
      )
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [searchPattern, limit, offset]);

    return {
      accounts: result.rows,
      total
    };
  }
}

export default AccountModel;
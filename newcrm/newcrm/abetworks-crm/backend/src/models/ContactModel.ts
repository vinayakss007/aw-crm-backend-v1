import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  accountId?: string;
  ownerId: string;
  assignedTo?: string;
  status: string;
  leadSource?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  customFields?: Record<string, any>;
}

class ContactModel {
  static tableName = 'contacts';

  // Create a new contact
  static async create(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Contact> {
    const id = uuidv4();
    const now = new Date();

    const query = `
      INSERT INTO ${this.tableName} (
        id, "firstName", "lastName", email, phone, "jobTitle", department, "accountId",
        "ownerId", "assignedTo", status, "leadSource", description, address, city,
        state, "zipCode", country, "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      contactData.firstName,
      contactData.lastName,
      contactData.email,
      contactData.phone,
      contactData.jobTitle,
      contactData.department,
      contactData.accountId,
      contactData.ownerId,
      contactData.assignedTo,
      contactData.status || 'active',
      contactData.leadSource,
      contactData.description,
      contactData.address,
      contactData.city,
      contactData.state,
      contactData.zipCode,
      contactData.country,
      now,
      now
    ]);

    return result.rows[0];
  }

  // Find contact by ID
  static async findById(id: string): Promise<Contact | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1 AND "deletedAt" IS NULL`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find contacts by owner ID
  static async findByOwnerId(ownerId: string, page: number = 1, limit: number = 10): Promise<{ contacts: Contact[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "ownerId" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [ownerId]);
    const total = parseInt(countResult.rows[0].count);

    // Get contacts
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "ownerId" = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [ownerId, limit, offset]);

    return {
      contacts: result.rows,
      total
    };
  }

  // Find contacts by assigned user ID
  static async findByAssignedTo(assignedTo: string, page: number = 1, limit: number = 10): Promise<{ contacts: Contact[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "assignedTo" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [assignedTo]);
    const total = parseInt(countResult.rows[0].count);

    // Get contacts
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "assignedTo" = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [assignedTo, limit, offset]);

    return {
      contacts: result.rows,
      total
    };
  }

  // Find contacts by account ID
  static async findByAccountId(accountId: string, page: number = 1, limit: number = 10): Promise<{ contacts: Contact[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "accountId" = $1 AND "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery, [accountId]);
    const total = parseInt(countResult.rows[0].count);

    // Get contacts
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "accountId" = $1 AND "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [accountId, limit, offset]);

    return {
      contacts: result.rows,
      total
    };
  }

  // Update contact
  static async update(id: string, contactData: Partial<Contact>): Promise<Contact | null> {
    const updates = Object.keys(contactData).filter(key => 
      key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'deletedAt'
    );
    if (updates.length === 0) return null;

    const setClause = updates.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = updates.map(key => contactData[key as keyof Contact]);
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

  // Soft delete contact
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

  // Get all contacts with pagination
  static async getAll(page: number = 1, limit: number = 10): Promise<{ contacts: Contact[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "deletedAt" IS NULL`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    // Get contacts
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    return {
      contacts: result.rows,
      total
    };
  }

  // Search contacts
  static async search(searchTerm: string, page: number = 1, limit: number = 10): Promise<{ contacts: Contact[]; total: number }> {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm}%`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM ${this.tableName}
      WHERE ("deletedAt" IS NULL)
      AND (
        "firstName" ILIKE $1 OR
        "lastName" ILIKE $1 OR
        email ILIKE $1 OR
        "jobTitle" ILIKE $1 OR
        description ILIKE $1
      )
    `;
    const countResult = await pool.query(countQuery, [searchPattern]);
    const total = parseInt(countResult.rows[0].count);

    // Get contacts
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ("deletedAt" IS NULL)
      AND (
        "firstName" ILIKE $1 OR
        "lastName" ILIKE $1 OR
        email ILIKE $1 OR
        "jobTitle" ILIKE $1 OR
        description ILIKE $1
      )
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [searchPattern, limit, offset]);

    return {
      contacts: result.rows,
      total
    };
  }
}

export default ContactModel;
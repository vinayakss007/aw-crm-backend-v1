import pool from '../config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  customFields?: Record<string, any>;
}

class UserModel {
  static tableName = 'users';

  // Create a new user
  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<User> {
    const { email, password, firstName, lastName, role } = userData;
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 12);
    const isActive = true;
    const now = new Date();

    const query = `
      INSERT INTO ${this.tableName} (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      email,
      hashedPassword,
      firstName,
      lastName,
      role || 'user',
      isActive,
      now,
      now
    ]);

    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  // Find user by ID
  static async findById(id: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Update user
  static async update(id: string, userData: Partial<User>): Promise<User | null> {
    const updates = Object.keys(userData).filter(key => key !== 'id' && key !== 'createdAt');
    if (updates.length === 0) return null;

    const setClause = updates.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = updates.map(key => userData[key as keyof User]);
    values.push(id);

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, updatedAt = $${updates.length + 1}
      WHERE id = $${updates.length + 2}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete user (soft delete)
  static async delete(id: string): Promise<boolean> {
    const now = new Date();
    const query = `
      UPDATE ${this.tableName}
      SET isActive = false, updatedAt = $1
      WHERE id = $2
    `;
    const result = await pool.query(query, [now, id]);
    return result.rowCount !== 0;
  }

  // Get all users with pagination
  static async getAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE "isActive" = true`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    // Get users
    const query = `
      SELECT id, email, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt"
      FROM ${this.tableName}
      WHERE "isActive" = true
      ORDER BY "createdAt" DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    return {
      users: result.rows,
      total
    };
  }
}

export default UserModel;
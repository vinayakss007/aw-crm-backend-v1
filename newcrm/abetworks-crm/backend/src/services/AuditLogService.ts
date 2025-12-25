import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface AuditLog {
  id: string;
  userId: string;
  action: string; // 'CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', etc.
  entity: string; // 'user', 'account', 'contact', 'lead', 'opportunity', 'activity'
  entityId?: string; // ID of the entity that was affected
  oldValue?: Record<string, any>; // Previous state of the entity (for UPDATE operations)
  newValue?: Record<string, any>; // New state of the entity (for CREATE/UPDATE operations)
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

class AuditLogService {
  static tableName = 'audit_logs';

  // Create an audit log entry
  static async create(userId: string, action: string, entity: string, entityId?: string, oldValue?: Record<string, any>, newValue?: Record<string, any>, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    const id = uuidv4();
    const timestamp = new Date();

    const query = `
      INSERT INTO ${this.tableName} (
        id, user_id, action, entity, entity_id, old_value, new_value, ip_address, user_agent, timestamp
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      userId,
      action,
      entity,
      entityId,
      oldValue ? JSON.stringify(oldValue) : null,
      newValue ? JSON.stringify(newValue) : null,
      ipAddress,
      userAgent,
      timestamp
    ]);

    return result.rows[0];
  }

  // Get audit logs for a specific user
  static async getByUser(userId: string, page: number = 1, limit: number = 10): Promise<{ logs: AuditLog[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE user_id = $1`;
    const countResult = await pool.query(countQuery, [userId]);
    const total = parseInt(countResult.rows[0].count);

    // Get logs
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [userId, limit, offset]);

    return {
      logs: result.rows.map(row => ({
        ...row,
        oldValue: row.old_value ? JSON.parse(row.old_value) : null,
        newValue: row.new_value ? JSON.parse(row.new_value) : null
      })),
      total
    };
  }

  // Get audit logs for a specific entity
  static async getByEntity(entity: string, entityId: string, page: number = 1, limit: number = 10): Promise<{ logs: AuditLog[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE entity = $1 AND entity_id = $2`;
    const countResult = await pool.query(countQuery, [entity, entityId]);
    const total = parseInt(countResult.rows[0].count);

    // Get logs
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE entity = $1 AND entity_id = $2
      ORDER BY timestamp DESC
      LIMIT $3 OFFSET $4
    `;
    const result = await pool.query(query, [entity, entityId, limit, offset]);

    return {
      logs: result.rows.map(row => ({
        ...row,
        oldValue: row.old_value ? JSON.parse(row.old_value) : null,
        newValue: row.new_value ? JSON.parse(row.new_value) : null
      })),
      total
    };
  }

  // Get all audit logs (admin only)
  static async getAll(page: number = 1, limit: number = 10): Promise<{ logs: AuditLog[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName}`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    // Get logs
    const query = `
      SELECT * FROM ${this.tableName}
      ORDER BY timestamp DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    return {
      logs: result.rows.map(row => ({
        ...row,
        oldValue: row.old_value ? JSON.parse(row.old_value) : null,
        newValue: row.new_value ? JSON.parse(row.new_value) : null
      })),
      total
    };
  }

  // Get audit logs by action type
  static async getByAction(action: string, page: number = 1, limit: number = 10): Promise<{ logs: AuditLog[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE action = $1`;
    const countResult = await pool.query(countQuery, [action]);
    const total = parseInt(countResult.rows[0].count);

    // Get logs
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE action = $1
      ORDER BY timestamp DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [action, limit, offset]);

    return {
      logs: result.rows.map(row => ({
        ...row,
        oldValue: row.old_value ? JSON.parse(row.old_value) : null,
        newValue: row.new_value ? JSON.parse(row.new_value) : null
      })),
      total
    };
  }
}

export default AuditLogService;
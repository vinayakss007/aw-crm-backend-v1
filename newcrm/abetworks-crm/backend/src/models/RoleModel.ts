import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

class RoleModel {
  static tableName = 'roles';
  static permissionTable = 'permissions';

  // Create a new role
  static async create(roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    const id = uuidv4();
    const now = new Date();

    const query = `
      INSERT INTO ${this.tableName} (id, name, description, permissions, "isActive", createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      roleData.name,
      roleData.description,
      JSON.stringify(roleData.permissions),
      roleData.isActive !== undefined ? roleData.isActive : true,
      now,
      now
    ]);

    return result.rows[0];
  }

  // Find role by ID
  static async findById(id: string): Promise<Role | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find role by name
  static async findByName(name: string): Promise<Role | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE name = $1`;
    const result = await pool.query(query, [name]);
    return result.rows[0] || null;
  }

  // Get all roles
  static async getAll(): Promise<Role[]> {
    const query = `SELECT * FROM ${this.tableName} ORDER BY name`;
    const result = await pool.query(query);
    return result.rows;
  }

  // Update role
  static async update(id: string, roleData: Partial<Role>): Promise<Role | null> {
    const updates = Object.keys(roleData).filter(key => 
      key !== 'id' && key !== 'createdAt' && key !== 'updatedAt'
    );
    if (updates.length === 0) return null;

    const setClause = updates.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = updates.map(key => {
      if (key === 'permissions' && typeof roleData[key as keyof Role] === 'object') {
        return JSON.stringify(roleData[key as keyof Role]);
      }
      return roleData[key as keyof Role];
    });
    values.push(new Date(), id);

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, "updatedAt" = $${updates.length + 1}
      WHERE id = $${updates.length + 2}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete role
  static async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rowCount !== 0;
  }

  // Check if user has permission
  static async userHasPermission(userId: string, permission: string): Promise<boolean> {
    // This would typically join users, user_roles, roles, and permissions tables
    // For now, we'll implement a simplified version
    const query = `
      SELECT r.permissions 
      FROM ${this.tableName} r
      JOIN user_roles ur ON r.id = ur."roleId"
      WHERE ur."userId" = $1
    `;
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return false;
    }
    
    // Check if any of the user's roles have the required permission
    for (const row of result.rows) {
      const permissions: string[] = typeof row.permissions === 'string' 
        ? JSON.parse(row.permissions) 
        : row.permissions;
      
      if (permissions.includes(permission)) {
        return true;
      }
    }
    
    return false;
  }
}

export default RoleModel;
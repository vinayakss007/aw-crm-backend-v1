import pool from '../config/database';

export interface CustomField {
  id: string;
  entity: string; // 'lead', 'contact', 'account', 'opportunity', 'activity'
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  displayName: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  options?: string[]; // For select/multiselect fields
  createdAt: Date;
  updatedAt: Date;
}

class CustomFieldService {
  static tableName = 'custom_fields';

  // Create a custom field for an entity
  static async create(entity: string, fieldName: string, fieldType: CustomField['fieldType'], displayName: string, required: boolean, defaultValue?: any, options?: string[]): Promise<CustomField> {
    const id = require('uuid').v4();
    const now = new Date();

    // Validate entity type
    const validEntities = ['lead', 'contact', 'account', 'opportunity', 'activity', 'user'];
    if (!validEntities.includes(entity)) {
      throw new Error(`Invalid entity type: ${entity}. Valid types are: ${validEntities.join(', ')}`);
    }

    // Validate field type
    const validFieldTypes = ['text', 'number', 'date', 'boolean', 'select', 'multiselect'];
    if (!validFieldTypes.includes(fieldType)) {
      throw new Error(`Invalid field type: ${fieldType}. Valid types are: ${validFieldTypes.join(', ')}`);
    }

    const query = `
      INSERT INTO ${this.tableName} (
        id, entity, field_name, field_type, display_name, required, default_value, options, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      entity,
      fieldName,
      fieldType,
      displayName,
      required,
      defaultValue,
      options ? JSON.stringify(options) : null,
      now,
      now
    ]);

    return result.rows[0];
  }

  // Get all custom fields for an entity
  static async getByEntity(entity: string): Promise<CustomField[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE entity = $1
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [entity]);
    return result.rows.map(row => ({
      ...row,
      options: row.options ? JSON.parse(row.options) : null
    }));
  }

  // Get a specific custom field by ID
  static async getById(id: string): Promise<CustomField | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    const field = result.rows[0];
    
    if (!field) return null;
    
    return {
      ...field,
      options: field.options ? JSON.parse(field.options) : null
    };
  }

  // Update a custom field
  static async update(id: string, updateData: Partial<CustomField>): Promise<CustomField | null> {
    const updates = Object.keys(updateData).filter(key => 
      !['id', 'entity', 'createdAt', 'updatedAt'].includes(key)
    );
    
    if (updates.length === 0) return null;

    const setClause = updates.map((key, index) => {
      const dbKey = key === 'fieldName' ? 'field_name' : 
                   key === 'fieldType' ? 'field_type' :
                   key === 'displayName' ? 'display_name' :
                   key === 'createdAt' ? 'created_at' :
                   key === 'updatedAt' ? 'updated_at' : key;
      
      if (key === 'options') {
        return `"${dbKey}" = $${index + 1}`;
      }
      return `"${dbKey}" = $${index + 1}`;
    }).join(', ');

    const values = updates.map(key => {
      if (key === 'options') {
        return updateData[key] ? JSON.stringify(updateData[key]) : null;
      }
      return updateData[key as keyof CustomField];
    });
    
    values.push(new Date(), id);

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = $${updates.length + 1}
      WHERE id = $${updates.length + 2}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    const field = result.rows[0];
    
    if (!field) return null;
    
    return {
      ...field,
      options: field.options ? JSON.parse(field.options) : null
    };
  }

  // Delete a custom field
  static async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rowCount !== 0;
  }

  // Validate custom field values against field definitions
  static async validateCustomFields(entity: string, customFields: Record<string, any>): Promise<{ valid: boolean; errors?: string[] }> {
    if (!customFields || Object.keys(customFields).length === 0) {
      return { valid: true };
    }

    // Get all custom fields for this entity
    const entityFields = await this.getByEntity(entity);
    
    const errors: string[] = [];
    
    // Check if provided custom fields exist in the entity definition
    for (const [fieldName, value] of Object.entries(customFields)) {
      const fieldDef = entityFields.find(f => f.fieldName === fieldName);
      
      if (!fieldDef) {
        errors.push(`Custom field "${fieldName}" is not defined for entity "${entity}"`);
        continue;
      }
      
      // Validate required fields
      if (fieldDef.required && (value === undefined || value === null || value === '')) {
        errors.push(`Required custom field "${fieldName}" is missing or empty`);
        continue;
      }
      
      // Validate field types
      switch (fieldDef.fieldType) {
        case 'number':
          if (value !== null && value !== undefined && value !== '' && isNaN(Number(value))) {
            errors.push(`Custom field "${fieldName}" must be a number`);
          }
          break;
        case 'boolean':
          if (value !== null && value !== undefined && value !== '' && typeof value !== 'boolean' && !['true', 'false', true, false].includes(value)) {
            errors.push(`Custom field "${fieldName}" must be a boolean`);
          }
          break;
        case 'date':
          if (value !== null && value !== undefined && value !== '') {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              errors.push(`Custom field "${fieldName}" must be a valid date`);
            }
          }
          break;
        case 'select':
        case 'multiselect':
          if (value !== null && value !== undefined && value !== '') {
            const options = fieldDef.options || [];
            if (fieldDef.fieldType === 'multiselect' && Array.isArray(value)) {
              for (const val of value) {
                if (!options.includes(val)) {
                  errors.push(`Value "${val}" is not valid for custom field "${fieldName}". Valid options: ${options.join(', ')}`);
                }
              }
            } else {
              if (!options.includes(value)) {
                errors.push(`Value "${value}" is not valid for custom field "${fieldName}". Valid options: ${options.join(', ')}`);
              }
            }
          }
          break;
      }
    }
    
    // Check required fields that weren't provided
    for (const fieldDef of entityFields) {
      if (fieldDef.required && (customFields[fieldDef.fieldName] === undefined || customFields[fieldDef.fieldName] === null || customFields[fieldDef.fieldName] === '')) {
        errors.push(`Required custom field "${fieldDef.fieldName}" is missing`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

export default CustomFieldService;
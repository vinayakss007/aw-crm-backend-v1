import { readFileSync } from 'fs';
import path from 'path';
import pool from '../config/database';

async function runMigration() {
  try {
    console.log('Starting database migration for custom fields management...');

    // Create custom_fields table
    const createCustomFieldsTableSQL = `
      CREATE TABLE IF NOT EXISTS custom_fields (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity VARCHAR(50) NOT NULL, -- 'lead', 'contact', 'account', etc.
        field_name VARCHAR(100) NOT NULL,
        field_type VARCHAR(20) NOT NULL, -- 'text', 'number', 'date', 'boolean', 'select', 'multiselect'
        display_name VARCHAR(100) NOT NULL,
        required BOOLEAN DEFAULT false,
        default_value JSONB,
        options JSONB, -- For select/multiselect fields
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(entity, field_name) -- Ensure unique field names per entity
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_custom_fields_entity ON custom_fields(entity);
      CREATE INDEX IF NOT EXISTS idx_custom_fields_field_name ON custom_fields(field_name);

      -- Update trigger function
      CREATE OR REPLACE FUNCTION update_custom_fields_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Create trigger for update timestamps
      CREATE TRIGGER update_custom_fields_updated_at 
      BEFORE UPDATE ON custom_fields 
      FOR EACH ROW 
      EXECUTE FUNCTION update_custom_fields_updated_at_column();
    `;
    
    await pool.query(createCustomFieldsTableSQL);
    console.log('Created custom_fields table...');

    // Close the connection pool
    await pool.end();
    console.log('Custom fields management migration completed successfully!');
  } catch (error) {
    console.error('Error during custom fields management migration:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

export default runMigration;
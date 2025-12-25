import { readFileSync } from 'fs';
import path from 'path';
import pool from '../config/database';

async function runMigration() {
  try {
    console.log('Starting database migration for custom fields...');

    // Add custom_fields column to all main tables
    const addCustomFieldsSQL = `
      -- Add custom fields to users table
      ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
      
      -- Add custom fields to accounts table
      ALTER TABLE accounts ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
      
      -- Add custom fields to contacts table
      ALTER TABLE contacts ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
      
      -- Add custom fields to leads table
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
      
      -- Add custom fields to opportunities table
      ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
      
      -- Add custom fields to activities table
      ALTER TABLE activities ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
      
      -- Add custom fields to roles table
      ALTER TABLE roles ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
    `;
    
    await pool.query(addCustomFieldsSQL);
    console.log('Added custom_fields columns to all tables...');

    // Close the connection pool
    await pool.end();
    console.log('Custom fields migration completed successfully!');
  } catch (error) {
    console.error('Error during custom fields migration:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

export default runMigration;
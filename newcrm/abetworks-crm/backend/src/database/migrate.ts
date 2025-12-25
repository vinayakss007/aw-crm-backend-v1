import { readFileSync } from 'fs';
import path from 'path';
import pool from '../config/database';

async function runMigration() {
  try {
    console.log('Starting database migration...');

    // Drop all existing tables (if any) - using CASCADE to remove dependencies
    const dropTablesSQL = `
      DROP TABLE IF EXISTS user_roles CASCADE;
      DROP TABLE IF EXISTS roles CASCADE;
      DROP TABLE IF EXISTS activities CASCADE;
      DROP TABLE IF EXISTS opportunities CASCADE;
      DROP TABLE IF EXISTS leads CASCADE;
      DROP TABLE IF EXISTS contacts CASCADE;
      DROP TABLE IF EXISTS accounts CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      -- Drop triggers if they exist
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
      DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
      DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
      DROP TRIGGER IF EXISTS update_opportunities_updated_at ON opportunities;
      DROP TRIGGER IF EXISTS update_activities_updated_at ON activities;
      DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;

      -- Drop functions if they exist
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `;

    await pool.query(dropTablesSQL);
    console.log('Dropped existing tables and dependencies...');

    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf8');

    // Execute the schema SQL
    await pool.query(schemaSQL);

    console.log('Database schema applied successfully!');

    // Close the connection pool
    await pool.end();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

export default runMigration;
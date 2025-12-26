import { readFileSync } from 'fs';
import path from 'path';
import pool from '../config/database';

async function runMigration() {
  try {
    console.log('Starting database migration for audit logs...');

    // Create audit_logs table
    const createAuditLogsTableSQL = `
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        action VARCHAR(50) NOT NULL, -- 'CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', etc.
        entity VARCHAR(50) NOT NULL, -- 'user', 'account', 'contact', 'lead', 'opportunity', 'activity'
        entity_id UUID,
        old_value JSONB,
        new_value JSONB,
        ip_address INET,
        user_agent TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_entity ON audit_logs(user_id, entity);

      -- Update trigger function
      CREATE OR REPLACE FUNCTION update_audit_logs_timestamp_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.timestamp = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Create trigger for update timestamps
      CREATE TRIGGER update_audit_logs_timestamp 
      BEFORE UPDATE ON audit_logs 
      FOR EACH ROW 
      EXECUTE FUNCTION update_audit_logs_timestamp_column();
    `;
    
    await pool.query(createAuditLogsTableSQL);
    console.log('Created audit_logs table...');

    // Close the connection pool
    await pool.end();
    console.log('Audit logs migration completed successfully!');
  } catch (error) {
    console.error('Error during audit logs migration:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

export default runMigration;
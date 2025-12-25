import pool from './src/config/database';

async function checkTableStructure() {
  try {
    console.log('Checking users table structure...');
    
    // Query to get column information for the users table
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('Users table columns:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    // Close the connection pool
    await pool.end();
  } catch (error) {
    console.error('Error checking table structure:', error);
    process.exit(1);
  }
}

checkTableStructure();
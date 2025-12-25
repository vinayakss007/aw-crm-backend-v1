import pool from './src/config/database';

async function checkTables() {
  try {
    console.log('Checking existing tables in the database...');
    
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Tables in the database:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Close the connection pool
    await pool.end();
  } catch (error) {
    console.error('Error checking tables:', error);
    process.exit(1);
  }
}

checkTables();
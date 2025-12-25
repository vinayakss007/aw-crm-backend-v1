import { Pool } from 'pg';
import config from './config';

// Enhanced database configuration with better connection pooling
const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl ? {
    rejectUnauthorized: false
  } : undefined,
  // Connection pool settings
  max: config.database.maxConnections, // Maximum number of clients in the pool
  min: config.database.minConnections, // Minimum number of clients in the pool
  idleTimeoutMillis: config.database.idleTimeout, // Close idle clients after specified time
  connectionTimeoutMillis: config.database.connectionTimeout, // Return an error after specified time if connection could not be established
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
});

// Log when pool connects to database
pool.on('connect', (client) => {
  if (config.node_env !== 'production') {
    console.log('Connected to database');
  }
});

// Log when pool receives an error
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // In production, we shouldn't exit the process, just log the error
  if (config.node_env === 'production') {
    console.error('Database pool error, keeping process alive for graceful handling');
  } else {
    process.exit(-1); // Exit and let platform restart the process in development
  }
});

// Test database connection in development only
if (config.node_env !== 'production') {
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Database connection error:', err.stack);
    } else {
      console.log('Database connected successfully');
    }
  });
}

export default pool;
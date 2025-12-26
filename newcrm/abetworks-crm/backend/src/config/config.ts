import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' :
                process.env.NODE_ENV === 'staging' ? '.env.staging' :
                '.env.development';

dotenv.config({ path: envFile });

// Fallback to .env if specific environment file doesn't exist
if (!process.env.DATABASE_URL) {
  dotenv.config(); // loads .env
}

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'NODE_ENV'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Environment-specific configurations
const config = {
  port: parseInt(process.env.PORT || '5000'),
  node_env: process.env.NODE_ENV || 'development',

  // Database configuration
  database: {
    url: process.env.DATABASE_URL!,
    ssl: process.env.DATABASE_SSL === 'true',
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
    queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000'),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    minConnections: parseInt(process.env.DB_MIN_CONNECTIONS || '5'),
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET!,
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // Limit each IP to 100 requests per windowMs
    message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    json: process.env.LOG_JSON === 'true',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // Security
  security: {
    helmet: {
      contentSecurityPolicy: process.env.HELMET_CSP !== 'false',
      dnsPrefetchControl: process.env.HELMET_DNS_PREFETCH !== 'false',
      frameguard: process.env.HELMET_FRAMEGUARD !== 'false',
      hidePoweredBy: process.env.HELMET_HIDE_POWERED_BY !== 'false',
      hsts: process.env.HELMET_HSTS !== 'false',
      ieNoOpen: process.env.HELMET_IE_NO_OPEN !== 'false',
      noSniff: process.env.HELMET_NO_SNIFF !== 'false',
      xssFilter: process.env.HELMET_XSS_FILTER !== 'false',
    }
  },

  // MinIO/S3 Configuration
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'minio',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    bucketName: process.env.MINIO_BUCKET || 'abetworks-crm',
  },

  // Health check
  health: {
    checkInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'), // 30 seconds
    maxAge: parseInt(process.env.HEALTH_MAX_AGE || '300000'), // 5 minutes
  }
};

export default config;
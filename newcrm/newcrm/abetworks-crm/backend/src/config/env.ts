// config/env.ts - Validate and export environment variables
const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const JWT_SECRET = getEnvVar('JWT_SECRET');
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
export const JWT_REFRESH_SECRET = getEnvVar('JWT_REFRESH_SECRET');
export const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

// Other environment variables
export const DATABASE_URL = getEnvVar('DATABASE_URL');
export const PORT = process.env.PORT || '5000';
export const NODE_ENV = process.env.NODE_ENV || 'development';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config/config';

// Import routes
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import accountRoutes from './routes/accountRoutes';
import contactRoutes from './routes/contactRoutes';
import leadRoutes from './routes/leadRoutes';
import opportunityRoutes from './routes/opportunityRoutes';
import activityRoutes from './routes/activityRoutes';
import fileRoutes from './routes/fileRoutes';
import customFieldRoutes from './routes/customFieldRoutes';
import dataImportExportRoutes from './routes/dataImportExportRoutes';

// Import health check controller
import { healthCheck, readyCheck } from './controllers/healthController';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler';
import authMiddleware from './middleware/authMiddleware';

// Initialize Express app
const app: Application = express();

// Security middleware with production configurations
app.use(helmet(config.security.helmet));

// CORS with environment-specific origins
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));

app.use(compression());

// Rate limiting with environment-specific configurations
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: config.rateLimit.message,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Body parsing middleware with security limits
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    // Optional: Add additional security checks here
    if (buf.length > 10 * 1024 * 1024) { // 10MB
      // This callback is synchronous and throws an error to stop parsing
      throw new Error('Request body too large');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add security headers
app.use((req, res, next) => {
  // Prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // HSTS
  if (config.node_env === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
});

// API routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to ABETWORKS CRM API',
    version: '1.0.0',
    environment: config.node_env
  });
});

// API versioning - all routes are under v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authMiddleware, userRoutes);
app.use('/api/v1/accounts', authMiddleware, accountRoutes);
app.use('/api/v1/contacts', authMiddleware, contactRoutes);
app.use('/api/v1/leads', authMiddleware, leadRoutes);
app.use('/api/v1/opportunities', authMiddleware, opportunityRoutes);
app.use('/api/v1/activities', authMiddleware, activityRoutes);
app.use('/api/v1/files', authMiddleware, fileRoutes);
app.use('/api/v1/custom-fields', authMiddleware, customFieldRoutes);
app.use('/api/v1/data', authMiddleware, dataImportExportRoutes);

// Legacy routes without versioning (for backward compatibility)
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/accounts', authMiddleware, accountRoutes);
app.use('/api/contacts', authMiddleware, contactRoutes);
app.use('/api/leads', authMiddleware, leadRoutes);
app.use('/api/opportunities', authMiddleware, opportunityRoutes);
app.use('/api/activities', authMiddleware, activityRoutes);
app.use('/api/files', authMiddleware, fileRoutes);
app.use('/api/custom-fields', authMiddleware, customFieldRoutes);
app.use('/api/data', authMiddleware, dataImportExportRoutes);

// Health check endpoints (should be accessible without auth)
app.get('/health', healthCheck);
app.get('/ready', readyCheck);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Get port from environment and store in Express
const port = config.port;

// Server initialization
const server = app.listen(port, () => {
  console.log(`ABETWORKS CRM server running on port ${port} in ${config.node_env} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
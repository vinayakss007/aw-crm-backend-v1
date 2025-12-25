import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import accountRoutes from './routes/accountRoutes';
import contactRoutes from './routes/contactRoutes';
import leadRoutes from './routes/leadRoutes';
import opportunityRoutes from './routes/opportunityRoutes';
import activityRoutes from './routes/activityRoutes';
import fileRoutes from './routes/fileRoutes';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler';
import authMiddleware from './middleware/authMiddleware';

// Initialize Express app
const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to ABETWORKS CRM API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/accounts', authMiddleware, accountRoutes);
app.use('/api/contacts', authMiddleware, contactRoutes);
app.use('/api/leads', authMiddleware, leadRoutes);
app.use('/api/opportunities', authMiddleware, opportunityRoutes);
app.use('/api/activities', authMiddleware, activityRoutes);
app.use('/api/files', authMiddleware, fileRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Get port from environment and store in Express
const port = process.env.PORT || 5000;

// Server initialization
const server = app.listen(port, () => {
  console.log(`ABETWORKS CRM server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});

export default app;
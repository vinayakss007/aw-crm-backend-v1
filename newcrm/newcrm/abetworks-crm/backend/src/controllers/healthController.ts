import { Response } from 'express';
import { AuthRequest } from '../types/express';
import pool from '../config/database';

// Health check endpoint
export const healthCheck = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Test database connection
    const dbStartTime = Date.now();
    await pool.query('SELECT 1');
    const dbResponseTime = Date.now() - dbStartTime;

    // Check if we can access a simple table count
    const userCountResult = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(userCountResult.rows[0].count);

    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: {
        database: `${dbResponseTime}ms`
      },
      checks: {
        database: {
          status: 'connected',
          responseTime: `${dbResponseTime}ms`
        },
        users: {
          count: userCount
        }
      }
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        database: {
          status: 'disconnected'
        }
      }
    };

    res.status(503).json(errorResponse);
  }
};

// Ready check endpoint (similar to health but for kubernetes readiness)
export const readyCheck = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Test database connection
    await pool.query('SELECT 1');

    res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ 
      status: 'not ready', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};
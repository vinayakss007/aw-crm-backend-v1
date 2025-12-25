import { Request, Response, NextFunction } from 'express';

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  
  // Send error response
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
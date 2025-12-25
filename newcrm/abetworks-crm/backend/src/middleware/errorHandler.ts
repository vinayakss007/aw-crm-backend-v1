import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, InternalServerError } from '../utils/errors';

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  let statusCode = 500;
  let message = 'Internal server error';

  // Determine status code and message based on error type
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof AuthenticationError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof AuthorizationError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  } else if (err instanceof ConflictError) {
    statusCode = 409;
    message = err.message;
  } else if (err instanceof InternalServerError) {
    statusCode = 500;
    message = err.message;
  } else {
    // For unknown errors, log them but don't expose internal details
    logger.error(`Unknown error: ${err.message}`, { error: err });
  }

  res.status(statusCode);

  // Send error response
  res.json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
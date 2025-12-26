import { Request } from 'express';
import { User } from './models/UserModel';

// Extend the Express Request type to include user property
export interface AuthRequest extends Request {
  user?: User;
}
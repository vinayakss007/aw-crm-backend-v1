import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { User } from '../models/UserModel';

interface AuthRequest extends Request {
  user?: User;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { id: string };
    
    // Get user from database
    const user = await UserModel.findById(decoded.id);
    
    if (!user || !user.isActive) {
      res.status(401).json({ message: 'Invalid token. User not found or inactive.' });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
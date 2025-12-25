// Use require to bypass TypeScript type checking issues with jsonwebtoken
const jwt = require('jsonwebtoken');

import { JWT_SECRET, JWT_EXPIRE, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRE } from '../config/env';

interface TokenPayload {
  id: string;
  email: string;
}

export const generateToken = (id: string, email: string): string => {
  return jwt.sign(
    { id, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

export const generateRefreshToken = (id: string, email: string): string => {
  return jwt.sign(
    { id, email },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRE }
  );
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};
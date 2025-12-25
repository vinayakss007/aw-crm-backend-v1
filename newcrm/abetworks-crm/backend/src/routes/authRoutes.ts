import { Router } from 'express';
import { register, login, refreshToken } from '../controllers/authController';

const router: Router = Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Refresh token route
router.post('/refresh', refreshToken);

export default router;
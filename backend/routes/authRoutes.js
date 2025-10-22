import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
  ],
  register
);

router.post('/login', login);
router.get('/me', protect, getMe);

export default router;

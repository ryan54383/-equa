import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';

const router = Router();

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

/**
 * @route   POST /api/v1/auth/register
 * @desc    Create a new user account
 * @access  Public
 */
router.post('/register', validate(registerValidation), register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and return token pair
 * @access  Public
 */
router.post('/login', validate(loginValidation), login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get currently authenticated user
 * @access  Private
 */
router.get('/me', authenticate, getMe);

export default router;

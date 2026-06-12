import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { User } from '../models/User';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password } = req.body;
    const result = await registerUser({ name, email, password });
    sendSuccess(res, result, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    sendSuccess(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.user!.sub);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    sendSuccess(res, user.toJSON(), 'Profile fetched');
  } catch (err) {
    next(err);
  }
}

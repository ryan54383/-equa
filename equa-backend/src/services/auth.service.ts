import { User, IUser } from '../models/User';
import { generateTokenPair, TokenPair } from '../utils/jwt';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Record<string, unknown>;
  tokens: TokenPair;
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const { name, email, password } = input;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error('Email already registered') as Error & { statusCode: number };
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, passwordHash: password });

  const tokens = generateTokenPair({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user: user.toJSON() as Record<string, unknown>, tokens };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const { email, password } = input;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

  if (!user) {
    const error = new Error('Invalid email or password') as Error & { statusCode: number };
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Account has been deactivated') as Error & { statusCode: number };
    error.statusCode = 403;
    throw error;
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    const error = new Error('Invalid email or password') as Error & { statusCode: number };
    error.statusCode = 401;
    throw error;
  }

  user.lastLogin = new Date();
  await user.save();

  const tokens = generateTokenPair({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user: user.toJSON() as Record<string, unknown>, tokens };
}

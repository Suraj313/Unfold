import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { findUserByEmail, findUserById, createUser } from '../services/auth.service';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
};

const setAuthCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.issues[0].message });
      return;
    }

    const { name, email, password } = parsed.data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ success: false, message: 'Email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, passwordHash);

    const token = generateToken(user.id);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.issues[0].message });
      return;
    }

    const { email, password } = parsed.data;

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await findUserById(userId);
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User verified',
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const router = Router();

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

async function makeToken(userId: string, name: string, email: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await new SignJWT({ userId, name, email, expiresAt: expiresAt.toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  return { token, expiresAt };
}

const SignupSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(80),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

router.post('/signup', async (req: Request, res: Response) => {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: 'An account with this email already exists.' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

  const { token, expiresAt } = await makeToken(user.id, user.name, user.email);
  res.status(201).json({ token, expiresAt, user: { id: user.id, name: user.name, email: user.email } });
});

router.post('/login', async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const { token, expiresAt } = await makeToken(user.id, user.name, user.email);
  res.json({ token, expiresAt, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;

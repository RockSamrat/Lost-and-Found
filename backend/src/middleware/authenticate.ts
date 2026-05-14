import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

export interface AuthRequest extends Request {
  userId?: string;
}

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = header.slice(7);
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
    req.userId = payload.userId as string;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired session' });
  }
}

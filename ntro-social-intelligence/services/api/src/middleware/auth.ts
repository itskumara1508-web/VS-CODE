import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import type { UserRole } from '@ntro/types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
      issuer: config.tokenIssuer,
    },
  );
}

export function verifyToken(token: string): AuthUser {
  const payload = jwt.verify(token, config.jwtSecret, {
    issuer: config.tokenIssuer,
  }) as jwt.JwtPayload & { sub: string; email: string; name: string; role: UserRole };
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}

/** Require a valid Bearer token. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'unauthorized',
      message: 'Missing or invalid authorization header.',
      code: 401,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({
      error: 'unauthorized',
      message: 'Invalid or expired token.',
      code: 401,
      timestamp: new Date().toISOString(),
    });
  }
}

/** Require a specific role. */
export function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({
        error: 'forbidden',
        message: `Requires ${role} role.`,
        code: 403,
        timestamp: new Date().toISOString(),
      });
      return;
    }
    next();
  };
}

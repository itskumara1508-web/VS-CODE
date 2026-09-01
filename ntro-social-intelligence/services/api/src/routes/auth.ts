import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { config } from '../config.js';

/** Demo users (password-hash generated at boot). */
const users = [
  {
    id: 'u_admin',
    email: 'admin@ntro.gov.in',
    name: 'System Administrator',
    role: 'administrator' as const,
    password: 'Admin@123',
  },
  {
    id: 'u_analyst',
    email: 'analyst@ntro.gov.in',
    name: 'Lead Analyst',
    role: 'analyst' as const,
    password: 'Analyst@123',
  },
];

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authRouter = Router();

// Memoized bcrypt hashes for the seeded demo users.
const passwordHashes = new Map<string, string>();

async function getPasswordHash(user: { id: string; password: string }): Promise<string> {
  const existing = passwordHashes.get(user.id);
  if (existing) return existing;
  const hash = await bcrypt.hash(user.password, config.bcryptRounds);
  passwordHashes.set(user.id, hash);
  return hash;
}

authRouter.post('/login', validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    res.status(401).json({
      error: 'invalid_credentials',
      message: 'Invalid email or password.',
      code: 401,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  const hash = await getPasswordHash(user);
  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    res.status(401).json({
      error: 'invalid_credentials',
      message: 'Invalid email or password.',
      code: 401,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  const authUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  const token = signToken(authUser);
  res.json({
    token,
    user: authUser,
    expiresIn: config.jwtExpiresIn,
  });
});

authRouter.post('/register', validateBody(loginSchema), async (req, res) => {
  // Placeholder for a future registration flow. For the SIH prototype we
  // keep auth simple with the seeded accounts.
  res.status(501).json({
    error: 'not_implemented',
    message: 'Registration is not enabled for the prototype. Use the seeded demo accounts.',
    code: 501,
    timestamp: new Date().toISOString(),
  });
});

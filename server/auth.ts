import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dhruba-power-production-secret-key-2026-secure';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  company?: string;
  phone?: string;
  role: 'customer' | 'admin' | 'engineer';
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(calculated, 'hex'), Buffer.from(hash, 'hex'));
}

export function generateToken(payload: AuthUser): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      fullName: payload.fullName,
      company: payload.company,
      phone: payload.phone,
      role: payload.role
    };
  } catch {
    return null;
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const user = verifyToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const token = authHeader.slice(7);
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Session expired or invalid token.' });
    return;
  }

  req.user = user;
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Staff authentication required.' });
    return;
  }

  const token = authHeader.slice(7);
  const user = verifyToken(token);
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Restricted to authorized engineering administrators.' });
    return;
  }

  req.user = user;
  next();
}

// Controller Handlers
export async function registerHandler(req: Request, res: Response) {
  try {
    const { email, password, fullName, company, phone } = req.body;
    if (!email || !password || !fullName) {
      res.status(400).json({ error: 'Email, password, and full name are required.' });
      return;
    }

    // Input validation: email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid corporate email address.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    // Enforce role: PUBLIC SIGNUP CANNOT CREATE ADMINS
    const safeRole = 'customer';

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const salt = crypto.randomBytes(32).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO users (email, password_hash, salt, full_name, company, phone, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = insert.run(
      email.toLowerCase().trim(),
      passwordHash,
      salt,
      fullName.trim(),
      company?.trim() || null,
      phone?.trim() || null,
      safeRole,
      now,
      now
    );

    const user: AuthUser = {
      id: Number(result.lastInsertRowid),
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      company: company?.trim(),
      phone: phone?.trim(),
      role: 'customer'
    };

    const token = generateToken(user);
    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user
    });
  } catch (err: any) {
    console.error('[Auth Error]', err);
    res.status(500).json({ error: 'An unexpected authentication error occurred.' });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const userRow = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim()) as any;
    if (!userRow) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const valid = verifyPassword(password, userRow.password_hash, userRow.salt);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const user: AuthUser = {
      id: userRow.id,
      email: userRow.email,
      fullName: userRow.full_name,
      company: userRow.company || undefined,
      phone: userRow.phone || undefined,
      role: userRow.role
    };

    const token = generateToken(user);
    res.json({
      message: 'Login successful.',
      token,
      user
    });
  } catch (err: any) {
    console.error('[Auth Login Error]', err);
    res.status(500).json({ error: 'An internal error occurred during login.' });
  }
}

export async function staffPasscodeLogin(req: Request, res: Response) {
  try {
    const { passcode } = req.body;
    if (!passcode) {
      res.status(400).json({ error: 'Staff authorization key is required.' });
      return;
    }

    const adminUser = db.prepare("SELECT * FROM users WHERE role = 'admin' LIMIT 1").get() as any;
    if (!adminUser) {
      res.status(500).json({ error: 'System administrator account not initialized.' });
      return;
    }

    // Verify passcode against admin user hash
    const valid = verifyPassword(passcode, adminUser.password_hash, adminUser.salt);
    if (!valid) {
      res.status(401).json({ error: 'Invalid engineering staff credential.' });
      return;
    }

    const user: AuthUser = {
      id: adminUser.id,
      email: adminUser.email,
      fullName: adminUser.full_name,
      company: adminUser.company,
      phone: adminUser.phone,
      role: 'admin'
    };

    const token = generateToken(user);
    res.json({
      message: 'Staff session authenticated.',
      token,
      user
    });
  } catch (err: any) {
    console.error('[Staff Login Error]', err);
    res.status(500).json({ error: 'Staff authentication error.' });
  }
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required.' });
      return;
    }

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim()) as any;
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hr
      db.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?').run(
        resetToken,
        expiry,
        user.id
      );
      // In production, would send real email. Return status ok without leaking whether account exists
    }

    res.json({
      message: 'If the corporate email is registered, password reset instructions have been dispatched.'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Could not process password reset request.' });
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    const { email, resetToken, newPassword } = req.body;
    if (!email || !resetToken || !newPassword) {
      res.status(400).json({ error: 'Email, reset token, and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ? AND reset_token = ?').get(
      email.toLowerCase().trim(),
      resetToken
    ) as any;

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired password reset token.' });
      return;
    }

    if (user.reset_token_expiry && new Date(user.reset_token_expiry).getTime() < Date.now()) {
      res.status(400).json({ error: 'Reset token has expired.' });
      return;
    }

    const salt = crypto.randomBytes(32).toString('hex');
    const hash = hashPassword(newPassword, salt);
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE users SET password_hash = ?, salt = ?, reset_token = NULL, reset_token_expiry = NULL, updated_at = ?
      WHERE id = ?
    `).run(hash, salt, now, user.id);

    res.json({ message: 'Password has been updated securely. You may now log in.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reset password.' });
  }
}

export async function meHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  res.json({ user: req.user });
}

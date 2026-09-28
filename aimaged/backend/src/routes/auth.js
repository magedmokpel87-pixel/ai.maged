const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../config/db');

const router = express.Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().optional(),
});

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function publicUser(user) {
  return { id: user.id, email: user.email, role: user.role, fullName: user.fullName };
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const data = credentialsSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { email: data.email, passwordHash, fullName: data.fullName, provider: 'local' },
    });

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = credentialsSchema.omit({ fullName: true }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/oauth
// Body: { provider: 'google' | 'facebook', idToken }
// NOTE: verify idToken with the provider's SDK before trusting the payload in production.
router.post('/oauth', async (req, res, next) => {
  try {
    const { provider, email, providerId, fullName } = req.body;
    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ error: 'Unsupported provider' });
    }
    if (!email || !providerId) {
      return res.status(400).json({ error: 'Missing verified provider payload' });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, provider, providerId, fullName },
      });
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

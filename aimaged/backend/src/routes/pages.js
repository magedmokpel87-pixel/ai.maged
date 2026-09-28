const express = require('express');
const { z } = require('zod');
const prisma = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/pages/:key?locale=ar|en  -> page copy for the public site
router.get('/:key', async (req, res, next) => {
  try {
    const locale = req.query.locale === 'en' ? 'en' : 'ar';
    const page = await prisma.pageContent.findUnique({
      where: { key_locale: { key: req.params.key, locale } },
    });
    if (!page) return res.status(404).json({ error: 'Page content not found' });
    res.json(page);
  } catch (err) {
    next(err);
  }
});

const pageSchema = z.object({
  title: z.string().min(1),
  locale: z.enum(['ar', 'en']),
  body: z.record(z.string()),
});

// Admin: all stored keys (for the editor's dropdown)
router.get('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const pages = await prisma.pageContent.findMany({ orderBy: [{ key: 'asc' }, { locale: 'asc' }] });
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

// PUT /api/pages/:key  -> upsert one locale's copy
router.put('/:key', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const data = pageSchema.parse(req.body);
    const page = await prisma.pageContent.upsert({
      where: { key_locale: { key: req.params.key, locale: data.locale } },
      update: { title: data.title, body: data.body },
      create: { key: req.params.key, locale: data.locale, title: data.title, body: data.body },
    });
    res.json(page);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

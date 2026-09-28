const express = require('express');
const { z } = require('zod');
const prisma = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const PLACEMENTS = ['home_top', 'home_bottom', 'product_page'];

// GET /api/ads?placement=home_top  -> public, active + currently in-window only
router.get('/', async (req, res, next) => {
  try {
    const { placement } = req.query;
    const now = new Date();
    const ads = await prisma.ad.findMany({
      where: {
        active: true,
        ...(placement ? { placement: String(placement) } : {}),
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(ads);
  } catch (err) {
    next(err);
  }
});

const adSchema = z.object({
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  bodyAr: z.string().default(''),
  bodyEn: z.string().default(''),
  imageUrl: z.string().url().optional().nullable(),
  linkUrl: z.string().url().optional().nullable(),
  placement: z.enum(PLACEMENTS).default('home_top'),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
});

// Admin: full list including inactive
router.get('/all', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const ads = await prisma.ad.findMany({ orderBy: [{ placement: 'asc' }, { sortOrder: 'asc' }] });
    res.json(ads);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const ad = await prisma.ad.create({ data: adSchema.parse(req.body) });
    res.status(201).json(ad);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const ad = await prisma.ad.update({ where: { id: req.params.id }, data: adSchema.partial().parse(req.body) });
    res.json(ad);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    await prisma.ad.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

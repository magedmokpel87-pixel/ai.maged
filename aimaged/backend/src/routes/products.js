const express = require('express');
const { z } = require('zod');
const prisma = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/products?search=&kind=book|course|product
router.get('/', async (req, res, next) => {
  try {
    const { search, kind } = req.query;
    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(kind ? { kind: String(kind) } : {}),
        ...(search
          ? {
              OR: [
                { titleAr: { contains: String(search), mode: 'insensitive' } },
                { titleEn: { contains: String(search), mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/all  (admin: includes inactive)
router.get('/all', requireAuth, requireRole('admin', 'affiliate_manager'), async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id  (product page: images, video, description, buy link)
router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

const productSchema = z.object({
  kind: z.enum(['book', 'course', 'product']).default('book'),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  price: z.number().min(0),
  currency: z.string().default('USD'),
  images: z.array(z.string()).default([]), // uploaded /uploads/... paths or remote URLs
  videoUrl: z.string().url().optional().nullable(),
  affiliateUrl: z.string().url().optional().nullable(),
  sourceApi: z.string().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

// POST /api/products (admin only - normally called by an n8n workflow after AI/SEO processing)
router.post('/', requireAuth, requireRole('admin', 'affiliate_manager'), async (req, res, next) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({ data });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, requireRole('admin', 'affiliate_manager'), async (req, res, next) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const product = await prisma.product.update({ where: { id: req.params.id }, data });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { active: false } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

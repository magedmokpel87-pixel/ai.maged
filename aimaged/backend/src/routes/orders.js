const express = require('express');
const { z } = require('zod');
const prisma = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive().default(1),
      })
    )
    .min(1),
});

// POST /api/orders - "صفحة إدخال بيانات الشراء"
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { items } = checkoutSchema.parse(req.body);

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) }, active: true },
    });
    if (products.length !== items.length) {
      return res.status(400).json({ error: 'One or more products are unavailable' });
    }

    const total = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + Number(product.price) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.user.sub,
        totalAmount: total,
        status: 'pending',
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return { productId: item.productId, quantity: item.quantity, price: product.price };
          }),
        },
      },
      include: { items: true },
    });

    // In production: redirect user to the affiliate purchase link(s) and/or a payment gateway here.
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.sub },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

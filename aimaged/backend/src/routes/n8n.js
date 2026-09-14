const express = require('express');
const axios = require('axios');
const { z } = require('zod');
const prisma = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const triggerSchema = z.object({
  workflowName: z.string().min(1), // e.g. "analyze-product"
  payload: z.record(z.any()).default({}),
});

// POST /api/n8n/trigger
// Backend does NOT call AI directly here - it asks n8n to run a workflow,
// and n8n internally orchestrates AI / Affiliate APIs / SEO steps, then
// calls back into Backend's API to persist results (see /api/n8n/callback).
router.post('/trigger', requireAuth, requireRole('admin', 'affiliate_manager'), async (req, res, next) => {
  try {
    const { workflowName, payload } = triggerSchema.parse(req.body);

    const run = await prisma.workflowRun.create({
      data: { workflowName, status: 'triggered', payload },
    });

    const webhookUrl = `${process.env.N8N_BASE_URL}/webhook/${workflowName}`;
    await axios.post(
      webhookUrl,
      { runId: run.id, ...payload },
      { headers: { 'x-n8n-api-key': process.env.N8N_API_KEY } }
    );

    res.status(202).json({ runId: run.id, status: 'triggered' });
  } catch (err) {
    next(err);
  }
});

// POST /api/n8n/callback
// n8n calls this once a workflow finishes, to persist the result back
// through Backend (keeps business logic/permissions/validation in Backend).
router.post('/callback', async (req, res, next) => {
  try {
    const apiKey = req.headers['x-n8n-api-key'];
    if (apiKey !== process.env.N8N_API_KEY) return res.status(401).json({ error: 'Unauthorized' });

    const { runId, status, result } = req.body;
    const run = await prisma.workflowRun.update({
      where: { id: runId },
      data: { status: status || 'success', result },
    });

    res.json({ ok: true, run });
  } catch (err) {
    next(err);
  }
});

router.get('/runs/:id', requireAuth, requireRole('admin', 'affiliate_manager'), async (req, res, next) => {
  try {
    const run = await prisma.workflowRun.findUnique({ where: { id: req.params.id } });
    if (!run) return res.status(404).json({ error: 'Not found' });
    res.json(run);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

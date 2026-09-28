const path = require('path');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const n8nRoutes = require('./routes/n8n');
const adRoutes = require('./routes/ads');
const pageRoutes = require('./routes/pages');
const uploadRoutes = require('./routes/uploads');

const app = express();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));
app.use('/uploads', express.static(UPLOAD_DIR));

// Basic rate limiting - protects Auth + n8n trigger endpoints
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'aimaged-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/n8n', n8nRoutes); // Backend -> n8n orchestration trigger (per approved architecture)

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`AI.MAGED backend running on port ${PORT}`));

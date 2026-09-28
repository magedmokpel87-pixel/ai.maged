const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { requireAuth, requireRole } = require('../middleware/auth');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = ALLOWED[file.mimetype] || '.bin';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    ALLOWED[file.mimetype] ? cb(null, true) : cb(new Error('Unsupported file type')),
});

const router = express.Router();

// POST /api/uploads  (multipart/form-data, field "file") -> { url }
router.post('/', requireAuth, requireRole('admin', 'affiliate_manager'), (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    res.status(201).json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
  });
});

// DELETE /api/uploads/:filename  (filename is server-generated, no traversal risk)
router.delete('/:filename', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const safe = path.basename(req.params.filename);
    fs.unlinkSync(path.join(UPLOAD_DIR, safe));
    res.status(204).send();
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).json({ error: 'File not found' });
    next(err);
  }
});

// Static serving for uploaded assets
router.staticServe = express.static(UPLOAD_DIR, { maxAge: '7d', fallthrough: false });

module.exports = router;

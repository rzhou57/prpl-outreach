const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Kinder-Blockly Proxy (must be before body parsers) ──────────────────────
const kinderBlocklyPageProxy = createProxyMiddleware({
  target: 'http://34.123.247.112:5000',
  changeOrigin: true,
  pathRewrite: { '^/blockly': '/' },
});
const kinderBlocklyApiProxy = createProxyMiddleware({
  target: 'http://34.123.247.112:5000',
  changeOrigin: true,
  proxyTimeout: 60000,
  timeout: 60000,
});
app.use((req, res, next) => {
  const p = req.path;
  if (p === '/blockly' || p.startsWith('/blockly/')) return kinderBlocklyPageProxy(req, res, next);
  if (p === '/reset' || p === '/run' || p === '/score' || p.startsWith('/static') || p.startsWith('/challenges')) return kinderBlocklyApiProxy(req, res, next);
  next();
});

// ─── HTTPS Redirect ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
});

// ─── HSTS Header ──────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PRPL outreach API is running' });
});

// ─── SPA fallback ────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 PRPL outreach server running on http://localhost:${PORT}`);
});

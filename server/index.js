const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { generateCode, sendVerificationEmail, sendPasswordResetEmail } = require('./email');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'robotics_secret_change_in_prod';
const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_WAIT_MS = 30 * 1000;

//console.log("DATABASE_URL =", process.env.DATABASE_URL); DONT PRINT THIS OR OUR CLOUD KEY GETS LEAKED IN TERMINAL

// ─── Validation ───────────────────────────────────────────────────────────────
const VALID_GRADE_LEVELS = [
  '1st Grade','2nd Grade','3rd Grade','4th Grade','5th Grade',
  '6th Grade','7th Grade','8th Grade','9th Grade',
];
const VALID_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX  = /^[a-zA-Z\s'\-]{1,30}$/;
const TOWN_REGEX  = /^[a-zA-Z\s'\-\.]{1,30}$/;

function validateSignup({ firstName, lastName, age, gradeLevel, town, state, email, password }) {
  if (!firstName || firstName.length > 30)    return 'First name must be 1–30 characters.';
  if (!NAME_REGEX.test(firstName))             return 'First name contains invalid characters.';
  if (!lastName || lastName.length > 30)       return 'Last name must be 1–30 characters.';
  if (!NAME_REGEX.test(lastName))              return 'Last name contains invalid characters.';
  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 99) return 'Age must be a number between 1 and 99.';
  if (!VALID_GRADE_LEVELS.includes(gradeLevel))    return 'Invalid grade level.';
  if (!town || town.length > 30)               return 'Town must be 1–30 characters.';
  if (!TOWN_REGEX.test(town))                  return 'Town contains invalid characters.';
  if (!VALID_STATES.includes(state))           return 'Invalid state.';
  if (!email || email.length > 30)             return 'Email must be 30 characters or fewer.';
  if (!EMAIL_REGEX.test(email))                return 'Invalid email address.';
  if (typeof password !== 'string' || password.length < 8) return 'Password must be at least 8 characters.';
  if (password.length > 30)                    return 'Password must be 30 characters or fewer.';
  return null;
}

// ─── Kinder-Blockly Proxy (must be before body parsers) ──────────────────────
const kinderBlocklyPageProxy = createProxyMiddleware({
  target: 'http://127.0.0.1:5000',
  changeOrigin: true,
  pathRewrite: { '^/blockly': '/' },
});
const kinderBlocklyApiProxy = createProxyMiddleware({
  target: 'http://127.0.0.1:5000',
  changeOrigin: true,
  proxyTimeout: 60000,
  timeout: 60000,
});
app.use((req, res, next) => {
  const p = req.path;
  if (p === '/blockly' || p.startsWith('/blockly/')) return kinderBlocklyPageProxy(req, res, next);
  if (p === '/reset' || p === '/run' || p.startsWith('/static')) return kinderBlocklyApiProxy(req, res, next);
  next();
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PRPL outreach API is running' });
});

// ─── SIGN UP ──────────────────────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  const { firstName, lastName, age, gradeLevel, town, state, email, password, termsAccepted } = req.body;

  if (!firstName || !lastName || !age || !gradeLevel || !town || !state || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' });
  if (!termsAccepted)
    return res.status(400).json({ error: 'You must accept the terms and conditions.' });

  const validationError = validateSignup({ firstName, lastName, age, gradeLevel, town, state, email, password });
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const existing = await prisma.student.findUnique({ where: { email: email.toLowerCase() } });

    if (existing && existing.isVerified)
      return res.status(409).json({ error: 'An account with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const code = generateCode();
    const now = new Date();

    if (existing) {
      if (existing.verifyCodeSentAt && (now - existing.verifyCodeSentAt) < RESEND_WAIT_MS) {
        const wait = Math.ceil((RESEND_WAIT_MS - (now - existing.verifyCodeSentAt)) / 1000);
        return res.status(429).json({ error: `Please wait ${wait}s before requesting a new code.` });
      }
      await prisma.student.update({
        where: { email: email.toLowerCase() },
        data: {
          firstName, lastName, age: parseInt(age), gradeLevel, town, state,
          passwordHash, termsAccepted,
          verifyCode: code,
          verifyCodeExpiresAt: new Date(now.getTime() + CODE_TTL_MS),
          verifyCodeSentAt: now,
        },
      });
    } else {
      await prisma.student.create({
        data: {
          firstName, lastName, age: parseInt(age), gradeLevel, town, state,
          email: email.toLowerCase(),
          passwordHash, termsAccepted,
          isVerified: false,
          verifyCode: code,
          verifyCodeExpiresAt: new Date(now.getTime() + CODE_TTL_MS),
          verifyCodeSentAt: now,
        },
      });
    }

    console.log(`Sending verification email to ${email} with code ${code}`);
    await sendVerificationEmail(email.toLowerCase(), firstName, code);

    res.status(201).json({
      message: `Verification code sent to ${email}. Check your inbox!`,
      email: email.toLowerCase(),
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
});

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────
app.post('/api/auth/verify', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required.' });
  if (!EMAIL_REGEX.test(email)) return res.status(400).json({ error: 'Invalid email address.' });
  if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'Invalid code format.' });

  try {
    const student = await prisma.student.findUnique({ where: { email: email.toLowerCase() } });
    if (!student) return res.status(404).json({ error: 'Account not found.' });
    if (student.isVerified) return res.status(400).json({ error: 'Account is already verified.' });
    if (!student.verifyCode || student.verifyCode !== code)
      return res.status(400).json({ error: 'Invalid verification code.' });
    if (new Date() > student.verifyCodeExpiresAt)
      return res.status(400).json({ error: 'Code expired. Please request a new one.' });

    const verified = await prisma.student.update({
      where: { email: email.toLowerCase() },
      data: { isVerified: true, verifyCode: null, verifyCodeExpiresAt: null, verifyCodeSentAt: null },
    });

    const token = jwt.sign(
      { id: verified.id, email: verified.email, name: verified.firstName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: `Welcome to PRPL Robotics, ${verified.firstName}!`,
      token,
      user: {
        id: verified.id,
        firstName: verified.firstName,
        lastName: verified.lastName,
        email: verified.email,
        gradeLevel: verified.gradeLevel,
        town: verified.town,
        state: verified.state,
      },
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── RESEND VERIFY CODE ───────────────────────────────────────────────────────
app.post('/api/auth/resend-verify', async (req, res) => {
  const { email } = req.body;
  if (!email || !EMAIL_REGEX.test(email)) return res.status(400).json({ error: 'Valid email is required.' });

  try {
    const student = await prisma.student.findUnique({ where: { email: email.toLowerCase() } });
    if (!student) return res.status(404).json({ error: 'Account not found.' });
    if (student.isVerified) return res.status(400).json({ error: 'Account is already verified.' });

    const now = new Date();
    if (student.verifyCodeSentAt && (now - student.verifyCodeSentAt) < RESEND_WAIT_MS) {
      const wait = Math.ceil((RESEND_WAIT_MS - (now - student.verifyCodeSentAt)) / 1000);
      return res.status(429).json({ error: `Please wait ${wait}s before resending.`, wait });
    }

    const code = generateCode();
    await prisma.student.update({
      where: { email: email.toLowerCase() },
      data: {
        verifyCode: code,
        verifyCodeExpiresAt: new Date(now.getTime() + CODE_TTL_MS),
        verifyCodeSentAt: now,
      },
    });

    await sendVerificationEmail(email.toLowerCase(), student.firstName, code);
    res.json({ message: 'Verification code resent!' });
  } catch (err) {
    console.error('Resend verify error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  if (!EMAIL_REGEX.test(email) || email.length > 30) return res.status(400).json({ error: 'Invalid email address.' });
  if (typeof password !== 'string' || password.length > 30)
    return res.status(400).json({ error: 'Invalid password.' });

  try {
    const student = await prisma.student.findUnique({ where: { email: email.toLowerCase() } });
    if (!student) return res.status(401).json({ error: 'Invalid email or password.' });

    const passwordMatch = await bcrypt.compare(password, student.passwordHash);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid email or password.' });

    if (!student.isVerified)
      return res.status(403).json({
        error: 'Please verify your email before logging in.',
        needsVerification: true,
        email: student.email,
      });

    const token = jwt.sign(
      { id: student.id, email: student.email, name: student.firstName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: `Welcome back, ${student.firstName}!`,
      token,
      user: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        gradeLevel: student.gradeLevel,
        town: student.town,
        state: student.state,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email || !EMAIL_REGEX.test(email) || email.length > 30)
    return res.status(400).json({ error: 'Valid email is required.' });

  try {
    const student = await prisma.student.findUnique({ where: { email: email.toLowerCase() } });

    if (!student || !student.isVerified)
      return res.json({ message: 'If that email exists, a reset code has been sent.' });

    const now = new Date();
    if (student.resetCodeSentAt && (now - student.resetCodeSentAt) < RESEND_WAIT_MS) {
      const wait = Math.ceil((RESEND_WAIT_MS - (now - student.resetCodeSentAt)) / 1000);
      return res.status(429).json({ error: `Please wait ${wait}s before requesting another code.`, wait });
    }

    const code = generateCode();
    await prisma.student.update({
      where: { email: email.toLowerCase() },
      data: {
        resetCode: code,
        resetCodeExpiresAt: new Date(now.getTime() + CODE_TTL_MS),
        resetCodeSentAt: now,
      },
    });

    await sendPasswordResetEmail(email.toLowerCase(), student.firstName, code);
    res.json({ message: 'If that email exists, a reset code has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ error: 'All fields are required.' });
  if (!EMAIL_REGEX.test(email) || email.length > 30)
    return res.status(400).json({ error: 'Invalid email address.' });
  if (!/^\d{6}$/.test(code))
    return res.status(400).json({ error: 'Invalid code format.' });
  if (typeof newPassword !== 'string' || newPassword.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  if (newPassword.length > 30)
    return res.status(400).json({ error: 'Password must be 30 characters or fewer.' });

  try {
    const student = await prisma.student.findUnique({ where: { email: email.toLowerCase() } });
    if (!student) return res.status(404).json({ error: 'Account not found.' });
    if (!student.resetCode || student.resetCode !== code)
      return res.status(400).json({ error: 'Invalid reset code.' });
    if (new Date() > student.resetCodeExpiresAt)
      return res.status(400).json({ error: 'Reset code expired. Please request a new one.' });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.student.update({
      where: { email: email.toLowerCase() },
      data: { passwordHash, resetCode: null, resetCodeExpiresAt: null, resetCodeSentAt: null },
    });

    res.json({ message: 'Password reset successfully! You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── GET ME ───────────────────────────────────────────────────────────────────
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, firstName: true, lastName: true,
        email: true, gradeLevel: true, town: true, state: true, createdAt: true,
      },
    });
    if (!student) return res.status(404).json({ error: 'User not found.' });
    res.json(student);
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 PRPL outreach server running on http://localhost:${PORT}`);
});
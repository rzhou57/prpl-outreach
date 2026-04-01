const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { generateCode, sendVerificationEmail, sendPasswordResetEmail } = require('./email');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'robotics_secret_change_in_prod';
const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_WAIT_MS = 30 * 1000;

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RoboLeague API is running' });
});

// SIGN UP
app.post('/api/auth/signup', async (req, res) => {
  const { firstName, lastName, age, gradeLevel, town, state, email, password, termsAccepted } = req.body;

  if (!firstName || !lastName || !age || !gradeLevel || !town || !state || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' });
  if (!termsAccepted)
    return res.status(400).json({ error: 'You must accept the terms and conditions.' });
  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });

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
          firstName, lastName, age, gradeLevel, town, state, passwordHash, termsAccepted,
          verifyCode: code,
          verifyCodeExpiresAt: new Date(now.getTime() + CODE_TTL_MS),
          verifyCodeSentAt: now,
        },
      });
    } else {
      await prisma.student.create({
        data: {
          firstName, lastName, age, gradeLevel, town, state,
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

// VERIFY EMAIL
app.post('/api/auth/verify', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required.' });

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

// RESEND VERIFY CODE
app.post('/api/auth/resend-verify', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

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

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

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

// FORGOT PASSWORD
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

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

// RESET PASSWORD
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ error: 'All fields are required.' });
  if (newPassword.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });

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

// GET ME
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

app.listen(PORT, () => {
  console.log(`PRPL outreach server running on http://localhost:${PORT}`);
});
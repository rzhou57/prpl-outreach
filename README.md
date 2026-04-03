# 🤖 PRPL Outreach — School Outreach Registration Portal

A full-stack web app for Princeton's PRPL Lab middle school robotics outreach program.  
**Stack:** React (Vite) + Node/Express + PostgreSQL (Neon cloud) + Prisma

#### For any inquiries for general web app inquiries, message Tomasz
---

## First Time Setup

### 1. Clone the repo and install dependencies

```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```


---

### 3. Create your `.env` file

Create a file called `.env` inside the `server/` folder. It is **never committed to git** — each developer makes their own.

```env
PORT=3001
DATABASE_URL=

JWT_SECRET=any_long_random_string_you_make_up

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

CLIENT_URL=http://localhost:5173
```

**Getting each value:**
- `DATABASE_URL` — ask Tomasz for url privately
- `JWT_SECRET` — make up any long random string, e.g. `prpl_secret_xk29smq482`
- `SMTP_USER` / `SMTP_PASS` — You guys don't have to worry about this. I'll be maintaining this. For testing purposes, I have a verified test account setup in the cloud to use for logins (ask me for this)

---


### 3. Set up the database (Neon — no local Postgres needed)

The database lives in the cloud on [Neon](https://neon.tech) — you do **not** need to install Postgres locally. Anyone running this project just needs the connection string.

Once your `.env` is set up, run the Prisma generation to create the tables:

Then generate the Prisma client:

```bash
./node_modules/.bin/prisma generate
```
---
### 4. Run the app

You need **two terminals open at the same time.**

**Terminal 1 — Backend:**
```bash
cd server
node index.js
# Runs at http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs at http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---


## Prisma Schema

Located at `server/prisma/schema.prisma`. If you ever modify this file, run:

```bash
cd server
./node_modules/.bin/prisma migrate dev --name describe_your_change
./node_modules/.bin/prisma generate
```

Current schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Student {
  id                  Int       @id @default(autoincrement())
  firstName           String
  lastName            String
  age                 Int
  gradeLevel          String
  town                String
  state               String
  email               String    @unique
  passwordHash        String
  termsAccepted       Boolean   @default(false)

  // Email verification
  isVerified          Boolean   @default(false)
  verifyCode          String?
  verifyCodeExpiresAt DateTime?
  verifyCodeSentAt    DateTime?

  // Password reset
  resetCode           String?
  resetCodeExpiresAt  DateTime?
  resetCodeSentAt     DateTime?

  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/signup` | Register a new student (sends verification email) |
| POST | `/api/auth/verify` | Submit 6-digit verification code |
| POST | `/api/auth/resend-verify` | Resend verification code (30s cooldown) |
| POST | `/api/auth/login` | Log in with email + password |
| POST | `/api/auth/forgot-password` | Send password reset code to email |
| POST | `/api/auth/reset-password` | Submit reset code + new password |
| GET | `/api/auth/me` | Get current user info (requires JWT) |

---

## Current Features (as of 4/1/2026)

- Landing page with animated robot in kitchen scene
- Sign up / Log in with tabbed auth page
- Email verification with 6-digit code (10 min expiry, 30s resend cooldown)
- Forgot password flow with emailed reset code
- Terms & Conditions modal
- Dashboard placeholder
- Input validation on both frontend and backend
- Passwords hashed with bcrypt (never stored plain)
- JWT session tokens (7 day expiry)
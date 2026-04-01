# 🤖 PRPL Outreach — School Outreach Registration Portal

A full-stack web app for a middle school robotics outreach program.  
**Stack:** React (Vite) + Node/Express + PostgreSQL (w/ Prisma Wrapper)

---


## Quick Start

# /server .env format 
```bash
PORT=
DATABASE_URL=
JWT_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### Install Dependencies

```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### Run the App

**Terminal 1 — Backend:**
```bash
cd server
node index.js
# Server runs at http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App runs at http://localhost:5173
```

## Prisma Scheme (to generate)
```bash
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
} ```bash


Open **http://localhost:5173** in your browser.

## Current Features (as of 4/1/2026)
-  Landing Page
-  Signup / Login Page
-  Terms and Services Modal
-  Dashboard Placeholder
-  Email verification + Reset Password
-  Various frontend + Backdoor Protections for Signup
# 🤖 PRPL Outreach — School Outreach Registration Portal

A full-stack web app for a middle school robotics outreach program.  
**Stack:** React (Vite) + Node/Express + PostgreSQL (+ Prisma Wrapper)

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

Open **http://localhost:5173** in your browser.

## Current Features (as of 4/1/2026)
-  Landing Page
-  Signup / Login Page
-  Terms and Services Modal
-  Dashboard Placeholder
-  Email verification + Reset Password

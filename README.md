# 🤖 RoboLeague — School Outreach Registration Portal

A full-stack web app for a middle school robotics outreach program.  
**Stack:** React (Vite) + Node/Express + PostgreSQL

---

## 📁 Project Structure

```
robotics-app/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── App.jsx
│       ├── AuthContext.jsx
│       ├── api.js
│       └── components/
│           ├── Landing.jsx        # Home/landing page
│           ├── Landing.module.css
│           ├── AuthPage.jsx       # Login + Signup tabs
│           ├── AuthPage.module.css
│           ├── TermsModal.jsx     # T&C popup
│           ├── TermsModal.module.css
│           ├── Dashboard.jsx      # Post-login view
│           └── Dashboard.module.css
└── server/          # Express backend
    ├── index.js     # Main server + all API routes
    ├── db.js        # PostgreSQL connection pool
    ├── schema.sql   # Database setup
    └── .env.example
```

---

## 🚀 Quick Start

### 1. Set Up PostgreSQL Database

Make sure PostgreSQL is installed and running, then:

```bash
psql -U postgres -f server/schema.sql
```

This creates the `robotics_outreach` database and `students` table.

### 2. Configure Environment Variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=robotics_outreach
DB_USER=postgres
DB_PASSWORD=your_actual_password
JWT_SECRET=some_long_random_secret_string
```

### 3. Install Dependencies

```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 4. Run the App

**Terminal 1 — Backend:**
```bash
cd server
npm start
# Server runs at http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App runs at http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🗄️ Database Schema

```sql
students (
  id              SERIAL PRIMARY KEY,
  first_name      VARCHAR(100),
  last_name       VARCHAR(100),
  age             INTEGER (10–20),
  grade_level     VARCHAR(20),
  town            VARCHAR(100),
  state           VARCHAR(50),
  email           VARCHAR(255) UNIQUE,
  password_hash   VARCHAR(255),
  terms_accepted  BOOLEAN,
  created_at      TIMESTAMP WITH TIME ZONE,
  updated_at      TIMESTAMP WITH TIME ZONE
)
```

---

## 🔌 API Endpoints

| Method | Path              | Description                  |
|--------|-------------------|------------------------------|
| GET    | `/api/health`     | Server health check          |
| POST   | `/api/auth/signup`| Register a new student       |
| POST   | `/api/auth/login` | Log in an existing student   |
| GET    | `/api/auth/me`    | Get current user (JWT auth)  |

### Signup Body
```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "age": 13,
  "gradeLevel": "7th Grade",
  "town": "Springfield",
  "state": "New Jersey",
  "email": "ada@school.edu",
  "password": "securepass123",
  "termsAccepted": true
}
```

---

## 🎨 Design System

- **Display font:** Orbitron (futuristic, tech-forward)
- **Body font:** Nunito (friendly, readable for middle schoolers)
- **Primary color:** Cyan `#00c8ff`
- **Accent color:** Orange `#ff6b35`
- **Theme:** Dark space / sci-fi — engaging and exciting for young students

---

## 🔐 Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens for session management (7-day expiry)
- Email uniqueness enforced at DB level
- Input validation on both client and server
- CORS configured for development

---

## 📝 Notes

- Terms & Conditions text is Lorem Ipsum placeholder — replace with real content before launch
- For production: set strong `JWT_SECRET`, use environment secrets manager, enable HTTPS
- Consider adding email verification before production deployment

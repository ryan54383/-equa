# EQUA — Sprint 1: Authentication

> Smart Water Leak Detection & Conservation Platform  
> **Sprint 1** covers: User registration, login, JWT auth, protected routes.

---

## Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | Next.js 14 · TypeScript · Tailwind CSS        |
| Backend    | Node.js · Express · TypeScript                |
| Database   | MongoDB Atlas (Free M0 tier)                  |
| Auth       | JWT (access + refresh) · bcrypt               |
| Hosting    | Vercel (frontend) · Render (backend)          |

---

## Project Structure

```
equa/
├── equa-backend/          ← Express API
│   ├── src/
│   │   ├── config/        env.ts, database.ts
│   │   ├── controllers/   auth.controller.ts
│   │   ├── middleware/     authenticate.ts, validate.ts, errorHandler.ts
│   │   ├── models/        User.ts
│   │   ├── routes/        auth.routes.ts, health.routes.ts
│   │   ├── services/      auth.service.ts
│   │   ├── utils/         jwt.ts, response.ts
│   │   ├── __tests__/     auth.test.ts
│   │   ├── app.ts
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── equa-frontend/         ← Next.js app
    ├── src/
    │   ├── app/
    │   │   ├── auth/login/     Login page
    │   │   ├── auth/register/  Registration page
    │   │   ├── dashboard/      Protected dashboard
    │   │   ├── layout.tsx
    │   │   ├── page.tsx        → redirects to /auth/login
    │   │   └── globals.css
    │   ├── components/ui/      FormInput, Alert, PasswordStrength, EquaLogo
    │   ├── lib/                api.ts, auth.ts, utils.ts
    │   ├── store/              authStore.ts (Zustand)
    │   ├── types/              index.ts
    │   └── middleware.ts       Route guard
    ├── .env.example
    ├── package.json
    └── tailwind.config.js
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free) — or local MongoDB
- Git

---

### 1 · Backend Setup

```bash
cd equa-backend
npm install

# Copy and fill in your env values
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/equa?retryWrites=true&w=majority
JWT_SECRET=<run: openssl rand -base64 64>
JWT_REFRESH_SECRET=<run: openssl rand -base64 64>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=12
```

```bash
# Run in development (hot reload)
npm run dev

# API is live at http://localhost:5000
```

---

### 2 · Frontend Setup

```bash
cd equa-frontend
npm install

cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

```bash
npm run dev
# App is live at http://localhost:3000
```

Open your browser → `http://localhost:3000` → redirects to `/auth/login`

---

## API Reference

Base URL: `http://localhost:5000/api/v1`

### Health Check
```
GET /health
→ 200 { success: true, message: "EQUA API is running", database: "connected" }
```

### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass1"
}

→ 201 {
  success: true,
  data: {
    user: { id, name, email, role, createdAt },
    tokens: { accessToken, refreshToken }
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "SecurePass1"
}

→ 200 {
  success: true,
  data: {
    user: { id, name, email, role, lastLogin },
    tokens: { accessToken, refreshToken }
  }
}
```

### Get Profile (protected)
```
GET /auth/me
Authorization: Bearer <accessToken>

→ 200 { success: true, data: { id, name, email, role, createdAt } }
```

---

## Running Tests

```bash
cd equa-backend

# Install test peer dep
npm install --save-dev mongodb-memory-server

# Run all tests
npm test

# Watch mode
npm run test:watch
```

Tests cover:
- ✅ Register: success → 201 with tokens
- ✅ Register: duplicate email → 409
- ✅ Register: missing fields → 422
- ✅ Register: weak password → 422
- ✅ Login: valid credentials → 200 with tokens
- ✅ Login: wrong password → 401
- ✅ Login: unknown email → 401
- ✅ Protected route: valid token → 200
- ✅ Protected route: no token → 401
- ✅ Protected route: malformed token → 401

---

## Manual Testing (curl)

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@equa.io","password":"SecurePass1"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@equa.io","password":"SecurePass1"}'

# Get profile (replace TOKEN)
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN"

# Health
curl http://localhost:5000/api/v1/health
```

---

## Deployment

### Frontend → Vercel
1. Push `equa-frontend/` to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1`
4. Deploy

### Backend → Render
1. Push `equa-backend/` to GitHub
2. New Web Service on [render.com](https://render.com)
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add all `.env` variables in Render dashboard
6. Set `CORS_ORIGIN` to your Vercel frontend URL

### Keep Render warm (free tier)
Free Render services sleep after 15 min. Add a keep-alive ping:
- Go to [cron-job.org](https://cron-job.org) (free)
- Create job: `GET https://your-backend.onrender.com/api/v1/health`
- Schedule: every 10 minutes

---

## Security Notes

- Passwords hashed with bcrypt (12 rounds in production)
- JWT access tokens expire in 15 minutes
- `passwordHash` field is excluded from all queries by default (`select: false`)
- Rate limiting: 20 auth requests / 15 min per IP
- CORS restricted to frontend origin only
- Input validated and sanitised via express-validator + Zod (frontend)

---

## Sprint Roadmap

| Sprint | Module                          | Status |
|--------|---------------------------------|--------|
| 1      | Authentication (this sprint)    | ✅     |
| 2      | Device Management               | 🔜     |
| 3      | Sensor Readings + Ingestion     | 🔜     |
| 4      | Leak Detection Engine           | 🔜     |
| 5      | Alerts + Notifications          | 🔜     |
| 6      | Reports + Dashboard             | 🔜     |
| 7      | Admin Panel                     | 🔜     |

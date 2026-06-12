<div align="center">

# 💧 EQUA
### Smart Water Leak Detection & Conservation Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![Sprint](https://img.shields.io/badge/sprint-1%20%E2%80%94%20Authentication-cyan?style=flat-square)
![Node](https://img.shields.io/badge/node-18%2B-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-purple?style=flat-square)

*Real-time water leak detection, conservation monitoring, and smart infrastructure management.*

</div>

---

## 🌊 What is EQUA?

EQUA is a full-stack platform that helps property managers, homeowners, and facility operators monitor water systems, detect leaks instantly, and track conservation efforts through an intelligent dashboard.

**Sprint 1** builds the complete authentication foundation — secure registration, login, and protected routes.

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| TypeScript | Type safety |
| MongoDB Atlas | Database (Free M0 tier) |
| Mongoose | Database ODM |
| bcryptjs | Password hashing |
| JSON Web Tokens | Authentication |
| express-validator | Input validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | State management |
| React Hook Form + Zod | Form handling and validation |
| Axios | HTTP client |

### Infrastructure
| Service | Purpose | Cost |
|---------|---------|------|
| MongoDB Atlas M0 | Database hosting | Free |
| Render | Backend hosting | Free |
| Vercel | Frontend hosting | Free |

---

## 🏗 Architecture

```
┌──────────────────────────────────────┐
│           CLIENT LAYER               │
│        Next.js — Vercel              │
│  Login · Register · Dashboard        │
└──────────────┬───────────────────────┘
               │ HTTPS
┌──────────────▼───────────────────────┐
│            API LAYER                 │
│        Express — Render              │
│  Auth · Validation · Middleware      │
└──────────────┬───────────────────────┘
               │ Mongoose
┌──────────────▼───────────────────────┐
│           DATA LAYER                 │
│       MongoDB Atlas M0               │
│         users collection             │
└──────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
equa/
│
├── equa-backend/                   # Express REST API
│   └── src/
│       ├── config/                 # Environment + database setup
│       ├── controllers/            # Request handlers
│       ├── middleware/             # Auth, validation, error handling
│       ├── models/                 # Mongoose schemas
│       ├── routes/                 # API route definitions
│       ├── services/               # Business logic
│       ├── utils/                  # Shared helpers
│       └── __tests__/              # Integration tests
│
└── equa-frontend/                  # Next.js 14 App
    └── src/
        ├── app/
        │   ├── auth/login/         # Login page
        │   ├── auth/register/      # Registration page
        │   └── dashboard/          # Protected dashboard
        ├── components/ui/          # Reusable UI components
        ├── lib/                    # API client + helpers
        ├── store/                  # Global state
        └── types/                  # TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas free account — [mongodb.com/atlas](https://mongodb.com/atlas)
- Git

---

### 1 · Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/equa.git
cd equa
```

### 2 · Backend

```bash
cd equa-backend
npm install
cp .env.example .env
# Fill in your MongoDB URI and secrets in .env
npm run dev
# Running at http://localhost:5000
```

### 3 · Frontend

```bash
cd equa-frontend
npm install
# Create .env.local and set NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
npm run dev
# Running at http://localhost:3000
```

---

## ☁️ Deployment

| Layer | Platform | Notes |
|-------|----------|-------|
| Frontend | Vercel | Connect GitHub repo, add env vars, deploy |
| Backend | Render | Connect GitHub repo, add env vars, deploy |
| Database | MongoDB Atlas | Free M0 shared cluster |

---

## 🔒 Security

- Passwords are hashed before storage — never saved as plain text
- Authentication tokens are short-lived and stored securely in memory
- All inputs are validated and sanitised on both client and server
- Rate limiting is applied to all authentication endpoints
- CORS is restricted to the frontend origin only

---

## 🗺 Sprint Roadmap

| Sprint | Module | Status |
|--------|--------|--------|
| **1** | **Authentication** — register, login, protected routes | ✅ Complete |
| 2 | Dashboard UI — usage charts, alerts, eco points, devices | ✅ Complete |
| 3 | Device Management — CRUD, sensor registration | 🔜 Planned |
| 4 | Sensor Readings — ingestion, time-series storage | 🔜 Planned |
| 5 | Leak Detection Engine — anomaly detection | 🔜 Planned |
| 6 | Alerts + Notifications — email alerts, severity system | 🔜 Planned |
| 7 | Reports + Admin Panel — PDF exports, admin controls | 🔜 Planned |

---

<div align="center">

Built with 💧 by the EQUA Team

</div>

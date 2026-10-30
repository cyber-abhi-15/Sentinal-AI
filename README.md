<<<<<<< HEAD
# 🛡️ SENTINEL AI — AI-Powered Security Firewall

> **Your AI. Your Data. Your Security.**

An intelligent security middleware that protects AI applications from malicious prompts, prompt injection, jailbreak attacks, personal information exposure, API key leakage, and unsafe AI-generated responses.

---

## 🚨 The Problem

Unprotected AI applications are vulnerable to:
- **Prompt Injection Attacks** — Attackers embed instructions to override AI behavior and extract system prompts
- **Sensitive Data Leakage** — Personal information, credentials, and API keys inadvertently forwarded to AI models
- **Jailbreaking** — Carefully crafted prompts bypass safety guidelines and enable harmful outputs

---

## ✅ The Solution

Sentinel AI acts as a security gateway between users and AI models. Every request passes through a multi-layer detection pipeline before reaching Gemini.

---

## 🔐 Key Features

| Feature | Description |
|---------|-------------|
| **Prompt Injection Detection** | 20+ regex rules detect instruction overrides, system prompt extraction, jailbreaks, and role manipulation |
| **PII Protection** | Detects emails, phone numbers, Aadhaar-format IDs, credit cards, PAN cards, and more |
| **Credential Guardian** | Blocks API keys, passwords, tokens, AWS keys, Stripe keys before they reach AI |
| **Risk Scoring Engine** | Deterministic 0–100 score with LOW/MEDIUM/HIGH/CRITICAL severity levels |
| **Security Policy Engine** | STRICT, BALANCED, and PERMISSIVE enforcement modes |
| **AI Explanations** | Google Gemini explains findings in plain language with remediation advice |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, React Router, Tailwind CSS, Recharts, Lucide React |
| Backend | Node.js, Express.js, ES Modules, JWT, bcrypt, Zod, Helmet, Rate Limiting |
| Database | Supabase PostgreSQL |
| AI | Google Gemini API (@google/genai SDK) |
| Deployment | Vercel (frontend), Render (backend), Supabase (database) |

---

## 🔄 Security Workflow

```
USER INPUT
    │
    ▼
EXPRESS BACKEND (Zod Validation)
    │
    ▼
PROMPT INJECTION DETECTION (20+ rules)
    │
    ▼
PII DETECTION (9 pattern types)
    │
    ▼
CREDENTIAL DETECTION (12 pattern types)
    │
    ▼
RISK SCORING (0–100, deterministic)
    │
    ▼
POLICY ENGINE (STRICT/BALANCED/PERMISSIVE)
    │
    ├──── BLOCK ──── STOP (Gemini NOT called)
    │
    ├──── REQUIRE_REVIEW ──── Return review status
    │
    └──── ALLOW/ALLOW_WITH_REDACTION
              │
              ▼
         REDACTION ENGINE
              │
              ▼
         GEMINI API (sanitized input only)
              │
              ▼
         OUTPUT SCANNING
              │
              ▼
         AUDIT DATABASE
```

---

## 🗄️ Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | TEXT | Unique email |
| password_hash | TEXT | bcrypt hash |
| created_at | TIMESTAMPTZ | Creation time |

### scans
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| input_fingerprint | TEXT | SHA-256 of original input |
| risk_score | INTEGER | 0–100 risk score |
| severity | TEXT | LOW/MEDIUM/HIGH/CRITICAL |
| decision | TEXT | ALLOW/BLOCK/REDACT/REVIEW |
| threat_count | INTEGER | Number of injection threats |
| pii_count | INTEGER | Number of PII findings |
| policy | TEXT | Security policy used |
| gemini_requested | BOOLEAN | Was Gemini requested? |
| gemini_forwarded | BOOLEAN | Was input forwarded to Gemini? |
| processing_status | TEXT | Final processing status |

### threat_findings
Stores individual threat findings per scan (category, severity, rule ID, score contribution).

### user_settings
Stores per-user security policy preferences.

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm 9+

### Clone and Setup

```bash
git clone <your-repo-url>
cd sentinel-ai
```

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
```

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# Edit .env with your backend URL
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=your_google_gemini_api_key
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Client (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🗃️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your Project URL and service_role key
3. Open the **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`
4. Add credentials to `server/.env`

---

## 🤖 Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to `server/.env` as `GEMINI_API_KEY`

> **Note:** Sentinel AI functions without Gemini configured. Security detection runs deterministically using regex rules. Gemini is used for explanations and AI response processing only.

---

## 💻 Local Development

### Start Backend
```bash
cd server
npm run dev
# Server: http://localhost:5000
# Health: http://localhost:5000/api/health
```

### Start Frontend
```bash
cd client
npm run dev
# App: http://localhost:5173
```

---

## 📡 API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login and get JWT |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/firewall/scan | Optional | Run security scan |
| GET | /api/dashboard/stats | Yes | Dashboard statistics |
| GET | /api/dashboard/distribution | Yes | Threat distribution |
| GET | /api/dashboard/activity | Yes | Recent scan activity |
| GET | /api/scans | Yes | List user's scans |
| GET | /api/scans/:id | Yes | Get scan details |
| DELETE | /api/scans/:id | Yes | Delete a scan |
| GET | /api/health | No | Health check |

---

## 🧪 Running Tests

```bash
cd server
node --test tests/security.test.js
```

Tests cover:
- Safe input (no false positives)
- Prompt injection detection
- System prompt extraction
- Jailbreak detection
- Email/phone PII detection
- Credential detection
- Automatic redaction
- Risk scoring accuracy
- Policy enforcement
- **Critical: blocked requests never invoke Gemini**

---

## 🚢 Deployment

### Backend (Render)

1. Create a new **Web Service** at [render.com](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add all environment variables from `server/.env.example`
5. Set `NODE_ENV=production` and `CLIENT_URL=https://your-frontend.vercel.app`

### Frontend (Vercel)

1. Import project at [vercel.com](https://vercel.com)
2. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

---

## ⚠️ Known Limitations

- Detection is heuristic-based; sophisticated adversarial prompts may evade regex rules
- Risk scores are not statistically calibrated probabilities
- Aadhaar detection uses format matching only — cannot verify authenticity
- Phone number detection may produce false positives on some numeric sequences
- Gemini explanations require a valid API key and network access
- Database persistence requires Supabase configuration; the app runs in demo mode without it

---

## 🔮 Future Improvements

- Machine learning-based injection detection (beyond regex)
- Real-time threat intelligence feeds
- Multi-model support (GPT-4, Claude, etc.)
- Team workspaces and role-based access
- Webhook alerts for critical threats
- Compliance reporting (GDPR, DPDPA)
- Browser extension for protecting web-based AI tools
=======
# Sentinal-AI
🛡️ Sentinel AI is an intelligent AI security firewall that detects prompt injection, jailbreak attacks, PII exposure, and credential leaks. It uses risk scoring, automatic data redaction, and AI-powered analysis to protect applications and ensure safer AI interactions.
>>>>>>> fe27150439701bf5717c2aa2ccb6d347435a8312

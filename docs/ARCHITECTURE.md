# Sentinel AI — Architecture Documentation

## System Overview

Sentinel AI is a three-tier security middleware:

```
[React Frontend] ←→ [Express Backend Security Engine] ←→ [Gemini AI]
                              ↕
                    [Supabase PostgreSQL]
```

## Component Architecture

### Backend Modules

```
server/src/
├── detection/
│   ├── promptInjectionDetector.js  — 20 regex rules, 6 categories
│   ├── piiDetector.js              — 9 PII pattern types
│   └── credentialDetector.js      — 12 credential patterns
│
├── services/
│   ├── redactionService.js        — Automatic sensitive data masking
│   ├── riskScoringService.js      — 0–100 deterministic scoring
│   ├── policyEngine.js            — STRICT/BALANCED/PERMISSIVE enforcement
│   └── geminiService.js           — AI integration with safety controls
│
├── controllers/
│   ├── firewallController.js      — Main scan orchestration
│   ├── authController.js          — Registration and login
│   ├── dashboardController.js     — Analytics queries
│   └── scansController.js        — Scan history management
│
├── middleware/
│   └── auth.js                   — JWT verification
│
└── config/
    └── database.js               — Supabase client
```

## Security Pipeline

Each scan request follows this exact sequence:

1. **Zod Validation** — Input type and length validation
2. **Prompt Injection Detection** — 20 regex rules across 6 threat categories
3. **PII Detection** — 9 personal data pattern types
4. **Credential Detection** — 12 credential/secret patterns
5. **Risk Scoring** — Weighted score calculation (0–100)
6. **Policy Evaluation** — BLOCK / ALLOW / REVIEW / REDACT decision
7. **Redaction** — Automatic masking of all detected sensitive content
8. **Gemini Processing** — Only reached if not blocked
9. **Output Scanning** — Response checked for secrets before return
10. **Database Audit** — Privacy-preserving record stored

## Security Invariants

These properties are maintained by the backend regardless of frontend state:

- Credentials always trigger a BLOCK decision (mandatory, unpolicied)
- Blocked requests never result in a Gemini API call
- Raw secrets are never persisted to the database
- Input fingerprint (SHA-256) stored instead of original text
- User ownership enforced on all database operations
- JWT verified server-side on every protected route

## Token Storage

JWT tokens are stored in browser localStorage. This approach:
- **Advantage:** Simple implementation for hackathon MVP
- **Limitation:** XSS-vulnerable; HttpOnly cookies with CSRF protection preferred for production
- **Recommendation:** Migrate to HttpOnly cookies with SameSite=Strict for production deployment

## Data Flow — Blocked Request

```
User Input → Validation → Detection → Score: 80 (CRITICAL) → BLOCK
                                                      ↓
                                         gemini_forwarded = false
                                         Response returned to user
                                         No Gemini API call made
                                         Audit record stored
```

## Data Flow — Allowed Request with PII

```
User Input → Detection → PII Found → Score: 15 (LOW) → ALLOW_WITH_REDACTION
                                                 ↓
                                      Redact PII from input
                                      Forward sanitized text to Gemini
                                      Scan Gemini output
                                      Return safe response
                                      Audit record: pii_count > 0
```

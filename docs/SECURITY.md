# Sentinel AI — Security Documentation

## Security Design Principles

1. **Defense in Depth** — Multiple detection layers before any AI call
2. **Backend Enforcement** — Security decisions made server-side, not trusted from frontend
3. **Least Privilege** — Supabase service key used only on backend
4. **Data Minimization** — Input fingerprints stored, not raw content
5. **Fail Secure** — Unknown conditions default to BLOCK

## Threat Model

### Covered Threats

| Threat | Detection Method | Response |
|--------|-----------------|----------|
| Prompt Injection | Regex rules (PI-001 to PI-020) | BLOCK (HIGH+) |
| System Prompt Extraction | Pattern matching on extraction phrases | BLOCK (CRITICAL) |
| Jailbreaking | DAN detection, role manipulation rules | BLOCK (HIGH+) |
| PII Exposure | Format validation for emails, phones, IDs | REDACT |
| Credential Leakage | API key, password, token patterns | MANDATORY BLOCK |
| Data Exfiltration | Exfiltration command patterns | BLOCK |

### Limitations

- **Regex-based detection** can be evaded by sophisticated adversarial prompts using encoding, Unicode normalization, or other obfuscation
- **Heuristic scoring** is not equivalent to statistically validated security metrics
- **Format-only PII detection** — cannot confirm Aadhaar numbers are real
- **No semantic understanding** — context-aware attacks may bypass rule matching

## Credential Handling

- API keys are **never logged** at any verbosity level
- Credentials are **never forwarded to Gemini** regardless of policy
- No raw secrets are **stored in the database**
- Detection results report **type** only, never the actual value
- Redaction occurs in memory before any persistence

## Password Security

- bcrypt with cost factor 12
- Minimum 8-character password enforced at API level
- Passwords never logged
- Authorization headers excluded from logs

## JWT Implementation

- HS256 signing with configurable secret
- Default 1-day expiration
- Server-side verification on every protected route
- Tokens stored in localStorage (XSS risk — see Architecture docs)

## Known Security Debt

1. **localStorage JWT** — Should use HttpOnly cookies with CSRF protection for production
2. **Rate limiting** — In-memory; use Redis for multi-instance deployments
3. **No refresh tokens** — Sessions expire without seamless renewal
4. **Regex detection** — Does not catch semantically equivalent encoded attacks

## Security Headers

Helmet.js configured with defaults:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (production)
- Content-Security-Policy (Helmet defaults)

## Input Constraints

- Maximum request body: 10KB
- Maximum input text: 5000 characters
- Scan rate limit: 20 requests/minute
- Global rate limit: 100 requests/15 minutes

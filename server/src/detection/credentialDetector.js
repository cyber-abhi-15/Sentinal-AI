// server/src/detection/credentialDetector.js

const CREDENTIAL_PATTERNS = [
  {
    id: 'CRED-001',
    type: 'API_KEY_GENERIC',
    pattern: /\b(api[_\-\s]?key|apikey)\s*[:=]\s*([a-zA-Z0-9_\-]{16,})/gi,
    placeholder: '[API_KEY_REDACTED]',
    severity: 'CRITICAL',
    description: 'API key assignment detected'
  },
  {
    id: 'CRED-002',
    type: 'SECRET_KEY',
    pattern: /\b(secret[_\-\s]?key|secretkey)\s*[:=]\s*([a-zA-Z0-9_\-\/+]{16,})/gi,
    placeholder: '[SECRET_KEY_REDACTED]',
    severity: 'CRITICAL',
    description: 'Secret key assignment detected'
  },
  {
    id: 'CRED-003',
    type: 'BEARER_TOKEN',
    pattern: /bearer\s+([a-zA-Z0-9_\-\.]{20,})/gi,
    placeholder: '[BEARER_TOKEN_REDACTED]',
    severity: 'CRITICAL',
    description: 'Bearer token detected'
  },
  {
    id: 'CRED-004',
    type: 'PASSWORD',
    pattern: /\b(password|passwd|pwd)\s*[:=]\s*\S{4,}/gi,
    placeholder: '[PASSWORD_REDACTED]',
    severity: 'CRITICAL',
    description: 'Password assignment detected'
  },
  {
    id: 'CRED-005',
    type: 'ACCESS_TOKEN',
    pattern: /\b(access[_\-\s]?token|accesstoken)\s*[:=]\s*([a-zA-Z0-9_\-\.]{16,})/gi,
    placeholder: '[ACCESS_TOKEN_REDACTED]',
    severity: 'CRITICAL',
    description: 'Access token detected'
  },
  {
    id: 'CRED-006',
    type: 'PRIVATE_KEY',
    pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/gi,
    placeholder: '[PRIVATE_KEY_REDACTED]',
    severity: 'CRITICAL',
    description: 'Private key header detected'
  },
  {
    id: 'CRED-007',
    type: 'AWS_KEY',
    pattern: /\bAKIA[0-9A-Z]{16}\b/g,
    placeholder: '[AWS_KEY_REDACTED]',
    severity: 'CRITICAL',
    description: 'AWS access key detected'
  },
  {
    id: 'CRED-008',
    type: 'STRIPE_KEY',
    pattern: /\b(sk|pk)_(test|live)_[a-zA-Z0-9]{16,}\b/g,
    placeholder: '[STRIPE_KEY_REDACTED]',
    severity: 'CRITICAL',
    description: 'Stripe API key detected'
  },
  {
    id: 'CRED-009',
    type: 'GITHUB_TOKEN',
    pattern: /\bghp_[a-zA-Z0-9]{36}\b/g,
    placeholder: '[GITHUB_TOKEN_REDACTED]',
    severity: 'CRITICAL',
    description: 'GitHub personal access token detected'
  },
  {
    id: 'CRED-010',
    type: 'GOOGLE_API_KEY',
    pattern: /\bAIza[0-9A-Za-z_\-]{35}\b/g,
    placeholder: '[GOOGLE_API_KEY_REDACTED]',
    severity: 'CRITICAL',
    description: 'Google API key detected'
  },
  {
    id: 'CRED-011',
    type: 'CONNECTION_STRING',
    pattern: /\b(mongodb|postgresql|mysql|redis):\/\/[^\s"']+/gi,
    placeholder: '[CONNECTION_STRING_REDACTED]',
    severity: 'CRITICAL',
    description: 'Database connection string detected'
  },
  {
    id: 'CRED-012',
    type: 'AUTH_TOKEN',
    pattern: /\b(auth[_\-]?token|token)\s*[:=]\s*([a-zA-Z0-9_\-\.]{20,})/gi,
    placeholder: '[AUTH_TOKEN_REDACTED]',
    severity: 'HIGH',
    description: 'Authentication token detected'
  }
];

export function detectCredentials(text) {
  if (!text || typeof text !== 'string') {
    return { detected: false, findings: [], types: [] };
  }

  const findings = [];
  const detectedTypes = new Set();
  const matchedRuleIds = new Set();

  for (const rule of CREDENTIAL_PATTERNS) {
    if (matchedRuleIds.has(rule.id)) continue;
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      matchedRuleIds.add(rule.id);
      detectedTypes.add(rule.type);
      findings.push({
        ruleId: rule.id,
        type: rule.type,
        severity: rule.severity,
        description: rule.description,
        count: matches.length,
        scoreContribution: 35
      });
    }
  }

  return {
    detected: findings.length > 0,
    findings,
    types: Array.from(detectedTypes)
  };
}

export const CREDENTIAL_RULES = CREDENTIAL_PATTERNS;

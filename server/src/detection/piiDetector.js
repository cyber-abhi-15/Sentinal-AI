// server/src/detection/piiDetector.js

const PII_PATTERNS = [
  {
    id: 'PII-EMAIL',
    type: 'EMAIL',
    pattern: /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g,
    placeholder: '[EMAIL_REDACTED]',
    severity: 'MEDIUM',
    description: 'Email address detected'
  },
  {
    id: 'PII-PHONE-IN',
    type: 'PHONE',
    pattern: /\b(?:\+91[\s\-]?)?[6-9]\d{9}\b/g,
    placeholder: '[PHONE_REDACTED]',
    severity: 'MEDIUM',
    description: 'Indian mobile number detected'
  },
  {
    id: 'PII-PHONE-INTL',
    type: 'PHONE',
    pattern: /\b\+?[1-9]\d{1,3}[\s\-.]?\(?\d{1,4}\)?[\s\-.]?\d{1,4}[\s\-.]?\d{1,9}\b/g,
    placeholder: '[PHONE_REDACTED]',
    severity: 'MEDIUM',
    description: 'International phone number detected'
  },
  {
    id: 'PII-AADHAAR',
    type: 'AADHAAR',
    pattern: /\b[2-9]\d{3}[\s\-]?\d{4}[\s\-]?\d{4}\b/g,
    placeholder: '[AADHAAR_REDACTED]',
    severity: 'HIGH',
    description: 'Possible Aadhaar-format identifier detected (12-digit number in Aadhaar range; unverified)'
  },
  {
    id: 'PII-CARD',
    type: 'CREDIT_CARD',
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    placeholder: '[CARD_REDACTED]',
    severity: 'HIGH',
    description: 'Credit/debit card number pattern detected'
  },
  {
    id: 'PII-PAN',
    type: 'PAN',
    pattern: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g,
    placeholder: '[PAN_REDACTED]',
    severity: 'HIGH',
    description: 'PAN card format detected'
  },
  {
    id: 'PII-SSN',
    type: 'SSN',
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    placeholder: '[SSN_REDACTED]',
    severity: 'HIGH',
    description: 'SSN format detected'
  },
  {
    id: 'PII-DOB',
    type: 'DATE_OF_BIRTH',
    pattern: /\b(?:dob|date\s+of\s+birth|born\s+on|birthday)\s*[:=]?\s*\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/i,
    placeholder: '[DOB_REDACTED]',
    severity: 'MEDIUM',
    description: 'Date of birth pattern detected'
  },
  {
    id: 'PII-PASSPORT',
    type: 'PASSPORT',
    pattern: /\b[A-Z][0-9]{7}\b/g,
    placeholder: '[PASSPORT_REDACTED]',
    severity: 'HIGH',
    description: 'Passport number format detected'
  }
];

export function detectPII(text) {
  if (!text || typeof text !== 'string') {
    return { detected: false, findings: [], types: [] };
  }

  const findings = [];
  const detectedTypes = new Set();

  for (const rule of PII_PATTERNS) {
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // Extra validation for Aadhaar to reduce false positives
      if (rule.id === 'PII-AADHAAR') {
        const cleanMatches = matches.filter(m => {
          const digits = m.replace(/[\s\-]/g, '');
          return digits.length === 12 && parseInt(digits[0]) >= 2;
        });
        if (cleanMatches.length === 0) continue;
      }
      // Skip phone pattern if already matched by Indian phone
      if (rule.id === 'PII-PHONE-INTL') {
        const indiaPattern = /\b(?:\+91[\s\-]?)?[6-9]\d{9}\b/g;
        const intlMatches = matches.filter(m => !indiaPattern.test(m));
        if (intlMatches.length === 0) continue;
      }

      detectedTypes.add(rule.type);
      findings.push({
        ruleId: rule.id,
        type: rule.type,
        severity: rule.severity,
        description: rule.description,
        count: matches.length,
        scoreContribution: rule.severity === 'HIGH' ? 20 : 15
      });
    }
  }

  return {
    detected: findings.length > 0,
    findings,
    types: Array.from(detectedTypes)
  };
}

export const PII_RULES = PII_PATTERNS;

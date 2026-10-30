// server/src/services/redactionService.js
import { PII_RULES } from '../detection/piiDetector.js';
import { CREDENTIAL_RULES } from '../detection/credentialDetector.js';

export function redactText(text, piiFindings, credentialFindings) {
  if (!text || typeof text !== 'string') return { redactedText: text, redactionCount: 0, redactions: [] };

  let redacted = text;
  const redactions = [];

  // Redact credentials first (higher priority)
  for (const finding of (credentialFindings || [])) {
    const rule = CREDENTIAL_RULES.find(r => r.id === finding.ruleId);
    if (!rule) continue;
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    const before = redacted;
    redacted = redacted.replace(pattern, (match) => {
      // For patterns with capture groups, preserve the key name
      const keyMatch = match.match(/^([a-zA-Z_\-\s]+\s*[:=]\s*)/i);
      if (keyMatch) return keyMatch[1] + rule.placeholder;
      return rule.placeholder;
    });
    if (before !== redacted) {
      redactions.push({ type: finding.type, placeholder: rule.placeholder });
    }
  }

  // Redact PII
  for (const finding of (piiFindings || [])) {
    const rule = PII_RULES.find(r => r.id === finding.ruleId);
    if (!rule) continue;
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    const before = redacted;
    redacted = redacted.replace(pattern, rule.placeholder);
    if (before !== redacted) {
      redactions.push({ type: finding.type, placeholder: rule.placeholder });
    }
  }

  return {
    redactedText: redacted,
    redactionCount: redactions.length,
    redactions
  };
}

export function redactForStorage(text) {
  // Returns a safe version for storage — never store raw sensitive data
  let safe = text;
  for (const rule of CREDENTIAL_RULES) {
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    safe = safe.replace(pattern, rule.placeholder);
  }
  for (const rule of PII_RULES) {
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    safe = safe.replace(pattern, rule.placeholder);
  }
  return safe;
}

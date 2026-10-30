// server/src/services/policyEngine.js

export const POLICIES = {
  STRICT: 'STRICT',
  BALANCED: 'BALANCED',
  PERMISSIVE: 'PERMISSIVE'
};

export const DECISIONS = {
  ALLOW: 'ALLOW',
  ALLOW_WITH_REDACTION: 'ALLOW_WITH_REDACTION',
  BLOCK: 'BLOCK',
  REQUIRE_REVIEW: 'REQUIRE_REVIEW'
};

export function evaluatePolicy(riskResult, piiResult, credentialResult, policy = 'BALANCED') {
  const score = riskResult?.score ?? 0;
  const severity = riskResult?.severity ?? 'LOW';
  const hasPII = (piiResult?.detected || (piiResult?.findings && piiResult.findings.length > 0)) ?? false;
  const hasCredentials = (credentialResult?.detected || (credentialResult?.findings && credentialResult.findings.length > 0)) ?? false;

  // 1. Mandatory credential protection cannot be bypassed by ANY policy
  if (hasCredentials) {
    return {
      decision: DECISIONS.BLOCK,
      reason: 'Mandatory credential protection: Exposed credentials or secrets detected. Bypassing is prohibited.',
      policyApplied: policy,
      mandatoryBlock: true
    };
  }

  const normalizedPolicy = (policy || 'BALANCED').toUpperCase();

  switch (normalizedPolicy) {
    case POLICIES.STRICT:
      if (severity === 'CRITICAL' || severity === 'HIGH') {
        return {
          decision: DECISIONS.BLOCK,
          reason: `STRICT Policy: ${severity} threat detected (score: ${score}/100). Request blocked.`,
          policyApplied: normalizedPolicy
        };
      }
      if (severity === 'MEDIUM') {
        return {
          decision: DECISIONS.REQUIRE_REVIEW,
          reason: `STRICT Policy: MEDIUM risk detected (score: ${score}/100). Manual review required.`,
          policyApplied: normalizedPolicy
        };
      }
      if (hasPII) {
        return {
          decision: DECISIONS.ALLOW_WITH_REDACTION,
          reason: 'STRICT Policy: PII detected and redacted before processing.',
          policyApplied: normalizedPolicy
        };
      }
      return {
        decision: DECISIONS.ALLOW,
        reason: 'STRICT Policy: Request passed all security checks.',
        policyApplied: normalizedPolicy
      };

    case POLICIES.BALANCED:
      // Default policy
      if (severity === 'CRITICAL') {
        return {
          decision: DECISIONS.BLOCK,
          reason: `BALANCED Policy: CRITICAL threat detected (score: ${score}/100). Request blocked.`,
          policyApplied: normalizedPolicy
        };
      }
      if (severity === 'HIGH') {
        // High risk attacks (e.g. Prompt Injection, Jailbreak, System Prompt Extraction) are blocked under default policy
        return {
          decision: DECISIONS.BLOCK,
          reason: `BALANCED Policy: HIGH threat detected (score: ${score}/100). Request blocked before model processing.`,
          policyApplied: normalizedPolicy
        };
      }
      if (severity === 'MEDIUM') {
        if (hasPII) {
          return {
            decision: DECISIONS.ALLOW_WITH_REDACTION,
            reason: 'BALANCED Policy: PII detected and automatically redacted.',
            policyApplied: normalizedPolicy
          };
        }
        return {
          decision: DECISIONS.REQUIRE_REVIEW,
          reason: `BALANCED Policy: MEDIUM risk level (score: ${score}/100). Security review recommended.`,
          policyApplied: normalizedPolicy
        };
      }
      if (hasPII) {
        return {
          decision: DECISIONS.ALLOW_WITH_REDACTION,
          reason: 'BALANCED Policy: PII detected and automatically redacted.',
          policyApplied: normalizedPolicy
        };
      }
      return {
        decision: DECISIONS.ALLOW,
        reason: 'BALANCED Policy: Request passed security verification.',
        policyApplied: normalizedPolicy
      };

    case POLICIES.PERMISSIVE:
      if (severity === 'CRITICAL') {
        return {
          decision: DECISIONS.BLOCK,
          reason: `PERMISSIVE Policy: CRITICAL risk detected (score: ${score}/100). Mandatory block enforced.`,
          policyApplied: normalizedPolicy
        };
      }
      if (hasPII) {
        return {
          decision: DECISIONS.ALLOW_WITH_REDACTION,
          reason: 'PERMISSIVE Policy: PII detected and redacted.',
          policyApplied: normalizedPolicy
        };
      }
      if (severity === 'HIGH' || severity === 'MEDIUM') {
        return {
          decision: DECISIONS.ALLOW,
          reason: `PERMISSIVE Policy: ${severity} risk permitted with warning (score: ${score}/100).`,
          policyApplied: normalizedPolicy,
          warning: true
        };
      }
      return {
        decision: DECISIONS.ALLOW,
        reason: 'PERMISSIVE Policy: Request permitted.',
        policyApplied: normalizedPolicy
      };

    default:
      return {
        decision: DECISIONS.BLOCK,
        reason: 'Unknown security policy configuration. Defaulting to safe BLOCK.',
        policyApplied: 'UNKNOWN'
      };
  }
}


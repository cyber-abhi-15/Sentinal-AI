// server/src/services/riskScoringService.js

export function calculateRiskScore(injectionResult, piiResult, credentialResult) {
  const contributions = [];
  const seenRuleIds = new Set();
  let rawScore = 0;

  // 1. Process prompt injection findings
  if (injectionResult?.findings?.length > 0) {
    for (const finding of injectionResult.findings) {
      if (!seenRuleIds.has(finding.ruleId)) {
        seenRuleIds.add(finding.ruleId);
        rawScore += finding.scoreContribution;
        contributions.push({
          source: 'PROMPT_INJECTION',
          ruleId: finding.ruleId,
          category: finding.category,
          severity: finding.severity,
          contribution: finding.scoreContribution,
          description: finding.description
        });
      }
    }
  }

  // 2. Process PII findings
  if (piiResult?.findings?.length > 0) {
    for (const finding of piiResult.findings) {
      if (!seenRuleIds.has(finding.ruleId)) {
        seenRuleIds.add(finding.ruleId);
        const contribution = finding.scoreContribution || (finding.severity === 'HIGH' ? 20 : 15);
        rawScore += contribution;
        contributions.push({
          source: 'PII',
          ruleId: finding.ruleId,
          category: finding.type,
          severity: finding.severity,
          contribution,
          description: finding.description
        });
      }
    }
  }

  // 3. Process credential findings
  if (credentialResult?.findings?.length > 0) {
    for (const finding of credentialResult.findings) {
      if (!seenRuleIds.has(finding.ruleId)) {
        seenRuleIds.add(finding.ruleId);
        const contribution = finding.scoreContribution || 35;
        rawScore += contribution;
        contributions.push({
          source: 'CREDENTIAL',
          ruleId: finding.ruleId,
          category: finding.type,
          severity: finding.severity,
          contribution,
          description: finding.description
        });
      }
    }
  }

  const score = Math.min(100, Math.max(0, rawScore));
  const severity = getSeverityLevel(score);
  const remediations = generateRemediations(contributions);

  return {
    score,
    severity,
    contributions,
    remediations,
    note: 'Heuristic-based deterministic risk score, not a statistically calibrated probability.'
  };
}

export function getSeverityLevel(score) {
  if (score >= 75) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
}

function generateRemediations(contributions) {
  const remediations = [];
  const sources = new Set(contributions.map(c => c.source));

  if (sources.has('PROMPT_INJECTION')) {
    remediations.push('Sanitize and validate user instructions against prompt injection patterns.');
    remediations.push('Enforce strict separation between system instructions and user-supplied data.');
  }
  if (sources.has('CREDENTIAL')) {
    remediations.push('Never include credentials, tokens, or private keys in AI prompts.');
    remediations.push('Store secrets securely in an encrypted vault or environment variables.');
  }
  if (sources.has('PII')) {
    remediations.push('Redact personally identifiable information before transmitting data to external models.');
    remediations.push('Implement client-side or gateway PII masking for compliance with privacy frameworks.');
  }
  if (contributions.some(c => c.category === 'SYSTEM_PROMPT_EXTRACTION')) {
    remediations.push('Ensure underlying system prompts do not contain confidential business logic or secrets.');
  }
  if (contributions.some(c => c.category === 'JAILBREAK')) {
    remediations.push('Deploy adversarial prompt filtering and hardened system prompts with safety constraints.');
  }

  if (remediations.length === 0) {
    remediations.push('Input passed security checks. Continue monitoring according to established policy.');
  }

  return [...new Set(remediations)];
}


// server/src/detection/promptInjectionDetector.js

const RULES = [
  {
    id: 'PI-001',
    pattern: /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|directives?|rules?)/i,
    weight: 25,
    category: 'PROMPT_INJECTION',
    severity: 'HIGH',
    description: 'Instruction override attempt detected'
  },
  {
    id: 'PI-002',
    pattern: /disregard\s+(all\s+)?(previous|prior|above|earlier|your)\s+(instructions?|prompts?|directives?|rules?|training)/i,
    weight: 25,
    category: 'INSTRUCTION_OVERRIDE',
    severity: 'HIGH',
    description: 'Instruction disregard attempt detected'
  },
  {
    id: 'PI-003',
    pattern: /reveal\s+(your\s+)?(hidden\s+)?(system\s+prompt|internal\s+instructions?|confidential\s+config|secret\s+instructions?)/i,
    weight: 30,
    category: 'SYSTEM_PROMPT_EXTRACTION',
    severity: 'CRITICAL',
    description: 'System prompt extraction attempt detected'
  },
  {
    id: 'PI-004',
    pattern: /show\s+(me\s+)?(your\s+)?(confidential|hidden|secret|internal|system)\s+(information|instructions?|prompt|config)/i,
    weight: 28,
    category: 'SYSTEM_PROMPT_EXTRACTION',
    severity: 'HIGH',
    description: 'Confidential information extraction attempt'
  },
  {
    id: 'PI-005',
    pattern: /bypass\s+(all\s+|any\s+|your\s+)?(security|safety|restrictions?|filters?|policies|rules?|guidelines?)/i,
    weight: 25,
    category: 'JAILBREAK',
    severity: 'HIGH',
    description: 'Security bypass attempt detected'
  },
  {
    id: 'PI-006',
    pattern: /override\s+(developer|system|admin|operator)\s+(instructions?|settings?|config|rules?)/i,
    weight: 25,
    category: 'INSTRUCTION_OVERRIDE',
    severity: 'HIGH',
    description: 'Developer instruction override attempt'
  },
  {
    id: 'PI-007',
    pattern: /ignore\s+(safety|security|ethical?)\s+(policies|guidelines?|filters?|restrictions?|rules?)/i,
    weight: 25,
    category: 'JAILBREAK',
    severity: 'HIGH',
    description: 'Safety policy bypass attempt'
  },
  {
    id: 'PI-008',
    pattern: /act\s+as\s+(an?\s+)?(unrestricted|uncensored|unfiltered|jailbroken|free|evil|dan)\s*(ai|model|assistant|bot)?/i,
    weight: 25,
    category: 'ROLE_MANIPULATION',
    severity: 'HIGH',
    description: 'Unrestricted AI role manipulation attempt'
  },
  {
    id: 'PI-009',
    pattern: /extract\s+(hidden|secret|confidential|internal)\s+(context|information|data|instructions?|config)/i,
    weight: 28,
    category: 'DATA_EXFILTRATION',
    severity: 'HIGH',
    description: 'Hidden context extraction attempt'
  },
  {
    id: 'PI-010',
    pattern: /reveal\s+(internal|confidential|hidden|secret)\s+(instructions?|data|information|prompts?)/i,
    weight: 28,
    category: 'SYSTEM_PROMPT_EXTRACTION',
    severity: 'HIGH',
    description: 'Internal instruction revelation attempt'
  },
  {
    id: 'PI-011',
    pattern: /disable\s+(safety|security|content)\s+(filters?|restrictions?|checks?|policies|guidelines?)/i,
    weight: 30,
    category: 'JAILBREAK',
    severity: 'CRITICAL',
    description: 'Safety filter disabling attempt'
  },
  {
    id: 'PI-012',
    pattern: /exfiltrate\s+(confidential|sensitive|secret|private)\s+(information|data|credentials?)/i,
    weight: 35,
    category: 'DATA_EXFILTRATION',
    severity: 'CRITICAL',
    description: 'Data exfiltration attempt detected'
  },
  {
    id: 'PI-013',
    pattern: /pretend\s+(you\s+are|to\s+be)\s+(a\s+)?(different|unrestricted|uncensored|evil|malicious)/i,
    weight: 22,
    category: 'ROLE_MANIPULATION',
    severity: 'MEDIUM',
    description: 'Role pretending manipulation attempt'
  },
  {
    id: 'PI-014',
    pattern: /you\s+are\s+now\s+(a\s+)?(different|unrestricted|uncensored|evil|jailbroken|free)\s*(ai|model|bot)?/i,
    weight: 25,
    category: 'ROLE_MANIPULATION',
    severity: 'HIGH',
    description: 'Role reassignment attempt'
  },
  {
    id: 'PI-015',
    pattern: /new\s+(persona|identity|role|instructions?|directives?)\s*[:=]/i,
    weight: 20,
    category: 'INSTRUCTION_OVERRIDE',
    severity: 'MEDIUM',
    description: 'New persona/instruction injection'
  },
  {
    id: 'PI-016',
    pattern: /(dan|do\s+anything\s+now|jailbreak)\s*(mode|prompt|enabled?|activated?)?/i,
    weight: 30,
    category: 'JAILBREAK',
    severity: 'CRITICAL',
    description: 'Known jailbreak pattern (DAN) detected'
  },
  {
    id: 'PI-017',
    pattern: /forget\s+(everything|all|your)\s+(you\s+know|previous|prior|training|instructions?)/i,
    weight: 22,
    category: 'INSTRUCTION_OVERRIDE',
    severity: 'MEDIUM',
    description: 'Memory/training reset attempt'
  },
  {
    id: 'PI-018',
    pattern: /what\s+(is|are)\s+your\s+(system\s+prompt|instructions?|training|guidelines?|rules?)\s*\??/i,
    weight: 20,
    category: 'SYSTEM_PROMPT_EXTRACTION',
    severity: 'MEDIUM',
    description: 'System prompt inquiry detected'
  },
  {
    id: 'PI-019',
    pattern: /hypothetically\s+(speaking|if|assume|suppose).{0,50}(bypass|ignore|reveal|override)/i,
    weight: 18,
    category: 'PROMPT_INJECTION',
    severity: 'MEDIUM',
    description: 'Hypothetical framing evasion attempt'
  },
  {
    id: 'PI-020',
    pattern: /\[system\]|\[admin\]|\[developer\]|\[override\]|\[jailbreak\]/i,
    weight: 25,
    category: 'PROMPT_INJECTION',
    severity: 'HIGH',
    description: 'Fake system/admin tag injection'
  }
];

export function detectPromptInjection(text) {
  if (!text || typeof text !== 'string') {
    return { detected: false, findings: [], totalScore: 0 };
  }

  const findings = [];
  const matchedRuleIds = new Set();

  for (const rule of RULES) {
    if (matchedRuleIds.has(rule.id)) continue;
    if (rule.pattern.test(text)) {
      matchedRuleIds.add(rule.id);
      findings.push({
        ruleId: rule.id,
        category: rule.category,
        severity: rule.severity,
        description: rule.description,
        scoreContribution: rule.weight
      });
    }
  }

  // Check for combined attack indicators (multiple categories)
  const categories = new Set(findings.map(f => f.category));
  if (categories.size >= 3) {
    findings.push({
      ruleId: 'PI-COMBO',
      category: 'PROMPT_INJECTION',
      severity: 'CRITICAL',
      description: 'Multiple attack categories detected simultaneously',
      scoreContribution: 15
    });
  }

  const totalScore = findings.reduce((sum, f) => sum + f.scoreContribution, 0);

  return {
    detected: findings.length > 0,
    findings,
    totalScore
  };
}

export const INJECTION_RULES = RULES;

// server/src/controllers/firewallController.js
import crypto from 'crypto';
import { detectPromptInjection } from '../detection/promptInjectionDetector.js';
import { detectPII } from '../detection/piiDetector.js';
import { detectCredentials } from '../detection/credentialDetector.js';
import { redactText } from '../services/redactionService.js';
import { calculateRiskScore } from '../services/riskScoringService.js';
import { evaluatePolicy, DECISIONS } from '../services/policyEngine.js';
import { getSecurityExplanation, processUserRequest } from '../services/geminiService.js';
import { getSupabaseClient } from '../config/database.js';

// In-memory scan audit store for fallback when database table is pending migration
export const memoryScans = [];

export async function scan(req, res) {
  const { input, policy = 'BALANCED', requestGemini = false } = req.body;
  const userId = req.user?.userId || null;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid string input is required for scanning.' });
  }

  // 1. Run detection engines
  const injectionResult = detectPromptInjection(input);
  const piiResult = detectPII(input);
  const credentialResult = detectCredentials(input);

  // 2. Calculate deterministic risk score
  const riskResult = calculateRiskScore(injectionResult, piiResult, credentialResult);

  // 3. Evaluate security policy
  const policyEvaluation = evaluatePolicy(riskResult, piiResult, credentialResult, policy);
  const decision = policyEvaluation.decision;

  // 4. Redaction: Automatically redact PII & credentials
  const redactionResult = redactText(input, piiResult.findings, credentialResult.findings);
  const sanitizedInput = redactionResult.redactedText;

  // 5. Enforce firewall gate: BLOCKED requests NEVER reach Gemini!
  const isBlocked = decision === DECISIONS.BLOCK;
  const isReviewRequired = decision === DECISIONS.REQUIRE_REVIEW;

  let geminiForwarded = false;
  let explanation = null;
  let aiResponse = null;

  if (isBlocked) {
    // FIREWALL ENFORCEMENT: Gemini is NEVER called for blocked requests!
    geminiForwarded = false;

    // Use deterministic offline explanation for blocked attacks
    explanation = {
      explanation: `[FIREWALL BLOCK ENFORCED] Request terminated prior to AI model invocation. ${policyEvaluation.reason}`,
      source: 'firewall_enforcement'
    };
  } else if (isReviewRequired) {
    // Review required: Do not forward to Gemini model until review approved
    geminiForwarded = false;
    explanation = {
      explanation: `[REVIEW REQUIRED] Threat indicators require manual confirmation before forwarding to AI model. ${policyEvaluation.reason}`,
      source: 'policy_review'
    };
  } else {
    // Decision is ALLOW or ALLOW_WITH_REDACTION
    if (requestGemini) {
      geminiForwarded = true;

      // Invoke Gemini safely with sanitized text only (never raw secrets)
      const [explanationResult, modelResult] = await Promise.all([
        getSecurityExplanation(sanitizedInput, riskResult, piiResult, injectionResult, credentialResult),
        processUserRequest(sanitizedInput, riskResult)
      ]);

      explanation = explanationResult;
      aiResponse = modelResult;
    } else {
      // Deterministic explanation without external Gemini API call
      explanation = {
        explanation: `[INSPECTION COMPLETE] Input sanitized and evaluated under ${policy} policy. Risk level: ${riskResult.severity} (${riskResult.score}/100).`,
        source: 'deterministic_engine'
      };
    }
  }

  // 6. Privacy-preserving SHA-256 fingerprint (never store raw sensitive content)
  const inputFingerprint = crypto.createHash('sha256').update(input).digest('hex');
  const scanId = crypto.randomUUID();
  const processingStatus = isBlocked ? 'BLOCKED' : isReviewRequired ? 'REQUIRE_REVIEW' : 'COMPLETED';

  // 7. Persist audit log
  const auditRecord = {
    id: scanId,
    user_id: userId,
    input_fingerprint: inputFingerprint,
    risk_score: riskResult.score,
    severity: riskResult.severity,
    decision,
    threat_count: injectionResult.findings.length,
    pii_count: piiResult.findings.length,
    policy,
    gemini_requested: !!requestGemini,
    gemini_forwarded: geminiForwarded,
    processing_status: processingStatus,
    prompt_preview: isBlocked ? '[REQUEST BLOCKED BY FIREWALL]' : (sanitizedInput.slice(0, 120) + (sanitizedInput.length > 120 ? '...' : '')),
    decision_reason: policyEvaluation.reason,
    created_at: new Date().toISOString()
  };

  memoryScans.unshift(auditRecord);
  if (memoryScans.length > 200) memoryScans.pop();

  const supabase = getSupabaseClient();
  if (supabase && userId) {
    try {
      const dbRecord = {
        id: scanId,
        user_id: userId,
        input_fingerprint: inputFingerprint,
        risk_score: riskResult.score,
        severity: riskResult.severity,
        decision,
        threat_count: injectionResult.findings.length,
        pii_count: piiResult.findings.length,
        policy,
        gemini_requested: !!requestGemini,
        gemini_forwarded: geminiForwarded,
        processing_status: processingStatus
      };
      await supabase.from('scans').insert(dbRecord);

      // Persist threat findings if table exists
      const allFindings = [
        ...injectionResult.findings.map(f => ({
          id: crypto.randomUUID(),
          scan_id: scanId,
          category: f.category,
          severity: f.severity,
          rule_id: f.ruleId,
          description: f.description,
          score_contribution: f.scoreContribution
        })),
        ...piiResult.findings.map(f => ({
          id: crypto.randomUUID(),
          scan_id: scanId,
          category: `PII_${f.type}`,
          severity: f.severity,
          rule_id: f.ruleId,
          description: f.description,
          score_contribution: f.scoreContribution || 15
        })),
        ...credentialResult.findings.map(f => ({
          id: crypto.randomUUID(),
          scan_id: scanId,
          category: `CREDENTIAL_${f.type}`,
          severity: f.severity,
          rule_id: f.ruleId,
          description: f.description,
          score_contribution: 35
        }))
      ];

      if (allFindings.length > 0) {
        await supabase.from('threat_findings').insert(allFindings);
      }
    } catch (dbErr) {
      console.warn('[Audit] Supabase persistence fallback to memory:', dbErr.message);
    }
  }

  // 8. Return comprehensive, safe response
  return res.json({
    success: true,
    scanId,
    riskScore: riskResult.score,
    severity: riskResult.severity,
    decision,
    decisionReason: policyEvaluation.reason,
    policy,
    mandatoryBlock: !!policyEvaluation.mandatoryBlock,
    threats: {
      injection: {
        detected: injectionResult.detected,
        findings: injectionResult.findings
      },
      pii: {
        detected: piiResult.detected,
        types: piiResult.types,
        findings: piiResult.findings
      },
      credentials: {
        detected: credentialResult.detected,
        types: credentialResult.types,
        findings: credentialResult.findings.map(f => ({
          ruleId: f.ruleId,
          type: f.type,
          severity: f.severity,
          description: f.description,
          count: f.count
          // NEVER return raw credential values!
        }))
      }
    },
    redaction: {
      applied: redactionResult.redactionCount > 0,
      count: redactionResult.redactionCount,
      // For blocked inputs, do not expose raw text; for allowed, show redacted preview
      preview: isBlocked ? '[REQUEST BLOCKED BY FIREWALL]' : sanitizedInput
    },
    gemini: {
      requested: !!requestGemini,
      forwarded: geminiForwarded,
      explanation: explanation?.explanation || null,
      explanationSource: explanation?.source || null,
      response: aiResponse?.response || null,
      responseSource: aiResponse?.source || null
    },
    processingStatus,
    scoreBreakdown: riskResult.contributions,
    remediations: riskResult.remediations
  });
}

/**
 * Process permitted request directly through firewall with model forwarding
 */
export async function process(req, res) {
  req.body.requestGemini = true;
  return scan(req, res);
}


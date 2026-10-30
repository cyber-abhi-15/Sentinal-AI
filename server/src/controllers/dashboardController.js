// server/src/controllers/dashboardController.js
import { getSupabaseClient } from '../config/database.js';
import { memoryScans } from './firewallController.js';

export async function getStats(req, res) {
  const userId = req.user?.userId;
  const supabase = getSupabaseClient();
  let userScans = [];

  if (supabase && userId) {
    try {
      const { data, error } = await supabase.from('scans').select('*').eq('user_id', userId);
      if (!error && data) {
        userScans = data;
      }
    } catch (err) {
      console.warn('[Dashboard] DB error, using memory fallback:', err.message);
    }
  }

  if (userScans.length === 0) {
    userScans = userId ? memoryScans.filter(s => s.user_id === userId) : memoryScans;
  }

  const totalScans = userScans.length;
  const threatsDetected = userScans.filter(s => (s.threat_count > 0 || s.pii_count > 0)).length;
  const blockedRequests = userScans.filter(s => s.decision === 'BLOCK').length;
  const redactedRequests = userScans.filter(s => s.decision === 'ALLOW_WITH_REDACTION').length;
  const criticalThreats = userScans.filter(s => s.severity === 'CRITICAL').length;
  const avgRiskScore = totalScans > 0
    ? Math.round(userScans.reduce((acc, curr) => acc + (curr.risk_score || 0), 0) / totalScans)
    : 0;

  return res.json({
    success: true,
    stats: {
      totalScans,
      threatsDetected,
      blockedRequests,
      redactedRequests,
      avgRiskScore,
      criticalThreats
    }
  });
}

export async function getDistribution(req, res) {
  const userId = req.user?.userId;
  const supabase = getSupabaseClient();
  let userScans = [];

  if (supabase && userId) {
    try {
      const { data, error } = await supabase.from('scans').select('severity, decision').eq('user_id', userId);
      if (!error && data) {
        userScans = data;
      }
    } catch (err) {
      console.warn('[Dashboard] DB distribution error:', err.message);
    }
  }

  if (userScans.length === 0) {
    userScans = userId ? memoryScans.filter(s => s.user_id === userId) : memoryScans;
  }

  const severityCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  const decisionCounts = { ALLOW: 0, ALLOW_WITH_REDACTION: 0, BLOCK: 0, REQUIRE_REVIEW: 0 };

  for (const s of userScans) {
    if (s.severity && severityCounts[s.severity] !== undefined) {
      severityCounts[s.severity]++;
    }
    if (s.decision && decisionCounts[s.decision] !== undefined) {
      decisionCounts[s.decision]++;
    }
  }

  const severityDistribution = Object.entries(severityCounts).map(([name, value]) => ({ name, value }));
  const decisionDistribution = Object.entries(decisionCounts).map(([name, value]) => ({ name, value }));

  return res.json({
    success: true,
    data: {
      severityDistribution,
      decisionDistribution
    }
  });
}

export async function getActivity(req, res) {
  const userId = req.user?.userId;
  const supabase = getSupabaseClient();
  let activity = [];

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('id, risk_score, severity, decision, threat_count, pii_count, policy, processing_status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        activity = data;
      }
    } catch (err) {
      console.warn('[Dashboard] DB activity error:', err.message);
    }
  }

  if (activity.length === 0) {
    activity = userId ? memoryScans.filter(s => s.user_id === userId) : memoryScans;
  }

  return res.json({
    success: true,
    data: activity.slice(0, 20)
  });
}


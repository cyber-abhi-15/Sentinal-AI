-- Sentinel AI Initial Schema Migration
-- 001_initial_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SCANS TABLE
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  input_fingerprint TEXT,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  severity TEXT CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  decision TEXT CHECK (decision IN ('ALLOW', 'ALLOW_WITH_REDACTION', 'BLOCK', 'REQUIRE_REVIEW')),
  threat_count INTEGER DEFAULT 0,
  pii_count INTEGER DEFAULT 0,
  policy TEXT DEFAULT 'BALANCED' CHECK (policy IN ('STRICT', 'BALANCED', 'PERMISSIVE')),
  gemini_requested BOOLEAN DEFAULT FALSE,
  gemini_forwarded BOOLEAN DEFAULT FALSE,
  processing_status TEXT DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- THREAT FINDINGS TABLE
CREATE TABLE IF NOT EXISTS threat_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  rule_id TEXT NOT NULL,
  description TEXT,
  score_contribution INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  security_policy TEXT DEFAULT 'BALANCED' CHECK (security_policy IN ('STRICT', 'BALANCED', 'PERMISSIVE')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_severity ON scans(severity);
CREATE INDEX IF NOT EXISTS idx_scans_decision ON scans(decision);
CREATE INDEX IF NOT EXISTS idx_threat_findings_scan_id ON threat_findings(scan_id);
CREATE INDEX IF NOT EXISTS idx_threat_findings_category ON threat_findings(category);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Backend Service Role Policies (Service role bypasses RLS or has full access)
CREATE POLICY "Service role full access on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on scans" ON scans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on threat_findings" ON threat_findings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on user_settings" ON user_settings FOR ALL USING (true) WITH CHECK (true);


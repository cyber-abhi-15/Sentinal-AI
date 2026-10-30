// client/src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  Lock,
  EyeOff,
  Key,
  Zap,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  Bot
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-28 lg:pb-36 border-b border-slate-200 dark:border-white/[0.08]">
        {/* Glow Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-pink-500/20 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rainbow-soft border border-purple-500/30 text-xs font-mono font-bold tracking-wide uppercase mb-8 shadow-lg shadow-purple-500/20">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-rainbow font-extrabold">Next-Gen AI Security Gateway</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-none font-mono">
            SENTINEL <span className="text-rainbow">AI</span>
          </h1>

          <p className="mt-6 text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 dark:from-slate-100 dark:via-cyan-200 dark:to-pink-200 tracking-wide font-mono">
            Your AI. Your Data. Your Security.
          </p>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            An intelligent, privacy-first security firewall that intercepts prompt injections, blocks adversarial jailbreaks, redacts confidential PII, and guarantees malicious requests never reach external AI models.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link
              to="/scanner"
              className="btn-rainbow px-8 py-4 rounded-2xl text-sm font-bold flex items-center gap-2.5 shadow-2xl group cursor-pointer"
            >
              Launch Security Scanner
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-2xl text-sm font-mono font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#0B1020] hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/[0.12] transition-all flex items-center gap-2.5 shadow-xl hover:border-cyan-500/50 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-cyan-500" />
              Live Audit Dashboard
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Deterministic 0–100 Risk Engine
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
              Automated PII & Credential Masking
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pink-500" />
              Zero-Trust Gate Before Gemini
            </div>
          </div>
        </div>
      </section>

      {/* The Threat & The Defense Cards */}
      <section className="py-20 border-b border-slate-200 dark:border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Threat */}
            <div className="glass-card rounded-3xl p-8 border border-rose-500/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
              <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 font-mono font-bold text-xs uppercase tracking-wider mb-4">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                THE UNPROTECTED ATTACK SURFACE
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 font-mono">
                Direct AI Access Leaks Systems & Credentials
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Directly transmitting prompts to external LLMs exposes your organization to instruction overrides, system prompt exfiltration, and inadvertent leakage of proprietary API keys or personal data into third-party cloud logs.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/[0.08] space-y-2.5 text-xs font-mono text-rose-600 dark:text-rose-300">
                <div className="flex items-center gap-2">⚠️ System Prompt Extraction & Hijacking</div>
                <div className="flex items-center gap-2">⚠️ Plaintext Indian Mobile, Aadhaar & Card Exposure</div>
                <div className="flex items-center gap-2">⚠️ Exposed Cloud API Keys & Database Secrets</div>
              </div>
            </div>

            {/* The Defense */}
            <div className="glass-rainbow-card rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider mb-4">
                <Shield className="w-5 h-5 text-cyan-500" />
                THE SENTINEL AI DEFENSE GATEWAY
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 font-mono">
                Zero-Trust Deterministic Security Firewall
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Sentinel AI acts as a transparent, high-speed security proxy. Every prompt is inspected across 20+ injection rules, 9 PII detectors, and 12 secret signatures. Malicious requests are terminated at the gateway and never touch Gemini.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/[0.08] space-y-2.5 text-xs font-mono text-cyan-600 dark:text-cyan-300">
                <div className="flex items-center gap-2">🛡️ Blocked attacks terminate before LLM invocation</div>
                <div className="flex items-center gap-2">🛡️ Automatic redaction [EMAIL_REDACTED], [SECRET_REDACTED]</div>
                <div className="flex items-center gap-2">🛡️ Privacy-preserving audit logs with SHA-256 fingerprints</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Pipeline Workflow */}
      <section className="py-20 border-b border-slate-200 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase text-cyan-500 dark:text-cyan-400 font-bold tracking-widest block mb-2">
              Multi-Layer Defense
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
              End-to-End Firewall Workflow
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-mono">
              Deterministic verification and sanitation before, during, and after AI generation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all shadow-xl">
              <span className="text-xs font-mono text-purple-500 dark:text-purple-400 font-bold block mb-1">STAGE 01</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-mono">Input Ingestion</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Zod validation enforces length boundaries and extracts cryptographic SHA-256 fingerprints.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all shadow-xl">
              <span className="text-xs font-mono text-cyan-500 dark:text-cyan-400 font-bold block mb-1">STAGE 02</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-mono">Triple Detection</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Parallel detection across 20+ injection rules, 9 PII pattern categories, and 12 credential signatures.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-pink-500/20 hover:border-pink-500/50 transition-all shadow-xl">
              <span className="text-xs font-mono text-pink-500 dark:text-pink-400 font-bold block mb-1">STAGE 03</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-mono">Enforce & Block</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Calculates 0–100 risk score. If malicious, execution terminates with Gemini never invoked.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-xl">
              <span className="text-xs font-mono text-emerald-500 dark:text-emerald-400 font-bold block mb-1">STAGE 04</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-mono">Sanitized Forward</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Permitted requests are masked, served via Gemini, and output is scanned prior to final delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
              Core Security Capabilities
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">Prompt Injection Shield</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Detects instruction overrides, system prompt extraction, jailbreaks, and DAN role manipulation with explainable rule identifiers.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">Automated PII Redaction</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Detects emails, Indian and international phone numbers, credit cards, and Aadhaar numbers, replacing them with privacy placeholders.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-500 dark:text-pink-400 flex items-center justify-center mb-4 border border-pink-500/20">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">Credential Guardian</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Mandatory blocking for API keys, passwords, bearer tokens, AWS credentials, and database connection strings.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">Deterministic Risk Scoring</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Deterministic 0–100 scale categorizing risks into LOW, MEDIUM, HIGH, and CRITICAL with weighted rule breakdown.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">Security Policy Engine</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Select between STRICT, BALANCED, and PERMISSIVE enforcement policies depending on corporate safety requirements.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">Auditing & Fingerprints</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Stores SHA-256 input fingerprints and metadata, ensuring privacy compliance without ever persisting unredacted prompts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 text-center border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
            Protect Your AI Infrastructure Today
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-mono">
            Execute real prompt injection, privacy, and credential attacks against our live firewall.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/scanner"
              className="btn-rainbow px-10 py-4 rounded-2xl text-sm font-bold flex items-center gap-2.5 shadow-2xl"
            >
              Open Security Scanner
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

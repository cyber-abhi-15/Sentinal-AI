// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  Activity,
  XCircle,
  Eye,
  Cpu,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Layers,
  Terminal,
  Lock,
  History
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { dashboardAPI } from '../services/api.js';

const SEVERITY_COLORS = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#f43f5e'
};

const DECISION_COLORS = {
  ALLOW: '#10b981',
  ALLOW_WITH_REDACTION: '#06b6d4',
  REQUIRE_REVIEW: '#f59e0b',
  BLOCK: '#f43f5e'
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [statsRes, distRes, actRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getDistribution(),
        dashboardAPI.getActivity()
      ]);

      setStats(statsRes.data?.stats || null);
      setDistribution(distRes.data?.data || null);
      setActivity(actRes.data?.data || []);
      setError('');
    } catch (err) {
      console.error('[Dashboard Error]', err);
      setError('Failed to retrieve security metrics from gateway.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center font-mono">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Synchronizing audit telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rainbow-soft border border-cyan-500/30 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Live Telemetry & Audit Stream
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-cyan-400" />
              Security <span className="text-rainbow">Audit Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-mono">
              Real-time threat statistics, decision distributions, and cryptographic verification logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0B1020] px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
              Refresh
            </button>

            <Link
              to="/history"
              className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0B1020] px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] transition-all cursor-pointer shadow-sm"
            >
              <History className="w-3.5 h-3.5 text-emerald-500" />
              Full History
            </Link>

            <Link
              to="/scanner"
              className="flex items-center gap-2 btn-rainbow px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <Shield className="w-4 h-4" />
              Run New Scan
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* 6 Metric Stat Cards (Glowing Rainbow Cyber Edition) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Total Scans */}
          <div className="glass-card rounded-2xl p-4 border border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all" />
            <span className="text-[10px] font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-widest font-mono block">
              Total Scans
            </span>
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
              {stats?.totalScans ?? 0}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-mono">Gateway traffic</span>
          </div>

          {/* Threats Blocked / Found */}
          <div className="glass-card rounded-2xl p-4 border border-amber-500/20 hover:border-amber-500/50 hover:shadow-amber-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
            <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest font-mono block">
              Threats Found
            </span>
            <div className="text-3xl font-black font-mono text-amber-500 dark:text-amber-300 mt-1">
              {stats?.threatsDetected ?? 0}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-mono">Injections / PII</span>
          </div>

          {/* Blocked Requests */}
          <div className="glass-card rounded-2xl p-4 border border-rose-500/20 hover:border-rose-500/50 hover:shadow-rose-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all" />
            <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest font-mono block">
              Threats Blocked
            </span>
            <div className="text-3xl font-black font-mono text-rose-500 dark:text-rose-400 mt-1">
              {stats?.blockedRequests ?? 0}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-mono">AI not called</span>
          </div>

          {/* Protected / Redacted Requests */}
          <div className="glass-card rounded-2xl p-4 border border-teal-500/20 hover:border-teal-500/50 hover:shadow-teal-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all" />
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest font-mono block">
              Protected PII
            </span>
            <div className="text-3xl font-black font-mono text-teal-600 dark:text-teal-300 mt-1">
              {stats?.redactedRequests ?? 0}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-mono">Sanitized inputs</span>
          </div>

          {/* Average Risk */}
          <div className="glass-card rounded-2xl p-4 border border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all" />
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest font-mono block">
              Avg Risk Index
            </span>
            <div className="text-3xl font-black font-mono text-purple-600 dark:text-purple-300 mt-1">
              {stats?.avgRiskScore ?? 0}
              <span className="text-xs font-normal text-slate-400"> /100</span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-mono">Telemetry score</span>
          </div>

          {/* Critical Threats */}
          <div className="glass-card rounded-2xl p-4 border border-pink-500/20 hover:border-pink-500/50 hover:shadow-pink-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition-all" />
            <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest font-mono block">
              Critical Attacks
            </span>
            <div className="text-3xl font-black font-mono text-pink-600 dark:text-pink-300 mt-1">
              {stats?.criticalThreats ?? 0}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-mono">High priority</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Severity Distribution Chart */}
          <div className="glass-rainbow-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  Threat Severity Distribution
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Categorized threat impact tiers</p>
              </div>
            </div>

            {distribution?.severityDistribution && distribution.severityDistribution.some(d => d.value > 0) ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution.severityDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={50}
                      paddingAngle={4}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {distribution.severityDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SEVERITY_COLORS[entry.name] || '#64748b'}
                          stroke="transparent"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#070A14',
                        borderColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50/50 dark:bg-[#060810]/40">
                <Shield className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-mono text-slate-400">No severity records logged yet</p>
                <Link to="/scanner" className="text-xs font-mono text-cyan-500 hover:underline mt-2 font-bold">
                  Execute scans to view telemetry
                </Link>
              </div>
            )}
          </div>

          {/* Decision Distribution Chart */}
          <div className="glass-rainbow-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Gateway Decision Distribution
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Firewall enforcement policy results</p>
              </div>
            </div>

            {distribution?.decisionDistribution && distribution.decisionDistribution.some(d => d.value > 0) ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribution.decisionDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-[#141B2E]" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} font-family="monospace" />
                    <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} font-family="monospace" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#070A14',
                        borderColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {distribution.decisionDistribution.map((entry, index) => (
                        <Cell
                          key={`bar-${index}`}
                          fill={DECISION_COLORS[entry.name] || '#3b82f6'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50/50 dark:bg-[#060810]/40">
                <Shield className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-mono text-slate-400">No decision records logged yet</p>
                <Link to="/scanner" className="text-xs font-mono text-cyan-500 hover:underline mt-2 font-bold">
                  Execute scans to view telemetry
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="glass-rainbow-card p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Recent Firewall Interceptions
              </h3>
              <p className="text-xs text-slate-400 font-mono">Live audit log of processed requests</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-200 dark:border-white/[0.08]">
                {activity.length} records captured
              </span>
              <Link
                to="/history"
                className="text-xs font-mono font-bold text-cyan-500 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {activity.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/[0.08] text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Scan ID</th>
                    <th className="py-3 px-3">Decision</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3">Severity</th>
                    <th className="py-3 px-3">Policy</th>
                    <th className="py-3 px-3">Gemini Gate</th>
                    <th className="py-3 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {activity.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-3 text-cyan-600 dark:text-cyan-300 font-bold">
                        {item.id.slice(0, 8)}...
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            item.decision === 'BLOCK'
                              ? 'bg-rose-500/20 text-rose-500 dark:text-rose-300 border border-rose-500/30'
                              : item.decision === 'ALLOW_WITH_REDACTION'
                              ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                              : item.decision === 'REQUIRE_REVIEW'
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {item.decision}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-white">
                        {item.risk_score} / 100
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-bold ${
                            item.severity === 'CRITICAL'
                              ? 'text-rose-500 dark:text-rose-400'
                              : item.severity === 'HIGH'
                              ? 'text-orange-500 dark:text-orange-400'
                              : item.severity === 'MEDIUM'
                              ? 'text-amber-500 dark:text-amber-400'
                              : 'text-emerald-500 dark:text-emerald-400'
                          }`}
                        >
                          {item.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                        {item.policy}
                      </td>
                      <td className="py-3.5 px-3">
                        {item.gemini_forwarded ? (
                          <span className="text-emerald-500 dark:text-emerald-400 font-bold">FORWARDED</span>
                        ) : (
                          <span className="text-rose-500 dark:text-rose-400 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            STOPPED
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                        {new Date(item.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 font-mono border border-dashed border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50/50 dark:bg-[#060810]/40">
              No audit logs captured yet. Execute tests in the Security Scanner to populate telemetry records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

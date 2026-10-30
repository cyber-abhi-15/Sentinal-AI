// client/src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Eye,
  Key,
  Clock,
  ChevronRight,
  RefreshCw,
  Loader2,
  X,
  Lock,
  ArrowRight
} from 'lucide-react';
import { scansAPI } from '../services/api.js';

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [decisionFilter, setDecisionFilter] = useState('ALL');
  const [selectedScan, setSelectedScan] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchScans = async () => {
    try {
      const res = await scansAPI.getScans();
      if (res.data?.success) {
        setScans(res.data.data || []);
      }
      setError('');
    } catch (err) {
      console.error('[History] Fetch error:', err);
      setError('Unable to load scan history records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchScans();
  };

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      await scansAPI.clearScans();
      setScans([]);
      setSelectedScan(null);
      setShowClearConfirm(false);
    } catch (err) {
      console.error('[History] Clear error:', err);
      setError('Failed to clear history records.');
    } finally {
      setClearing(false);
    }
  };

  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();
    try {
      await scansAPI.deleteScan(id);
      setScans(prev => prev.filter(s => s.id !== id));
      if (selectedScan?.id === id) {
        setSelectedScan(null);
      }
    } catch (err) {
      console.error('[History] Delete item error:', err);
    }
  };

  // Filter & Search logic
  const filteredScans = scans.filter(scan => {
    // Severity filter
    if (severityFilter !== 'ALL' && scan.severity !== severityFilter) {
      return false;
    }
    // Decision filter
    if (decisionFilter !== 'ALL' && scan.decision !== decisionFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const preview = (scan.prompt_preview || scan.input_fingerprint || '').toLowerCase();
      const id = (scan.id || '').toLowerCase();
      const policy = (scan.policy || '').toLowerCase();
      return preview.includes(q) || id.includes(q) || policy.includes(q);
    }
    return true;
  });

  const getDecisionBadge = (decision) => {
    switch (decision) {
      case 'BLOCK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3 h-3 text-rose-400" />
            BLOCK
          </span>
        );
      case 'ALLOW_WITH_REDACTION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Eye className="w-3 h-3 text-cyan-400" />
            REDACTED
          </span>
        );
      case 'REQUIRE_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            REVIEW
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            ALLOW
          </span>
        );
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="font-mono text-xs font-bold text-rose-400">CRITICAL</span>;
      case 'HIGH':
        return <span className="font-mono text-xs font-bold text-orange-400">HIGH</span>;
      case 'MEDIUM':
        return <span className="font-mono text-xs font-bold text-amber-400">MEDIUM</span>;
      default:
        return <span className="font-mono text-xs font-bold text-emerald-400">LOW</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center font-mono">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Retrieving security audit history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] dark:border-white/[0.08] light:border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rainbow-soft border border-purple-500/30 text-xs font-mono font-bold text-purple-400 mb-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Audit Log & Telemetry Archives
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <History className="w-8 h-8 text-cyan-400" />
              Scan <span className="text-rainbow">History</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-mono">
              Privacy-preserving historical audit records. Original credentials and raw sensitive prompts are never stored.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0B1020] px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
              Refresh
            </button>

            {scans.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 px-3.5 py-2.5 rounded-xl border border-rose-500/30 transition-all cursor-pointer shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear History
              </button>
            )}

            <Link
              to="/scanner"
              className="btn-rainbow px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              New Scan
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by preview, ID, or fingerprint..."
              className="w-full bg-slate-50 dark:bg-[#070A14] border border-slate-200 dark:border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-50 dark:bg-[#070A14] border border-slate-200 dark:border-white/[0.1] rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">ALL SEVERITIES</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            {/* Decision Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Decision:</span>
              <select
                value={decisionFilter}
                onChange={(e) => setDecisionFilter(e.target.value)}
                className="bg-slate-50 dark:bg-[#070A14] border border-slate-200 dark:border-white/[0.1] rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">ALL DECISIONS</option>
                <option value="ALLOW">ALLOW</option>
                <option value="ALLOW_WITH_REDACTION">ALLOW_WITH_REDACTION</option>
                <option value="BLOCK">BLOCK</option>
                <option value="REQUIRE_REVIEW">REQUIRE_REVIEW</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table / Records */}
        <div className="glass-rainbow-card p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-slate-400">
              Showing {filteredScans.length} of {scans.length} scan records
            </span>
          </div>

          {filteredScans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/[0.08] text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3">Decision</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3">Severity</th>
                    <th className="py-3 px-3">Prompt Preview</th>
                    <th className="py-3 px-3">Policy</th>
                    <th className="py-3 px-3">Gemini</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {filteredScans.map((scan) => (
                    <tr
                      key={scan.id}
                      onClick={() => setSelectedScan(scan)}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        <div className="font-bold text-slate-700 dark:text-slate-200">
                          {new Date(scan.created_at).toLocaleTimeString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(scan.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getDecisionBadge(scan.decision)}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-white whitespace-nowrap">
                        {scan.risk_score} / 100
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getSeverityBadge(scan.severity)}
                      </td>
                      <td className="py-3.5 px-3 max-w-xs truncate text-slate-600 dark:text-slate-300">
                        {scan.prompt_preview || `SHA-256: ${scan.input_fingerprint?.slice(0, 16)}...`}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        {scan.policy}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {scan.gemini_forwarded ? (
                          <span className="text-emerald-500 dark:text-emerald-400 font-bold">FORWARDED</span>
                        ) : (
                          <span className="text-rose-500 dark:text-rose-400 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            STOPPED
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleDeleteItem(e, scan.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10 cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-xs font-mono text-slate-400 border border-dashed border-slate-200 dark:border-white/[0.08] rounded-xl bg-slate-50/50 dark:bg-[#060810]/40">
              <History className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="font-bold text-slate-700 dark:text-slate-300">No scan history matches your filter criteria</p>
              <p className="text-slate-500 text-[11px] mt-1 max-w-xs mx-auto">
                Execute new prompt scans in the Security Scanner to populate real-time audit records.
              </p>
              <Link
                to="/scanner"
                className="inline-flex items-center gap-2 btn-rainbow px-4 py-2 rounded-xl text-xs font-bold mt-4"
              >
                Launch Scanner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Scan Details Modal / Drawer */}
        {selectedScan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
            <div className="glass-rainbow-card max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] dark:border-white/[0.08] light:border-slate-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-black font-mono text-slate-900 dark:text-white">
                    Scan Audit Detail #{selectedScan.id?.slice(0, 8)}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="bg-slate-100 dark:bg-[#070A14] p-3 rounded-xl border border-white/[0.08]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Decision</span>
                  <div className="mt-1">{getDecisionBadge(selectedScan.decision)}</div>
                </div>

                <div className="bg-slate-100 dark:bg-[#070A14] p-3 rounded-xl border border-white/[0.08]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Risk Score</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {selectedScan.risk_score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-[#070A14] p-3 rounded-xl border border-white/[0.08]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Severity</span>
                  <div className="mt-1">{getSeverityBadge(selectedScan.severity)}</div>
                </div>

                <div className="bg-slate-100 dark:bg-[#070A14] p-3 rounded-xl border border-white/[0.08]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Gemini Gate</span>
                  <div className="mt-1 font-bold text-xs">
                    {selectedScan.gemini_forwarded ? (
                      <span className="text-emerald-400">FORWARDED</span>
                    ) : (
                      <span className="text-rose-400">BLOCKED</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Prompt Preview */}
              <div className="bg-slate-100 dark:bg-[#070A14] p-4 rounded-xl border border-white/[0.08] font-mono">
                <span className="text-xs font-bold text-cyan-400 block mb-1">Sanitized Prompt Preview</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-all">
                  {selectedScan.prompt_preview || '[No preview saved - cryptographic hash only]'}
                </p>
              </div>

              {/* SHA-256 Fingerprint */}
              <div className="bg-slate-100 dark:bg-[#070A14] p-4 rounded-xl border border-white/[0.08] font-mono">
                <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                  Cryptographic SHA-256 Audit Fingerprint
                </span>
                <p className="text-xs text-purple-400 dark:text-purple-300 break-all select-all">
                  {selectedScan.input_fingerprint || 'N/A'}
                </p>
              </div>

              {/* Threat Findings if present */}
              {selectedScan.threat_findings && selectedScan.threat_findings.length > 0 && (
                <div className="space-y-2 font-mono">
                  <span className="text-xs font-bold text-slate-400 uppercase block">
                    Recorded Threat Signatures ({selectedScan.threat_findings.length})
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selectedScan.threat_findings.map((f, i) => (
                      <div key={i} className="bg-slate-100 dark:bg-[#070A14] p-2.5 rounded-lg border border-rose-500/30 text-xs flex items-center justify-between">
                        <span className="text-rose-400 font-bold">{f.rule_id}</span>
                        <span className="text-slate-400">{f.description}</span>
                        <span className="text-rose-400 font-bold">+{f.score_contribution} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedScan(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold font-mono bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close Detail
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="glass-card max-w-md w-full p-6 rounded-2xl shadow-2xl border border-rose-500/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black font-mono text-slate-900 dark:text-white">Clear All Scan History?</h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                This will permanently delete all scan records from your audit log. This action cannot be reversed.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  disabled={clearing}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearHistory}
                  disabled={clearing}
                  className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {clearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Confirm Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


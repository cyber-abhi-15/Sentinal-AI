// client/src/layouts/AppLayout.jsx
import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Shield, Activity, LayoutDashboard, History, LogOut, Sun, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-200 ${
      isDark ? 'bg-[#080B16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Background Ambient Glows */}
      {isDark ? (
        <>
          <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
          <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed bottom-10 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        </>
      )}

      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
        isDark ? 'bg-[#080B16]/85 border-white/[0.08] shadow-2xl' : 'bg-white/85 border-slate-200 shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-rainbow-gradient p-[1.5px] shadow-lg shadow-purple-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
                isDark ? 'bg-[#080B16]' : 'bg-white'
              }`}>
                <Shield className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className={`text-xl font-black tracking-tight flex items-center gap-1.5 font-mono ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                SENTINEL <span className="text-rainbow font-extrabold">AI</span>
              </span>
              <span className="text-[9px] tracking-widest uppercase text-slate-400 font-mono block -mt-1 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                Firewall Active
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink
              to="/scanner"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-400/50 shadow-md shadow-cyan-500/20'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`
              }
            >
              <Activity className="w-4 h-4 text-cyan-500" />
              Scanner
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 text-pink-400 border border-pink-400/50 shadow-md shadow-pink-500/20'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-pink-500" />
              Dashboard
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 text-emerald-400 border border-emerald-400/50 shadow-md shadow-emerald-500/20'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`
              }
            >
              <History className="w-4 h-4 text-emerald-500" />
              Scan History
            </NavLink>
          </nav>

          {/* Right Controls: Theme Toggle & User Auth */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
                isDark
                  ? 'bg-slate-900 border-white/[0.12] text-amber-300 hover:text-amber-200 hover:border-amber-400/50 hover:bg-slate-800 shadow-md'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-purple-600 hover:border-purple-300 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 animate-spin-slow text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-purple-600" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2.5">
                <span className={`hidden sm:inline-block text-xs font-mono px-3 py-1.5 rounded-xl border ${
                  isDark ? 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30' : 'text-slate-700 bg-slate-100 border-slate-300'
                }`}>
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-600 px-3 py-1.5 rounded-xl border border-rose-500/30 transition-all font-semibold shadow-sm cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all ${
                    isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.05]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold text-white px-4 py-1.5 rounded-xl btn-rainbow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 text-center text-xs transition-colors duration-200 ${
        isDark ? 'border-white/[0.06] bg-[#060810]/90 text-slate-500' : 'border-slate-200 bg-white/90 text-slate-500 shadow-inner'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <span>SENTINEL AI FIREWALL v1.0 • RAINBOW EDITION</span>
          </div>
          <div className="text-rainbow font-semibold">Your AI. Your Data. Your Security.</div>
        </div>
      </footer>
    </div>
  );
}

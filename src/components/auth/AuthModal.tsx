import React, { useState } from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { getDiagnosticReport } from '../../services/configService';
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Database,
  ArrowRight,
  Shield,
  Loader2,
  KeyRound,
  Terminal,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'reset';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const { signIn, signUp, resetPassword, authLoading, authError } = useCareerSaathi();

  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();
  const diagnostic = getDiagnosticReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMsg(null);

    if (!isConfigured) {
      setLocalError(
        'Supabase configuration is required to authenticate. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment.'
      );
      return;
    }

    if (!email) {
      setLocalError('Please enter your email address.');
      return;
    }

    if (mode !== 'reset' && !password) {
      setLocalError('Please enter your password.');
      return;
    }

    if (mode === 'signup' && !fullName) {
      setLocalError('Please enter your full name.');
      return;
    }

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else if (mode === 'signup') {
        await signUp({
          email,
          password,
          fullName,
          college,
          branch,
        });
        setSuccessMsg('Account created successfully! Session established.');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else if (mode === 'reset') {
        await resetPassword(email);
        setSuccessMsg(`Password reset link dispatched to ${email}. Please check your inbox.`);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication operation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header decoration */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {mode === 'signin' && 'Student Sign In'}
                {mode === 'signup' && 'Create Student Account'}
                {mode === 'reset' && 'Password Recovery'}
              </h3>
              <p className="text-xs text-slate-400">
                Persistent personal career intelligence platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supabase status indicator */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Auth Engine:</span>
            <span className="font-semibold text-slate-200">Supabase Auth & RLS</span>
          </div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
              isConfigured
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            {isConfigured ? 'Connected' : 'Missing Configuration'}
          </span>
        </div>

        {/* Configuration notice if env vars are missing */}
        {!isConfigured && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-200 space-y-2">
            <div className="flex items-center space-x-1.5 font-semibold text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Developer Configuration Required</span>
            </div>
            <p className="text-[11px] text-rose-300/90 leading-relaxed">
              Career Saathi AI requires authoritative Supabase credentials. Missing variables:
            </p>
            <div className="bg-slate-950/80 p-2 rounded-lg font-mono text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3 h-3 text-slate-500" />
                <span>VITE_SUPABASE_URL: {diagnostic.config.hasSupabaseUrl ? '✓ configured' : '✗ missing'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-3 h-3 text-slate-500" />
                <span>VITE_SUPABASE_PUBLISHABLE_KEY: {diagnostic.config.hasSupabaseKey ? '✓ configured' : '✗ missing'}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Configure these in your <code>.env</code> file. No mock fallback is used in production.
            </p>
          </div>
        )}

        {/* Error / Success feedback */}
        {(localError || authError) && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localError || authError}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Shalini Sharma"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      setLocalError(null);
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  College / Univ
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="IIT, NIT, BITS..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Branch / Major
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="CSE, ECE, IT..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with Supabase...</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'signup' ? (
              <>
                <span>Create Student Account</span>
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Send Password Reset Link</span>
                <KeyRound className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle Footer */}
        <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'signin' && (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setLocalError(null);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
              >
                Create one now
              </button>
            </span>
          )}
          {mode === 'signup' && (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setLocalError(null);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
              >
                Sign in instead
              </button>
            </span>
          )}
          {mode === 'reset' && (
            <span>
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setLocalError(null);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
              >
                Return to sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

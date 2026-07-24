import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_ACCOUNTS } from '../../lib/firebaseAuth';
import { UserRole, PlatformView } from '../../types';
import {
  ShieldCheck,
  UserCheck,
  KeyRound,
  Mail,
  Lock,
  User,
  Briefcase,
  ArrowRight,
  LogOut,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';
import { IslamicPatternBg } from '../IslamicPatternBg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlatformView?: (view: PlatformView) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSelectPlatformView }) => {
  const {
    currentUser,
    loginWithEmail,
    loginDemoPreset,
    registerWithEmail,
    logout,
    loading
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('demo');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTitle, setRegTitle] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [regPlatform, setRegPlatform] = useState<PlatformView>('customer_portal');
  const [regError, setRegError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoLogin = async (demoId: string, targetPlatform: PlatformView) => {
    setIsSubmitting(true);
    setLoginError(null);
    const res = await loginDemoPreset(demoId);
    setIsSubmitting(false);
    if (res.success && res.user) {
      if (onSelectPlatformView) {
        onSelectPlatformView(res.user.targetPlatform || targetPlatform);
      }
      onClose();
    } else {
      setLoginError(res.error || 'Failed to authenticate with Firebase');
    }
  };

  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }
    setIsSubmitting(true);
    setLoginError(null);
    const res = await loginWithEmail(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (res.success && res.user) {
      if (onSelectPlatformView) {
        onSelectPlatformView(res.user.targetPlatform);
      }
      onClose();
    } else {
      setLoginError(res.error || 'Invalid credentials or network error.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setRegError('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    setRegError(null);
    const res = await registerWithEmail(
      regEmail,
      regPassword,
      regName,
      regRole,
      regTitle || `${regRole.toUpperCase()} Professional`,
      regPlatform
    );
    setIsSubmitting(false);
    if (res.success && res.user) {
      if (onSelectPlatformView) {
        onSelectPlatformView(res.user.targetPlatform);
      }
      onClose();
    } else {
      setRegError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0B132B] text-white rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden my-8">
        <IslamicPatternBg />

        {/* Modal Header */}
        <div className="relative z-10 p-6 sm:p-8 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Firebase Authentication Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
              HALALCHAIN™ Enterprise Sign In & Profile Management
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              Secure email/password authentication backed by Firebase Auth & Firestore user records.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Auth State Indicator if already signed in */}
        {currentUser && (
          <div className="relative z-10 bg-[#1C2541] px-6 sm:px-8 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.displayName}
                className="w-10 h-10 rounded-full border-2 border-amber-400/80 object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{currentUser.displayName}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-emerald-500/40">
                    AUTHENTICATED
                  </span>
                </div>
                <div className="text-slate-300 text-[11px]">{currentUser.title} • {currentUser.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onSelectPlatformView) {
                    onSelectPlatformView(currentUser.targetPlatform);
                  }
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Go to {currentUser.targetPlatform.replace('_', ' ').toUpperCase()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="relative z-10 px-6 sm:px-8 pt-4 border-b border-white/10 flex items-center gap-2 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'demo'
                ? 'bg-[#1C2541] text-amber-300 border-t border-x border-amber-500/30 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>1. Presentation Demo Accounts (9 Roles)</span>
          </button>

          <button
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'login'
                ? 'bg-[#1C2541] text-amber-300 border-t border-x border-amber-500/30 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>2. Email & Password Sign In</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'register'
                ? 'bg-[#1C2541] text-amber-300 border-t border-x border-amber-500/30 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>3. Register New Account</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="relative z-10 p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: DEMO ACCOUNTS */}
          {activeTab === 'demo' && (
            <div className="space-y-6">
              <div className="bg-[#1C2541] p-4 rounded-2xl border border-amber-500/20 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-400" />
                    Preset Demonstration Accounts for Presentations
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded text-[10px]">
                    Password: HalalChain2026!
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Click any demo account to instantly log in via Firebase Authentication and auto-redirect to their assigned platform dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                {DEMO_ACCOUNTS.map((acc) => (
                  <div
                    key={acc.id}
                    className="bg-[#1C2541] hover:bg-[#253259] p-4 rounded-2xl border border-amber-500/20 hover:border-amber-400/60 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${acc.badgeColor}`}>
                          {acc.role.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {acc.targetPlatform === 'exec_platform' ? 'Exec Platform' : acc.targetPlatform === 'ops_platform' ? 'Ops Platform' : 'Client Portal'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 rounded-full border border-amber-400/60 object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                            {acc.name}
                          </div>
                          <div className="text-[10px] text-slate-300">{acc.title}</div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 bg-black/30 p-2 rounded-xl space-y-0.5">
                        <div><span className="text-slate-500">Email:</span> <code className="text-amber-300">{acc.email}</code></div>
                        <div className="text-slate-300 text-[10px] italic mt-1">{acc.description}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDemoLogin(acc.id, acc.targetPlatform)}
                      disabled={isSubmitting}
                      className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold border border-amber-500/40 transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                      <span>Sign In as {acc.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EMAIL LOGIN FORM */}
          {activeTab === 'login' && (
            <div className="max-w-md mx-auto space-y-6 font-mono text-xs">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold font-serif text-amber-300">Firebase Email & Password Login</h3>
                <p className="text-slate-400 text-[11px]">Enter credentials to authenticate with Firebase Auth.</p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-200 border border-rose-500/40 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. gm@halalchain.org"
                    className="w-full bg-[#1C2541] text-white p-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Password:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#1C2541] text-white p-3 pr-10 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? 'Authenticating with Firebase...' : 'Sign In to HalalChain™'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: REGISTER NEW USER FORM */}
          {activeTab === 'register' && (
            <div className="max-w-lg mx-auto space-y-6 font-mono text-xs">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold font-serif text-cyan-300">Create New Enterprise Profile</h3>
                <p className="text-slate-400 text-[11px]">Registers a new account in Firebase Auth and creates profile record in Firestore.</p>
              </div>

              {regError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-200 border border-rose-500/40 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Full Name:</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Dr. Rashid Ibrahim"
                      className="w-full bg-[#1C2541] text-white p-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Official Email:</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="r.ibrahim@institution.org"
                      className="w-full bg-[#1C2541] text-white p-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Password:</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-[#1C2541] text-white p-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Job Title / Designation:</label>
                    <input
                      type="text"
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value)}
                      placeholder="e.g. Senior Auditor"
                      className="w-full bg-[#1C2541] text-white p-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Enterprise System Role:</label>
                    <select
                      value={regRole}
                      onChange={(e) => {
                        const newRole = e.target.value as UserRole;
                        setRegRole(newRole);
                        if (newRole === 'exec') setRegPlatform('exec_platform');
                        else if (newRole === 'customer') setRegPlatform('customer_portal');
                        else setRegPlatform('ops_platform');
                      }}
                      className="w-full bg-[#1C2541] text-amber-300 p-3 rounded-xl border border-amber-500/30 focus:outline-none"
                    >
                      <option value="customer">Customer / Web3 Client</option>
                      <option value="exec">General Manager / Executive</option>
                      <option value="sales">Sales Manager</option>
                      <option value="pm">Project Manager</option>
                      <option value="tech_auditor">Technical Reviewer</option>
                      <option value="business_analyst">Business Reviewer</option>
                      <option value="scholar">Sharia Scholar</option>
                      <option value="qa">Quality Assurance</option>
                      <option value="finance">Finance Officer</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Target Dashboard Platform:</label>
                    <select
                      value={regPlatform}
                      onChange={(e) => setRegPlatform(e.target.value as PlatformView)}
                      className="w-full bg-[#1C2541] text-amber-300 p-3 rounded-xl border border-amber-500/30 focus:outline-none"
                    >
                      <option value="customer_portal">Customer Portal</option>
                      <option value="ops_platform">Operations Platform</option>
                      <option value="exec_platform">Executive Platform</option>
                      <option value="public_website">Public Registry</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? 'Creating Firebase Profile...' : 'Register Enterprise User'}
                  <UserCheck className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

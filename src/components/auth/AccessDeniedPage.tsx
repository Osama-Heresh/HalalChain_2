import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRbac } from '../../context/RbacContext';
import { PlatformView, UserRole } from '../../types';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  KeyRound,
  UserCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Shield,
  Briefcase
} from 'lucide-react';
import { IslamicPatternBg } from '../IslamicPatternBg';

interface AccessDeniedPageProps {
  targetPlatform?: PlatformView;
  targetTab?: string;
  requiredPermission?: string;
  onRedirectAuthorized?: () => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  targetPlatform,
  targetTab,
  requiredPermission,
  onRedirectAuthorized
}) => {
  const { currentUser, openAuthModal } = useAuth();
  const { roles } = useRbac();
  const [escalationSent, setEscalationSent] = useState(false);

  const currentRoleDef = roles.find((r) => r.id === (currentUser?.role || 'customer'));

  const handleRequestEscalation = () => {
    setEscalationSent(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-8 font-mono text-white">
      <div className="relative w-full max-w-2xl bg-[#0B132B] rounded-3xl border border-rose-500/40 shadow-2xl overflow-hidden p-6 sm:p-10 text-center space-y-6">
        <IslamicPatternBg />

        {/* Top Warning Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-300 text-xs font-bold border border-rose-500/30">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>403 FORBIDDEN • ENTERPRISE RBAC ENFORCEMENT</span>
        </div>

        {/* Large Animated Lock Icon */}
        <div className="relative z-10 my-2 flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center shadow-2xl shadow-rose-500/20">
            <Lock className="w-10 h-10 text-rose-400" />
          </div>
        </div>

        {/* Title & Arabic Subtitle */}
        <div className="relative z-10 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Access Denied / Restricted Module
          </h1>
          <p className="text-amber-300 font-serif text-sm dir-rtl">
            عذراً، لا تملك الصلاحية الكافية للوصول إلى هذا القسم
          </p>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Your assigned role does not hold the required permission policy to view this platform, tab, or execute this action.
          </p>
        </div>

        {/* Diagnostic Metadata Card */}
        <div className="relative z-10 bg-[#1C2541] rounded-2xl border border-white/10 p-4 text-left space-y-2 text-xs">
          <div className="text-[10px] uppercase text-slate-400 font-bold border-b border-white/10 pb-1 flex items-center justify-between">
            <span>Security Context Diagnosis</span>
            <span className="text-rose-400 font-bold">UNAUTHORIZED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
            <div>
              <span className="text-slate-400">Authenticated User:</span>{' '}
              <span className="text-white font-bold">{currentUser?.displayName || 'Anonymous User'}</span>
            </div>
            <div>
              <span className="text-slate-400">Assigned Role:</span>{' '}
              <span className="text-amber-300 font-bold">{currentRoleDef?.name || currentUser?.role || 'Guest'}</span>
            </div>
            {targetPlatform && (
              <div>
                <span className="text-slate-400">Target Platform:</span>{' '}
                <code className="text-cyan-300 font-bold">{targetPlatform.toUpperCase()}</code>
              </div>
            )}
            {targetTab && (
              <div>
                <span className="text-slate-400">Attempted Module Tab:</span>{' '}
                <code className="text-cyan-300 font-bold">{targetTab}</code>
              </div>
            )}
            {requiredPermission && (
              <div className="sm:col-span-2 bg-black/40 p-2 rounded-xl border border-rose-500/20">
                <span className="text-slate-400">Required Policy Key:</span>{' '}
                <code className="text-rose-300 font-bold text-[10px]">{requiredPermission}</code>
              </div>
            )}
          </div>
        </div>

        {/* Escalation Confirmation */}
        {escalationSent && (
          <div className="relative z-10 p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Permission escalation request dispatched to General Manager (Tariq Al-Mansoor).</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onRedirectAuthorized && (
            <button
              onClick={onRedirectAuthorized}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Authorized Workspace</span>
            </button>
          )}

          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1C2541] hover:bg-[#253259] text-white font-bold text-xs border border-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Switch Role / Sign In</span>
          </button>

          {!escalationSent && (
            <button
              onClick={handleRequestEscalation}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-rose-400" />
              <span>Request GM Escalation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

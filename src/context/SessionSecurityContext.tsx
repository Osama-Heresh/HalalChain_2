import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { recordAuditEvent } from '../lib/auditLogger';

interface SessionSecurityContextType {
  sessionDurationSeconds: number;
  remainingSeconds: number;
  isSessionWarningOpen: boolean;
  extendSession: () => void;
  lockSession: () => void;
  securityEventsCount: number;
  lastLoginIp: string;
  activeSessionId: string;
}

const INACTIVITY_TIMEOUT_SECONDS = 15 * 60; // 15 Minutes
const WARNING_THRESHOLD_SECONDS = 2 * 60;  // 2 Minutes Warning

const SessionSecurityContext = createContext<SessionSecurityContextType | undefined>(undefined);

export const SessionSecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [remainingSeconds, setRemainingSeconds] = useState(INACTIVITY_TIMEOUT_SECONDS);
  const [isSessionWarningOpen, setIsSessionWarningOpen] = useState(false);
  const [securityEventsCount, setSecurityEventsCount] = useState(0);
  const [activeSessionId] = useState(() => `sess_${Math.random().toString(36).substring(2, 11)}`);
  const [lastLoginIp] = useState('185.191.171.24 (Cloud Run Secured)');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetActivityTimer = () => {
    lastActivityRef.current = Date.now();
    setRemainingSeconds(INACTIVITY_TIMEOUT_SECONDS);
    if (isSessionWarningOpen) {
      setIsSessionWarningOpen(false);
    }
  };

  // Activity listeners
  useEffect(() => {
    if (!currentUser) return;

    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle updates to max once every 10s to avoid high state churn
      if (now - lastActivityRef.current > 10000) {
        lastActivityRef.current = now;
        setRemainingSeconds(INACTIVITY_TIMEOUT_SECONDS);
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [currentUser]);

  // Main countdown tick
  useEffect(() => {
    if (!currentUser) return;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const remaining = Math.max(0, INACTIVITY_TIMEOUT_SECONDS - elapsed);
      setRemainingSeconds(remaining);

      if (remaining <= WARNING_THRESHOLD_SECONDS && remaining > 0 && !isSessionWarningOpen) {
        setIsSessionWarningOpen(true);
      }

      if (remaining <= 0) {
        // Auto-logout
        if (timerRef.current) clearInterval(timerRef.current);
        recordAuditEvent(currentUser, 'Session Inactivity Auto-Logout', {
          status: 'WARNING',
          notes: 'Session automatically terminated due to 15 minutes of inactivity.'
        });
        logout();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentUser, isSessionWarningOpen, logout]);

  // Detect concurrent / multiple logins simulation check
  useEffect(() => {
    if (!currentUser) return;

    const sessionKey = `halalchain_session_${currentUser.uid}`;
    const existingSession = localStorage.getItem(sessionKey);

    if (existingSession && existingSession !== activeSessionId) {
      // Multiple logins detected for same account
      setSecurityEventsCount((prev) => prev + 1);
      recordAuditEvent(currentUser, 'Multiple Concurrent Login Detected', {
        status: 'WARNING',
        notes: `Simultaneous session opened from secondary browser tab/device. Active Session ID: ${activeSessionId}`
      });
    }

    localStorage.setItem(sessionKey, activeSessionId);
  }, [currentUser, activeSessionId]);

  const extendSession = () => {
    resetActivityTimer();
    if (currentUser) {
      recordAuditEvent(currentUser, 'Session Security Token Refreshed', {
        status: 'SUCCESS',
        notes: 'User manually extended active session timer.'
      });
    }
  };

  const lockSession = () => {
    if (currentUser) {
      recordAuditEvent(currentUser, 'User Manual Session Lock', {
        status: 'SUCCESS',
        notes: 'User explicitly locked their active session.'
      });
    }
    logout();
  };

  return (
    <SessionSecurityContext.Provider
      value={{
        sessionDurationSeconds: INACTIVITY_TIMEOUT_SECONDS,
        remainingSeconds,
        isSessionWarningOpen,
        extendSession,
        lockSession,
        securityEventsCount,
        lastLoginIp,
        activeSessionId
      }}
    >
      {children}

      {/* Session Inactivity Timeout Warning Modal */}
      {isSessionWarningOpen && currentUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0B132B] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30">
                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Session Timeout Warning</h3>
                <p className="text-xs text-slate-400 font-mono">AUTOMATIC LOCK IN {remainingSeconds}s</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Your active HALALCHAIN™ session will automatically expire in <span className="text-amber-400 font-bold font-mono">{remainingSeconds} seconds</span> due to inactivity.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={lockSession}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                Logout Now
              </button>
              <button
                onClick={extendSession}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all"
              >
                Extend Session
              </button>
            </div>
          </div>
        </div>
      )}
    </SessionSecurityContext.Provider>
  );
};

export const useSessionSecurity = () => {
  const ctx = useContext(SessionSecurityContext);
  if (!ctx) {
    throw new Error('useSessionSecurity must be used within SessionSecurityProvider');
  }
  return ctx;
};

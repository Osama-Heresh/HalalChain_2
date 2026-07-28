import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Clock, ShieldAlert, UserCheck } from 'lucide-react';
import { ProjectTaskLock, UserRole } from '../../types';

interface ProjectLockingBannerProps {
  projectId: string;
  taskId: string;
  currentUserRole: UserRole;
  currentUserName: string;
  onLockChanged?: () => void;
}

export const ProjectLockingBanner: React.FC<ProjectLockingBannerProps> = ({
  projectId,
  taskId,
  currentUserRole,
  currentUserName,
  onLockChanged
}) => {
  const [lock, setLock] = useState<ProjectTaskLock | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLock = async () => {
    try {
      const res = await fetch(`/api/project-locks/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setLock(data);
      }
    } catch (e) {
      console.warn('Task lock read error:', e);
    }
  };

  useEffect(() => {
    fetchLock();
    const interval = setInterval(fetchLock, 15000);
    return () => clearInterval(interval);
  }, [projectId]);

  const handleAcquireLock = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/project-locks/acquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          taskId,
          userName: currentUserName || 'Reviewer Analyst',
          userRole: currentUserRole,
          finishInMinutes: 60
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setLock(updated);
        if (onLockChanged) onLockChanged();
      }
    } catch (e) {
      console.error('Acquire lock error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReleaseLock = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/project-locks/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      setLock({ projectId, taskId, lockedBy: '', lockedByRole: '', lockedAt: '', expectedFinish: '', isLocked: false });
      if (onLockChanged) onLockChanged();
    } catch (e) {
      console.error('Release lock error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const isManagerOrAdmin = currentUserRole === 'admin' || currentUserRole === 'pm' || currentUserRole === 'exec';
  const isLockedBySelf = lock?.isLocked && lock.lockedBy === currentUserName;
  const isLockedByOther = lock?.isLocked && lock.lockedBy !== currentUserName;

  if (!lock?.isLocked) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
          <Unlock className="w-4 h-4 text-emerald-600" />
          <span>This task is currently <strong>unlocked</strong> and available for reviewer edit access.</span>
        </div>
        <button
          onClick={handleAcquireLock}
          disabled={isLoading}
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow"
        >
          {isLoading ? 'Locking...' : 'Lock Task & Start Work'}
        </button>
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
      isLockedByOther
        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
        : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${isLockedByOther ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <div className="font-extrabold flex items-center gap-2">
            <span>Locked by: <strong>{lock.lockedBy}</strong> ({lock.lockedByRole.toUpperCase()})</span>
            {isLockedBySelf && (
              <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                YOU
              </span>
            )}
          </div>
          <div className="text-[11px] opacity-80 flex items-center gap-3 mt-0.5 font-mono">
            <span>Started: {new Date(lock.lockedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>• Expected Finish: {new Date(lock.expectedFinish).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isLockedByOther && !isManagerOrAdmin && (
          <span className="bg-amber-200/80 text-amber-900 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Read-Only Mode
          </span>
        )}

        {(isLockedBySelf || isManagerOrAdmin) && (
          <button
            onClick={handleReleaseLock}
            disabled={isLoading}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow flex items-center gap-1.5"
          >
            <Unlock className="w-3.5 h-3.5 text-amber-400" />
            <span>{isManagerOrAdmin && isLockedByOther ? 'Force Unlock / Reassign' : 'Release Task Lock'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

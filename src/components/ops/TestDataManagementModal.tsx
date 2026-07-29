import React, { useState } from 'react';
import { X, RefreshCw, Database, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';

interface TestDataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const TestDataManagementModal: React.FC<TestDataManagementModalProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleResetDemoData = async () => {
    setIsResetting(true);
    setStatusMsg('Resetting demo data & re-seeding Firestore...');
    try {
      const res = await fetch('/api/system/reset-demo-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setStatusMsg('Demo data successfully reset to clean default state!');
        onRefreshData();
        setTimeout(() => {
          setStatusMsg(null);
          onClose();
        }, 1500);
      } else {
        setStatusMsg('Failed to reset demo data.');
      }
    } catch (err) {
      console.error('Reset error:', err);
      setStatusMsg('Error communicating with server.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-600 tracking-wider">
                ADMINISTRATION & TESTING
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Test Data & Demo Management
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs font-mono text-slate-600 dark:text-slate-300">
          <p>
            This tool allows managers and administrators to purge non-persistent test records and reset demo projects back to the pristine initial state in Firebase Firestore.
          </p>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 space-y-1">
            <span className="font-bold block uppercase text-[10px]">What happens when you reset?</span>
            <ul className="list-disc list-inside text-[11px] space-y-1">
              <li>Test projects created during evaluation will be cleared.</li>
              <li>Default initial demo projects will be re-seeded in Firestore.</li>
              <li>Audit logs will record the reset action.</li>
            </ul>
          </div>

          {statusMsg && (
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl font-bold text-center">
              {statusMsg}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 font-mono text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleResetDemoData}
            disabled={isResetting}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

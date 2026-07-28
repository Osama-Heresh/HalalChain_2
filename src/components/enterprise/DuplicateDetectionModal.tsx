import React from 'react';
import { AlertTriangle, ExternalLink, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { MasterProjectRecord, DuplicateMatchDetail } from '../../types';

interface DuplicateDetectionModalProps {
  isOpen: boolean;
  matches: DuplicateMatchDetail[];
  existingRecord?: MasterProjectRecord;
  onClose: () => void;
  onOpenExisting: (record: MasterProjectRecord) => void;
  onCreateNewVersion: (record: MasterProjectRecord) => void;
}

export const DuplicateDetectionModal: React.FC<DuplicateDetectionModalProps> = ({
  isOpen,
  matches,
  existingRecord,
  onClose,
  onOpenExisting,
  onCreateNewVersion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-300 dark:border-amber-700/50 shadow-2xl max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-amber-100 dark:border-amber-900/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-950/80 rounded-2xl text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold font-mono text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                AUTOMATIC DUPLICATE PROTECTION
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                This project already exists.
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matches Found Details */}
        <div className="space-y-3 bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40">
          <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
            Conflict Breakdown ({matches.length} matching parameters)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {matches.map((m, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">{m.field}</span>
                <span className="text-slate-900 dark:text-white font-bold truncate block">{m.value}</span>
                <span className="text-amber-600 dark:text-amber-400 text-[10px] mt-1 block">
                  Matched in: {m.matchedProjectName} ({m.halalChainId})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Record Overview */}
        {existingRecord && (
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500 uppercase">Existing Registry Record</span>
              <span className="font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200">
                {existingRecord.id}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-black text-slate-900 dark:text-white text-base">
                  {existingRecord.projectName} ({existingRecord.tokenSymbol})
                </div>
                <div className="text-xs text-slate-500">{existingRecord.companyName} • {existingRecord.country}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Stage: {existingRecord.lifecycleStage}
                </div>
                <div className="text-[11px] text-slate-500">Version: {existingRecord.assessmentVersion}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Options */}
        <div className="space-y-2 pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            System policy strictly prohibits duplicate customer records in the Master Registry. Please select an action below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {existingRecord && (
              <button
                onClick={() => onOpenExisting(existingRecord)}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Existing Record</span>
              </button>
            )}

            {existingRecord && (
              <button
                onClick={() => onCreateNewVersion(existingRecord)}
                className="py-3 px-4 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <span>Create New Version</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl flex items-center justify-center transition-all"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { EvidenceItem } from '../../types';
import {
  X,
  FileText,
  Search,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface EvidenceInspectorModalProps {
  evidence: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceInspectorModal: React.FC<EvidenceInspectorModalProps> = ({
  evidence,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!evidence) return null;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(evidence.supportingQuote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 px-6 py-4 border-b border-emerald-900/40 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {evidence.evidenceId}
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-emerald-400 font-medium">Verified AI Evidence Link</span>
              </div>
              <h3 className="text-base font-semibold text-white tracking-wide">
                Document Evidence Inspector
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Source Document
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate">{evidence.sourceDocument}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Page Number
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {evidence.pageNumber ? `Page ${evidence.pageNumber}` : 'N/A (Web/Contract)'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Section Name
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                {evidence.sectionName}
              </span>
            </div>

            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 block mb-1">
                Extraction Confidence
              </span>
              <div className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{evidence.confidenceScore}% Validated</span>
              </div>
            </div>
          </div>

          {/* Supporting Quote Highlight Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Supporting Verbatim Quote
              </label>
              <button
                onClick={handleCopyQuote}
                className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied to Clipboard!' : 'Copy Quote'}
              </button>
            </div>

            <div className="relative p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-slate-900 dark:text-slate-100 font-serif italic text-sm leading-relaxed shadow-sm">
              "{evidence.supportingQuote}"
            </div>
          </div>

          {/* Sharia Neutrality Reminder */}
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white block font-medium mb-0.5">
                Human Reviewer Evidence Traceability
              </strong>
              This quote was parsed and linked directly from the project's collected technical inputs. HalalChain AI does not render Sharia rulings; human auditors verify this evidence during dossier evaluation.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

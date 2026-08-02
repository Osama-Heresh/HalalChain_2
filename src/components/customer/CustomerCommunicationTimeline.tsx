import React, { useState } from 'react';
import {
  Clock,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { EmailHistoryEntry } from '../../types';

interface CustomerCommunicationTimelineProps {
  prospectName: string;
  masterId: string;
  emailHistory: EmailHistoryEntry[];
  onTriggerFollowUp?: (entry: EmailHistoryEntry) => void;
}

export const CustomerCommunicationTimeline: React.FC<CustomerCommunicationTimelineProps> = ({
  prospectName,
  masterId,
  emailHistory,
  onTriggerFollowUp
}) => {
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEmailId((prev) => (prev === id ? null : id));
  };

  // Filter history for this prospect or master ID
  const prospectHistory = emailHistory.filter(
    (e) => e.masterId === masterId || e.companyName === prospectName
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase font-mono">
            Customer Communication Timeline ({prospectHistory.length})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Master ID: {masterId}</span>
      </div>

      {prospectHistory.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <Mail className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">No Outreach Logged Yet</div>
          <p className="text-[11px] text-slate-400">Send an initial Sharia Audit outreach email to start tracking communication history.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {prospectHistory.map((entry) => {
            const isExpanded = expandedEmailId === entry.id;

            // Calculate 7-day follow-up status
            const sentDate = new Date(entry.date);
            const now = new Date();
            const daysSinceSent = Math.floor((now.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24));
            const isFollowUpDue = daysSinceSent >= 7 && entry.replyStatus === 'No Reply';

            return (
              <div key={entry.id} className="relative group">
                
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                    isFollowUpDue
                      ? 'bg-amber-500 border-amber-300 text-slate-950 font-bold'
                      : 'bg-indigo-600 border-indigo-200 text-white'
                  }`}
                >
                  <Mail className="w-3 h-3" />
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all">
                  
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {entry.id}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {entry.subject}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-3">
                        <span>Sent by: <strong>{entry.employeeName}</strong></span>
                        <span>• Date: {entry.date} at {entry.time}</span>
                        <span>• Recipient: {entry.recipient}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Status Badges */}
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-200">
                        {entry.deliveryStatus}
                      </span>

                      {entry.replyStatus === 'Replied' ? (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded-md border border-indigo-200">
                          Replied
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                          No Reply Yet
                        </span>
                      )}

                      <button
                        onClick={() => toggleExpand(entry.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 font-bold text-xs"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 7-DAY FOLLOW-UP WARNING BANNER */}
                  {isFollowUpDue && (
                    <div className="bg-amber-50 dark:bg-amber-950/60 p-3 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-[11px]">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Follow-up Due: 7+ days with no reply. Create follow-up task.</span>
                      </div>
                      {onTriggerFollowUp && (
                        <button
                          onClick={() => onTriggerFollowUp(entry)}
                          className="py-1 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded-lg shrink-0 shadow"
                        >
                          Send Follow-up Email
                        </button>
                      )}
                    </div>
                  )}

                  {/* EXPANDED CONTENT PREVIEW */}
                  {isExpanded && entry.renderedHtml && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
                        Rendered Outreach Email Preview:
                      </span>
                      <iframe
                        srcDoc={entry.renderedHtml}
                        title="Email Rendered Preview"
                        className="w-full h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white"
                      />
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

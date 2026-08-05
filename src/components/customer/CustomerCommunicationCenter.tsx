import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  Send,
  Paperclip,
  FileText,
  Lock,
  Eye,
  EyeOff,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldAlert
} from 'lucide-react';
import { CertificationApplication, ClarificationMessage, EmailHistoryEntry } from '../../types';

interface CommunicationItem {
  id: string;
  type: 'Email' | 'Clarification' | 'Meeting Note' | 'Attachment' | 'Internal Note';
  senderName: string;
  senderRole: string;
  recipient?: string;
  subject?: string;
  content: string;
  timestamp: string;
  isInternalOnly: boolean;
  attachments?: { name: string; url: string; size?: string }[];
}

interface CustomerCommunicationCenterProps {
  project: CertificationApplication;
  emailHistory?: EmailHistoryEntry[];
  isCustomerPortalView?: boolean; // If true, strictly hide internalOnly items!
  lang?: 'en' | 'ar' | 'side-by-side';
}

export const CustomerCommunicationCenter: React.FC<CustomerCommunicationCenterProps> = ({
  project,
  emailHistory = [],
  isCustomerPortalView = true,
  lang = 'en'
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [messagesList, setMessagesList] = useState<ClarificationMessage[]>([]);
  const [newMessageInput, setNewMessageInput] = useState('');
  const [newNoteSubject, setNewNoteSubject] = useState('');
  const [newNoteType, setNewNoteType] = useState<'Clarification' | 'Meeting Note' | 'Internal Note'>('Clarification');
  const [attachmentName, setAttachmentName] = useState('');
  const [isSending, setIsSending] = useState(false);

  const isRtl = lang === 'ar';

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/applications/${project.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessagesList(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    if (project.id) {
      fetchMessages();
    }
  }, [project.id]);

  const handleSendMessage = async () => {
    if (!newMessageInput.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch(`/api/applications/${project.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderRole: isCustomerPortalView ? 'customer' : 'auditor',
          senderName: isCustomerPortalView
            ? `${project.representativeName} (${project.companyName})`
            : 'Lead Auditor / Sharia Scholar',
          message: newMessageInput.trim()
        })
      });
      if (res.ok) {
        setNewMessageInput('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Convert raw messages and email history into unified communication stream
  const mappedClarifications: CommunicationItem[] = messagesList.map((m) => ({
    id: m.id,
    type: 'Clarification',
    senderName: m.senderName,
    senderRole: m.senderRole === 'customer' ? 'Customer Rep' : 'Audit Team Specialist',
    content: m.message,
    timestamp: m.timestamp,
    isInternalOnly: false
  }));

  const mappedEmails: CommunicationItem[] = emailHistory
    .filter((e) => e.masterId === project.id || e.companyName === project.companyName)
    .map((e) => ({
      id: e.id,
      type: 'Email',
      senderName: e.employeeName || 'Outreach BD Manager',
      senderRole: 'Sales & BD Specialist',
      recipient: e.recipient,
      subject: e.subject,
      content: e.bodyText || e.renderedHtml || 'Outreach email dispatch',
      timestamp: `${e.date}T${e.time}:00.000Z`,
      isInternalOnly: false
    }));

  // Demo meeting notes & attachments
  const demoItems: CommunicationItem[] = [
    {
      id: 'COMM-M01',
      type: 'Meeting Note',
      senderName: project.assignedReviewers?.pm || 'Project Manager',
      senderRole: 'Project Manager',
      subject: 'Initial Sharia Scope Alignment Call',
      content: 'Discussed tokenomics lockup mechanism. Customer agreed to provide audited smart contract bytecode repository within 48 hours.',
      timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
      isInternalOnly: false,
      attachments: [{ name: 'Sharia_Kickoff_Minutes.pdf', url: '#', size: '1.2 MB' }]
    },
    {
      id: 'COMM-INT01',
      type: 'Internal Note',
      senderName: project.assignedReviewers?.scholar || 'Sheikh Dr. Ibrahim Al-Kuwaiti',
      senderRole: 'Lead Scholar',
      subject: 'Internal Scholar Panel Pre-Review Note',
      content: 'Check section 4.2 of whitepaper for any hidden fixed yield guarantees before issuing final theological fatwa.',
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      isInternalOnly: true
    }
  ];

  const allCommunicationItems = [...mappedClarifications, ...mappedEmails, ...demoItems]
    .filter((item) => {
      if (isCustomerPortalView && item.isInternalOnly) {
        return false; // NEVER show internal reviewer notes to customer
      }
      if (filterType === 'All') return true;
      return item.type === filterType;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-extrabold font-serif text-slate-900 dark:text-white">
                Customer Communication Center
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Unified inbox for emails, meeting notes, clarification requests, attachments, and customer responses
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isCustomerPortalView ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono text-xs font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Customer Portal Secure View</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono text-xs font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Operations Mode (Internal Notes Unlocked)</span>
              </span>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-mono overflow-x-auto">
          {['All', 'Clarification', 'Email', 'Meeting Note', 'Attachment', ...(!isCustomerPortalView ? ['Internal Note'] : [])].map((typeKey) => (
            <button
              key={typeKey}
              onClick={() => setFilterType(typeKey)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold whitespace-nowrap ${
                filterType === typeKey
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {typeKey}s
            </button>
          ))}
        </div>
      </div>

      {/* Message Composer Box */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-2">
          <Send className="w-3.5 h-3.5 text-indigo-500" />
          <span>Send Clarification or Response to HalalChain Team</span>
        </h4>

        <div className="space-y-3">
          <textarea
            rows={3}
            placeholder="Type your message, document clarification, or query..."
            value={newMessageInput}
            onChange={(e) => setNewMessageInput(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>All messages are logged cryptographically in the project audit record.</span>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={isSending || !newMessageInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <span>{isSending ? 'Sending Message...' : 'Send Message'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stream of Communication Entries */}
      <div className="space-y-4">
        {allCommunicationItems.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-mono">
            No communication logs match the selected filter.
          </div>
        ) : (
          allCommunicationItems.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
                item.isInternalOnly
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : item.type === 'Email'
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                    item.type === 'Email'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                      : item.type === 'Meeting Note'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : item.isInternalOnly
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                  }`}>
                    {item.type}
                  </span>

                  {item.subject && (
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {item.subject}
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-3">
                  <span>Sender: <strong className="text-slate-800 dark:text-slate-200">{item.senderName}</strong> ({item.senderRole})</span>
                  <span>• {new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Content */}
              <p className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed">
                {item.content}
              </p>

              {/* Attachments if any */}
              {item.attachments && item.attachments.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {item.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] font-mono font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{att.name}</span>
                      {att.size && <span className="text-slate-400 text-[10px]">({att.size})</span>}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

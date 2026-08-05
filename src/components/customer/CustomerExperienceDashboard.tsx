import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Clock,
  MessageSquare,
  Award,
  Download,
  AlertCircle,
  Bell,
  Calendar,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  CreditCard,
  Building2
} from 'lucide-react';
import { CertificationApplication, ClarificationMessage } from '../../types';
import { ShariaCertificateModal } from '../ShariaCertificateModal';

interface CustomerExperienceDashboardProps {
  project: CertificationApplication;
  allProjects: CertificationApplication[];
  messages: ClarificationMessage[];
  onSelectTab: (tabKey: string) => void;
  lang: 'en' | 'ar' | 'side-by-side';
  onChangeLang: (newLang: 'en' | 'ar' | 'side-by-side') => void;
}

export const CustomerExperienceDashboard: React.FC<CustomerExperienceDashboardProps> = ({
  project,
  allProjects,
  messages,
  onSelectTab,
  lang,
  onChangeLang
}) => {
  const [showCertModal, setShowCertModal] = React.useState(false);

  const isRtl = lang === 'ar';

  // Calculate Renewal Countdown
  const issueDate = new Date(project.submittedAt || Date.now());
  const renewalDate = new Date(issueDate.getTime() + 365 * 86400000);
  const daysUntilRenewal = Math.max(0, Math.ceil((renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const latestMessage = messages[messages.length - 1];

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* Top Banner & Multilingual Language Switcher (Section 6 & 7) */}
      <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>HalalChain™ Customer Experience Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-300">
              {lang === 'ar' ? `مرحباً بكم، ${project.companyName}` : `Welcome, ${project.companyName}`}
            </h1>
            <p className="text-xs text-slate-300 font-mono">
              Ref: {project.applicationNumber || project.id} • Blockchain: {project.blockchain} • Tier: {project.packageType}
            </p>
          </div>

          {/* Multilingual Switcher (Requirement 6) */}
          <div className="bg-[#1C2541] p-3 rounded-2xl border border-amber-500/30 space-y-1.5 shrink-0">
            <span className="text-[10px] text-amber-400 font-mono block uppercase font-bold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Portal Experience Language</span>
            </span>

            <div className="flex items-center gap-1 text-xs font-mono">
              <button
                onClick={() => onChangeLang('en')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                  lang === 'en' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onChangeLang('ar')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                  lang === 'ar' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => onChangeLang('side-by-side')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                  lang === 'side-by-side' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Side-by-Side (Bilingual)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Stat Cards (Requirement 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        
        {/* Card 1: Active Projects */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="uppercase text-[10px] font-bold">Certification Projects</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-serif">{allProjects.length}</div>
          <span className="text-[10px] text-emerald-600 font-bold block">1 Active Assessment</span>
        </div>

        {/* Card 2: Assessment Stage */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="uppercase text-[10px] font-bold">Current Assessment Stage</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-black text-amber-600 dark:text-amber-400 truncate uppercase font-serif">
            {project.stage.replace(/_/g, ' ')}
          </div>
          <span className="text-[10px] text-slate-400 block">SLA Target: {project.targetCompletionDate}</span>
        </div>

        {/* Card 3: Open Action Items */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="uppercase text-[10px] font-bold">Open Action Requests</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-serif">
            {!project.depositPaid ? 1 : 0}
          </div>
          <span className={`text-[10px] font-bold block ${!project.depositPaid ? 'text-rose-600' : 'text-emerald-600'}`}>
            {!project.depositPaid ? 'Initial Deposit Required' : 'All Required Actions Up-to-Date ✓'}
          </span>
        </div>

        {/* Card 4: Annual Renewal Countdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="uppercase text-[10px] font-bold">Renewal Countdown</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-serif">{daysUntilRenewal} Days</div>
          <span className="text-[10px] text-slate-400 block">Annual Re-Audit Target: {renewalDate.toISOString().split('T')[0]}</span>
        </div>

      </div>

      {/* Prominent Next Action & Stage Banner (Requirement 9) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-1">
              Current Stage Action Summary
            </span>
            <h3 className="text-lg font-bold font-serif text-white">
              Stage: {project.stage.replace(/_/g, ' ').toUpperCase()}
            </h3>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Responsible Team: <strong className="text-amber-300">Sharia Supervisory Board & Technical Auditors</strong> • Expected Completion: <strong className="text-amber-300">{project.targetCompletionDate}</strong>
            </p>
          </div>

          <button
            onClick={() => onSelectTab('overview')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow shrink-0"
          >
            <span>View Workflow Tracker</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {!project.depositPaid && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Required Customer Action: Settle initial 50% deposit of ${project.depositAmount?.toLocaleString()} USD to activate auditor review.</span>
            </div>
            <button
              onClick={() => onSelectTab('payments')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl whitespace-nowrap cursor-pointer shadow"
            >
              Pay Deposit Invoice
            </button>
          </div>
        )}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Recent Messages & Clarifications */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase font-mono">
              <MessageSquare className="w-4 h-4" />
              <span>Recent Messages & Clarifications</span>
            </div>
            <button
              onClick={() => onSelectTab('communication')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold hover:underline"
            >
              View All ({messages.length})
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs font-mono bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              No recent clarification messages. All audit parameters clear.
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {messages.slice(-3).map((msg) => (
                <div key={msg.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">{msg.senderName}</strong>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Certificates & Quick Downloads */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm uppercase font-mono">
              <Award className="w-4 h-4" />
              <span>Certificates & Download Center</span>
            </div>
            <button
              onClick={() => onSelectTab('documents')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold hover:underline"
            >
              Document Hub
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Official Sharia Certificate</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-300">
                  {project.stage === 'published_registry' ? 'Issued & Published ✓' : 'In Stage Review'}
                </span>
              </div>
              <button
                onClick={() => setShowCertModal(true)}
                className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400"
              >
                View Diploma
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Executive Sharia Briefing Report</span>
                <span className="text-[10px] text-slate-400">PDF • Theological Verdict Summary</span>
              </div>
              <button
                onClick={() => onSelectTab('documents')}
                className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-xl hover:bg-indigo-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Certificate Modal */}
      <ShariaCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        project={project}
      />
    </div>
  );
};

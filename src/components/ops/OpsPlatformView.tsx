import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  UserRole,
  CertificationApplication,
  Lead,
  AuditLogEntry,
  AiServiceLog,
  WorkflowStage
} from '../../types';
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Code,
  Coins,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertTriangle,
  Play,
  ArrowRight,
  Send,
  Lock,
  Search,
  ExternalLink,
  Globe,
  Eye,
  Filter
} from 'lucide-react';
import { IslamicPatternBg } from '../IslamicPatternBg';
import { TaskDetailModal } from './TaskDetailModal';

interface OpsPlatformViewProps {
  currentUserRole: UserRole;
  setCurrentUserRole: (r: UserRole) => void;
  applications: CertificationApplication[];
  leads: Lead[];
  auditLogs: AuditLogEntry[];
  onRefreshData: () => void;
}

export const OpsPlatformView: React.FC<OpsPlatformViewProps> = ({
  currentUserRole,
  setCurrentUserRole,
  applications,
  leads,
  auditLogs,
  onRefreshData
}) => {
  const { t, dir, lang } = useLanguage();
  const [activeOpsTab, setActiveOpsTab] = useState<'my_work' | 'crm' | 'pm' | 'ai_engine' | 'auditor' | 'finance' | 'audit_log'>('my_work');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(applications[0]?.id || '');

  // Task Inspection Modal State
  const [activeTaskForModal, setActiveTaskForModal] = useState<CertificationApplication | null>(null);

  // My Work Filter Toggle ('role' or 'all')
  const [myWorkFilter, setMyWorkFilter] = useState<'role' | 'all'>('role');

  // AI Run state
  const [runningAi, setRunningAi] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    if (currentUserRole === 'sales' || currentUserRole === 'marketing') {
      setActiveOpsTab('crm');
    } else if (currentUserRole === 'pm') {
      setActiveOpsTab('pm');
    } else if (currentUserRole === 'tech_auditor' || currentUserRole === 'scholar' || currentUserRole === 'qa') {
      setActiveOpsTab('auditor');
    } else if (currentUserRole === 'finance') {
      setActiveOpsTab('finance');
    } else if (currentUserRole === 'admin' || currentUserRole === 'business_analyst') {
      setActiveOpsTab('ai_engine');
    }
  }, [currentUserRole]);

  const selectedApp = applications.find((a) => a.id === selectedProjectId) || applications[0];

  // Get tasks filtered by the active user's role
  const getRoleFilteredTasks = (role: UserRole): CertificationApplication[] => {
    switch (role) {
      case 'tech_auditor':
        return applications.filter(
          (a) => a.stage === 'technical_review' || a.stage === 'ai_assessment' || a.stage === 'clarification_requested'
        );
      case 'scholar':
        return applications.filter(
          (a) => a.stage === 'scholar_review' || a.stage === 'clarification_requested' || a.stage === 'rejected'
        );
      case 'business_analyst':
        return applications.filter(
          (a) => a.stage === 'ai_assessment' || a.stage === 'business_review' || a.stage === 'project_created'
        );
      case 'qa':
        return applications.filter(
          (a) => a.stage === 'quality_assurance' || a.stage === 'certificate_generation'
        );
      case 'finance':
        return applications.filter(
          (a) => a.stage === 'waiting_deposit' || a.stage === 'waiting_final_payment'
        );
      case 'sales':
      case 'marketing':
        return applications.filter((a) => a.stage === 'waiting_deposit' || a.stage === 'project_created');
      case 'pm':
      case 'admin':
      case 'exec':
      default:
        return applications;
    }
  };

  const roleTasks = getRoleFilteredTasks(currentUserRole);
  const displayedMyWorkTasks = myWorkFilter === 'role' ? roleTasks : applications;

  // Counts for tab badges
  const auditorTaskCount = applications.filter(
    (a) => a.stage === 'technical_review' || a.stage === 'scholar_review' || a.stage === 'quality_assurance'
  ).length;

  const financeTaskCount = applications.filter(
    (a) => a.stage === 'waiting_deposit' || a.stage === 'waiting_final_payment'
  ).length;

  const handleAdvanceStage = async (nextStage: WorkflowStage, appToAdvance?: CertificationApplication) => {
    const target = appToAdvance || selectedApp;
    if (!target) return;

    try {
      const res = await fetch(`/api/applications/${target.id}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nextStage,
          userName: `Employee (${currentUserRole.toUpperCase()})`,
          userRole: currentUserRole
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Stage Advancement Error: ${data.error}`);
      } else {
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAiAssessment = async () => {
    if (!selectedApp) return;
    setRunningAi(true);
    try {
      const res = await fetch('/api/ai/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedApp.id,
          companyName: selectedApp.companyName,
          whitepaperText: selectedApp.projectDescription,
          contractAddress: selectedApp.contractAddress,
          blockchain: selectedApp.blockchain
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAiResult(data.assessment);
        onRefreshData();
      }
    } catch (err) {
      console.error('AI Assessment failed', err);
    } finally {
      setRunningAi(false);
    }
  };

  const getRoleBadgeLabel = (role: UserRole) => {
    switch (role) {
      case 'pm':
        return 'Project Manager';
      case 'tech_auditor':
        return 'Blockchain Auditor';
      case 'scholar':
        return 'Sharia Scholar';
      case 'business_analyst':
        return 'Business Analyst';
      case 'qa':
        return 'Quality Assurance';
      case 'finance':
        return 'Finance Officer';
      case 'sales':
        return 'Sales Exec';
      case 'marketing':
        return 'Marketing';
      case 'exec':
        return 'Executive Leader';
      case 'admin':
        return 'System Admin';
      default:
        return role;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      {/* Header Banner */}
      <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <IslamicPatternBg />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/30">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ar' ? 'نظام تشغيل العمليات والإدارة' : 'Operations Operating System'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">
            {lang === 'ar' ? 'منصة العمليات والتدقيق الشرعي الرقمي' : 'HalalChain Remote Operations Platform'}
          </h1>
          <p className="text-xs text-slate-300 font-mono">
            {lang === 'ar' ? 'دور الموظف النشط:' : 'Active Employee Role:'}{' '}
            <span className="font-bold text-amber-400 uppercase">{getRoleBadgeLabel(currentUserRole)}</span>
          </p>
        </div>

        {/* Role Switcher */}
        <div className="relative z-10 bg-[#1C2541] p-3 rounded-2xl border border-amber-500/20 text-xs font-mono">
          <label className="text-[10px] text-slate-400 block uppercase mb-1">
            {lang === 'ar' ? 'تغيير دور المعاينة:' : 'Switch View Role:'}
          </label>
          <select
            value={currentUserRole}
            onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
            className="bg-[#0B132B] text-amber-300 font-bold py-1.5 px-3 rounded-xl border border-amber-500/30 focus:outline-none cursor-pointer"
          >
            <option value="customer">Customer (Applicant)</option>
            <option value="pm">Project Manager</option>
            <option value="tech_auditor">Blockchain Tech Auditor</option>
            <option value="business_analyst">Business Analyst</option>
            <option value="scholar">Senior Sharia Scholar</option>
            <option value="qa">Quality Assurance Officer</option>
            <option value="finance">Finance Officer</option>
            <option value="sales">Sales Executive</option>
            <option value="marketing">Marketing Specialist</option>
            <option value="exec">Executive Leader</option>
            <option value="admin">System Administrator</option>
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => setActiveOpsTab('my_work')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
            activeOpsTab === 'my_work' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{lang === 'ar' ? 'لوحة مهامي الخاطفة' : 'My Work Dashboard'}</span>
          <span className="bg-amber-500/20 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
            {roleTasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveOpsTab('pm')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
            activeOpsTab === 'pm' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{lang === 'ar' ? 'مركز إدارة المشاريع' : 'PM Project Hub'}</span>
          <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveOpsTab('ai_engine')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
            activeOpsTab === 'ai_engine' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'ar' ? 'مركز التقييم بالذكاء الاصطناعي' : 'AI Assessment Center'}</span>
        </button>

        <button
          onClick={() => setActiveOpsTab('auditor')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
            activeOpsTab === 'auditor' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'ar' ? 'مساحة التدقيق والشرعنة' : 'Auditor Workspace'}</span>
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
            {auditorTaskCount}
          </span>
        </button>

        <button
          onClick={() => setActiveOpsTab('crm')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
            activeOpsTab === 'crm' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{lang === 'ar' ? 'إدارة العملاء والمبيعات' : 'CRM & Sales Pipeline'}</span>
          <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
            {leads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveOpsTab('finance')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
            activeOpsTab === 'finance' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'ar' ? 'بوابة التحقق المالي' : 'Finance Release Gate'}</span>
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
            {financeTaskCount}
          </span>
        </button>

        <button
          onClick={() => setActiveOpsTab('audit_log')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
            activeOpsTab === 'audit_log' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{lang === 'ar' ? 'دفتر السجلات الدقيق' : 'Audit Log Feed'}</span>
          <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
            {auditLogs.length}
          </span>
        </button>
      </div>

      {/* Tab 1: My Work Dashboard */}
      {activeOpsTab === 'my_work' && (
        <div className="space-y-6">
          {/* Top KPI Cards (Tailored to current role) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">
                {lang === 'ar' ? `المهام المسندة لدور (${getRoleBadgeLabel(currentUserRole)})` : `Assigned Tasks for ${getRoleBadgeLabel(currentUserRole)}`}
              </div>
              <div className="text-3xl font-bold font-serif text-slate-900">{roleTasks.length} Active</div>
              <p className="text-[11px] text-slate-500">
                {roleTasks.length > 0 ? 'Requires action or review' : 'Queue cleared for this role'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">
                {lang === 'ar' ? 'خيارات لاتخاذ القرار' : 'Available Decision Controls'}
              </div>
              <div className="text-xl font-bold font-serif text-emerald-700 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded font-mono">Approve</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-mono">Clarify</span>
                <span className="bg-rose-100 text-rose-800 text-xs px-2 py-0.5 rounded font-mono">Reject</span>
              </div>
              <p className="text-[11px] text-slate-500">Full audit notes and evidence links attached</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">
                {lang === 'ar' ? 'مستوى الامتثال لنسبة SLA' : 'Average Completion SLA'}
              </div>
              <div className="text-3xl font-bold font-serif text-amber-700">18.4 Hours</div>
              <p className="text-[11px] text-slate-500">Target SLA compliance rate: 98.2%</p>
            </div>
          </div>

          {/* Queue Header & Role Filter Toggle */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900">
                  {lang === 'ar' ? 'طابور المهام ومسار العمل' : 'Assigned Workflow Queue Items'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {myWorkFilter === 'role'
                    ? `Showing tasks specifically requiring ${getRoleBadgeLabel(currentUserRole)} review`
                    : 'Showing all active applications in system pipeline'}
                </p>
              </div>

              {/* Filter toggle */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-mono">
                <button
                  onClick={() => setMyWorkFilter('role')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    myWorkFilter === 'role' ? 'bg-[#0B132B] text-amber-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Role Tasks ({roleTasks.length})
                </button>
                <button
                  onClick={() => setMyWorkFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    myWorkFilter === 'all' ? 'bg-[#0B132B] text-amber-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Queue ({applications.length})
                </button>
              </div>
            </div>

            {/* Task Items Queue */}
            <div className="space-y-4">
              {displayedMyWorkTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-mono text-xs bg-slate-50 rounded-2xl border border-slate-200">
                  No active tasks assigned to the <span className="font-bold uppercase">{currentUserRole}</span> role at this time. Click "All Queue" to view all system tasks.
                </div>
              ) : (
                displayedMyWorkTasks.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-3 font-mono text-xs shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">{app.companyName}</span>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {app.applicationNumber}
                          </span>
                          <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {app.packageType}
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Stage: {app.stage.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          Blockchain: <span className="font-semibold text-slate-900">{app.blockchain}</span> • Target SLA:{' '}
                          <span className="font-semibold text-amber-700">{app.targetCompletionDate}</span>
                        </p>
                      </div>

                      {/* Right direct linked references & action button */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Direct Linked References */}
                        <a
                          href={app.whitepaperUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open Whitepaper Link"
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-amber-700 hover:border-amber-400 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-600" />
                          <span>Whitepaper</span>
                        </a>

                        {app.contractAddress && app.contractAddress !== 'N/A' && (
                          <a
                            href={`https://etherscan.io/address/${app.contractAddress}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Inspect Smart Contract"
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-400 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                          >
                            <Code className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Contract</span>
                          </a>
                        )}

                        {/* Inspect & Decide Button */}
                        <button
                          onClick={() => setActiveTaskForModal(app)}
                          className="px-4 py-2 rounded-xl bg-[#0B132B] text-amber-300 font-bold hover:bg-[#1C2541] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Inspect & Decide</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick description summary snippet */}
                    <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/80 leading-relaxed truncate">
                      <span className="font-bold text-slate-700">Project Overview:</span> {app.projectDescription}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PM Hub */}
      {activeOpsTab === 'pm' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">Project Manager Oversight Hub</h3>
              <p className="text-xs text-slate-500 font-mono">Manage workflow stage transitions, SLA pause toggles, and assignments</p>
            </div>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <h4 className="text-base font-bold font-serif text-slate-900">{app.companyName}</h4>
                    <p className="text-xs font-mono text-slate-500">
                      Ref: {app.applicationNumber} • Package: {app.packageType} • Fee: ${app.totalFee.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-500">Current Stage:</span>
                    <span className="font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 uppercase">
                      {app.stage.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => setActiveTaskForModal(app)}
                      className="px-3 py-1.5 rounded-lg bg-[#0B132B] text-amber-300 font-bold hover:bg-[#1C2541] cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Full Task Modal</span>
                    </button>
                  </div>
                </div>

                {/* Direct Stage Advance Bar */}
                <div className="flex items-center justify-between gap-4 text-xs font-mono bg-white p-4 rounded-xl border border-slate-200 flex-wrap">
                  <span className="font-semibold text-slate-700">Advance Workflow Stage:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAdvanceStage('ai_assessment', app)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold cursor-pointer"
                    >
                      → AI Assessment
                    </button>
                    <button
                      onClick={() => handleAdvanceStage('technical_review', app)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold cursor-pointer"
                    >
                      → Technical Review
                    </button>
                    <button
                      onClick={() => handleAdvanceStage('scholar_review', app)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold cursor-pointer"
                    >
                      → Scholar Review
                    </button>
                    <button
                      onClick={() => handleAdvanceStage('waiting_final_payment', app)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold cursor-pointer"
                    >
                      → Final Payment
                    </button>
                    <button
                      onClick={() => handleAdvanceStage('published_registry', app)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer shadow-sm"
                    >
                      ✓ Publish Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: AI Engine */}
      {activeOpsTab === 'ai_engine' && (
        <div className="bg-[#0B132B] text-white p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden">
          <IslamicPatternBg />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-amber-300">Centralized AI Automated Assessment Center</h3>
                <p className="text-xs text-slate-300 font-mono">
                  Runs automated whitepaper indexing, bytecode privilege scan, and Sharia findings generator for {selectedApp?.companyName}
                </p>
              </div>

              <button
                onClick={handleRunAiAssessment}
                disabled={runningAi}
                className="px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{runningAi ? 'Executing AI Engine...' : 'Run Automated AI Assessment'}</span>
              </button>
            </div>

            {/* AI Results Output */}
            {aiResult && (
              <div className="space-y-6 pt-4 text-xs font-mono">
                {/* Whitepaper Summary */}
                <div className="bg-[#1C2541] p-6 rounded-2xl border border-amber-500/20 space-y-3">
                  <h4 className="text-amber-400 font-bold text-sm uppercase">Whitepaper AI Analysis Summary</h4>
                  <p className="text-slate-200 leading-relaxed">{aiResult.whitepaperSummary.purpose}</p>
                  <div className="grid grid-cols-2 gap-4 text-slate-300 pt-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">REVENUE SOURCES</span>
                      <span>{aiResult.whitepaperSummary.revenueSources.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">TOKEN UTILITY</span>
                      <span>{aiResult.whitepaperSummary.tokenUtility.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Smart Contract Privilege Analysis */}
                <div className="bg-[#1C2541] p-6 rounded-2xl border border-amber-500/20 space-y-3">
                  <h4 className="text-amber-400 font-bold text-sm uppercase">Smart Contract Bytecode Scan</h4>
                  <div className="grid grid-cols-3 gap-4 text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[10px]">VERIFIED SOURCE</span>
                      <span className="text-emerald-400 font-bold">YES ✓</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">PAUSE FUNCTION</span>
                      <span className="text-amber-300 font-bold">{aiResult.smartContractAnalysis.pauseFunction ? 'DETECTED' : 'NONE'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">PRIVILEGED FUNCTIONS</span>
                      <span>{aiResult.smartContractAnalysis.privilegedFunctions.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* AI Draft Findings */}
                <div className="space-y-3">
                  <h4 className="text-amber-400 font-bold text-sm uppercase">AI Generated Draft Findings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiResult.aiDraftFindings.map((fnd: any) => (
                      <div key={fnd.id} className="bg-[#1C2541] p-4 rounded-xl border border-amber-500/20 space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">{fnd.category}</span>
                          <span className="text-emerald-400 font-bold">Confidence: {fnd.confidenceScore}%</span>
                        </div>
                        <p className="text-slate-200">{fnd.description}</p>
                        <div className="text-[10px] text-slate-400">Source: {fnd.evidenceSource}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Auditor Workspace */}
      {activeOpsTab === 'auditor' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">Auditor Specialized Workspace</h3>
              <p className="text-xs text-slate-500 font-mono">Technical & Sharia Inspection for {selectedApp?.companyName}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Role: {currentUserRole.toUpperCase()}
              </span>
              <button
                onClick={() => setActiveTaskForModal(selectedApp)}
                className="px-4 py-1.5 rounded-xl bg-[#0B132B] text-amber-300 font-bold hover:bg-[#1C2541] cursor-pointer text-xs font-mono flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Task Decision Modal</span>
              </button>
            </div>
          </div>

          {/* Project Selector for Auditor */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono text-xs">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedProjectId(app.id)}
                className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap cursor-pointer border transition-all ${
                  selectedProjectId === app.id
                    ? 'bg-[#0B132B] text-amber-300 border-amber-500'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {app.companyName} ({app.stage.replace(/_/g, ' ')})
              </button>
            ))}
          </div>

          {/* Inspection Checklist & Linked Evidence References */}
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900 text-sm block">Linked Evidence & Documentation:</span>
              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href={selectedApp?.whitepaperUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-amber-800 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Whitepaper Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {selectedApp?.contractAddress && selectedApp?.contractAddress !== 'N/A' && (
                  <a
                    href={`https://etherscan.io/address/${selectedApp?.contractAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Contract ({selectedApp?.contractAddress.substring(0, 10)}...)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <a
                  href={selectedApp?.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-slate-800 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-600" />
                  <span>Website ({selectedApp?.websiteUrl})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">Sharia & Technical Verification Checklist</span>
              <div className="space-y-2 text-slate-700 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-amber-600" />
                  <span>Verified no guaranteed fixed interest (Riba) in yield pool contracts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-amber-600" />
                  <span>Verified physical reserve or Mudarabah risk-sharing mechanism</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-amber-600" />
                  <span>Verified owner pause/mint privileges possess timelocks</span>
                </label>
              </div>
            </div>

            {/* Decision Bar in Auditor Workspace */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <span className="text-slate-500 text-[11px]">Action Decision Options:</span>
              <button
                onClick={() => setActiveTaskForModal(selectedApp)}
                className="px-6 py-2.5 rounded-xl bg-[#0B132B] text-amber-300 font-bold text-xs hover:bg-[#1C2541] transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Open Approve / Clarify / Reject Action Modal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: CRM */}
      {activeOpsTab === 'crm' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">CRM & Sales Pipeline</h3>
              <p className="text-xs text-slate-500 font-mono">Lead management and CoinMarketCap discovery pipeline</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <div key={lead.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{lead.companyName}</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">{lead.status}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{lead.notes}</p>
                <div className="flex justify-between text-slate-500 pt-2 border-t">
                  <span>Est. Value:</span>
                  <span className="font-bold text-emerald-700">${lead.estimatedValue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Finance */}
      {activeOpsTab === 'finance' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">Finance Release Gate</h3>
              <p className="text-xs text-slate-500 font-mono">Verify invoice payments prior to digital certificate generation</p>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {applications.map((app) => (
              <div key={app.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{app.companyName}</div>
                  <div className="text-slate-500">
                    Deposit: <span className={`font-bold ${app.depositPaid ? 'text-emerald-700' : 'text-amber-700'}`}>{app.depositPaid ? 'PAID ✓' : 'UNPAID ✕'}</span> • Final:{' '}
                    <span className={`font-bold ${app.finalPaid ? 'text-emerald-700' : 'text-slate-500'}`}>{app.finalPaid ? 'PAID ✓' : 'UNPAID ✕'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTaskForModal(app)}
                    className="px-3 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 cursor-pointer text-xs"
                  >
                    Inspect Details
                  </button>

                  <button
                    onClick={() => handleAdvanceStage('published_registry', app)}
                    disabled={!app.finalPaid}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-40 cursor-pointer"
                  >
                    Confirm Payment & Release Cert
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Audit Log Feed */}
      {activeOpsTab === 'audit_log' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">Immutable Audit Trail Logs</h3>
              <p className="text-xs text-slate-500 font-mono">Permanent record of all platform operations and stage transitions</p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>
                    {log.action} — <span className="text-amber-700">{log.userName}</span> ({log.userRole})
                  </span>
                  <span className="text-slate-400 font-normal text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-600">{log.newValue}</p>
                {log.reason && <div className="text-[11px] text-amber-800 font-semibold bg-amber-50 p-2 rounded-lg border border-amber-200">Note: {log.reason}</div>}
                <div className="text-[10px] text-slate-400 pt-1">IP: {log.ipAddress} • Signature: {log.digitalSignature}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Decision & Linked Reference Modal */}
      {activeTaskForModal && (
        <TaskDetailModal
          application={activeTaskForModal}
          currentUserRole={currentUserRole}
          onClose={() => setActiveTaskForModal(null)}
          onRefreshData={onRefreshData}
        />
      )}
    </div>
  );
};

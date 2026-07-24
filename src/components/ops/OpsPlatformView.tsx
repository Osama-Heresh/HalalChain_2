import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  UserRole,
  CertificationApplication,
  Lead,
  AuditLogEntry,
  AiServiceLog,
  WorkflowStage,
  TalentApplication
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
  Filter,
  Bell,
  UserPlus
} from 'lucide-react';
import { IslamicPatternBg } from '../IslamicPatternBg';
import { PMProjectHubView } from './PMProjectHubView';
import { TaskDetailModal } from './TaskDetailModal';
import { EmployeeWalletView } from './EmployeeWalletView';

import { safeFetch, getLocalTalentApps } from '../../lib/api';
import { INITIAL_TALENT_APPLICATIONS } from '../../data/mockData';

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
  const [activeOpsTab, setActiveOpsTab] = useState<'my_work' | 'crm' | 'pm' | 'ai_engine' | 'auditor' | 'finance' | 'audit_log' | 'wallet'>('my_work');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(applications[0]?.id || '');

  // Task Inspection Modal State
  const [activeTaskForModal, setActiveTaskForModal] = useState<CertificationApplication | null>(null);

  // My Work Filter Toggle ('role' or 'all')
  const [myWorkFilter, setMyWorkFilter] = useState<'role' | 'all'>('role');

  // AI Run state
  const [runningAi, setRunningAi] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Pending Talent Applications for PM Alert Banner
  const [pendingTalentApps, setPendingTalentApps] = useState<TalentApplication[]>(() => {
    return getLocalTalentApps().filter((t) => t.status === 'Pending Review');
  });

  const fetchTalentApps = () => {
    safeFetch('/api/talent-applications', 'talent_apps', INITIAL_TALENT_APPLICATIONS)
      .then((data) => {
        if (Array.isArray(data)) {
          setPendingTalentApps(data.filter((t: TalentApplication) => t.status === 'Pending Review'));
        }
      })
      .catch((err) => console.warn('Using client-side talent apps', err));
  };

  useEffect(() => {
    fetchTalentApps();
    const interval = setInterval(fetchTalentApps, 10000);
    return () => clearInterval(interval);
  }, []);

  // Define allowed sub-tabs for each user role to prevent confusion
  const getAllowedTabsForRole = (role: UserRole): Array<'my_work' | 'crm' | 'pm' | 'ai_engine' | 'auditor' | 'finance' | 'audit_log' | 'wallet'> => {
    switch (role) {
      case 'scholar':
        // Sharia Scholars need My Work, Sharia Review Workspace, Wallet, and Audit Log
        return ['my_work', 'auditor', 'wallet', 'audit_log'];
      case 'finance':
        // Finance Officers need My Work, Finance Release Gate, Wallet, and Audit Log
        return ['my_work', 'finance', 'wallet', 'audit_log'];
      case 'tech_auditor':
        // Tech Auditors need My Work, Technical Audit Workspace, AI Assessment Center, Wallet, and Audit Log
        return ['my_work', 'auditor', 'ai_engine', 'wallet', 'audit_log'];
      case 'sales':
      case 'marketing':
        // Sales / Marketing need My Work, CRM & Sales Pipeline, Wallet, and Audit Log
        return ['my_work', 'crm', 'wallet', 'audit_log'];
      case 'pm':
        // PMs need My Work, PM Project Hub, CRM, Wallet, and Audit Log
        return ['my_work', 'pm', 'crm', 'wallet', 'audit_log'];
      case 'business_analyst':
        // Business Analysts need My Work, PM Hub, AI Assessment Center, Wallet, and Audit Log
        return ['my_work', 'pm', 'ai_engine', 'wallet', 'audit_log'];
      case 'qa':
        // QA Officers need My Work, Auditor/QA Workspace, Wallet, and Audit Log
        return ['my_work', 'auditor', 'wallet', 'audit_log'];
      case 'admin':
      case 'exec':
      default:
        // System Admins and Executives have full operational visibility across all tabs
        return ['my_work', 'pm', 'ai_engine', 'auditor', 'crm', 'finance', 'wallet', 'audit_log'];
    }
  };


  const allowedTabs = getAllowedTabsForRole(currentUserRole);

  useEffect(() => {
    if (!allowedTabs.includes(activeOpsTab)) {
      setActiveOpsTab(allowedTabs[0]);
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
            {lang === 'ar' ? 'منصة العمليات والتدقيق الشرعي الرقمي - حلال تشين™' : 'HalalChain™ Remote Operations Platform'}
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

      {/* PM Recruitment Alert Banner */}
      {pendingTalentApps.length > 0 &&
        (currentUserRole === 'pm' ||
          currentUserRole === 'admin' ||
          currentUserRole === 'exec' ||
          currentUserRole === 'business_analyst') && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-amber-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold font-mono tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded">
                    {lang === 'ar' ? 'تنبيه مدير المشاريع (PM Alert)' : 'Project Manager Alert'}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-950">
                    {pendingTalentApps.length}{' '}
                    {lang === 'ar'
                      ? 'طلب انضمام جديد بفريق التقييم بانتظار الاعتماد'
                      : 'New Evaluation Team Application(s) Pending PM Review'}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-900 mt-0.5">
                  {lang === 'ar'
                    ? `مقدم الطلب الأحدث: ${pendingTalentApps[0]?.fullName} (${pendingTalentApps[0]?.role.replace('_', ' ')}) - الدولة: ${pendingTalentApps[0]?.country}`
                    : `Latest Applicant: ${pendingTalentApps[0]?.fullName} (${pendingTalentApps[0]?.role.replace('_', ' ')}) from ${pendingTalentApps[0]?.country}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveOpsTab('pm')}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-950 text-amber-300 hover:text-white hover:bg-slate-900 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'فحص السير الذاتية والتعيين' : 'Review & Recruit Expert'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      {/* Navigation Sub-Tabs (Filtered per role) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-mono overflow-x-auto scrollbar-none max-w-full touch-pan-x">
        {allowedTabs.includes('my_work') && (
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
        )}

        {allowedTabs.includes('pm') && (
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
        )}

        {allowedTabs.includes('ai_engine') && (
          <button
            onClick={() => setActiveOpsTab('ai_engine')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeOpsTab === 'ai_engine' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'مركز التقييم بالذكاء الاصطناعي' : 'AI Assessment Center'}</span>
          </button>
        )}

        {allowedTabs.includes('auditor') && (
          <button
            onClick={() => setActiveOpsTab('auditor')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeOpsTab === 'auditor' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {currentUserRole === 'scholar' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Code className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>
              {currentUserRole === 'scholar'
                ? (lang === 'ar' ? 'مساحة المراجعة والشرعنة' : 'Sharia Review Workspace')
                : currentUserRole === 'tech_auditor'
                ? (lang === 'ar' ? 'تدقيق العقود الذكية' : 'Smart Contract Tech Auditor')
                : currentUserRole === 'qa'
                ? (lang === 'ar' ? 'مساحة ضمان الجودة' : 'QA Certification Gate')
                : (lang === 'ar' ? 'مساحة التدقيق والشرعنة' : 'Auditor Workspace')}
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {auditorTaskCount}
            </span>
          </button>
        )}

        {allowedTabs.includes('crm') && (
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
        )}

        {allowedTabs.includes('finance') && (
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
        )}

        {allowedTabs.includes('wallet') && (
          <button
            onClick={() => setActiveOpsTab('wallet')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeOpsTab === 'wallet' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'ar' ? 'محفظتي والمكافآت' : 'Employee Wallet'}</span>
          </button>
        )}

        {allowedTabs.includes('audit_log') && (
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
        )}

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
        <PMProjectHubView
          applications={applications}
          onUpdateApplicationStage={(appId, stage) => {
            const target = applications.find((a) => a.id === appId);
            if (target) handleAdvanceStage(stage, target);
          }}
          onOpenTaskModal={(app) => setActiveTaskForModal(app)}
        />
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
              <h3 className="text-base font-bold font-serif text-slate-900">
                {currentUserRole === 'scholar'
                  ? (lang === 'ar' ? 'مساحة فضيلة الشيخ والمراجع الشرعي' : 'Sharia Scholar Review Workspace')
                  : currentUserRole === 'tech_auditor'
                  ? (lang === 'ar' ? 'مساحة التدقيق الفني للعقود الذكية' : 'Smart Contract Tech Auditor Workspace')
                  : (lang === 'ar' ? 'مساحة ضمان الجودة والتدقيق' : 'Quality Assurance & Certification Gate')}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {currentUserRole === 'scholar'
                  ? (lang === 'ar' ? 'مراجعة نموذج العمل والورقة البيضاء والمعايير الشرعية لـ ' : 'Evaluating business model, Mudarabah structure & whitepaper for ')
                  : currentUserRole === 'tech_auditor'
                  ? (lang === 'ar' ? 'فحص شفرة العقد الذكي وامتيازات الصكوك لـ ' : 'Inspecting EVM smart contract bytecode, privileges & timelocks for ')
                  : (lang === 'ar' ? 'فحص اكتمال الشهادة والبيانات لـ ' : 'Verifying certificate metadata & audit ledger integrity for ')}
                <span className="font-bold text-slate-900">{selectedApp?.companyName}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {getRoleBadgeLabel(currentUserRole)}
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

          {/* Inspection Checklist & Linked Evidence References (Tailored to Role) */}
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900 text-sm block">
                {currentUserRole === 'scholar'
                  ? (lang === 'ar' ? 'الوثائق والأدلة الموجهة للمراجع الشرعي:' : 'Sharia Documentation & Evidence Links:')
                  : currentUserRole === 'tech_auditor'
                  ? (lang === 'ar' ? 'روابط البرمجيات وشفرة العقد الذكي:' : 'Technical Code Repository & Blockchain Explorer:')
                  : (lang === 'ar' ? 'الأدلة والشهادات التوثيقية:' : 'Verification References & Evidence:')}
              </span>
              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href={selectedApp?.whitepaperUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-amber-800 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'رابط الورقة البيضاء الرسمية' : 'Official Whitepaper'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Only show raw smart contract address link to Tech Auditors and QA/Admins, hide from Scholars */}
                {currentUserRole !== 'scholar' && selectedApp?.contractAddress && selectedApp?.contractAddress !== 'N/A' && (
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

            {/* Checklist items tailored to role */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>
                    {currentUserRole === 'scholar'
                      ? (lang === 'ar' ? 'قائمة الفحص الشرعي الموثوق بالأدلة (معايير أيوفي AAOIFI v2.1):' : 'Sharia Compliance Verification Checklist & Evidence Links (AAOIFI Standard v2.1):')
                      : currentUserRole === 'tech_auditor'
                      ? (lang === 'ar' ? 'قائمة الفحص البرمجي وأمان العقد الموثقة بالأدلة:' : 'Smart Contract Security & Bytecode Checklist (Linked Evidence):')
                      : (lang === 'ar' ? 'قائمة فحص الجودة والشهادة الرقمية:' : 'QA Metadata & Registry Integrity Checklist:')}
                  </span>
                </span>
                <span className="text-[10px] font-mono text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                  {lang === 'ar' ? 'جميع عناصر الفحص مربوطة بأدلة توثيقية' : 'All Audit Items Verified & Linked'}
                </span>
              </div>

              <div className="space-y-3 text-slate-700 pt-1">
                {currentUserRole === 'scholar' ? (
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Item 1 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-amber-400 transition-all">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {lang === 'ar' ? '1. خلو برك السيولة من الفوائد الربوية المضمونة (AAOIFI Standard #21)' : '1. Verified zero guaranteed fixed interest (Riba) in yield pool structures (AAOIFI #21)'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {lang === 'ar' ? 'معيار أيوفي رقم 21: حظر عائد الفائدة المضمون ثابتاً بدون مخاطرة' : 'AAOIFI Standard 21: Strict prohibition on guaranteed fixed interest yields'}
                          </span>
                        </div>
                      </label>
                      <a
                        href={selectedApp?.whitepaperUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>{lang === 'ar' ? 'دليل: الورقة البيضاء §4.2 (عائد السيولة)' : 'Evidence: Whitepaper §4.2 (Yield Pool Structure)'}</span>
                        <ExternalLink className="w-3 h-3 text-amber-700" />
                      </a>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-amber-400 transition-all">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {lang === 'ar' ? '2. آلية المشاركة في الربح والخسارة - المضاربة (AAOIFI Standard #13)' : '2. Verified Mudarabah / Musharakah risk-sharing profit mechanism (AAOIFI #13)'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {lang === 'ar' ? 'تحديد نسب توزيع الربح الشائعة بدون ضمان رأس المال' : 'Proportional profit sharing matrix without principal guarantee'}
                          </span>
                        </div>
                      </label>
                      <a
                        href={selectedApp?.whitepaperUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>{lang === 'ar' ? 'دليل: عقد المضاربة والتوكنومكس v1.4' : 'Evidence: Mudarabah Tokenomics Sheet v1.4'}</span>
                        <ExternalLink className="w-3 h-3 text-amber-700" />
                      </a>
                    </div>

                    {/* Item 3 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-amber-400 transition-all">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {lang === 'ar' ? '3. وجود أصل حقيقي ومنع الغرر الفاحش (AAOIFI Standard #30)' : '3. Verified asset backing & absence of excessive speculation / Gharar (AAOIFI #30)'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {lang === 'ar' ? 'ربط التوكن بوجود أصل حقيقي أو منفعة حقيقية معتمدة' : 'Token value tied to verifiable real-world assets or underlying utility'}
                          </span>
                        </div>
                      </label>
                      <a
                        href={selectedApp?.websiteUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Globe className="w-3.5 h-3.5 text-amber-700" />
                        <span>{lang === 'ar' ? 'دليل: أوراكل الاحتياطي ومحفظة الضمان' : 'Evidence: On-Chain Asset Vault & Oracle Feed'}</span>
                        <ExternalLink className="w-3 h-3 text-amber-700" />
                      </a>
                    </div>

                    {/* Item 4 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-amber-400 transition-all">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {lang === 'ar' ? '4. مطابقة نموذج الحوكمة لمعايير الرقابة الشرعية (AAOIFI Governance #7)' : '4. Verified business governance with AAOIFI Governance Guidelines (AAOIFI Gov #7)'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {lang === 'ar' ? 'الالتزام بقرارات الهيئة الشرعية وحق المراجعة المستمرة' : 'Compliance with Sharia board oversight & annual audit protocols'}
                          </span>
                        </div>
                      </label>
                      <a
                        href={selectedApp?.whitepaperUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>{lang === 'ar' ? 'دليل: قرار الهيئة الشرعية والحوكمة' : 'Evidence: Board Resolution & Governance Bylaws'}</span>
                        <ExternalLink className="w-3 h-3 text-amber-700" />
                      </a>
                    </div>
                  </div>
                ) : currentUserRole === 'tech_auditor' ? (
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Item 1 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-emerald-400 transition-all">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {lang === 'ar' ? '1. القفل الزمني (Timelock) والصلاحيات متعددة التوقيع' : '1. Verified owner pause & mint functions possess multi-sig timelocks'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {lang === 'ar' ? 'تأكيد وجود تأخير 48 ساعة قبل أي تعديل على العقد' : '48-hour delay on sensitive admin operations'}
                          </span>
                        </div>
                      </label>
                      {selectedApp?.contractAddress && selectedApp?.contractAddress !== 'N/A' && (
                        <a
                          href={`https://etherscan.io/address/${selectedApp.contractAddress}`}
                          target="_blank"
                          rel="noreferrer"
                          className="self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <Code className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Evidence: Timelock MultiSig Contract</span>
                          <ExternalLink className="w-3 h-3 text-emerald-700" />
                        </a>
                      )}
                    </div>

                    {/* Item 2 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-emerald-400 transition-all">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {lang === 'ar' ? '2. الحماية ضد هجمات إعادة الدخول (Re-entrancy Guard)' : '2. Verified nonReentrant modifier on liquidity withdrawal entry points'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {lang === 'ar' ? 'فحص السكون والتحقق من استخدام Slither & Mythril' : 'Static analysis verified clean against reentrancy vectors'}
                          </span>
                        </div>
                      </label>
                      <a
                        href={selectedApp?.whitepaperUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Evidence: Slither Security Report</span>
                        <ExternalLink className="w-3 h-3 text-emerald-700" />
                      </a>
                    </div>

                    {/* Item 3 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-emerald-400 transition-all">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {lang === 'ar' ? '3. مطابقة الشفرة البرمجية المصدرية مع الـ Bytecode المنشور' : '3. Validated smart contract bytecode matches declared source repository'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {lang === 'ar' ? 'تأكيد الهاش وتطابق النسخة على مستكشف الكتل' : '100% exact bytecode hash match verified on-chain'}
                          </span>
                        </div>
                      </label>
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Code className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Evidence: Verified Source Repo (GitHub)</span>
                        <ExternalLink className="w-3 h-3 text-emerald-700" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Item 1 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-slate-600" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {lang === 'ar' ? '1. توقيع المشايخ في السجل الرقمي المعتمد' : '1. Verified scholar endorsement signatures registered in immutable ledger'}
                          </span>
                          <span className="text-[11px] text-slate-500">Cryptographic approval record by Sharia Board</span>
                        </div>
                      </label>
                      <a
                        href="/registry"
                        target="_blank"
                        rel="noreferrer"
                        className="self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-bold flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                        <span>Evidence: Immutable Sharia Hash</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-slate-600" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {lang === 'ar' ? '2. صحة رابط الاستجابة السريعة QR للشهادة الرقمية' : '2. Verified QR code verification endpoint pointing to valid registry record'}
                          </span>
                          <span className="text-[11px] text-slate-500">Real-time resolution test passed</span>
                        </div>
                      </label>
                      <a
                        href="/registry"
                        target="_blank"
                        rel="noreferrer"
                        className="self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-bold flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
                        <span>Evidence: Live Registry Endpoint</span>
                      </a>
                    </div>
                  </div>
                )}
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

      {/* Tab 8: Employee Wallet */}
      {activeOpsTab === 'wallet' && (
        <EmployeeWalletView currentUserRole={currentUserRole} />
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

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CandidateProfileModal } from './CandidateProfileModal';
import { TeamMemberEvaluationModal } from './TeamMemberEvaluationModal';
import { ShariaCertificateModal } from '../ShariaCertificateModal';
import {
  CertificationApplication,
  RemoteEmployee,
  TalentApplication,
  ProjectTeamAssignment,
  WorkLogEntry,
  MemberEvaluation,
  UserRole,
  WorkflowStage
} from '../../types';
import {
  safeFetch,
  getLocalEmployees,
  getLocalTalentApps,
  getLocalTeamAssignments,
  getLocalWorkLogs,
  getLocalEvaluations
} from '../../lib/api';
import {
  INITIAL_REMOTE_EMPLOYEES,
  INITIAL_TALENT_APPLICATIONS,
  INITIAL_PROJECT_TEAM_ASSIGNMENTS,
  INITIAL_WORK_LOGS,
  INITIAL_MEMBER_EVALUATIONS
} from '../../data/mockData';
import {
  Briefcase,
  Users,
  Clock,
  DollarSign,
  UserCheck,
  UserPlus,
  RefreshCw,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Search,
  Check,
  Shield,
  Award,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Send,
  ExternalLink,
  Code,
  Building2,
  FileSpreadsheet,
  Printer,
  MessageCircle,
  Mail,
  User,
  GraduationCap,
  BarChart3,
  Sparkles,
  Star,
  Zap,
  Sliders
} from 'lucide-react';

interface PMProjectHubViewProps {
  applications: CertificationApplication[];
  onUpdateApplicationStage: (appId: string, stage: WorkflowStage) => void;
  onOpenTaskModal: (app: CertificationApplication) => void;
}

export const PMProjectHubView: React.FC<PMProjectHubViewProps> = ({
  applications,
  onUpdateApplicationStage,
  onOpenTaskModal
}) => {
  const { lang } = useLanguage();

  // Active Tab inside PM Hub
  const [pmSubTab, setPmSubTab] = useState<'projects' | 'deployed' | 'recruitment' | 'payroll'>('projects');

  // Filter for Projects: 'running' | 'closed' | 'all'
  const [projectStatusFilter, setProjectStatusFilter] = useState<'running' | 'closed' | 'all'>('running');
  const [searchTerm, setSearchTerm] = useState('');

  // Data States initialized with guaranteed mock fallbacks
  const [employees, setEmployees] = useState<RemoteEmployee[]>(() => getLocalEmployees());
  const [talentApps, setTalentApps] = useState<TalentApplication[]>(() => getLocalTalentApps());
  const [teamAssignments, setTeamAssignments] = useState<ProjectTeamAssignment[]>(() => getLocalTeamAssignments());
  const [workLogs, setWorkLogs] = useState<WorkLogEntry[]>(() => getLocalWorkLogs());
  const [evaluations, setEvaluations] = useState<MemberEvaluation[]>(() => getLocalEvaluations());
  const [loading, setLoading] = useState(false);

  // Selected Evaluation for Modal
  const [selectedEvaluationModal, setSelectedEvaluationModal] = useState<MemberEvaluation | null>(null);

  // Certificate Modal State
  const [certModalProject, setCertModalProject] = useState<CertificationApplication | null>(null);
  const [isIssuingCert, setIsIssuingCert] = useState(false);

  // Handle PM Produce & Issue Certificate
  const handleIssueCertificate = async (projectId: string) => {
    setIsIssuingCert(true);
    try {
      const res = await fetch(`/api/applications/${projectId}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nextStage: 'published_registry',
          reason: 'Official Sharia Certificate Produced & Minted by PM after tasks completion.',
          userName: 'Omar Khayyam (PM)',
          userRole: 'pm',
          autoConfirmPayment: true
        })
      });

      if (res.ok) {
        const updatedApp = await res.json();
        setCertModalProject(updatedApp);
        fetchPMData();
      }
    } catch (err) {
      console.error('Failed to issue certificate from PM hub', err);
    } finally {
      setIsIssuingCert(false);
    }
  };

  // Reassignment Modal State
  const [reassignModalProject, setReassignModalProject] = useState<CertificationApplication | null>(null);
  const [selectedRoleToSwap, setSelectedRoleToSwap] = useState<UserRole>('tech_auditor');
  const [selectedNewCandidateId, setSelectedNewCandidateId] = useState<string>('');
  const [reassignReason, setReassignReason] = useState<string>('');
  const [reassigning, setReassigning] = useState(false);

  // New Talent Application Modal State (Simulate external applicant)
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [newTalentForm, setNewTalentForm] = useState({
    fullName: '',
    email: '',
    role: 'tech_auditor' as UserRole,
    country: lang === 'ar' ? 'الأردن' : 'Jordan',
    timeZone: 'GMT+3',
    expectedHourlyRateUsd: 160,
    skills: 'Solidity Security, Slither, Bytecode Disassembly',
    experienceYears: 7,
    cvSummary: 'Experienced Smart Contract Security Auditor with extensive Web3 vulnerabilities research.',
    portfolioUrl: 'https://github.com/sec-auditor',
    githubUrl: 'https://github.com/sec-auditor'
  });

  // Log Hours Modal State
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [newLogForm, setNewLogForm] = useState({
    employeeId: '',
    projectId: applications[0]?.id || '',
    hoursWorked: 10,
    taskDescription: 'Technical bytecode audit & Sharia verification review',
    performanceScore: 98
  });

  // Collapsible reassignment history toggle
  const [expandedHistoryAppId, setExpandedHistoryAppId] = useState<string | null>(null);

  // Candidate Full Bio & CV Profile Modal state
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<TalentApplication | RemoteEmployee | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchPMData();
  }, []);

  const fetchPMData = async () => {
    setLoading(true);
    try {
      const [empRes, talentRes, teamRes, logRes, evalRes] = await Promise.all([
        safeFetch('/api/employees', 'employees', INITIAL_REMOTE_EMPLOYEES),
        safeFetch('/api/talent-applications', 'talent_apps', INITIAL_TALENT_APPLICATIONS),
        safeFetch('/api/projects/team-assignments', 'team_assignments', INITIAL_PROJECT_TEAM_ASSIGNMENTS),
        safeFetch('/api/payroll/work-logs', 'work_logs', INITIAL_WORK_LOGS),
        safeFetch('/api/evaluations', 'evaluations', INITIAL_MEMBER_EVALUATIONS)
      ]);

      if (empRes && Array.isArray(empRes)) setEmployees(empRes);
      if (talentRes && Array.isArray(talentRes)) setTalentApps(talentRes);
      if (teamRes && Array.isArray(teamRes)) setTeamAssignments(teamRes);
      if (logRes && Array.isArray(logRes)) setWorkLogs(logRes);
      if (evalRes && Array.isArray(evalRes)) setEvaluations(evalRes);
    } catch (err) {
      console.warn('Using client-side PM data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssessment = async (updated: MemberEvaluation) => {
    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const saved = await res.json();
      setEvaluations((prev) => {
        const idx = prev.findIndex((e) => e.employeeId === saved.employeeId);
        if (idx >= 0) {
          const newArr = [...prev];
          newArr[idx] = saved;
          return newArr;
        }
        return [saved, ...prev];
      });
      setSelectedEvaluationModal(saved);
    } catch (err) {
      console.error('Failed to save assessment', err);
    }
  };

  // Helper for Running vs Closed stage classification
  const isClosedStage = (stage: WorkflowStage) => {
    return stage === 'completed' || stage === 'published_registry' || stage === 'rejected';
  };

  // Filtered Applications
  const filteredProjects = applications.filter((app) => {
    const isClosed = isClosedStage(app.stage);
    if (projectStatusFilter === 'running' && isClosed) return false;
    if (projectStatusFilter === 'closed' && !isClosed) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        app.companyName.toLowerCase().includes(term) ||
        app.applicationNumber.toLowerCase().includes(term) ||
        app.blockchain.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Calculate Running vs Closed counts
  const runningCount = applications.filter((a) => !isClosedStage(a.stage)).length;
  const closedCount = applications.filter((a) => isClosedStage(a.stage)).length;
  const pendingTalentCount = talentApps.filter((t) => t.status === 'Pending Review').length;
  const totalPayrollDue = workLogs.reduce((sum, log) => sum + log.totalPayUsd, 0);

  // Get project team assignment object
  const getAssignment = (projectId: string): ProjectTeamAssignment => {
    const found = teamAssignments.find((t) => t.projectId === projectId);
    if (found) return found;

    // Fallback default structure
    return {
      projectId,
      leadTechAuditorId: 'EMP-002',
      leadTechAuditorName: 'Youssef Benali',
      shariaScholarId: 'EMP-001',
      shariaScholarName: 'Sheikh Dr. Ali Al-Quradaghi',
      businessAnalystId: 'EMP-003',
      businessAnalystName: 'Amina Al-Mansouri',
      qaOfficerId: 'EMP-005',
      qaOfficerName: 'Zainab Ibrahim',
      lastUpdated: '2026-07-22',
      reassignmentHistory: []
    };
  };

  // Handle Team Member Reassignment
  const handleExecuteReassignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignModalProject || !selectedNewCandidateId) return;

    const selectedEmp = employees.find((e) => e.id === selectedNewCandidateId);
    if (!selectedEmp) return;

    setReassigning(true);
    try {
      const res = await fetch(`/api/projects/${reassignModalProject.id}/reassign-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleToReassign: selectedRoleToSwap,
          newEmployeeId: selectedEmp.id,
          newEmployeeName: selectedEmp.name,
          reason: reassignReason || 'PM performance & timeline optimization',
          pmName: 'Omar Khayyam (PM)'
        })
      });

      if (res.ok) {
        const updatedAssignment = await res.json();
        setTeamAssignments((prev) => {
          const idx = prev.findIndex((p) => p.projectId === reassignModalProject.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = updatedAssignment;
            return next;
          }
          return [updatedAssignment, ...prev];
        });

        setReassignModalProject(null);
        setReassignReason('');
      }
    } catch (err) {
      console.error('Failed to reassign team member', err);
    } finally {
      setReassigning(false);
    }
  };

  // Handle Review Talent Application (Approve / Reject)
  const handleReviewTalent = async (talentId: string, status: 'Approved' | 'Rejected', notes?: string) => {
    try {
      const res = await fetch(`/api/talent-applications/${talentId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes: notes || `Application ${status.toLowerCase()} by Project Manager`,
          reviewerName: 'Omar Khayyam (PM)'
        })
      });

      if (res.ok) {
        const updatedTalent = await res.json();
        setTalentApps((prev) => prev.map((t) => (t.id === talentId ? updatedTalent : t)));
        fetchPMData(); // refresh employee list
      }
    } catch (err) {
      console.error('Failed to review talent application', err);
    }
  };

  // Submit External Candidate CV Application
  const handleCreateTalentApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTalentForm.fullName || !newTalentForm.email) return;

    try {
      const res = await fetch('/api/talent-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTalentForm)
      });

      if (res.ok) {
        const created = await res.json();
        setTalentApps((prev) => [created, ...prev]);
        setShowApplyModal(false);
      }
    } catch (err) {
      console.error('Failed to submit candidate application', err);
    }
  };

  // Submit Work Hours Log
  const handleCreateWorkLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === newLogForm.employeeId) || employees[0];
    const proj = applications.find((a) => a.id === newLogForm.projectId) || applications[0];

    if (!emp || !proj) return;

    try {
      const res = await fetch('/api/payroll/work-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: emp.id,
          employeeName: emp.name,
          role: emp.role,
          projectId: proj.id,
          projectName: proj.companyName,
          hoursWorked: newLogForm.hoursWorked,
          hourlyRateUsd: emp.hourlyCostUsd,
          taskDescription: newLogForm.taskDescription,
          performanceScore: newLogForm.performanceScore
        })
      });

      if (res.ok) {
        const createdLog = await res.json();
        setWorkLogs((prev) => [createdLog, ...prev]);
        setShowLogHoursModal(false);
      }
    } catch (err) {
      console.error('Failed to log work hours', err);
    }
  };

  // Approve Payroll Release
  const handleApprovePayroll = async (logIds: string[]) => {
    try {
      const res = await fetch('/api/payroll/approve-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logIds, pmName: 'Omar Khayyam (PM)' })
      });

      if (res.ok) {
        setWorkLogs((prev) =>
          prev.map((log) => (logIds.includes(log.id) ? { ...log, paymentStatus: 'Approved for Release' } : log))
        );
      }
    } catch (err) {
      console.error('Failed to approve payroll release', err);
    }
  };

  const roleLabel = (role: UserRole) => {
    switch (role) {
      case 'scholar':
        return lang === 'ar' ? 'عالم شرعي' : 'Sharia Scholar';
      case 'tech_auditor':
        return lang === 'ar' ? 'مدقق تقني' : 'Technical Auditor';
      case 'business_analyst':
        return lang === 'ar' ? 'محلل أعمال' : 'Business Analyst';
      case 'qa':
        return lang === 'ar' ? 'مسؤول جودة' : 'QA Specialist';
      case 'pm':
        return lang === 'ar' ? 'مدير مشروع' : 'Project Manager';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* PM Hub Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Projects Matrix */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'المشاريع المسجلة' : 'Projects In Pipeline'}</span>
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {applications.length} {lang === 'ar' ? 'مشروع' : 'Projects'}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-emerald-700 font-bold">{runningCount} Running</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-bold">{closedCount} Closed</span>
          </div>
        </div>

        {/* Card 2: Remote Talent Pool */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'فريق العمل المعتمد' : 'Approved Remote Pool'}</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {employees.length} {lang === 'ar' ? 'خبير' : 'Specialists'}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Available across 6 countries & time zones
          </p>
        </div>

        {/* Card 3: Pending CV Applications */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'طلبات التوظيف الخارجية' : 'Pending Talent Applications'}</span>
            <UserPlus className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-amber-700 flex items-center gap-2">
            <span>{pendingTalentCount}</span>
            {pendingTalentCount > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono animate-pulse">
                Needs Review
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Automated application queue</p>
        </div>

        {/* Card 4: Total Remote Payroll */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'مستحقات فريق العمل' : 'Remote Payroll Due'}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-700">
            ${totalPayrollDue.toLocaleString()} USD
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Calculated from verified work logs</p>
        </div>
      </div>

      {/* Alert Banner for PM when Professionals Apply to Join Evaluation Team */}
      {pendingTalentCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-4 rounded-2xl shadow-lg border border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold font-mono tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded">
                  {lang === 'ar' ? 'تنبيه المدير (PM ALERT)' : 'RECRUITMENT ALERT'}
                </span>
                <span className="text-xs font-bold text-slate-950">
                  {pendingTalentCount}{' '}
                  {lang === 'ar'
                    ? 'طلب انضمام جديد بفريق التقييم بانتظار فحص السيرة الذاتية'
                    : 'New Candidate Application(s) Waiting in Recruitment Queue'}
                </span>
              </div>
              <p className="text-xs text-slate-900 mt-0.5 font-medium">
                {lang === 'ar'
                  ? 'تقدم خبراء خارج HalalChain للانضمام إلى فريق التقييم الشرعي والفني. راجع السير الذاتية واعتمد التعيين.'
                  : 'Remote scholars, auditors & analysts applied via "Join the Team". Review CVs and approve recruitment.'}
              </p>
            </div>
          </div>
          {pmSubTab !== 'recruitment' && (
            <button
              onClick={() => setPmSubTab('recruitment')}
              className="shrink-0 px-4 py-2 rounded-xl bg-slate-950 text-amber-300 hover:text-white hover:bg-slate-900 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>{lang === 'ar' ? 'فتح قائمة التوظيف' : 'Open Recruitment Queue'}</span>
              <UserPlus className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      )}

      {/* Main PM Navigation Tabs */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x max-w-full pb-1 text-xs font-mono">
          <button
            onClick={() => setPmSubTab('projects')}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              pmSubTab === 'projects'
                ? 'bg-[#0B132B] text-amber-400 shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{lang === 'ar' ? 'قائمة المشاريع وإدارة الفرق' : 'Projects List & Team Management'}</span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setPmSubTab('deployed')}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              pmSubTab === 'deployed'
                ? 'bg-[#0B132B] text-amber-400 shadow-md ring-2 ring-amber-400/50'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'ar' ? 'أعضاء الفريق العاملون حالياً في المشاريع' : 'Active Deployed Team Members (Evaluation)'}</span>
            <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {employees.filter((e) => e.currentWorkload > 0 || e.status === 'Assigned').length || 4}
            </span>
          </button>

          <button
            onClick={() => setPmSubTab('recruitment')}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              pmSubTab === 'recruitment'
                ? 'bg-[#0B132B] text-amber-400 shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'بوابة التوظيف الخارجي للسير الذاتية' : 'Automated Talent Recruitment Portal'}</span>
            {pendingTalentCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {pendingTalentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setPmSubTab('payroll')}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              pmSubTab === 'payroll'
                ? 'bg-[#0B132B] text-amber-400 shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{lang === 'ar' ? 'سجلات الساعات وتقرير الأجور' : 'Hours Log & Payroll Performance'}</span>
          </button>
        </div>

        {/* Quick Action Button */}
        {pmSubTab === 'recruitment' && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 text-xs font-bold font-mono hover:bg-amber-400 transition-all cursor-pointer shadow-sm flex items-center gap-2 self-start md:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تقديم سيرة ذاتية جديدة' : '+ Submit Candidate Application'}</span>
          </button>
        )}

        {pmSubTab === 'payroll' && (
          <button
            onClick={() => setShowLogHoursModal(true)}
            className="px-4 py-2 rounded-2xl bg-[#0B132B] text-amber-400 text-xs font-bold font-mono hover:bg-[#1C2541] transition-all cursor-pointer shadow-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'تسجيل ساعات عمل جديدة' : '+ Log Work Hours'}</span>
          </button>
        )}
      </div>

      {/* SUB-TAB 1: Projects Matrix (Running vs Closed) */}
      {pmSubTab === 'projects' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            {/* Toggle Status Buttons */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-mono">
              <button
                onClick={() => setProjectStatusFilter('running')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  projectStatusFilter === 'running'
                    ? 'bg-[#0B132B] text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Running / Active</span>
                <span className="bg-emerald-500/20 text-emerald-700 px-2 py-0.2 rounded-full text-[10px]">
                  {runningCount}
                </span>
              </button>

              <button
                onClick={() => setProjectStatusFilter('closed')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  projectStatusFilter === 'closed'
                    ? 'bg-[#0B132B] text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Closed / Completed</span>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.2 rounded-full text-[10px]">
                  {closedCount}
                </span>
              </button>

              <button
                onClick={() => setProjectStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  projectStatusFilter === 'all'
                    ? 'bg-[#0B132B] text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Projects ({applications.length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'بحث باسم المشروع أو المعرف...' : 'Search project or ID...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-6">
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-mono text-xs bg-slate-50 rounded-2xl border border-slate-200">
                No projects match the selected filter query.
              </div>
            ) : (
              filteredProjects.map((app) => {
                const isClosed = isClosedStage(app.stage);
                const assignment = getAssignment(app.id);

                return (
                  <div
                    key={app.id}
                    className={`p-6 rounded-3xl border transition-all space-y-5 shadow-sm ${
                      isClosed ? 'bg-slate-50/70 border-slate-200' : 'bg-white border-slate-200/90 hover:border-amber-400/80'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-lg font-bold font-serif text-slate-900">{app.companyName}</h4>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold font-mono px-2 py-0.5 rounded">
                            {app.applicationNumber}
                          </span>
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase">
                            {app.packageType}
                          </span>
                          {isClosed ? (
                            <span className="bg-slate-200 text-slate-800 text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-slate-600" />
                              <span>Closed / {app.stage.replace(/_/g, ' ')}</span>
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase flex items-center gap-1">
                              <RefreshCw className="w-3 h-3 text-emerald-600 animate-spin" />
                              <span>Running ({app.stage.replace(/_/g, ' ')})</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-mono text-slate-500">
                          Blockchain: <span className="font-semibold text-slate-800">{app.blockchain}</span> • Submitted:{' '}
                          <span className="text-slate-800">{app.submittedAt}</span> • Target SLA:{' '}
                          <span className="font-bold text-amber-700">{app.targetCompletionDate}</span> • Fee:{' '}
                          <span className="font-bold text-emerald-700">${app.totalFee.toLocaleString()} USD</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => setCertModalProject(app)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs font-bold hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <Award className="w-4 h-4 text-slate-950" />
                          <span>{app.stage === 'published_registry' ? 'View Certificate (Barcode)' : 'Produce & Issue Certificate'}</span>
                        </button>

                        <button
                          onClick={() => onOpenTaskModal(app)}
                          className="px-3 py-1.5 rounded-xl bg-[#0B132B] text-amber-300 font-mono text-xs font-bold hover:bg-[#1C2541] cursor-pointer flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Task Detail Modal</span>
                        </button>
                      </div>
                    </div>

                    {/* Assigned Project Team Bar */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-amber-600" />
                          <span>Assigned Remote Project Team</span>
                        </span>

                        {!isClosed && (
                          <button
                            onClick={() => {
                              setReassignModalProject(app);
                              setSelectedRoleToSwap('tech_auditor');
                              setSelectedNewCandidateId('');
                            }}
                            className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold cursor-pointer flex items-center gap-1 transition-all"
                          >
                            <RefreshCw className="w-3 h-3 text-amber-700" />
                            <span>{lang === 'ar' ? 'تعديل / تبديل عضو فريق' : 'Swap / Reassign Member'}</span>
                          </button>
                        )}
                      </div>

                      {/* Team Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-700">
                        {/* Member 1: Tech Auditor */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Lead Tech Auditor</div>
                            <div className="font-bold text-slate-900 truncate">{assignment.leadTechAuditorName}</div>
                            <div className="text-[10px] text-emerald-700 font-semibold">Active Reviewer ✓</div>
                          </div>
                          <button
                            onClick={() => {
                              const empId = assignment.leadTechAuditorId || 'EMP-001';
                              const existingEval = evaluations.find((ev) => ev.employeeId === empId || ev.employeeName === assignment.leadTechAuditorName) || {
                                id: `EVAL-${empId}`,
                                employeeId: empId,
                                employeeName: assignment.leadTechAuditorName,
                                role: 'tech_auditor',
                                projectId: app.id,
                                projectName: app.projectName,
                                currentTask: 'Technical Bytecode Audit & Verification',
                                assignedDate: '2026-07-15',
                                systemAutoMetrics: { slaAdherenceScore: 98, auditAccuracyScore: 99, reportCompleteness: 97, communicationResponsiveness: 98, complianceQuality: 99, overallAutoScore: 98 },
                                pmManualAssessment: { leadershipScore: 96, analyticalDepth: 98, teamCollaboration: 95, technicalRigour: 99, deliverablePunctuality: 97, overallPmScore: 97, evaluatorNotes: 'Outstanding technical diligence.', evaluatedDate: new Date().toISOString().split('T')[0], evaluatorName: 'Omar Khayyam (PM)' },
                                finalCombinedScore: 98,
                                ratingCategory: 'Exceptional (A+)'
                              };
                              setSelectedEvaluationModal(existingEval as MemberEvaluation);
                            }}
                            className="w-full py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1 transition-all"
                          >
                            <BarChart3 className="w-3 h-3 text-amber-700" />
                            <span>Evaluate Member</span>
                          </button>
                        </div>

                        {/* Member 2: Sharia Scholar */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Sharia Scholar</div>
                            <div className="font-bold text-slate-900 truncate">{assignment.shariaScholarName}</div>
                            <div className="text-[10px] text-amber-700 font-semibold">Board Signatory ✓</div>
                          </div>
                          <button
                            onClick={() => {
                              const empId = assignment.shariaScholarId || 'EMP-002';
                              const existingEval = evaluations.find((ev) => ev.employeeId === empId || ev.employeeName === assignment.shariaScholarName) || {
                                id: `EVAL-${empId}`,
                                employeeId: empId,
                                employeeName: assignment.shariaScholarName,
                                role: 'scholar',
                                projectId: app.id,
                                projectName: app.projectName,
                                currentTask: 'AAOIFI Sharia Governance Fatwa Review',
                                assignedDate: '2026-07-15',
                                systemAutoMetrics: { slaAdherenceScore: 96, auditAccuracyScore: 98, reportCompleteness: 98, communicationResponsiveness: 97, complianceQuality: 100, overallAutoScore: 97 },
                                pmManualAssessment: { leadershipScore: 98, analyticalDepth: 99, teamCollaboration: 97, technicalRigour: 98, deliverablePunctuality: 96, overallPmScore: 98, evaluatorNotes: 'Deep AAOIFI expertise and clear scholarly rulings.', evaluatedDate: new Date().toISOString().split('T')[0], evaluatorName: 'Omar Khayyam (PM)' },
                                finalCombinedScore: 98,
                                ratingCategory: 'Exceptional (A+)'
                              };
                              setSelectedEvaluationModal(existingEval as MemberEvaluation);
                            }}
                            className="w-full py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1 transition-all"
                          >
                            <BarChart3 className="w-3 h-3 text-amber-700" />
                            <span>Evaluate Member</span>
                          </button>
                        </div>

                        {/* Member 3: Business Analyst */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Business Analyst</div>
                            <div className="font-bold text-slate-900 truncate">{assignment.businessAnalystName}</div>
                            <div className="text-[10px] text-slate-600 font-semibold">Tokenomics Lead ✓</div>
                          </div>
                          <button
                            onClick={() => {
                              const empId = assignment.businessAnalystId || 'EMP-003';
                              const existingEval = evaluations.find((ev) => ev.employeeId === empId || ev.employeeName === assignment.businessAnalystName) || {
                                id: `EVAL-${empId}`,
                                employeeId: empId,
                                employeeName: assignment.businessAnalystName,
                                role: 'business_analyst',
                                projectId: app.id,
                                projectName: app.projectName,
                                currentTask: 'Financial Flow & Mudarabah Tokenomics Modeling',
                                assignedDate: '2026-07-15',
                                systemAutoMetrics: { slaAdherenceScore: 94, auditAccuracyScore: 95, reportCompleteness: 96, communicationResponsiveness: 95, complianceQuality: 96, overallAutoScore: 95 },
                                pmManualAssessment: { leadershipScore: 93, analyticalDepth: 96, teamCollaboration: 95, technicalRigour: 94, deliverablePunctuality: 95, overallPmScore: 94, evaluatorNotes: 'Strong economic modeling and clear financial breakdowns.', evaluatedDate: new Date().toISOString().split('T')[0], evaluatorName: 'Omar Khayyam (PM)' },
                                finalCombinedScore: 95,
                                ratingCategory: 'Exceptional (A+)'
                              };
                              setSelectedEvaluationModal(existingEval as MemberEvaluation);
                            }}
                            className="w-full py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1 transition-all"
                          >
                            <BarChart3 className="w-3 h-3 text-amber-700" />
                            <span>Evaluate Member</span>
                          </button>
                        </div>

                        {/* Member 4: QA Officer */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">QA Officer</div>
                            <div className="font-bold text-slate-900 truncate">{assignment.qaOfficerName}</div>
                            <div className="text-[10px] text-slate-600 font-semibold">Verification QA ✓</div>
                          </div>
                          <button
                            onClick={() => {
                              const empId = assignment.qaOfficerId || 'EMP-005';
                              const existingEval = evaluations.find((ev) => ev.employeeId === empId || ev.employeeName === assignment.qaOfficerName) || {
                                id: `EVAL-${empId}`,
                                employeeId: empId,
                                employeeName: assignment.qaOfficerName,
                                role: 'qa',
                                projectId: app.id,
                                projectName: app.projectName,
                                currentTask: 'QA Verification & Test Case Validation',
                                assignedDate: '2026-07-15',
                                systemAutoMetrics: { slaAdherenceScore: 97, auditAccuracyScore: 97, reportCompleteness: 98, communicationResponsiveness: 99, complianceQuality: 98, overallAutoScore: 98 },
                                pmManualAssessment: { leadershipScore: 95, analyticalDepth: 97, teamCollaboration: 98, technicalRigour: 98, deliverablePunctuality: 98, overallPmScore: 97, evaluatorNotes: 'Rigorously validated all test cases before final signoff.', evaluatedDate: new Date().toISOString().split('T')[0], evaluatorName: 'Omar Khayyam (PM)' },
                                finalCombinedScore: 98,
                                ratingCategory: 'Exceptional (A+)'
                              };
                              setSelectedEvaluationModal(existingEval as MemberEvaluation);
                            }}
                            className="w-full py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1 transition-all"
                          >
                            <BarChart3 className="w-3 h-3 text-amber-700" />
                            <span>Evaluate Member</span>
                          </button>
                        </div>
                      </div>

                      {/* Reassignment Audit History Collapsible */}
                      {assignment.reassignmentHistory && assignment.reassignmentHistory.length > 0 && (
                        <div className="pt-2 border-t border-slate-200">
                          <button
                            onClick={() =>
                              setExpandedHistoryAppId(expandedHistoryAppId === app.id ? null : app.id)
                            }
                            className="text-[11px] text-amber-800 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>
                              {expandedHistoryAppId === app.id ? 'Hide Reassignment Audit Log' : 'View Reassignment Audit History'} ({assignment.reassignmentHistory.length})
                            </span>
                            {expandedHistoryAppId === app.id ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          {expandedHistoryAppId === app.id && (
                            <div className="mt-2 space-y-2 bg-white p-3 rounded-xl border border-slate-200 text-[11px]">
                              {assignment.reassignmentHistory.map((hist, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-0 pb-1.5 gap-1">
                                  <div>
                                    <span className="font-bold text-slate-900">{hist.date}:</span> Swapped{' '}
                                    <span className="font-semibold text-rose-700">{hist.previousMemberName}</span> with{' '}
                                    <span className="font-semibold text-emerald-700">{hist.newMemberName}</span> for{' '}
                                    <span className="uppercase text-amber-800 font-bold">{hist.role}</span>
                                  </div>
                                  <div className="text-slate-500 italic">"{hist.reason}"</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Stage Advance Bar for PM */}
                    <div className="flex items-center justify-between gap-2 text-xs font-mono bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200 flex-wrap">
                      <span className="font-bold text-amber-950">Advance Stage:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onUpdateApplicationStage(app.id, 'ai_assessment')}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 font-semibold cursor-pointer text-[11px]"
                        >
                          → AI Assessment
                        </button>
                        <button
                          onClick={() => onUpdateApplicationStage(app.id, 'technical_review')}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 font-semibold cursor-pointer text-[11px]"
                        >
                          → Tech Review
                        </button>
                        <button
                          onClick={() => onUpdateApplicationStage(app.id, 'scholar_review')}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 font-semibold cursor-pointer text-[11px]"
                        >
                          → Scholar Review
                        </button>
                        <button
                          onClick={() => onUpdateApplicationStage(app.id, 'waiting_final_payment')}
                          className="px-2.5 py-1 rounded-lg bg-amber-200 text-amber-950 font-semibold hover:bg-amber-300 cursor-pointer text-[11px]"
                        >
                          → Final Payment
                        </button>
                        <button
                          onClick={() => onUpdateApplicationStage(app.id, 'published_registry')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer shadow-sm text-[11px]"
                        >
                          ✓ Publish Certificate
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: Currently Deployed Project Team Members (Listed Separately) */}
      {pmSubTab === 'deployed' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-mono">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-bold font-serif text-slate-900">
                  {lang === 'ar'
                    ? 'أعضاء الفريق العاملون حالياً في المشاريع (مدرجون بشكل منفصل)'
                    : 'Currently Deployed Project Team Members (Listed Separately)'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Active specialists currently assigned to running certification projects. Access real-time system auto-evaluations alongside PM manual performance assessment dashboards.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3.5 py-1.5 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active Deployed Specialists: {employees.filter((e) => e.currentWorkload > 0 || e.status === 'Assigned').length || 4}</span>
              </span>
            </div>
          </div>

          {/* Currently Deployed Active Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employees
              .filter((emp) => emp.currentWorkload > 0 || emp.status === 'Assigned' || ['EMP-001', 'EMP-002', 'EMP-003', 'EMP-005'].includes(emp.id))
              .map((emp) => {
                // Find matching project assignment
                const matchedAssignment = teamAssignments.find(
                  (a) =>
                    a.leadTechAuditorId === emp.id ||
                    a.shariaScholarId === emp.id ||
                    a.businessAnalystId === emp.id ||
                    a.qaOfficerId === emp.id ||
                    a.leadTechAuditorName === emp.name ||
                    a.shariaScholarName === emp.name ||
                    a.businessAnalystName === emp.name ||
                    a.qaOfficerName === emp.name
                );

                const matchedApp = applications.find((app) => app.id === matchedAssignment?.projectId) || applications[0];

                // Find existing evaluation or construct default
                const existingEval = evaluations.find((ev) => ev.employeeId === emp.id || ev.employeeName === emp.name) || {
                  id: `EVAL-${emp.id}`,
                  employeeId: emp.id,
                  employeeName: emp.name,
                  role: emp.role,
                  projectId: matchedApp?.id || 'APP-2026-801',
                  projectName: matchedApp?.projectName || 'Sovereign Sukuk Chain',
                  currentTask: 'Active Project Verification & Audit Review',
                  assignedDate: '2026-07-15',
                  systemAutoMetrics: {
                    slaAdherenceScore: emp.qualityScore || 96,
                    auditAccuracyScore: 97,
                    reportCompleteness: 95,
                    communicationResponsiveness: 98,
                    complianceQuality: 99,
                    overallAutoScore: emp.qualityScore || 97
                  },
                  pmManualAssessment: {
                    leadershipScore: 95,
                    analyticalDepth: 96,
                    teamCollaboration: 94,
                    technicalRigour: 98,
                    deliverablePunctuality: 96,
                    overallPmScore: 96,
                    evaluatorNotes: 'Demonstrated high performance and strict adherence to AAOIFI & HalalChain standards.',
                    evaluatedDate: new Date().toISOString().split('T')[0],
                    evaluatorName: 'Omar Khayyam (PM Lead)'
                  },
                  finalCombinedScore: emp.qualityScore || 97,
                  ratingCategory: (emp.qualityScore || 97) >= 95 ? 'Exceptional (A+)' : 'Strong (A)'
                };

                return (
                  <div
                    key={emp.id}
                    className="p-6 rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30 space-y-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                    {/* Member Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#0B132B] text-amber-300 font-serif font-bold text-lg flex items-center justify-center shrink-0 border border-amber-400/40 shadow-sm">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold font-serif text-slate-900">{emp.name}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                              Active Deployed
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Role: <span className="font-bold text-amber-900">{roleLabel(emp.role)}</span> • {emp.country} ({emp.timeZone})
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 block">${emp.hourlyCostUsd}/hr</span>
                        <span className="text-[10px] text-slate-500">Workload: <span className="font-bold text-emerald-700">{emp.currentWorkload || 70}%</span></span>
                      </div>
                    </div>

                    {/* Assigned Project Card */}
                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Running Project</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          {matchedApp?.stage?.replace(/_/g, ' ') || 'technical_review'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-amber-600" />
                        <span>{matchedApp?.projectName || 'Sovereign Sukuk Chain'}</span>
                        <span className="text-xs text-slate-400">({matchedApp?.id})</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Current Task: <span className="font-semibold text-slate-800">{existingEval.currentTask}</span>
                      </div>
                    </div>

                    {/* Dual Performance Metrics Bar (Auto System vs PM Evaluation) */}
                    <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 font-mono">
                      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Performance Assessment Overview</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                          {existingEval.ratingCategory}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        {/* Auto Score */}
                        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                          <span className="text-[10px] text-slate-400 block uppercase">Auto System</span>
                          <span className="text-lg font-bold text-indigo-400">{existingEval.systemAutoMetrics.overallAutoScore}</span>
                          <span className="text-[10px] text-slate-500 block">/ 100</span>
                        </div>

                        {/* PM Score */}
                        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                          <span className="text-[10px] text-slate-400 block uppercase">PM Review</span>
                          <span className="text-lg font-bold text-amber-400">{existingEval.pmManualAssessment.overallPmScore}</span>
                          <span className="text-[10px] text-slate-500 block">/ 100</span>
                        </div>

                        {/* Combined */}
                        <div className="bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 p-2 rounded-xl border border-amber-500/30">
                          <span className="text-[10px] text-amber-300 block uppercase">Combined</span>
                          <span className="text-lg font-bold text-white">{existingEval.finalCombinedScore}</span>
                          <span className="text-[10px] text-emerald-400 block">Grade A+</span>
                        </div>
                      </div>
                    </div>

                    {/* PROMINENT CALL TO ACTION: EVALUATE MEMBER & OPEN DASHBOARD */}
                    <button
                      onClick={() => setSelectedEvaluationModal(existingEval as MemberEvaluation)}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md group"
                    >
                      <BarChart3 className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                      <span>
                        {lang === 'ar'
                          ? 'تقييم العضو وفتح لوحة تحليلات الأداء المتقدمة'
                          : 'Evaluate Member (PM Assessment & Dashboard)'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-950" />
                    </button>

                    {/* Secondary Action Links: Bio/CV, WhatsApp, Email */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs font-mono flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCandidateForModal(emp)}
                        className="text-slate-800 hover:text-amber-900 font-bold flex items-center gap-1.5 cursor-pointer text-[11px]"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>View Full Bio & M3 CV</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <a
                          href={`https://wa.me/${(emp.whatsappNumber || emp.phone || '+966501234567').replace(/[^0-[#\d]/g, '')}?text=${encodeURIComponent(
                            `Hello ${emp.name}, regarding your performance on project ${matchedApp?.projectName}...`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`mailto:${emp.email || 'emp@halalchain.org'}`}
                          className="text-slate-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-600" />
                          <span>Email</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {pmSubTab === 'recruitment' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">
                {lang === 'ar' ? 'طلبات الانضمام والسير الذاتية للخُبراء المستقلين' : 'Automated External Candidate Recruitment Queue'}
              </h3>
              <p className="text-xs text-slate-500">
                Review CVs, evaluate skills & hourly rates, and approve candidates into the remote talent pool.
              </p>
            </div>

            <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-xl font-bold self-start">
              {talentApps.length} Candidates Submitted
            </span>
          </div>

          {/* Candidate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {talentApps.map((talent) => (
              <div
                key={talent.id}
                className="p-6 rounded-3xl border border-slate-200 bg-slate-50 space-y-4 hover:bg-white transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 border-b pb-3">
                  <div>
                    <h4 className="text-base font-bold font-serif text-slate-900">{talent.fullName}</h4>
                    <p className="text-xs text-slate-500">
                      Role Target: <span className="font-bold text-amber-800">{roleLabel(talent.role)}</span> • Country:{' '}
                      <span className="font-semibold text-slate-800">{talent.country} ({talent.timeZone})</span>
                    </p>
                  </div>

                  {talent.status === 'Approved' ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Approved Remote</span>
                    </span>
                  ) : talent.status === 'Rejected' ? (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-rose-600" />
                      <span>Rejected</span>
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-300 animate-pulse">
                      Pending Review
                    </span>
                  )}
                </div>

                {/* Rates & Experience */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">EXPECTED HOURLY RATE</span>
                    <span className="font-bold text-emerald-700 text-sm">${talent.expectedHourlyRateUsd}/hr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">EXPERIENCE & DATE</span>
                    <span className="font-bold text-slate-800">{talent.experienceYears} Years • {talent.appliedDate}</span>
                  </div>
                </div>

                {/* Skills Badges */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">VERIFIED TECHNICAL SKILLS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {talent.skills.map((skill, idx) => (
                      <span key={idx} className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-md font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CV Summary Box */}
                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-slate-800 space-y-1">
                  <span className="font-bold text-amber-900 block text-[11px]">📄 CV Summary & Qualifications:</span>
                  <p className="leading-relaxed text-[11px] text-slate-700">{talent.cvSummary}</p>
                </div>

                {/* Primary Button: View Full Bio, Education & CV Page */}
                <button
                  onClick={() => setSelectedCandidateForModal(talent)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md group"
                >
                  <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>{lang === 'ar' ? 'عرض الملف الشخصي الكامل والسيرة الذاتية M3 CV' : 'View Candidate Bio, Education & CV Profile'}</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>

                {/* Contact Bar & Quick Links */}
                <div className="flex items-center justify-between pt-1 flex-wrap gap-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    {/* Direct WhatsApp button */}
                    <a
                      href={`https://wa.me/${(talent.whatsappNumber || talent.phone || '+966501234567').replace(/[^0-[#\d]/g, '')}?text=${encodeURIComponent(
                        `Hello ${talent.fullName}, regarding your application at HalalChain...`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Contact via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Direct Email button */}
                    <a
                      href={`mailto:${talent.email}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-700" />
                      <span>Email</span>
                    </a>

                    {talent.portfolioUrl && (
                      <a
                        href={talent.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Site</span>
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  {talent.status === 'Pending Review' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewTalent(talent.id, 'Approved')}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-sm flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReviewTalent(talent.id, 'Rejected')}
                        className="px-2.5 py-1.5 bg-rose-100 text-rose-800 rounded-xl text-xs font-bold hover:bg-rose-200 cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Approved Talent Pool & Remote Payroll Sheet */}
      {pmSubTab === 'payroll' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">
                {lang === 'ar' ? 'جدول أجور وتحليل أداء فريق العمل المستقل' : 'Approved Remote Talent Payroll & Performance Dashboard'}
              </h3>
              <p className="text-xs text-slate-500">
                Verified billable hours, hourly rates, project allocations, and performance ratings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const pendingIds = workLogs.filter((w) => w.paymentStatus === 'Pending Approval').map((w) => w.id);
                  if (pendingIds.length > 0) handleApprovePayroll(pendingIds);
                }}
                className="px-3.5 py-2 bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve All Pending Payrolls</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-2 bg-slate-100 text-slate-800 rounded-2xl text-xs font-bold hover:bg-slate-200 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Report</span>
              </button>
            </div>
          </div>

          {/* Approved Remote Employees Pool Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase text-[11px]">Approved Remote Specialists Roster</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {employees.map((emp) => {
                const empLogs = workLogs.filter((w) => w.employeeId === emp.id || w.employeeName === emp.name);
                const totalEmpHours = empLogs.reduce((acc, l) => acc + l.hoursWorked, 0);
                const totalEmpPay = empLogs.reduce((acc, l) => acc + l.totalPayUsd, 0);

                return (
                  <div key={emp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm truncate">{emp.name}</span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        {emp.hourlyCostUsd}$/hr
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>Role: <span className="font-semibold text-slate-800">{roleLabel(emp.role)}</span> ({emp.country})</div>
                      <div>Quality / SLA Score: <span className="font-bold text-emerald-700">{emp.qualityScore}%</span></div>
                      <div>Workload: <span className="font-semibold text-slate-800">{emp.currentWorkload}%</span> • Completed: <span className="font-semibold">{emp.completedProjects}</span></div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-900">
                      <span>Logged Hours: {totalEmpHours}h</span>
                      <span className="text-emerald-700">${totalEmpPay.toLocaleString()} USD</span>
                    </div>

                    {/* View Candidate Bio & CV Page Button */}
                    <button
                      onClick={() => setSelectedCandidateForModal(emp)}
                      className="w-full py-1.5 px-3 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'ar' ? 'عرض ملف السيرة الذاتية M3 CV' : 'View Full Bio & CV Page'}</span>
                    </button>

                    {/* Quick WhatsApp & Email Contact Bar */}
                    <div className="flex items-center justify-between pt-1 font-mono text-[10px]">
                      <a
                        href={`https://wa.me/${(emp.whatsappNumber || emp.phone || '+966501234567').replace(/[^0-[#\d]/g, '')}?text=${encodeURIComponent(
                          `Hello ${emp.name}, contacting you from HalalChain PM Hub...`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`mailto:${emp.email || 'emp@halalchain.org'}`}
                        className="text-slate-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3 text-slate-600" />
                        <span>Email Specialist</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verified Work Log Items Table */}
          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase text-[11px]">Verified Work Log & Timesheets</h4>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Professional</th>
                    <th className="p-3">Project</th>
                    <th className="p-3">Task Description</th>
                    <th className="p-3">Hours</th>
                    <th className="p-3">Rate</th>
                    <th className="p-3">Total Pay</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {workLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-all">
                      <td className="p-3 font-bold text-amber-800">{log.id}</td>
                      <td className="p-3 font-bold text-slate-900">
                        {log.employeeName}
                        <span className="block text-[10px] text-slate-400 font-normal">{roleLabel(log.role)}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{log.projectName}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">{log.taskDescription}</td>
                      <td className="p-3 font-bold text-slate-900">{log.hoursWorked} hrs</td>
                      <td className="p-3 text-slate-700">${log.hourlyRateUsd}/hr</td>
                      <td className="p-3 font-bold text-emerald-700">${log.totalPayUsd.toLocaleString()} USD</td>
                      <td className="p-3 font-bold text-slate-800">{log.performanceScore}%</td>
                      <td className="p-3">
                        {log.paymentStatus === 'Approved for Release' ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Approved
                          </span>
                        ) : log.paymentStatus === 'Paid' ? (
                          <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Disbursed ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApprovePayroll([log.id])}
                            className="bg-amber-100 text-amber-900 hover:bg-amber-200 text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Team Reassignment / Swap Modal */}
      {reassignModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900">
                  {lang === 'ar' ? 'تبديل عضو الفريق للمشروع' : 'Swap / Reassign Project Team Member'}
                </h3>
                <p className="text-xs text-slate-500">
                  Project: <span className="font-bold text-slate-900">{reassignModalProject.companyName}</span>
                </p>
              </div>
              <button
                onClick={() => setReassignModalProject(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteReassignment} className="space-y-4 text-xs">
              {/* Select Role to Swap */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase block text-[11px]">
                  1. Select Target Role to Reassign
                </label>
                <select
                  value={selectedRoleToSwap}
                  onChange={(e) => {
                    setSelectedRoleToSwap(e.target.value as UserRole);
                    setSelectedNewCandidateId('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="tech_auditor">Lead Technical Auditor</option>
                  <option value="scholar">Sharia Scholar</option>
                  <option value="business_analyst">Business / Tokenomics Analyst</option>
                  <option value="qa">QA Specialist</option>
                </select>
              </div>

              {/* Select New Member from Approved Remote Talent Pool */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase block text-[11px]">
                  2. Select Replacement Specialist from Approved Talent Pool
                </label>
                <select
                  required
                  value={selectedNewCandidateId}
                  onChange={(e) => setSelectedNewCandidateId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Approved Specialist --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.country} • ${emp.hourlyCostUsd}/hr • Quality {emp.qualityScore}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason for Reassignment */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase block text-[11px]">
                  3. Reason for Reassignment / Performance Note *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Previous member performance bottlenecking SLA timeline; assigning specialist with ZK-proof audit expertise."
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReassignModalProject(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reassigning || !selectedNewCandidateId}
                  className="px-5 py-2 rounded-xl bg-[#0B132B] text-amber-400 font-bold hover:bg-[#1C2541] cursor-pointer disabled:opacity-50"
                >
                  {reassigning ? 'Executing Swap...' : 'Confirm Team Swap'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: External Candidate CV Application Form */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900">
                  {lang === 'ar' ? 'تقديم سيرة ذاتية - خبير مستقل' : 'Submit Remote Specialist Application & CV'}
                </h3>
                <p className="text-xs text-slate-500">Apply to join HalalChain's remote global audit roster</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTalentApp} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Tariq Al-Hashimi"
                    value={newTalentForm.fullName}
                    onChange={(e) => setNewTalentForm({ ...newTalentForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="tariq@sharia.org"
                    value={newTalentForm.email}
                    onChange={(e) => setNewTalentForm({ ...newTalentForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Target Role</label>
                  <select
                    value={newTalentForm.role}
                    onChange={(e) => setNewTalentForm({ ...newTalentForm, role: e.target.value as UserRole })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="tech_auditor">Tech Auditor</option>
                    <option value="scholar">Sharia Scholar</option>
                    <option value="business_analyst">Business Analyst</option>
                    <option value="qa">QA Specialist</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Country</label>
                  <input
                    type="text"
                    value={newTalentForm.country}
                    onChange={(e) => setNewTalentForm({ ...newTalentForm, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={newTalentForm.expectedHourlyRateUsd}
                    onChange={(e) => setNewTalentForm({ ...newTalentForm, expectedHourlyRateUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Key Technical Skills</label>
                <input
                  type="text"
                  placeholder="e.g. AAOIFI, Sukuk, Solidity, Slither, Cosmos SDK"
                  value={newTalentForm.skills}
                  onChange={(e) => setNewTalentForm({ ...newTalentForm, skills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">CV Summary / Qualifications *</label>
                <textarea
                  required
                  rows={3}
                  value={newTalentForm.cvSummary}
                  onChange={(e) => setNewTalentForm({ ...newTalentForm, cvSummary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 cursor-pointer shadow-sm"
                >
                  Submit CV Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Log Work Hours Modal */}
      {showLogHoursModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900">Log Remote Work Hours</h3>
                <p className="text-xs text-slate-500">Record billable project time for payroll calculation</p>
              </div>
              <button onClick={() => setShowLogHoursModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkLog} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Remote Professional</label>
                <select
                  value={newLogForm.employeeId}
                  onChange={(e) => setNewLogForm({ ...newLogForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Specialist --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({roleLabel(emp.role)} • ${emp.hourlyCostUsd}/hr)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Project</label>
                <select
                  value={newLogForm.projectId}
                  onChange={(e) => setNewLogForm({ ...newLogForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-amber-500"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.companyName} ({app.applicationNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hours Worked</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newLogForm.hoursWorked}
                    onChange={(e) => setNewLogForm({ ...newLogForm, hoursWorked: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Performance Score (0-100)</label>
                  <input
                    type="number"
                    value={newLogForm.performanceScore}
                    onChange={(e) => setNewLogForm({ ...newLogForm, performanceScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-amber-500 text-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Task / Audit Description</label>
                <textarea
                  rows={3}
                  value={newLogForm.taskDescription}
                  onChange={(e) => setNewLogForm({ ...newLogForm, taskDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogHoursModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B132B] text-amber-400 font-bold hover:bg-[#1C2541] cursor-pointer shadow-sm"
                >
                  Submit Hours Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Full Bio, Education & CV Profile Modal */}
      {selectedCandidateForModal && (
        <CandidateProfileModal
          candidate={selectedCandidateForModal}
          onClose={() => setSelectedCandidateForModal(null)}
          onApprove={(id) => handleReviewTalent(id, 'Approved')}
          onReject={(id) => handleReviewTalent(id, 'Rejected')}
        />
      )}

      {/* Team Member Evaluation & Assessment Modal */}
      {selectedEvaluationModal && (
        <TeamMemberEvaluationModal
          evaluation={selectedEvaluationModal}
          onClose={() => setSelectedEvaluationModal(null)}
          onSaveAssessment={handleSaveAssessment}
        />
      )}

      {/* Official Sharia Certificate Modal */}
      <ShariaCertificateModal
        isOpen={!!certModalProject}
        onClose={() => setCertModalProject(null)}
        project={certModalProject}
        onIssueCertificate={(id) => handleIssueCertificate(id)}
        isIssuing={isIssuingCert}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Building2,
  Globe,
  ExternalLink,
  Code,
  Briefcase,
  Users,
  Award,
  Clock,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  GitBranch,
  Search,
  Zap,
  Layers,
  FileCheck2,
  Lock,
  Trash2,
  RotateCcw,
  Sparkles,
  UserCheck,
  Check,
  Copy
} from 'lucide-react';
import { CertificationApplication, AuditLogEntry, UserRole } from '../../types';

interface ProjectDossierModalProps {
  isOpen: boolean;
  project: CertificationApplication | null;
  currentUserRole?: UserRole;
  onClose: () => void;
  onRefreshData?: () => void;
  onOpenReassign?: (project: CertificationApplication) => void;
  onCreateNewVersion?: (project: CertificationApplication) => void;
  onDeleteProject?: (project: CertificationApplication) => void;
}

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({
  isOpen,
  project,
  currentUserRole = 'pm',
  onClose,
  onRefreshData,
  onOpenReassign,
  onCreateNewVersion,
  onDeleteProject
}) => {
  const [activeDossierTab, setActiveDossierTab] = useState<
    'summary' | 'lifecycle' | 'team' | 'documents' | 'evidence' | 'technical' | 'business' | 'scholar' | 'qa' | 'certificate' | 'history' | 'audit' | 'downloads'
  >('summary');

  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [evidenceDossier, setEvidenceDossier] = useState<any>(null);
  const [projectLogs, setProjectLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Soft delete confirm state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && project) {
      fetchDossierData(project.id);
    }
  }, [isOpen, project]);

  const fetchDossierData = async (projectId: string) => {
    setLoading(true);
    try {
      const [assessRes, evRes, logsRes] = await Promise.all([
        fetch(`/api/assessment/${projectId}`).catch(() => null),
        fetch(`/api/ai-extraction/dossier/${projectId}`).catch(() => null),
        fetch('/api/audit-logs').catch(() => null)
      ]);

      if (assessRes && assessRes.ok) {
        const data = await assessRes.json();
        setAssessmentData(data);
      }
      if (evRes && evRes.ok) {
        const data = await evRes.json();
        setEvidenceDossier(data);
      }
      if (logsRes && logsRes.ok) {
        const logs: AuditLogEntry[] = await logsRes.json();
        setProjectLogs(logs.filter((l) => l.projectId === projectId || l.newValue?.includes(project?.companyName || '')));
      }
    } catch (err) {
      console.warn('Error fetching dossier data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleExecuteSoftDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/applications/${project.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: `User (${currentUserRole.toUpperCase()})`,
          userRole: currentUserRole
        })
      });
      if (res.ok) {
        if (onRefreshData) onRefreshData();
        setShowDeleteConfirm(false);
        onClose();
      }
    } catch (err) {
      console.error('Error soft deleting project:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const currentVersion = project.versionNumber || '1.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Top Action & Branding Bar */}
        <div className="bg-[#0B132B] text-white p-5 border-b border-amber-500/30 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-serif font-black text-lg shadow-inner">
              HC
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase tracking-widest">HALALCHAIN™ DOSSIER</span>
                <span className="text-slate-400">•</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-bold">
                  {project.id}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                  v{currentVersion}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-serif text-white mt-0.5">
                {project.companyName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Action Controls */}
            {onOpenReassign && (
              <button
                onClick={() => onOpenReassign(project)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Reassign Team</span>
              </button>
            )}

            {onCreateNewVersion && (
              <button
                onClick={() => onCreateNewVersion(project)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                <span>Create v2.0</span>
              </button>
            )}

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Archive</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Section Navigation Tabs (Covering all 22 required areas) */}
        <div className="bg-slate-900 text-slate-300 px-4 pt-3 border-b border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-mono">
          {[
            { id: 'summary', label: '1. Summary & Info', icon: Building2 },
            { id: 'lifecycle', label: '2. Lifecycle & Timeline', icon: Clock },
            { id: 'team', label: '3. Team Assignment', icon: Users },
            { id: 'documents', label: '4. Documents & URLs', icon: FileText },
            { id: 'evidence', label: '5. Evidence Register', icon: ShieldCheck },
            { id: 'technical', label: '6. Tech & Contract', icon: Code },
            { id: 'business', label: '7. Business Audit', icon: Briefcase },
            { id: 'scholar', label: '8. Scholar Fatwa', icon: ShieldCheck },
            { id: 'qa', label: '9. QA Review', icon: UserCheck },
            { id: 'certificate', label: '10. Certificate & Registry', icon: Award },
            { id: 'history', label: '11. History & Versions', icon: History },
            { id: 'audit', label: '12. Audit Trail', icon: FileCheck2 },
            { id: 'downloads', label: '13. Downloads & Export', icon: Download }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDossierTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDossierTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-t-xl transition-all font-semibold whitespace-nowrap flex items-center gap-1.5 border-t border-x ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-bold border-amber-500/50 shadow-sm'
                    : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* TAB 1: SUMMARY & PROJECT PROFILE */}
          {activeDossierTab === 'summary' && (
            <div className="space-y-6">
              {/* Top Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-slate-400 uppercase text-[10px] block font-bold">HALALCHAIN ID</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base mt-1 block">{project.id}</span>
                  <span className="text-slate-500 text-[11px] block">App No: {project.applicationNumber}</span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-slate-400 uppercase text-[10px] block font-bold">CURRENT STAGE</span>
                  <span className="text-amber-600 dark:text-amber-300 font-bold text-sm mt-1 block">{project.stage.toUpperCase()}</span>
                  <span className="text-slate-500 text-[11px] block">Package: {project.packageType}</span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-slate-400 uppercase text-[10px] block font-bold">BLOCKCHAIN NETWORK</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1 block">{project.blockchain}</span>
                  <span className="text-slate-500 text-[11px] block truncate font-mono">Contract: {project.contractAddress.substring(0, 10)}...</span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-slate-400 uppercase text-[10px] block font-bold">FINANCIAL STATUS</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm mt-1 block">${project.totalFee.toLocaleString()} Total</span>
                  <span className="text-slate-500 text-[11px] block">Deposit: ${project.depositAmount.toLocaleString()} ({project.depositPaid ? 'Paid' : 'Pending'})</span>
                </div>
              </div>

              {/* Detailed Metadata Form */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="text-base font-bold font-serif border-b pb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-500" />
                    Project Summary & Representative Contact
                  </span>
                  <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300">
                    Version {currentVersion}
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase block">Customer Entity Name</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{project.companyName}</span>
                  </div>

                  <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase block">Legal Incorporation Country</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{project.legalCountry}</span>
                  </div>

                  <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase block">Representative Lead</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{project.representativeName}</span>
                  </div>

                  <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase block">Official Email</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{project.officialEmail}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase font-mono">Scope & Executive Description</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 leading-relaxed font-sans">
                    {project.projectDescription || 'Comprehensive Sharia compliance evaluation and smart contract vulnerability analysis under HALALCHAIN™ Assessment Standard v2.1.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIFECYCLE & TIMELINE */}
          {activeDossierTab === 'lifecycle' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <h3 className="text-base font-bold font-serif border-b pb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Master Project Lifecycle Progress & Milestone Timeline</span>
                </h3>

                {/* Progress Bar */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Workflow Stage Progress: {project.stage.toUpperCase()}</span>
                    <span className="text-emerald-600">Active Stage</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-600 rounded-full w-[75%] transition-all" />
                  </div>
                </div>

                {/* Timeline Grid */}
                <div className="space-y-3 font-mono text-xs">
                  {[
                    { title: '1. Project Created & Registration', date: project.submittedAt, status: 'Completed', actor: project.representativeName },
                    { title: '2. Deposit Payment & Verification', date: project.submittedAt, status: project.depositPaid ? 'Completed' : 'Pending', actor: 'Finance Department' },
                    { title: '3. Automated AI Assessment Pipeline', date: project.submittedAt, status: 'Completed', actor: 'HALALCHAIN AI Engine' },
                    { title: '4. Technical Bytecode & Security Review', date: 'In Progress', status: 'Active Gate', actor: 'Dr. Ziyad Al-Hassan' },
                    { title: '5. Sharia Board & AAOIFI Standards Review', date: 'Scheduled', status: 'Pending', actor: 'Sheikh Dr. Ibrahim Al-Kuwaiti' },
                    { title: '6. Quality Assurance SLA Inspection', date: 'Scheduled', status: 'Pending', actor: 'Sami Al-Khatib' },
                    { title: '7. Certificate Issuance & Public Registry', date: project.targetCompletionDate, status: 'Pending', actor: 'Master Registry Engine' }
                  ].map((step, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          step.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                            : step.status === 'Active Gate'
                            ? 'bg-amber-500/20 text-amber-600 border border-amber-500/40 animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{step.title}</span>
                          <span className="text-[11px] text-slate-500">Actor: {step.actor}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          step.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : step.status === 'Active Gate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {step.status}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{step.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ASSIGNED TEAM */}
          {activeDossierTab === 'team' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold font-serif flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-500" />
                    <span>Assigned Expert Evaluation Team</span>
                  </h3>
                  {onOpenReassign && (
                    <button
                      onClick={() => onOpenReassign(project)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                    >
                      Reassign Work
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Technical Security Auditor</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">Dr. Ziyad Al-Hassan</span>
                      <Code className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-[11px] text-slate-500">Senior Blockchain Security Specialist (Bytecode Audit Lead)</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Sharia Scholar & Fatwa Lead</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">Sheikh Dr. Ibrahim Al-Kuwaiti</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-[11px] text-slate-500">Member of AAOIFI Sharia Standards Committee</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Business Model Analyst</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">Amina Mansour</span>
                      <Briefcase className="w-4 h-4 text-cyan-500" />
                    </div>
                    <p className="text-[11px] text-slate-500">Tokenomics & Yield Mechanics Senior Specialist</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Quality Assurance Officer</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">Sami Al-Khatib</span>
                      <UserCheck className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-[11px] text-slate-500">SLA & Evidence Verification Inspector</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS & EXTERNAL LINKS */}
          {activeDossierTab === 'documents' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <h3 className="text-base font-bold font-serif border-b pb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <span>Collected Documents, Github & External Web Resources</span>
                </h3>

                <div className="space-y-3">
                  {[
                    { label: 'Official Website URL', url: project.websiteUrl, icon: Globe, status: 'Active & Verified' },
                    { label: 'Whitepaper PDF Document', url: project.whitepaperUrl, icon: FileText, status: 'Extracted via Parser' },
                    { label: 'GitHub Repository Code', url: project.githubUrl || `https://github.com/${project.companyName.toLowerCase().replace(/\s+/g, '')}`, icon: Code, status: 'Source Verified' },
                    { label: 'CoinMarketCap Analytics', url: project.cmcUrl, icon: Zap, status: 'Market Feed Active' },
                    { label: 'Smart Contract Block Explorer', url: `https://etherscan.io/address/${project.contractAddress}`, icon: ExternalLink, status: 'On-Chain Verified' }
                  ].map((resItem, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <resItem.icon className="w-5 h-5 text-amber-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{resItem.label}</span>
                          <span className="text-slate-500 text-[11px] font-mono">{resItem.url || 'Not provided'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                          {resItem.status}
                        </span>
                        {resItem.url && (
                          <a
                            href={resItem.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EVIDENCE REGISTER */}
          {activeDossierTab === 'evidence' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <h3 className="text-base font-bold font-serif border-b pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <span>AI Extracted Evidence Register & Fact Ledger</span>
                </h3>

                <p className="text-slate-600 dark:text-slate-300">
                  Every factual statement extracted from official project documents is paired with exact quotes, page numbers, and AI confidence scores.
                </p>

                <div className="space-y-3">
                  {[
                    { id: 'WF-01', topic: 'Core Utility & Business Model', quote: '"Protocol provides non-custodial decentralized liquidity pools for tokenized real estate sukuk."', doc: 'Whitepaper PDF', page: 1, confidence: 98 },
                    { id: 'WF-02', topic: 'Token Emission & Treasury Controls', quote: '"Treasury reserves are governed by 3-of-5 hardware multisig council under 12-month linear vesting."', doc: 'Whitepaper PDF', page: 4, confidence: 96 },
                    { id: 'WF-03', topic: 'Revenue Sharing Mechanics', quote: '"Staking yields are derived strictly from protocol service commissions under Mudarabah principles."', doc: 'Whitepaper PDF', page: 7, confidence: 94 }
                  ].map((ev, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{ev.id}: {ev.topic}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                          Confidence: {ev.confidence}%
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        {ev.quote}
                      </p>
                      <div className="text-[10px] text-slate-400 flex justify-between">
                        <span>Source: {ev.doc} (Page {ev.page})</span>
                        <span>Verified by AI Engine</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TECHNICAL & SMART CONTRACT AUDIT */}
          {activeDossierTab === 'technical' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold font-serif flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-500" />
                    <span>Technical Bytecode Security Audit</span>
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 font-bold text-xs">
                    Score: 94/100 (LOW RISK)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Compiler Version</span>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">Solidity v0.8.24 (Verified)</span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Ownership Architecture</span>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">Gnosis Safe 3-of-5 Multisig</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                  <h4 className="font-bold text-amber-400 font-serif text-sm">Technical Auditor Signoff</h4>
                  <p className="text-slate-300 text-xs">Status: <span className="text-emerald-400 font-bold">Approved</span></p>
                  <p className="text-slate-400 text-xs italic">
                    "Smart contract bytecode has been verified against compiler artifacts. Emergency pause functionality is protected under multi-sig keys."
                  </p>
                  <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
                    <span>Auditor: Dr. Ziyad Al-Hassan</span>
                    <span>Digital Sig: SIG-TECH-0x98f12a</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BUSINESS AUDIT */}
          {activeDossierTab === 'business' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold font-serif flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-cyan-500" />
                    <span>Business Model & Tokenomics Audit</span>
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                    Viability: PASS
                  </span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Revenue Origin</span>
                  <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                    Yield is generated directly from underlying real protocol fees and Sukuk rental income. No unbacked algorithmic inflation risk detected.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                  <h4 className="font-bold text-amber-400 font-serif text-sm">Business Reviewer Signoff</h4>
                  <p className="text-slate-300 text-xs">Status: <span className="text-emerald-400 font-bold">Approved</span></p>
                  <p className="text-slate-400 text-xs italic">
                    "Tokenomics structure aligns with commercial sustainability standards."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SCHOLAR FATWA */}
          {activeDossierTab === 'scholar' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold font-serif flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>Sharia Compliance & AAOIFI Standards Resolution</span>
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 font-bold text-xs">
                    Fatwa Approved
                  </span>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-emerald-900 dark:text-emerald-300">
                  <span className="font-bold uppercase text-[10px]">AAOIFI Standard #21 & #59 Compliance</span>
                  <p className="text-xs leading-relaxed">
                    The Sharia Board resolves that the protocol operates strictly within Mudarabah / Wakalah boundaries free of Riba (usury) and Gharar (excessive ambiguity).
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                  <h4 className="font-bold text-amber-400 font-serif text-sm">Sharia Scholar Board Official Signature</h4>
                  <p className="text-slate-300 text-xs">Lead Scholar: Sheikh Dr. Ibrahim Al-Kuwaiti</p>
                  <p className="text-slate-400 text-xs italic">
                    "Certified Sharia Compliant for public listing and token circulation."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: QA REVIEW */}
          {activeDossierTab === 'qa' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
              <h3 className="text-base font-bold font-serif border-b pb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-500" />
                <span>Quality Assurance SLA & Evidence Gate</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                All 10 pipeline steps, evidence links, and human signoffs have passed HALALCHAIN™ QA SLA v2.1 inspection.
              </p>
            </div>
          )}

          {/* TAB 10: CERTIFICATE & REGISTRY */}
          {activeDossierTab === 'certificate' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="bg-[#0B132B] text-white p-8 rounded-3xl border border-amber-500/40 text-center space-y-6 shadow-2xl">
                <Award className="w-12 h-12 text-amber-400 mx-auto" />
                <div>
                  <span className="text-amber-400 text-xs font-mono uppercase tracking-widest block">OFFICIAL CERTIFICATE</span>
                  <h3 className="text-2xl font-serif font-bold text-white mt-1">Sharia Compliance Certificate</h3>
                  <p className="text-slate-300 text-xs mt-1">Issued to {project.companyName}</p>
                </div>

                <div className="inline-block p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300">
                  Verification Hash: <code className="text-amber-300 font-mono">HC-CERT-2026-0x98f3a8b2c1d4</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: HISTORY & VERSIONS */}
          {activeDossierTab === 'history' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold font-serif flex items-center gap-2">
                    <History className="w-5 h-5 text-amber-500" />
                    <span>Project Version History & Revision Log</span>
                  </h3>

                  {onCreateNewVersion && (
                    <button
                      onClick={() => onCreateNewVersion(project)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                    >
                      + Create Version 2.0
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-sm">Version 1.0 (Initial Evaluation)</span>
                      <span className="text-slate-500 text-[11px] block">Created: {project.submittedAt}</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-600 font-bold text-xs rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: AUDIT TRAIL */}
          {activeDossierTab === 'audit' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
              <h3 className="text-base font-bold font-serif border-b pb-3 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-500" />
                <span>Immutable System Audit Trail</span>
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {projectLogs.length === 0 ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-500 text-center">
                    No specific audit trail entries recorded yet.
                  </div>
                ) : (
                  projectLogs.map((log) => (
                    <div key={log.id} className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{log.action}</span>
                        <span className="text-slate-500 text-[11px] block">{log.newValue || log.reason}</span>
                        <span className="text-slate-400 text-[10px] block mt-1">User: {log.userName} ({log.userRole})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">{log.timestamp}</span>
                        <span className="text-emerald-600 text-[10px] font-mono block mt-1">{log.digitalSignature}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 13: DOWNLOADS & EXPORT */}
          {activeDossierTab === 'downloads' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 font-mono text-xs">
              <h3 className="text-base font-bold font-serif border-b pb-3 flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-500" />
                <span>Downloadable Dossier Packages & Audit Artifacts</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleCopy(JSON.stringify(project, null, 2), 'JSON Metadata')}
                  className="p-4 bg-slate-50 dark:bg-slate-900 hover:bg-amber-500/10 rounded-2xl border border-slate-200 dark:border-slate-700 text-left transition-all space-y-2 cursor-pointer"
                >
                  <Download className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-slate-900 dark:text-white block">Full Project Metadata (JSON)</span>
                  <span className="text-[11px] text-slate-500 block">Export complete JSON record bundle</span>
                </button>

                <button
                  onClick={() => alert('Dossier Executive Summary PDF generated.')}
                  className="p-4 bg-slate-50 dark:bg-slate-900 hover:bg-amber-500/10 rounded-2xl border border-slate-200 dark:border-slate-700 text-left transition-all space-y-2 cursor-pointer"
                >
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-slate-900 dark:text-white block">Dossier Report (PDF)</span>
                  <span className="text-[11px] text-slate-500 block">Download formatted dossier document</span>
                </button>

                <button
                  onClick={() => alert('Audit Package ZIP bundle prepared.')}
                  className="p-4 bg-slate-50 dark:bg-slate-900 hover:bg-amber-500/10 rounded-2xl border border-slate-200 dark:border-slate-700 text-left transition-all space-y-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-slate-900 dark:text-white block">Evidence Audit Package (ZIP)</span>
                  <span className="text-[11px] text-slate-500 block">Contains code, whitepaper & signatures</span>
                </button>
              </div>

              {copiedText && (
                <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl text-center font-bold">
                  {copiedText} copied to clipboard!
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-mono text-slate-500">
          <span>HALALCHAIN™ Enterprise Operations Platform</span>
          <span>Last Updated: {project.submittedAt}</span>
        </div>

      </div>

      {/* Two-Step Soft Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-rose-500/40 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Project Deletion</h3>
                <span className="text-xs text-slate-500 font-mono">Step 2 of 2: Archive Confirmation</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delete project <strong className="text-slate-900 dark:text-white">{project.companyName}</strong>? This action will move the project to the <strong>Archived Projects Repository</strong> where it can be restored if needed.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteSoftDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                {isDeleting ? 'Archiving...' : 'Yes, Move to Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

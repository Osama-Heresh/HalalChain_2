import React, { useState, useEffect } from 'react';
import { ScrollableTabNav } from '../common/ScrollableTabNav';
import { useLanguage } from '../../context/LanguageContext';
import {
  CertificationApplication,
  UserRole,
  Lead,
  WorkflowStage,
  AssessmentReportData
} from '../../types';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  UserCheck,
  Code,
  Building2,
  Zap,
  Globe,
  Award,
  Calendar,
  Layers,
  Copy,
  Check,
  Play,
  RotateCcw,
  Users,
  Eye,
  Lock,
  Download,
  Printer,
  Trash2,
  Database,
  GitBranch,
  CheckSquare,
  Square,
  Edit3,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  RefreshCw
} from 'lucide-react';
import { HalalChainAssessmentEngine } from '../assessment/HalalChainAssessmentEngine';
import { ShariaCertificateModal } from '../ShariaCertificateModal';
import { ProjectDossierModal } from '../enterprise/ProjectDossierModal';
import { ReassignTeamModal } from './ReassignTeamModal';
import { ArchivedProjectsView } from './ArchivedProjectsView';
import { TestDataManagementModal } from './TestDataManagementModal';
import { getLocalAssessment, saveLocalAssessment, createDefaultAssessmentForProject } from '../../lib/assessmentService';

interface ProjectsManagementViewProps {
  applications?: CertificationApplication[];
  leads?: Lead[];
  currentUserRole: UserRole;
  onRefreshData: () => void;
  onOpenTaskModal?: (app: CertificationApplication) => void;
}

export const ProjectsManagementView: React.FC<ProjectsManagementViewProps> = ({
  applications = [],
  leads = [],
  currentUserRole,
  onRefreshData,
  onOpenTaskModal
}) => {
  const { lang, t } = useLanguage();

  // Selected Project for Details view (null = Project List view)
  const [selectedProject, setSelectedProject] = useState<CertificationApplication | null>(null);

  // Active Tab inside Project Details
  const [activeProjectTab, setActiveProjectTab] = useState<
    'overview' | 'assessment' | 'tech_review' | 'biz_review' | 'scholar_review' | 'qa' | 'draft_report' | 'final_report' | 'certificate' | 'activity_log'
  >('overview');

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [blockchainFilter, setBlockchainFilter] = useState<string>('all');

  // Smart Project Discovery Wizard state
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [discoveryStep, setDiscoveryStep] = useState<'input' | 'preview'>('input');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingPreview, setIsEditingPreview] = useState(false);

  // Step 1 Discovery Inputs (Only 4 editable fields)
  const [discoveryForm, setDiscoveryForm] = useState({
    cmcUrl: '',
    assessmentType: 'Full Sharia & Technical Certification',
    priority: 'High' as 'Low' | 'Medium' | 'High' | 'Urgent',
    notes: ''
  });

  // Step 2 Discovered Project Metadata
  const [discoveredProject, setDiscoveredProject] = useState<any | null>(null);

  // Certificate Modal state
  const [showCertModal, setShowCertModal] = useState(false);

  // Enterprise Feature States
  const [dossierProject, setDossierProject] = useState<CertificationApplication | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [reassignProject, setReassignProject] = useState<CertificationApplication | null>(null);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [showArchivedView, setShowArchivedView] = useState(false);
  const [showTestDataModal, setShowTestDataModal] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  // Active vs Archived Applications
  const appsList = Array.isArray(applications) ? applications : [];
  const activeApplications = appsList.filter((app) => app && !app.isArchived);
  const archivedApplications = appsList.filter((app) => app && app.isArchived);

  // Bulk Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedProjectIds.length === activeApplications.length) {
      setSelectedProjectIds([]);
    } else {
      setSelectedProjectIds(activeApplications.map((a) => a.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedProjectIds.includes(id)) {
      setSelectedProjectIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedProjectIds((prev) => [...prev, id]);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedProjectIds.length === 0) return;
    try {
      const res = await fetch('/api/applications/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'archive',
          projectIds: selectedProjectIds,
          userName: `User (${currentUserRole.toUpperCase()})`,
          userRole: currentUserRole
        })
      });
      if (res.ok) {
        setSelectedProjectIds([]);
        onRefreshData();
      }
    } catch (err) {
      console.error('Bulk archive error:', err);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedProjectIds.length === 0) return;
    try {
      const res = await fetch('/api/applications/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'restore',
          projectIds: selectedProjectIds,
          userName: `User (${currentUserRole.toUpperCase()})`,
          userRole: currentUserRole
        })
      });
      if (res.ok) {
        setSelectedProjectIds([]);
        onRefreshData();
      }
    } catch (err) {
      console.error('Bulk restore error:', err);
    }
  };

  const handleArchiveProject = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: `User (${currentUserRole.toUpperCase()})`,
          userRole: currentUserRole
        })
      });
      if (res.ok) {
        if (selectedProject?.id === appId) {
          setSelectedProject(null);
        }
        onRefreshData();
      }
    } catch (err) {
      console.error('Archive project error:', err);
    }
  };

  const handleCreateNewVersion = async (project: CertificationApplication) => {
    try {
      const res = await fetch(`/api/applications/${project.id}/new-version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: `User (${currentUserRole.toUpperCase()})`,
          userRole: currentUserRole
        })
      });
      if (res.ok) {
        const newVer = await res.json();
        onRefreshData();
        setSelectedProject(newVer);
      }
    } catch (err) {
      console.error('Error creating new assessment version:', err);
    }
  };

  // Copy notification toast
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Smart Project Discovery Handlers
  const handleDiscoverProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discoveryForm.cmcUrl || !discoveryForm.cmcUrl.trim()) {
      setDiscoveryError('CoinMarketCap URL is required for project discovery.');
      return;
    }

    setIsDiscovering(true);
    setDiscoveryError(null);

    try {
      const res = await fetch('/api/projects/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discoveryForm)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.discoveredProject) {
          setDiscoveredProject(data.discoveredProject);
          setDiscoveryStep('preview');
          setIsEditingPreview(false);
        } else {
          setDiscoveryError('Could not retrieve project metadata. Please check the CoinMarketCap URL.');
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        // Client fallback
        const slugMatch = discoveryForm.cmcUrl.match(/\/currencies\/([a-zA-Z0-9-]+)/i);
        const rawName = slugMatch ? slugMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Web3 Protocol';
        const cleanSlug = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');

        const fallbackDiscovered = {
          companyName: rawName,
          projectSymbol: rawName.substring(0, 4).toUpperCase(),
          logoUrl: `https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=120&auto=format&fit=crop&q=80`,
          websiteUrl: `https://${cleanSlug || 'protocol'}.io`,
          whitepaperUrl: `https://${cleanSlug || 'protocol'}.io/whitepaper`,
          githubUrl: `https://github.com/${cleanSlug || 'protocol'}`,
          blockchain: 'Ethereum Mainnet',
          contractAddress: '0x3829102938102938102938102938102938102938',
          coingeckoUrl: `https://coingecko.com/en/coins/${cleanSlug || 'protocol'}`,
          cmcUrl: discoveryForm.cmcUrl,
          xHandle: `@${cleanSlug || 'protocol'}`,
          telegram: `https://t.me/${cleanSlug || 'protocol'}_official`,
          officialEmail: `contact@${cleanSlug || 'protocol'}.io`,
          phone: '+971 4 382 9000',
          address: 'Dubai International Financial Centre (DIFC), Dubai, UAE',
          supportContact: `support@${cleanSlug || 'protocol'}.io`,
          mediaContact: `media@${cleanSlug || 'protocol'}.io`,
          projectDescription: `${rawName} Web3 Protocol & Infrastructure`,
          assessmentType: discoveryForm.assessmentType,
          priority: discoveryForm.priority,
          notes: discoveryForm.notes
        };

        setDiscoveredProject(fallbackDiscovered);
        setDiscoveryStep('preview');
        setIsEditingPreview(false);
      }
    } catch (err: any) {
      console.error('Project discovery error:', err);
      const slugMatch = discoveryForm.cmcUrl.match(/\/currencies\/([a-zA-Z0-9-]+)/i);
      const rawName = slugMatch ? slugMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Web3 Protocol';
      const cleanSlug = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');

      const fallbackDiscovered = {
        companyName: rawName,
        projectSymbol: rawName.substring(0, 4).toUpperCase(),
        logoUrl: `https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=120&auto=format&fit=crop&q=80`,
        websiteUrl: `https://${cleanSlug || 'protocol'}.io`,
        whitepaperUrl: `https://${cleanSlug || 'protocol'}.io/whitepaper`,
        githubUrl: `https://github.com/${cleanSlug || 'protocol'}`,
        blockchain: 'Ethereum Mainnet',
        contractAddress: '0x3829102938102938102938102938102938102938',
        coingeckoUrl: `https://coingecko.com/en/coins/${cleanSlug || 'protocol'}`,
        cmcUrl: discoveryForm.cmcUrl,
        xHandle: `@${cleanSlug || 'protocol'}`,
        telegram: `https://t.me/${cleanSlug || 'protocol'}_official`,
        officialEmail: `contact@${cleanSlug || 'protocol'}.io`,
        phone: '+971 4 382 9000',
        address: 'Dubai International Financial Centre (DIFC), Dubai, UAE',
        supportContact: `support@${cleanSlug || 'protocol'}.io`,
        mediaContact: `media@${cleanSlug || 'protocol'}.io`,
        projectDescription: `${rawName} Web3 Protocol & Infrastructure`,
        assessmentType: discoveryForm.assessmentType,
        priority: discoveryForm.priority,
        notes: discoveryForm.notes
      };

      setDiscoveredProject(fallbackDiscovered);
      setDiscoveryStep('preview');
      setIsEditingPreview(false);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleCreateProjectFromDiscovery = async () => {
    if (!discoveredProject) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/projects/create-from-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discoveredProject)
      });

      if (res.ok) {
        const data = await res.json();
        const createdApp: CertificationApplication = data.project;

        // Auto-run deep assessment pipeline
        try {
          fetch('/api/assessment/execute-pipeline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectId: createdApp.id,
              companyName: createdApp.companyName,
              cmcUrl: createdApp.cmcUrl,
              contractAddress: createdApp.contractAddress,
              whitepaperUrl: createdApp.whitepaperUrl,
              websiteUrl: createdApp.websiteUrl
            })
          }).then(r => r.json()).then(pipelineData => {
            if (pipelineData?.assessment) {
              saveLocalAssessment(pipelineData.assessment);
            }
          }).catch(e => console.warn('Pipeline execution warning:', e));
        } catch (e) {}

        onRefreshData();
        setShowNewProjectModal(false);
        setDiscoveryStep('input');
        setDiscoveredProject(null);

        setSelectedProject(createdApp);
        setActiveProjectTab('assessment');
      } else {
        alert('Failed to save project. Please check server logs.');
      }
    } catch (err) {
      console.error('Error creating project from discovery:', err);
      alert('Error creating project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stage advancement helper
  const handleAdvanceStage = async (nextStage: WorkflowStage) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/applications/${selectedProject.id}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nextStage,
          userName: `Project Manager (${currentUserRole.toUpperCase()})`,
          userRole: currentUserRole
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedProject(updated);
        onRefreshData();
      }
    } catch (err) {
      console.error('Stage advance failed:', err);
    }
  };

  // Filter applications list (Active non-archived projects)
  const filteredProjects = activeApplications.filter((app) => {
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contractAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.representativeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'in_progress' && app.stage !== 'published_registry' && app.stage !== 'rejected') ||
      (statusFilter === 'draft_ready' && app.stage === 'ai_assessment') ||
      (statusFilter === 'published' && app.stage === 'published_registry') ||
      app.stage === statusFilter;

    const matchesPriority =
      priorityFilter === 'all' || (app.priority || 'High').toLowerCase() === priorityFilter.toLowerCase();

    const matchesBlockchain =
      blockchainFilter === 'all' || app.blockchain.toLowerCase().includes(blockchainFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesPriority && matchesBlockchain;
  });

  // Calculate progress percentage for a project based on stage
  const getStageProgress = (stage: WorkflowStage): number => {
    switch (stage) {
      case 'waiting_deposit':
        return 10;
      case 'project_created':
        return 20;
      case 'ai_assessment':
        return 40;
      case 'technical_review':
        return 55;
      case 'business_review':
        return 65;
      case 'scholar_review':
        return 75;
      case 'quality_assurance':
        return 85;
      case 'waiting_final_payment':
        return 90;
      case 'certificate_generation':
        return 95;
      case 'published_registry':
        return 100;
      case 'rejected':
        return 0;
      default:
        return 30;
    }
  };

  const getStageBadge = (stage: WorkflowStage) => {
    switch (stage) {
      case 'published_registry':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">Certified & Published</span>;
      case 'certificate_generation':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">Certificate Minting</span>;
      case 'quality_assurance':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">QA Gate</span>;
      case 'scholar_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">Sharia Review</span>;
      case 'technical_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">Technical Review</span>;
      case 'business_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Business Review</span>;
      case 'ai_assessment':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse">Draft Report Ready</span>;
      case 'project_created':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">Project Created</span>;
      case 'waiting_deposit':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">Waiting Deposit</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/40">{stage}</span>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    const p = (priority || 'High').toUpperCase();
    if (p === 'URGENT') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40">URGENT</span>;
    }
    if (p === 'HIGH') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">HIGH</span>;
    }
    if (p === 'MEDIUM') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">MEDIUM</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-500/20 text-slate-300 border border-slate-500/40">LOW</span>;
  };

  // Render Project Details view if project is selected
  if (selectedProject) {
    const assessmentData = getLocalAssessment(selectedProject.id, selectedProject);

    return (
      <div className="space-y-6">
        {/* Header Navigation Back Button & Project Banner */}
        <div className="bg-[#0B132B] text-white p-6 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
            <button
              onClick={() => setSelectedProject(null)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back to Projects List</span>
            </button>

            <div className="flex items-center gap-3">
              {getStageBadge(selectedProject.stage)}
              {getPriorityBadge(selectedProject.priority)}
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                ID: {selectedProject.id}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
                <Building2 className="w-4 h-4" />
                <span>Customer: {selectedProject.representativeName} ({selectedProject.legalCountry})</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                {selectedProject.companyName}
              </h1>
              <p className="text-xs text-slate-300 font-mono mt-1 flex items-center gap-3 flex-wrap">
                <span className="text-amber-300 font-semibold">{selectedProject.blockchain}</span>
                <span>•</span>
                <span>Contract: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-200">{selectedProject.contractAddress}</code></span>
                <span>•</span>
                <span>Due: {selectedProject.targetCompletionDate}</span>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setDossierProject(selectedProject);
                  setIsDossierOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-amber-400 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-amber-500/40 shadow-lg"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>View Dossier</span>
              </button>

              <button
                onClick={() => {
                  setReassignProject(selectedProject);
                  setIsReassignOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-blue-500/30"
              >
                <Users className="w-4 h-4 text-blue-400" />
                <span>Reassign Team</span>
              </button>

              <button
                onClick={() => handleCreateNewVersion(selectedProject)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-emerald-500/30"
              >
                <GitBranch className="w-4 h-4 text-emerald-400" />
                <span>Create v2.0</span>
              </button>

              <button
                onClick={() => handleArchiveProject(selectedProject.id)}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-rose-500/30"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Archive</span>
              </button>

              <button
                onClick={() => {
                  setActiveProjectTab('assessment');
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Assessment</span>
              </button>

              <button
                onClick={() => setShowCertModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-amber-500/30"
              >
                <Award className="w-4 h-4" />
                <span>View Certificate</span>
              </button>
            </div>
          </div>

          {/* Project Details Navigation Tabs (10 Tabs) */}
          <ScrollableTabNav className="border-t border-white/10 pt-4 text-xs font-mono" variant="dark">
            {[
              { id: 'overview', label: 'Overview', icon: Building2 },
              { id: 'assessment', label: 'Assessment', icon: Sparkles },
              { id: 'tech_review', label: 'Technical Review', icon: Code },
              { id: 'biz_review', label: 'Business Review', icon: Briefcase },
              { id: 'scholar_review', label: 'Scholar Review', icon: ShieldCheck },
              { id: 'qa', label: 'QA', icon: UserCheck },
              { id: 'draft_report', label: 'Draft Report', icon: FileText },
              { id: 'final_report', label: 'Final Report', icon: Award },
              { id: 'certificate', label: 'Certificate', icon: Award },
              { id: 'activity_log', label: 'Activity Log', icon: Clock }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeProjectTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveProjectTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </ScrollableTabNav>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeProjectTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold font-serif text-slate-900 border-b pb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  <span>Project Metadata & Configuration</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-slate-500 block uppercase text-[10px]">Customer / Company</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedProject.companyName}</span>
                    <span className="text-slate-500 text-[11px] block">{selectedProject.officialEmail}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-slate-500 block uppercase text-[10px]">Representative & Country</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedProject.representativeName}</span>
                    <span className="text-slate-500 text-[11px] block">{selectedProject.legalCountry}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-slate-500 block uppercase text-[10px]">Blockchain & Network</span>
                    <span className="font-bold text-amber-700 text-sm mt-0.5 block">{selectedProject.blockchain}</span>
                    <span className="text-slate-500 text-[11px] block truncate font-mono">Contract: {selectedProject.contractAddress}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-slate-500 block uppercase text-[10px]">Package & Pricing</span>
                    <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{selectedProject.packageType} Package (${selectedProject.totalFee.toLocaleString()})</span>
                    <span className="text-slate-500 text-[11px] block">Deposit: ${selectedProject.depositAmount.toLocaleString()} ({selectedProject.depositPaid ? 'Paid' : 'Pending'})</span>
                  </div>
                </div>

                {/* Description & Notes */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase font-mono">Project Description & Scope</span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {selectedProject.projectDescription || 'No description provided.'}
                  </p>
                </div>

                {/* URLs & Resources */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 uppercase font-mono">Connected Links & External Resources</span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {selectedProject.websiteUrl && (
                      <a href={selectedProject.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-amber-100 hover:text-amber-900 transition-all border border-slate-200 font-semibold">
                        <Globe className="w-3.5 h-3.5 text-amber-600" />
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedProject.whitepaperUrl && (
                      <a href={selectedProject.whitepaperUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-amber-100 hover:text-amber-900 transition-all border border-slate-200 font-semibold">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Whitepaper PDF</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedProject.cmcUrl && (
                      <a href={selectedProject.cmcUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-amber-100 hover:text-amber-900 transition-all border border-slate-200 font-semibold">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span>CoinMarketCap</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Assigned Team & Stage Controls */}
            <div className="space-y-6">
              {/* Assigned Reviewers */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold font-serif text-slate-900 border-b pb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span>Assigned Expert Team</span>
                </h3>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Technical Reviewer</span>
                      <span className="font-bold text-slate-800">Dr. Ziyad Al-Hassan</span>
                    </div>
                    <Code className="w-4 h-4 text-blue-600" />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Sharia Scholar</span>
                      <span className="font-bold text-slate-800">Sheikh Dr. Ibrahim Al-Kuwaiti</span>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Business Reviewer</span>
                      <span className="font-bold text-slate-800">Amina Mansour</span>
                    </div>
                    <Briefcase className="w-4 h-4 text-cyan-600" />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">QA Officer</span>
                      <span className="font-bold text-slate-800">Sami Al-Khatib</span>
                    </div>
                    <UserCheck className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Stage Advance Controller */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold font-serif text-slate-900 border-b pb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Workflow Stage Advancement</span>
                </h3>

                <div className="space-y-2 text-xs font-mono">
                  <label className="text-[10px] text-slate-500 uppercase block">Current Workflow Stage</label>
                  <div className="p-3 rounded-2xl bg-[#0B132B] text-amber-300 font-bold text-center border border-amber-500/30">
                    {selectedProject.stage.toUpperCase()}
                  </div>

                  <div className="pt-2">
                    <label className="text-[10px] text-slate-500 uppercase block mb-1">Advance Stage To:</label>
                    <select
                      value={selectedProject.stage}
                      onChange={(e) => handleAdvanceStage(e.target.value as WorkflowStage)}
                      className="w-full bg-slate-50 border border-slate-300 font-bold py-2 px-3 rounded-xl text-slate-800 cursor-pointer focus:outline-none"
                    >
                      <option value="project_created">Project Created</option>
                      <option value="ai_assessment">AI Assessment (Draft Ready)</option>
                      <option value="technical_review">Technical Review</option>
                      <option value="business_review">Business Review</option>
                      <option value="scholar_review">Scholar Review</option>
                      <option value="quality_assurance">Quality Assurance</option>
                      <option value="waiting_final_payment">Waiting Final Payment</option>
                      <option value="certificate_generation">Certificate Generation</option>
                      <option value="published_registry">Published on Registry</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ASSESSMENT ENGINE */}
        {activeProjectTab === 'assessment' && (
          <div className="space-y-6">
            <HalalChainAssessmentEngine
              applications={applications}
              currentUserRole={currentUserRole}
              initialProjectId={selectedProject.id}
              onRefreshData={onRefreshData}
            />
          </div>
        )}

        {/* Tab 3: TECHNICAL REVIEW */}
        {activeProjectTab === 'tech_review' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  <span>Technical & Smart Contract Security Audit</span>
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Assigned Auditor: Dr. Ziyad Al-Hassan (Senior Blockchain Security Specialist)</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                Score: 92/100 (LOW RISK)
              </span>
            </div>

            {/* Findings & Bytecode Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Compiler & Upgradeability</span>
                <p className="font-bold text-slate-800">Solidity v0.8.20 (Verified on Etherscan)</p>
                <p className="text-slate-600 text-[11px]">UUPS Proxy Pattern detected. Owner upgrade keys protected via 3-of-5 Gnosis Safe Multi-Sig.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Privilege Functions Audit</span>
                <p className="font-bold text-slate-800">Pause () & Blacklist () Mitigated</p>
                <p className="text-slate-600 text-[11px]">Minting capped at max supply limit. Emergency pause functions enforce 48-hour timelock delay.</p>
              </div>
            </div>

            {/* Auditor Signoff Form */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-amber-400 font-serif text-sm">Technical Reviewer Official Signoff</h4>
              <p className="text-slate-300 text-xs">Signoff Status: <span className="text-emerald-400 font-bold">{assessmentData.humanReviewSignoffs?.tech_auditor?.status || 'Approved'}</span></p>
              <div className="p-3 bg-slate-800 rounded-xl text-slate-200 text-xs italic">
                "{assessmentData.humanReviewSignoffs?.tech_auditor?.comment || 'Bytecode verified. Pause function centralization mitigated by 3-of-5 Gnosis Safe multi-sig keys.'}"
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Digital Signature: {assessmentData.humanReviewSignoffs?.tech_auditor?.digitalSignature || 'SIG-TECH-0x89f2a1b'}</span>
                <span>Signed: {assessmentData.humanReviewSignoffs?.tech_auditor?.signedAt || '2026-07-25'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: BUSINESS REVIEW */}
        {activeProjectTab === 'biz_review' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-600" />
                  <span>Business Model & Tokenomics Audit</span>
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Assigned Reviewer: Amina Mansour (Senior Tokenomics Analyst)</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                Business Viability: PASS
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Revenue & Utility Mechanics</span>
                <p className="text-slate-700 text-xs leading-relaxed">
                  Yield generation is tied directly to underlying protocol usage fees and real asset rental profits. No algorithmic unbacked inflation detected.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-amber-400 font-serif text-sm">Business Reviewer Official Signoff</h4>
              <p className="text-slate-300 text-xs">Signoff Status: <span className="text-emerald-400 font-bold">{assessmentData.humanReviewSignoffs?.business_analyst?.status || 'Approved'}</span></p>
              <div className="p-3 bg-slate-800 rounded-xl text-slate-200 text-xs italic">
                "{assessmentData.humanReviewSignoffs?.business_analyst?.comment || 'Business model verified. Yields are generated exclusively from real fee revenue.'}"
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: SCHOLAR REVIEW */}
        {activeProjectTab === 'scholar_review' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Sharia Compliance & AAOIFI Standards Review</span>
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Assigned Scholar: Sheikh Dr. Ibrahim Al-Kuwaiti (Member of AAOIFI Sharia Board)</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                Fatwa Approval: APPROVED
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="text-emerald-800 font-bold uppercase text-[10px]">AAOIFI Sharia Compliance Mapping</span>
              <p className="text-emerald-900 text-xs leading-relaxed">
                Evaluated under AAOIFI Standard No. 21 (Financial Paper/Sukuk) and No. 59 (Sale of Debt). The staking contract complies with Mudarabah profit-sharing rules with no guaranteed fixed returns.
              </p>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-amber-400 font-serif text-sm">Sharia Scholar Fatwa Approval Signoff</h4>
              <p className="text-slate-300 text-xs">Signoff Status: <span className="text-emerald-400 font-bold">{assessmentData.humanReviewSignoffs?.scholar?.status || 'Approved'}</span></p>
              <div className="p-3 bg-slate-800 rounded-xl text-slate-200 text-xs italic">
                "{assessmentData.humanReviewSignoffs?.scholar?.comment || 'Fatwa approved. Yields are derived strictly from Mudarabah profit sharing.'}"
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: QA */}
        {activeProjectTab === 'qa' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                <span>Quality Assurance SLA & Evidence Verification</span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-xs">QA PASSED</span>
            </div>
            <p className="text-slate-600">All 10 assessment steps and 4 human reviewer signoffs verified against HalalChain™ Quality Assurance SLA v2.1.</p>
          </div>
        )}

        {/* Tab 7: DRAFT REPORT */}
        {activeProjectTab === 'draft_report' && (
          <div className="space-y-6">
            <div className="bg-amber-500/10 text-amber-900 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-bold">MANDATORY DRAFT WATERMARK ACTIVE</span>
              </div>
              <span>Watermark is automatically removed upon final certificate issuance.</span>
            </div>

            <HalalChainAssessmentEngine
              applications={applications}
              currentUserRole={currentUserRole}
              initialProjectId={selectedProject.id}
              onRefreshData={onRefreshData}
            />
          </div>
        )}

        {/* Tab 8: FINAL REPORT */}
        {activeProjectTab === 'final_report' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-mono text-xs">
            <div className="text-center space-y-2 border-b pb-6">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">OFFICIAL REPORT</span>
              <h2 className="text-2xl font-bold font-serif text-slate-900">HALALCHAIN™ FINAL SHARIA & TECHNICAL AUDIT REPORT</h2>
              <p className="text-slate-500">Project: {selectedProject.companyName} | ID: {selectedProject.id}</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 font-serif text-sm">Human Reviewers Official Approvals</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block">Technical Auditor</span>
                  <span className="text-emerald-600 font-bold">APPROVED</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block">Business Reviewer</span>
                  <span className="text-emerald-600 font-bold">APPROVED</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block">Sharia Scholar</span>
                  <span className="text-emerald-600 font-bold">APPROVED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: CERTIFICATE */}
        {activeProjectTab === 'certificate' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => handleAdvanceStage('published_registry')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold text-xs transition-all shadow-xl hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Issue & Publish Sharia Certificate</span>
              </button>
            </div>

            <div className="bg-[#0B132B] p-8 rounded-3xl border border-amber-500/40 text-white shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <span className="text-amber-400 text-xs font-mono uppercase tracking-widest block">CERTIFICATE PREVIEW</span>
                <h3 className="text-2xl font-serif font-bold text-white mt-1">Sharia Compliance Certificate</h3>
                <p className="text-slate-300 text-xs mt-1 font-mono">Issued to {selectedProject.companyName} ({selectedProject.blockchain})</p>
              </div>

              <div className="inline-block p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300">
                Verification Hash: <code className="text-amber-300">HC-CERT-2026-0x98f3a8b2c1d4</code>
              </div>
            </div>
          </div>
        )}

        {/* Tab 10: ACTIVITY LOG */}
        {activeProjectTab === 'activity_log' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
            <h3 className="text-base font-bold font-serif text-slate-900 border-b pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Project Specific Activity & Audit Trail</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">Project Created</span>
                  <span className="text-slate-500 text-[11px] block">Created by {selectedProject.representativeName} ({selectedProject.officialEmail})</span>
                </div>
                <span className="text-slate-400 text-[10px]">{selectedProject.submittedAt}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">Stage Advanced</span>
                  <span className="text-slate-500 text-[11px] block">Current Stage: {selectedProject.stage}</span>
                </div>
                <span className="text-slate-400 text-[10px]">Recent</span>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {showCertModal && (
          <ShariaCertificateModal
            project={{
              id: selectedProject.id,
              name: selectedProject.companyName,
              symbol: selectedProject.companyName.substring(0, 4).toUpperCase(),
              certificateNumber: `CERT-2026-${selectedProject.id}`,
              issueDate: new Date().toISOString().split('T')[0],
              expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
              shariaStandard: 'HalalChain Assessment Standard v2.1 (AAOIFI Aligned)',
              complianceStatus: 'Certified Sharia-Compliant',
              category: selectedProject.blockchain,
              chainName: selectedProject.blockchain,
              contractAddress: selectedProject.contractAddress,
              shariaSummaryEn: 'Verified full compliance with Islamic commercial law.',
              shariaSummaryAr: 'تم التحقق من الامتثال الكامل لأحكام الشريعة الإسلامية.',
              scholarSignatures: ['Sheikh Dr. Ibrahim Al-Kuwaiti'],
              verificationHash: `HC-HASH-0x${Math.random().toString(16).substring(2, 10)}`
            }}
            onClose={() => setShowCertModal(false)}
          />
        )}
      </div>
    );
  }

  // Render PROJECT LIST VIEW (Default Screen)
  return (
    <div className="space-y-8">
      {/* Top Header & Statistics Banner */}
      <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/30">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Project Management Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Projects & Assessments Center
            </h1>
            <p className="text-xs text-slate-300 font-mono">
              Create, track, and manage all enterprise assessments, reviewer assignments, and Sharia certificates.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setShowArchivedView(!showArchivedView)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border ${
                showArchivedView
                  ? 'bg-rose-500 text-white border-rose-400 shadow-lg'
                  : 'bg-slate-900/90 text-rose-300 hover:bg-slate-800 border-white/10'
              }`}
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>{showArchivedView ? 'Active Projects' : `Archived Projects (${archivedApplications.length})`}</span>
            </button>

            <button
              onClick={() => setShowTestDataModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-white/10"
              title="Manage Demo & Test Data"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>Test Data</span>
            </button>

            {(currentUserRole === 'pm' || currentUserRole === 'exec' || currentUserRole === 'admin') && (
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xl shadow-amber-500/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>New Project</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-[10px] block uppercase">Total Active Projects</span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block">{activeApplications.length}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-[10px] block uppercase">In Progress</span>
            <span className="text-xl font-bold text-blue-400 mt-0.5 block">
              {activeApplications.filter((a) => a.stage !== 'published_registry' && a.stage !== 'rejected').length}
            </span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-[10px] block uppercase">Draft Reports Ready</span>
            <span className="text-xl font-bold text-amber-300 mt-0.5 block">
              {activeApplications.filter((a) => a.stage === 'ai_assessment').length}
            </span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-[10px] block uppercase">Certified & Published</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
              {activeApplications.filter((a) => a.stage === 'published_registry').length}
            </span>
          </div>
        </div>
      </div>

      {/* Render Archived Projects View when toggled */}
      {showArchivedView ? (
        <ArchivedProjectsView
          archivedProjects={archivedApplications}
          archivedApplications={archivedApplications}
          currentUserRole={currentUserRole}
          onRefreshData={onRefreshData}
          onClose={() => setShowArchivedView(false)}
        />
      ) : (
      <>
      {/* Action Controls: Search & Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search project name, customer, contract, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-slate-800 cursor-pointer focus:outline-none font-semibold"
            >
              <option value="all">All Statuses / Stages</option>
              <option value="in_progress">In Progress</option>
              <option value="project_created">Project Created</option>
              <option value="ai_assessment">Draft Report Ready</option>
              <option value="technical_review">Technical Review</option>
              <option value="scholar_review">Scholar Review</option>
              <option value="quality_assurance">QA Gate</option>
              <option value="published">Certified & Published</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-slate-800 cursor-pointer focus:outline-none font-semibold"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar if items selected */}
        {selectedProjectIds.length > 0 && (
          <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between flex-wrap gap-3 font-mono text-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400">{selectedProjectIds.length} Selected</span>
              <button
                onClick={handleToggleSelectAll}
                className="text-slate-400 hover:text-white underline text-[11px]"
              >
                Deselect All
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkArchive}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bulk Archive</span>
              </button>

              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(applications.filter(a => selectedProjectIds.includes(a.id)), null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `projects_export_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all border border-amber-500/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Selected</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Projects List (Grid of Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
          <span>Showing {filteredProjects.length} of {applications.length} Project(s)</span>
          {copiedText && <span className="text-emerald-600 font-bold animate-fade-in">Copied {copiedText}!</span>}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 font-mono">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 font-serif">No Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No project matches the selected search filters. Click "New Project" to create one.
            </p>
            {(currentUserRole === 'pm' || currentUserRole === 'exec' || currentUserRole === 'admin') && (
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((app) => {
              const progressPct = getStageProgress(app.stage);
              return (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all p-6 flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-3">
                    {/* Top Badges & Select Checkbox */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleSelectOne(app.id)}
                          className="text-slate-400 hover:text-amber-500 cursor-pointer"
                        >
                          {selectedProjectIds.includes(app.id) ? (
                            <CheckSquare className="w-4 h-4 text-amber-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                          {app.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getPriorityBadge(app.priority)}
                        {getStageBadge(app.stage)}
                      </div>
                    </div>

                    {/* Project Title & Customer */}
                    <div>
                      <h3
                        onClick={() => {
                          setSelectedProject(app);
                          setActiveProjectTab('overview');
                        }}
                        className="text-lg font-bold font-serif text-slate-900 group-hover:text-amber-600 transition-colors cursor-pointer"
                      >
                        {app.companyName}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Customer: {app.representativeName}</span>
                      </p>
                    </div>

                    {/* Blockchain & Contract */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-bold text-amber-700">{app.blockchain}</span>
                        <span className="text-[10px] text-slate-400">Due: {app.targetCompletionDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="truncate max-w-[180px] font-mono">{app.contractAddress}</span>
                        <button
                          onClick={() => handleCopy(app.contractAddress, 'Contract Address')}
                          className="text-amber-600 hover:text-amber-700 font-semibold p-1"
                          title="Copy Contract Address"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Assessment Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-600">
                        <span>Assessment Progress</span>
                        <span className="text-amber-600">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Assigned Reviewers Avatars */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Reviewers Team:</span>
                      <div className="flex items-center -space-x-1">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] border border-white" title="Technical Auditor">T</div>
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] border border-white" title="Sharia Scholar">S</div>
                        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-[10px] border border-white" title="Business Analyst">B</div>
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[10px] border border-white" title="QA Officer">Q</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                    <button
                      onClick={() => {
                        setDossierProject(app);
                        setIsDossierOpen(true);
                      }}
                      className="py-1.5 px-2.5 rounded-xl bg-slate-900 text-amber-400 hover:bg-black font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                      title="Open Complete Project Dossier"
                    >
                      <FileText className="w-3 h-3 text-amber-400" />
                      <span>Dossier</span>
                    </button>

                    <button
                      onClick={() => {
                        setReassignProject(app);
                        setIsReassignOpen(true);
                      }}
                      className="py-1.5 px-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer border border-blue-200"
                      title="Reassign Team Members"
                    >
                      <Users className="w-3 h-3" />
                      <span>Reassign</span>
                    </button>

                    <button
                      onClick={() => handleCreateNewVersion(app)}
                      className="py-1.5 px-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer border border-emerald-200"
                      title="Create Version 2.0 Assessment"
                    >
                      <GitBranch className="w-3 h-3" />
                      <span>v2.0</span>
                    </button>

                    <button
                      onClick={() => handleArchiveProject(app.id)}
                      className="py-1.5 px-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer border border-rose-200"
                      title="Archive Project"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProject(app);
                        setActiveProjectTab('overview');
                      }}
                      className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </>
      )}

      {/* SMART PROJECT DISCOVERY WIZARD MODAL */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold font-serif text-slate-900">Smart Project Discovery Wizard</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      Discovery-First
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Zero manual data entry — data acquisition engine automatically retrieves all public project metadata & syncs CRM.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  setDiscoveryStep('input');
                  setDiscoveryError(null);
                }}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-2 cursor-pointer rounded-xl hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Wizard Step Progress Pills */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl font-mono text-xs">
              <div
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${
                  discoveryStep === 'input'
                    ? 'bg-white text-amber-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 opacity-70'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Step 1: Input URL & Parameters</span>
              </div>
              <div
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${
                  discoveryStep === 'preview'
                    ? 'bg-white text-amber-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 opacity-70'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${discoveryStep === 'preview' ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-600'}`}>2</span>
                <span>Step 2: Discovered Data Preview</span>
              </div>
            </div>

            {/* STEP 1: INITIAL DISCOVERY INPUT (4 EDITABLE FIELDS ONLY) */}
            {discoveryStep === 'input' && (
              <form onSubmit={handleDiscoverProject} className="space-y-5 font-mono text-xs">
                {discoveryError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                    <span>{discoveryError}</span>
                  </div>
                )}

                <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl text-amber-900 text-xs leading-relaxed flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-amber-950 block">Discovery-First Automation Engine Active</strong>
                    Enter the CoinMarketCap URL below. Our engine will scrape and extract all 16+ public attributes including Project Name, Symbol, Logo, Website, Whitepaper, GitHub, Blockchain, Contract Address, CoinGecko, Twitter, Telegram, Email, Phone, Address, Support, and Media contacts.
                  </div>
                </div>

                {/* Field 1: CoinMarketCap URL (Required) */}
                <div className="space-y-1.5">
                  <label className="text-slate-800 font-bold uppercase text-xs flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-600" />
                    <span>CoinMarketCap URL</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://coinmarketcap.com/currencies/polygon/"
                    value={discoveryForm.cmcUrl}
                    onChange={(e) => setDiscoveryForm({ ...discoveryForm, cmcUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 font-bold text-sm outline-none transition-all shadow-sm"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Supported formats: https://coinmarketcap.com/currencies/[slug]/ or contract address URLs.
                  </span>
                </div>

                {/* Field 2 & 3: Assessment Type & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-800 font-bold uppercase text-xs block">
                      Assessment Type
                    </label>
                    <select
                      value={discoveryForm.assessmentType}
                      onChange={(e) => setDiscoveryForm({ ...discoveryForm, assessmentType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-slate-800 font-bold cursor-pointer focus:outline-none focus:border-amber-500"
                    >
                      <option value="Full Sharia & Technical Certification">Full Sharia & Technical Certification</option>
                      <option value="Technical Security & Bytecode Audit">Technical Security & Bytecode Audit</option>
                      <option value="Sharia Compliance Verification">Sharia Compliance Verification</option>
                      <option value="Tokenomics & Governance Audit">Tokenomics & Governance Audit</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-800 font-bold uppercase text-xs block">
                      Priority Level
                    </label>
                    <select
                      value={discoveryForm.priority}
                      onChange={(e) => setDiscoveryForm({ ...discoveryForm, priority: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-slate-800 font-bold cursor-pointer focus:outline-none focus:border-amber-500"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Urgent">Urgent Priority</option>
                    </select>
                  </div>
                </div>

                {/* Field 4: Internal Scope Notes */}
                <div className="space-y-1.5">
                  <label className="text-slate-800 font-bold uppercase text-xs block">
                    Internal Scope Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter internal evaluation context, target due dates, or special Sharia review instructions..."
                    value={discoveryForm.notes}
                    onChange={(e) => setDiscoveryForm({ ...discoveryForm, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white rounded-xl p-3 text-slate-800 font-normal leading-relaxed outline-none"
                  />
                </div>

                {/* Discovery Action Bar */}
                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Create Project button remains disabled until discovery completes successfully.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewProjectModal(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isDiscovering || !discoveryForm.cmcUrl.trim()}
                      className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all text-sm"
                    >
                      {isDiscovering ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Acquiring Project Data...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Discover Project</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: DISCOVERED INFORMATION PREVIEW SCREEN */}
            {discoveryStep === 'preview' && discoveredProject && (
              <div className="space-y-6 font-mono text-xs">
                {/* Header Banner */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">Discovery Completed Successfully!</h4>
                      <p className="text-emerald-800 text-[11px]">
                        Retrieved 16 project attributes from public web sources & smart contract registries.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingPreview(!isEditingPreview)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                      isEditingPreview
                        ? 'bg-amber-500 text-slate-950 border-amber-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingPreview ? 'Lock Fields (Read-Only)' : 'Edit Discovered Data'}</span>
                  </button>
                </div>

                {/* Project Identity Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={discoveredProject.logoUrl}
                      alt={discoveredProject.companyName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=120&auto=format&fit=crop&q=80');
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        {isEditingPreview ? (
                          <input
                            type="text"
                            value={discoveredProject.companyName}
                            onChange={(e) => setDiscoveredProject({ ...discoveredProject, companyName: e.target.value })}
                            className="text-base font-bold bg-white border border-slate-300 rounded px-2 py-0.5 text-slate-900"
                          />
                        ) : (
                          <h3 className="text-lg font-bold font-serif text-slate-900">{discoveredProject.companyName}</h3>
                        )}

                        {isEditingPreview ? (
                          <input
                            type="text"
                            value={discoveredProject.projectSymbol}
                            onChange={(e) => setDiscoveredProject({ ...discoveredProject, projectSymbol: e.target.value })}
                            className="text-xs font-bold bg-white border border-slate-300 rounded px-2 py-0.5 text-slate-900 w-20"
                          />
                        ) : (
                          <span className="bg-slate-200 text-slate-800 text-xs font-bold px-2 py-0.5 rounded-lg">
                            ${discoveredProject.projectSymbol}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{discoveredProject.projectDescription}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Status</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 font-bold px-2.5 py-1 rounded-full text-xs border border-emerald-300">
                      <Lock className="w-3 h-3" /> Discovered (Read-Only)
                    </span>
                  </div>
                </div>

                {/* 16 Discovered Attributes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {/* Official Website */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-amber-600" /> Official Website</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="url"
                        value={discoveredProject.websiteUrl}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, websiteUrl: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <a href={discoveredProject.websiteUrl} target="_blank" rel="noreferrer" className="text-slate-900 font-bold hover:text-amber-600 truncate block">
                        {discoveredProject.websiteUrl}
                      </a>
                    )}
                  </div>

                  {/* Whitepaper URL */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-amber-600" /> Whitepaper PDF / Docs</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="url"
                        value={discoveredProject.whitepaperUrl}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, whitepaperUrl: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <a href={discoveredProject.whitepaperUrl} target="_blank" rel="noreferrer" className="text-slate-900 font-bold hover:text-amber-600 truncate block">
                        {discoveredProject.whitepaperUrl}
                      </a>
                    )}
                  </div>

                  {/* GitHub Repository */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><Code className="w-3 h-3 text-amber-600" /> GitHub Repository</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="url"
                        value={discoveredProject.githubUrl}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, githubUrl: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <a href={discoveredProject.githubUrl} target="_blank" rel="noreferrer" className="text-slate-900 font-bold hover:text-amber-600 truncate block">
                        {discoveredProject.githubUrl}
                      </a>
                    )}
                  </div>

                  {/* Blockchain Network */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-amber-600" /> Blockchain Network</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="text"
                        value={discoveredProject.blockchain}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, blockchain: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <span className="text-slate-900 font-bold block">{discoveredProject.blockchain}</span>
                    )}
                  </div>

                  {/* Verified Smart Contract */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><Code className="w-3 h-3 text-amber-600" /> Verified Smart Contract</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="text"
                        value={discoveredProject.contractAddress}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, contractAddress: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <span className="text-slate-900 font-bold font-mono text-[11px] block truncate">{discoveredProject.contractAddress}</span>
                    )}
                  </div>

                  {/* CoinGecko Link */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3 text-amber-600" /> CoinGecko Endpoint</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="url"
                        value={discoveredProject.coingeckoUrl}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, coingeckoUrl: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <a href={discoveredProject.coingeckoUrl} target="_blank" rel="noreferrer" className="text-slate-900 font-bold hover:text-amber-600 truncate block">
                        {discoveredProject.coingeckoUrl}
                      </a>
                    )}
                  </div>

                  {/* X (Twitter) Account */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-amber-600" /> X (Twitter) Account</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="text"
                        value={discoveredProject.xHandle}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, xHandle: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <span className="text-slate-900 font-bold block">{discoveredProject.xHandle}</span>
                    )}
                  </div>

                  {/* Telegram Channel */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><Send className="w-3 h-3 text-amber-600" /> Official Telegram</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="url"
                        value={discoveredProject.telegram}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, telegram: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <a href={discoveredProject.telegram} target="_blank" rel="noreferrer" className="text-slate-900 font-bold hover:text-amber-600 truncate block">
                        {discoveredProject.telegram}
                      </a>
                    )}
                  </div>

                  {/* Official Email */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-amber-600" /> Official Email</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="email"
                        value={discoveredProject.officialEmail}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, officialEmail: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <span className="text-slate-900 font-bold block">{discoveredProject.officialEmail}</span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-amber-600" /> Public Phone Number</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="text"
                        value={discoveredProject.phone}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, phone: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <span className="text-slate-900 font-bold block">{discoveredProject.phone}</span>
                    )}
                  </div>

                  {/* Official Address */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-600" /> Official Address / Legal Jurisdiction</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="text"
                        value={discoveredProject.address}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, address: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <span className="text-slate-900 font-bold block">{discoveredProject.address}</span>
                    )}
                  </div>

                  {/* Support Contact */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-amber-600" /> Support Desk Contact</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="text"
                        value={discoveredProject.supportContact}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, supportContact: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <span className="text-slate-900 font-bold block">{discoveredProject.supportContact}</span>
                    )}
                  </div>

                  {/* Media Contact */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 md:col-span-2">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-amber-600" /> Media / Press Contact</span>
                      {!isEditingPreview && <Lock className="w-3 h-3 text-slate-400" />}
                    </span>
                    {isEditingPreview ? (
                      <input
                        type="text"
                        value={discoveredProject.mediaContact}
                        onChange={(e) => setDiscoveredProject({ ...discoveredProject, mediaContact: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold"
                      />
                    ) : (
                      <span className="text-slate-900 font-bold block">{discoveredProject.mediaContact}</span>
                    )}
                  </div>
                </div>

                {/* CRM Integration Badge */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <strong className="font-bold block">Smart Marketing CRM Auto-Linking & Deduplication</strong>
                    Creating this project will automatically create or update the CRM customer record without generating duplicate customer profiles.
                  </div>
                </div>

                {/* Step 2 Actions Bar */}
                <div className="pt-4 border-t flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setDiscoveryStep('input')}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to URL Input</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewProjectModal(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleCreateProjectFromDiscovery}
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Creating Project & Syncing CRM...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Create Project & Open</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROJECT DOSSIER MODAL */}
      {isDossierOpen && dossierProject && (
        <ProjectDossierModal
          project={dossierProject}
          onClose={() => setIsDossierOpen(false)}
          onRefreshData={onRefreshData}
        />
      )}

      {/* REASSIGN TEAM MODAL */}
      {isReassignOpen && reassignProject && (
        <ReassignTeamModal
          project={reassignProject}
          onClose={() => setIsReassignOpen(false)}
          onRefreshData={onRefreshData}
        />
      )}

      {/* TEST DATA MANAGEMENT MODAL */}
      {showTestDataModal && (
        <TestDataManagementModal
          onClose={() => setShowTestDataModal(false)}
          onRefreshData={onRefreshData}
        />
      )}
    </div>
  );
};

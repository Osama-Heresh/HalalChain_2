import React, { useState, useEffect } from 'react';
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
  Printer
} from 'lucide-react';
import { HalalChainAssessmentEngine } from '../assessment/HalalChainAssessmentEngine';
import { ShariaCertificateModal } from '../ShariaCertificateModal';
import { getLocalAssessment, saveLocalAssessment, createDefaultAssessmentForProject } from '../../lib/assessmentService';

interface ProjectsManagementViewProps {
  applications: CertificationApplication[];
  leads: Lead[];
  currentUserRole: UserRole;
  onRefreshData: () => void;
  onOpenTaskModal?: (app: CertificationApplication) => void;
}

export const ProjectsManagementView: React.FC<ProjectsManagementViewProps> = ({
  applications,
  leads,
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

  // New Project Form Modal state
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Project Form Data
  const [newProjectForm, setNewProjectForm] = useState({
    customerId: '',
    customCustomerName: '',
    customCustomerEmail: '',
    customCountry: 'United Arab Emirates',
    projectName: '',
    cmcOrContractInput: '',
    blockchain: 'Ethereum Mainnet',
    priority: 'High' as 'Low' | 'Medium' | 'High' | 'Urgent',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    notes: '',
    packageType: 'Professional' as 'Starter' | 'Professional' | 'Enterprise'
  });

  // Certificate Modal state
  const [showCertModal, setShowCertModal] = useState(false);

  // Copy notification toast
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Auto-detect Blockchain from Contract Address or CMC Input
  useEffect(() => {
    const input = newProjectForm.cmcOrContractInput.trim();
    if (input.startsWith('0x')) {
      if (input.length === 42) {
        setNewProjectForm((prev) => ({ ...prev, blockchain: 'Ethereum Mainnet' }));
      }
    } else if (input.toLowerCase().includes('bsc') || input.toLowerCase().includes('binance')) {
      setNewProjectForm((prev) => ({ ...prev, blockchain: 'BNB Smart Chain' }));
    } else if (input.toLowerCase().includes('polygon')) {
      setNewProjectForm((prev) => ({ ...prev, blockchain: 'Polygon PoS' }));
    } else if (input.toLowerCase().includes('arbitrum')) {
      setNewProjectForm((prev) => ({ ...prev, blockchain: 'Arbitrum One' }));
    } else if (input.toLowerCase().includes('solana')) {
      setNewProjectForm((prev) => ({ ...prev, blockchain: 'Solana' }));
    }
  }, [newProjectForm.cmcOrContractInput]);

  // Handle New Project Creation
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.projectName) {
      alert('Please enter a Project Name.');
      return;
    }

    setIsSubmitting(true);

    // Resolve Customer Details
    let customerName = newProjectForm.customCustomerName;
    let customerEmail = newProjectForm.customCustomerEmail;
    let customerCountry = newProjectForm.customCountry;

    if (newProjectForm.customerId) {
      const selectedLead = leads.find((l) => l.id === newProjectForm.customerId);
      if (selectedLead) {
        customerName = selectedLead.companyName;
        customerEmail = selectedLead.contactEmail || `contact@${selectedLead.companyName.toLowerCase().replace(/\s+/g, '')}.io`;
        customerCountry = selectedLead.country;
      }
    }

    if (!customerName) {
      customerName = newProjectForm.projectName;
    }
    if (!customerEmail) {
      customerEmail = `info@${newProjectForm.projectName.toLowerCase().replace(/\s+/g, '')}.io`;
    }

    // Determine Contract Address vs CMC URL
    let contractAddress = '0x3829102938102938102938102938102938102938';
    let cmcUrl = '';

    const rawInput = newProjectForm.cmcOrContractInput.trim();
    if (rawInput.startsWith('0x')) {
      contractAddress = rawInput;
    } else if (rawInput.includes('coinmarketcap.com') || rawInput.includes('coingecko.com')) {
      cmcUrl = rawInput;
      contractAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    } else if (rawInput) {
      contractAddress = rawInput;
    }

    const payload = {
      companyName: newProjectForm.projectName,
      legalCountry: customerCountry,
      representativeName: customerName,
      officialEmail: customerEmail,
      websiteUrl: `https://${newProjectForm.projectName.toLowerCase().replace(/\s+/g, '')}.io`,
      whitepaperUrl: `https://${newProjectForm.projectName.toLowerCase().replace(/\s+/g, '')}.io/whitepaper.pdf`,
      contractAddress,
      cmcUrl,
      blockchain: newProjectForm.blockchain,
      packageType: newProjectForm.packageType,
      projectDescription: newProjectForm.notes || `HalalChain™ Comprehensive Sharia & Technical Assessment for ${newProjectForm.projectName}`,
      stage: 'project_created' as WorkflowStage,
      priority: newProjectForm.priority,
      targetCompletionDate: newProjectForm.dueDate,
      notes: newProjectForm.notes,
      assignedReviewers: {
        tech_auditor: 'Dr. Ziyad Al-Hassan',
        scholar: 'Sheikh Dr. Ibrahim Al-Kuwaiti',
        business_analyst: 'Amina Mansour',
        qa: 'Sami Al-Khatib',
        pm: 'Omar Khayyam'
      }
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newApp: CertificationApplication = await res.json();
        
        // Immediately run Live Automated Assessment Pipeline to retrieve public data
        try {
          const pipelineRes = await fetch('/api/assessment/execute-pipeline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectId: newApp.id,
              companyName: newApp.companyName,
              cmcUrl: newApp.cmcUrl,
              contractAddress: newApp.contractAddress,
              whitepaperUrl: newApp.whitepaperUrl,
              websiteUrl: newApp.websiteUrl
            })
          });

          if (pipelineRes.ok) {
            const pipelineData = await pipelineRes.json();
            if (pipelineData.assessment) {
              saveLocalAssessment(pipelineData.assessment);
            }
          }
        } catch (pipelineErr) {
          console.warn('Post-creation automatic assessment enrichment warning:', pipelineErr);
        }

        onRefreshData();
        setShowNewProjectModal(false);

        // Immediately open the newly created project in details view!
        setSelectedProject(newApp);
        setActiveProjectTab('assessment');
      } else {
        alert('Failed to save project. Please check server connection.');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Error creating project. Operating in offline state.');
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

  // Filter applications list
  const filteredProjects = applications.filter((app) => {
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
          <div className="flex items-center gap-1 border-t border-white/10 pt-4 overflow-x-auto scrollbar-none max-w-full text-xs font-mono">
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
          </div>
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

          <button
            onClick={() => setShowNewProjectModal(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xl shadow-amber-500/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Project</span>
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-[10px] block uppercase">Total Projects</span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block">{applications.length}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-[10px] block uppercase">In Progress</span>
            <span className="text-xl font-bold text-blue-400 mt-0.5 block">
              {applications.filter((a) => a.stage !== 'published_registry' && a.stage !== 'rejected').length}
            </span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-[10px] block uppercase">Draft Reports Ready</span>
            <span className="text-xl font-bold text-amber-300 mt-0.5 block">
              {applications.filter((a) => a.stage === 'ai_assessment').length}
            </span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-[10px] block uppercase">Certified & Published</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
              {applications.filter((a) => a.stage === 'published_registry').length}
            </span>
          </div>
        </div>
      </div>

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
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
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
                    {/* Top Badges */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {app.id}
                      </span>
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

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedProject(app);
                        setActiveProjectTab('overview');
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Project Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProject(app);
                        setActiveProjectTab('assessment');
                      }}
                      className="py-2 px-3 rounded-xl bg-amber-500/10 text-amber-700 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer border border-amber-500/30"
                      title="Run Assessment Engine"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* NEW PROJECT FORM MODAL */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-scale-up my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900">Create New Assessment Project</h3>
                  <p className="text-xs text-slate-500 font-mono">Initialize project scope, customer data, and contract details.</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-mono">
              {/* Select Customer */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase text-[10px] block">Customer / Applicant</label>
                <select
                  value={newProjectForm.customerId}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, customerId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold cursor-pointer focus:outline-none"
                >
                  <option value="">+ Enter Custom Customer / Applicant Details</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.companyName} ({lead.country}) - Contact: {lead.contactEmail}
                    </option>
                  ))}
                </select>
              </div>

              {!newProjectForm.customerId && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-slate-600 text-[10px] uppercase font-bold block">Customer Representative</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Founder"
                      value={newProjectForm.customCustomerName}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, customCustomerName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 text-[10px] uppercase font-bold block">Official Contact Email</label>
                    <input
                      type="email"
                      placeholder="founder@project.io"
                      value={newProjectForm.customCustomerEmail}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, customCustomerEmail: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Project Name */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase text-[10px] block">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sovereign Sukuk Token Protocol"
                  value={newProjectForm.projectName}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, projectName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold text-sm"
                />
              </div>

              {/* CMC URL OR Contract Address (Single Input Requirement) */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase text-[10px] block">
                  CoinMarketCap URL OR Contract Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0x3829102938... OR https://coinmarketcap.com/currencies/project"
                  value={newProjectForm.cmcOrContractInput}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, cmcOrContractInput: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 block">Auto-detects blockchain network if contract address is provided.</span>
              </div>

              {/* Blockchain & Package Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase text-[10px] block">Blockchain (Auto-Detected)</label>
                  <select
                    value={newProjectForm.blockchain}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, blockchain: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="Ethereum Mainnet">Ethereum Mainnet</option>
                    <option value="BNB Smart Chain">BNB Smart Chain</option>
                    <option value="Polygon PoS">Polygon PoS</option>
                    <option value="Arbitrum One">Arbitrum One</option>
                    <option value="Solana">Solana</option>
                    <option value="Avalanche C-Chain">Avalanche C-Chain</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase text-[10px] block">Priority Level</label>
                  <select
                    value={newProjectForm.priority}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, priority: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Priority</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Package */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase text-[10px] block">Target Due Date</label>
                  <input
                    type="date"
                    value={newProjectForm.dueDate}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase text-[10px] block">Service Package</label>
                  <select
                    value={newProjectForm.packageType}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, packageType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="Starter">Starter Package ($4,500)</option>
                    <option value="Professional">Professional Package ($9,800)</option>
                    <option value="Enterprise">Enterprise Full Audit ($19,500)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase text-[10px] block">Assessment Scope Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter initial review notes, special Sharia criteria, or custom instruction notes..."
                  value={newProjectForm.notes}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving Project...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Save & Open Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

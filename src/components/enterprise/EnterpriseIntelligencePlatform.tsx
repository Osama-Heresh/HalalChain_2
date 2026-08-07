import React, { useState, useMemo } from 'react';
import {
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  DollarSign,
  Coins,
  FileText,
  Download,
  Search,
  Filter,
  Sparkles,
  Cpu,
  Database,
  HardDrive,
  Layers,
  Settings,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  UserCheck,
  FileCheck,
  Briefcase,
  Globe,
  Building2,
  Send,
  Sliders,
  Check,
  Plus,
  Zap,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import {
  CertificationApplication,
  UserRole,
  ExecutiveAlert,
  ReviewerScorecard,
  ProjectHealthStatus,
  SystemHealthMetrics,
  PredictiveForecastItem
} from '../../types';

interface EnterpriseIntelligencePlatformProps {
  applications?: CertificationApplication[];
  currentUserRole?: UserRole;
  currentUserName?: string;
}

export const EnterpriseIntelligencePlatform: React.FC<EnterpriseIntelligencePlatformProps> = ({
  applications = [],
  currentUserRole = 'exec',
  currentUserName = 'Executive Director'
}) => {
  // Navigation & Sub-view states
  const [activeTab, setActiveTab] = useState<
    | 'command_center'
    | 'kpi_engine'
    | 'reviewer_perf'
    | 'project_health'
    | 'alert_engine'
    | 'analytics'
    | 'ai_monitor'
    | 'workload'
    | 'system_health'
    | 'reports'
    | 'predictive'
    | 'compliance'
    | 'search'
    | 'config'
  >('command_center');

  // Filters & Customization states
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedPreset, setSelectedPreset] = useState<string>('executive_board');

  // Widget Visibility State for Personalization
  const [widgetVisibility, setWidgetVisibility] = useState({
    commandCenter: true,
    kpiEngine: true,
    projectHealth: true,
    alertStream: true,
    analytics: true,
    aiMonitor: true,
    workloadBalancer: true,
    systemHealth: true,
    complianceMonitor: true
  });

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'projects' | 'customers' | 'certs' | 'invoices' | 'logs'>('all');
  const [selectedSearchItem, setSelectedSearchItem] = useState<any | null>(null);

  // Report Builder State
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'word' | 'csv'>('pdf');
  const [reportSections, setReportSections] = useState<string[]>(['financials', 'kpis', 'ai_quality', 'reviewer_perf', 'risks']);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  // Executive Alerts State & Handlers
  const [alerts, setAlerts] = useState<ExecutiveAlert[]>([
    {
      id: 'ALT-101',
      timestamp: '2026-08-05 11:42',
      title: 'Project Overdue Alert',
      type: 'project_overdue',
      severity: 'critical',
      message: 'Project GoldPact Digital Bullion (HC-2026-002) is 4 days behind SLA in Scholar Review stage.',
      sourceModule: 'Project Management',
      entityId: 'HC-2026-002',
      isResolved: false
    },
    {
      id: 'ALT-102',
      timestamp: '2026-08-05 10:15',
      title: 'High AI Contradiction Detected',
      type: 'ai_contradiction',
      severity: 'high',
      message: 'Gemini AI flagged 2 contradictions in Crescent Liquidity Mudarabah clause vs Accounting standards.',
      sourceModule: 'AI Assessment Engine',
      entityId: 'HC-2026-003',
      isResolved: false
    },
    {
      id: 'ALT-103',
      timestamp: '2026-08-05 09:30',
      title: 'Invoice Payment Overdue',
      type: 'invoice_overdue',
      severity: 'warning',
      message: 'HalalPay Global Gateway invoice #INV-2026-004 ($14,500) overdue by 12 days.',
      sourceModule: 'Commercial Operations & Finance',
      entityId: 'INV-2026-004',
      isResolved: false
    },
    {
      id: 'ALT-104',
      timestamp: '2026-08-05 08:05',
      title: 'System Queue Spikes',
      type: 'system_failure',
      severity: 'warning',
      message: 'Document OCR processing queue reached 18 items. Automatic worker scaling activated.',
      sourceModule: 'System Infrastructure',
      isResolved: true,
      resolvedBy: 'Auto-Scaler'
    },
    {
      id: 'ALT-105',
      timestamp: '2026-08-04 16:20',
      title: 'Security Anomaly Logged',
      type: 'security_warning',
      severity: 'info',
      message: 'Multiple failed login attempts detected from IP 185.220.101.5 (Blocked by WAF).',
      sourceModule: 'RBAC & Security',
      isResolved: true,
      resolvedBy: 'Security Bot'
    }
  ]);

  // Reviewer Scorecards Data
  const [reviewers, setReviewers] = useState<ReviewerScorecard[]>([
    {
      reviewerId: 'REV-01',
      name: 'Dr. Ahmad Al-Mansoor',
      role: 'scholar',
      assignedProjects: 5,
      completedProjects: 28,
      avgCompletionDays: 3.8,
      aiAgreementRatePct: 94.5,
      qaCorrectionsCount: 1,
      avgConfidenceScore: 97.2,
      pendingTasks: 3,
      productivityTrend: 'improving',
      capacityUtilizationPct: 88,
      availableCapacityHours: 8
    },
    {
      reviewerId: 'REV-02',
      name: 'Dr. Nizam Yaquby',
      role: 'scholar',
      assignedProjects: 3,
      completedProjects: 22,
      avgCompletionDays: 4.2,
      aiAgreementRatePct: 96.0,
      qaCorrectionsCount: 0,
      avgConfidenceScore: 98.4,
      pendingTasks: 2,
      productivityTrend: 'stable',
      capacityUtilizationPct: 65,
      availableCapacityHours: 14
    },
    {
      reviewerId: 'REV-03',
      name: 'Eng. Tariq Al-Hashimi',
      role: 'tech_auditor',
      assignedProjects: 6,
      completedProjects: 34,
      avgCompletionDays: 2.9,
      aiAgreementRatePct: 91.8,
      qaCorrectionsCount: 2,
      avgConfidenceScore: 94.6,
      pendingTasks: 4,
      productivityTrend: 'improving',
      capacityUtilizationPct: 95,
      availableCapacityHours: 2
    },
    {
      reviewerId: 'REV-04',
      name: 'Sarah Jenkins, CPA',
      role: 'business_analyst',
      assignedProjects: 4,
      completedProjects: 31,
      avgCompletionDays: 2.4,
      aiAgreementRatePct: 95.2,
      qaCorrectionsCount: 1,
      avgConfidenceScore: 96.0,
      pendingTasks: 2,
      productivityTrend: 'stable',
      capacityUtilizationPct: 70,
      availableCapacityHours: 12
    },
    {
      reviewerId: 'REV-05',
      name: 'Fatima Al-Zahra',
      role: 'qa',
      assignedProjects: 7,
      completedProjects: 45,
      avgCompletionDays: 1.8,
      aiAgreementRatePct: 98.1,
      qaCorrectionsCount: 0,
      avgConfidenceScore: 99.0,
      pendingTasks: 3,
      productivityTrend: 'improving',
      capacityUtilizationPct: 75,
      availableCapacityHours: 10
    }
  ]);

  // Project Health Monitor Data
  const [projectHealthList, setProjectHealthList] = useState<ProjectHealthStatus[]>([
    {
      projectId: 'HC-2026-001',
      projectName: 'HAQQ Network (Islamic Coin)',
      clientName: 'HAQQ Association (Switzerland)',
      blockchain: 'Cosmos / HAQQ Chain',
      category: 'L1 Blockchain',
      healthCategory: 'Healthy',
      reasons: ['On schedule for annual re-certification', 'All AI assessments passed without critical flags'],
      recommendedActions: ['Proceed to final executive signature release'],
      daysInCurrentStage: 2,
      assignedReviewers: ['Dr. Ahmad Al-Mansoor', 'Eng. Tariq Al-Hashimi']
    },
    {
      projectId: 'HC-2026-002',
      projectName: 'GoldPact Digital Bullion',
      clientName: 'GoldPact DMCC (Dubai)',
      blockchain: 'Ethereum Mainnet',
      category: 'Real World Assets',
      healthCategory: 'Delayed',
      reasons: ['Scholar review stage exceeded target SLA by 4 days', 'DMCC Vault Vault Audit Document unverified'],
      recommendedActions: ['Reassign backup scholar Dr. Yaquby', 'Request uploaded vault inspection certificate'],
      daysInCurrentStage: 9,
      assignedReviewers: ['Dr. Ahmad Al-Mansoor', 'Sarah Jenkins, CPA']
    },
    {
      projectId: 'HC-2026-003',
      projectName: 'Crescent Liquidity Protocol',
      clientName: 'Crescent DeFi Labs (Cayman)',
      blockchain: 'Arbitrum One',
      category: 'DeFi / Mudarabah',
      healthCategory: 'Needs Attention',
      reasons: ['2 high AI contradictions in Mudarabah profit ratio clauses'],
      recommendedActions: ['Trigger AI clause re-scan', 'Schedule scholar clarification call'],
      daysInCurrentStage: 5,
      assignedReviewers: ['Dr. Nizam Yaquby', 'Eng. Tariq Al-Hashimi']
    },
    {
      projectId: 'HC-2026-004',
      projectName: 'HalalPay Global Gateway',
      clientName: 'HalalPay Payments FZ-LLC',
      blockchain: 'Polygon POS',
      category: 'Payments & Settlement',
      healthCategory: 'Blocked',
      reasons: ['Client payment for Stage 2 Technical Audit invoice #INV-2026-004 pending'],
      recommendedActions: ['Notify Commercial Ops for finance payment clearance', 'Send automatic invoice reminder'],
      daysInCurrentStage: 12,
      assignedReviewers: ['Eng. Tariq Al-Hashimi', 'Fatima Al-Zahra']
    },
    {
      projectId: 'HC-2026-005',
      projectName: 'Takaful Chain Mutual Protection',
      clientName: 'Takaful Web3 Cooperative (KSA)',
      blockchain: 'BNB Chain',
      category: 'DeFi / Takaful',
      healthCategory: 'High Risk',
      reasons: ['Potential Sharia Issue Detected — Requires Scholar Review (Detected leverage ratio: 22%)'],
      recommendedActions: ['Flag critical risk finding in report', 'Request smart contract modification from developer'],
      daysInCurrentStage: 7,
      assignedReviewers: ['Dr. Nizam Yaquby', 'Sarah Jenkins, CPA']
    }
  ]);

  // System Health Metrics
  const systemMetrics: SystemHealthMetrics = {
    apiUptimePct: 99.98,
    apiLatencyMs: 42,
    databaseStatus: 'Optimal',
    firestoreStatus: 'Optimal',
    storageUsageGB: 48.2,
    storageLimitGB: 100.0,
    docQueueDepth: 3,
    aiQueueDepth: 1,
    backgroundJobsActive: 12,
    notificationQueueDepth: 0,
    emailQueueDepth: 2,
    errorRatePct: 0.01
  };

  // Predictive Forecast Items
  const forecastItems: PredictiveForecastItem[] = [
    {
      metricName: 'Monthly Recurring Revenue',
      metricKey: 'revenue',
      currentValue: '$85,400 USD',
      projectedValue30d: '$98,200 USD',
      projectedValue90d: '$124,500 USD',
      growthRatePct: 15.0,
      confidencePct: 94,
      trendDirection: 'up',
      insightSummary: 'Strong inflow of RWA bullion and DeFi Mudarabah certification requests in Gulf & SE Asia.'
    },
    {
      metricName: 'Annual Certificate Renewals',
      metricKey: 'renewals',
      currentValue: '14 Due in Q3',
      projectedValue30d: '6 Renewals Expiring',
      projectedValue90d: '18 Renewals Due',
      growthRatePct: 22.4,
      confidencePct: 98,
      trendDirection: 'up',
      insightSummary: '92.8% historical renewal retention rate generating predictable recurring annual audit fees.'
    },
    {
      metricName: 'Reviewer Capacity Demand',
      metricKey: 'capacity',
      currentValue: '78% Utilization',
      projectedValue30d: '86% Utilization',
      projectedValue90d: '94% (Near Bottleneck)',
      growthRatePct: 16.0,
      confidencePct: 91,
      trendDirection: 'up',
      insightSummary: 'Recommend onboarding 1 senior Sharia Scholar & 1 Technical Auditor before Q4 spike.'
    },
    {
      metricName: 'Assessment Inflow Volume',
      metricKey: 'inflow',
      currentValue: '18 Active Projects',
      projectedValue30d: '24 Projects',
      projectedValue90d: '34 Projects',
      growthRatePct: 33.3,
      confidencePct: 89,
      trendDirection: 'up',
      insightSummary: 'Lead conversion rate increased to 68.4% following automated marketing CRM integration.'
    }
  ];

  // Helper calculation for Command Center stats
  const commandCenterStats = useMemo(() => {
    return {
      totalProjects: 48,
      inProgress: 18,
      completed: 26,
      delayed: 4,
      certificatesIssued: 42,
      certificatesExpiring: 6,
      renewalsDue: 8,
      revenueThisMonth: 85400,
      outstandingInvoices: 24500,
      aiAlertsCount: alerts.filter(a => !a.isResolved && a.type === 'ai_contradiction').length,
      criticalRisksCount: projectHealthList.filter(p => p.healthCategory === 'High Risk' || p.healthCategory === 'Critical').length,
      systemHealth: '100% Operational'
    };
  }, [alerts, projectHealthList]);

  // Alert resolution handler
  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId ? { ...a, isResolved: true, resolvedBy: currentUserName, resolvedAt: new Date().toLocaleTimeString() } : a
      )
    );
  };

  // Smart Reassignment Handler for Workload Balancer
  const handleSmartReassign = (projectId: string, targetReviewerName: string) => {
    setProjectHealthList(prev =>
      prev.map(p => (p.projectId === projectId ? { ...p, healthCategory: 'Healthy', reasons: ['Smart re-assigned to ' + targetReviewerName] } : p))
    );
  };

  // Report Export Simulator
  const handleGenerateReport = () => {
    setIsExporting(true);
    setExportSuccessMsg(null);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccessMsg(`HALALCHAIN_${reportType.toUpperCase()}_EXECUTIVE_REPORT_${new Date().toISOString().slice(0, 10)}.${reportFormat}`);
    }, 1200);
  };

  // Search execution
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: any[] = [];

    // Search in Projects
    projectHealthList.forEach(p => {
      if (p.projectName.toLowerCase().includes(query) || p.clientName.toLowerCase().includes(query) || p.blockchain.toLowerCase().includes(query)) {
        results.push({ type: 'Project', title: p.projectName, subtitle: `${p.clientName} • ${p.blockchain}`, id: p.projectId, category: 'projects', data: p });
      }
    });

    // Search in Reviewers
    reviewers.forEach(r => {
      if (r.name.toLowerCase().includes(query) || r.role.toLowerCase().includes(query)) {
        results.push({ type: 'Team Member', title: r.name, subtitle: `Role: ${r.role.toUpperCase()} • Assigned: ${r.assignedProjects}`, id: r.reviewerId, category: 'customers', data: r });
      }
    });

    // Search in Alerts
    alerts.forEach(a => {
      if (a.title.toLowerCase().includes(query) || a.message.toLowerCase().includes(query)) {
        results.push({ type: 'Executive Alert', title: a.title, subtitle: a.message, id: a.id, category: 'logs', data: a });
      }
    });

    return results;
  }, [searchQuery, projectHealthList, reviewers, alerts]);

  return (
    <div className="space-y-8 text-slate-900 pb-16">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white p-6 md:p-8 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-mono font-semibold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ENTERPRISE EXECUTIVE INTELLIGENCE & MONITORING SUITE</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold font-serif text-white tracking-tight">
              HALALCHAIN™ Executive Monitoring & Operational Excellence
            </h1>
            <p className="text-sm text-slate-300 font-mono max-w-3xl">
              Real-time enterprise command center, AI quality performance meters, reviewer productivity scorecards, automated workload balancer, and predictive revenue analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('config')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Personalize Widgets</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Executive Report</span>
            </button>
          </div>
        </div>

        {/* Top Control Bar: Global Filters & Presets */}
        <div className="mt-6 pt-6 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" /> View Preset:
            </span>
            <select
              value={selectedPreset}
              onChange={e => setSelectedPreset(e.target.value)}
              className="bg-[#0B132B] text-white border border-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400"
            >
              <option value="executive_board">Executive Board Overview</option>
              <option value="daily_ops">Daily Operations Standup</option>
              <option value="financial_focus">Financial & Treasury Focus</option>
              <option value="sharia_audit">Sharia & Technical Quality</option>
            </select>

            <span className="text-slate-500">|</span>

            <span className="text-slate-400">Date Range:</span>
            <div className="flex bg-[#0B132B] p-0.5 rounded-lg border border-slate-700">
              {(['7d', '30d', '90d', 'ytd'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                    dateRange === r ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Instant Search Trigger */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Global Enterprise Search..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) setActiveTab('search');
                }}
                className="bg-[#0B132B] text-white placeholder-slate-400 border border-slate-700 rounded-xl pl-8 pr-4 py-1.5 w-60 focus:w-72 transition-all focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 text-xs font-mono font-semibold">
        <button
          onClick={() => setActiveTab('command_center')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'command_center'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>1. Command Center</span>
        </button>

        <button
          onClick={() => setActiveTab('kpi_engine')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'kpi_engine'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>2. KPI Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('reviewer_perf')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'reviewer_perf'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-indigo-400" />
          <span>3. Reviewers</span>
        </button>

        <button
          onClick={() => setActiveTab('project_health')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'project_health'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>4. Project Health</span>
        </button>

        <button
          onClick={() => setActiveTab('alert_engine')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'alert_engine'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>5. Executive Alerts</span>
          {alerts.filter(a => !a.isResolved).length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
              {alerts.filter(a => !a.isResolved).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <PieChart className="w-4 h-4 text-sky-400" />
          <span>6. Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_monitor')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'ai_monitor'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>7. AI Quality</span>
        </button>

        <button
          onClick={() => setActiveTab('workload')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'workload'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>8. Workload</span>
        </button>

        <button
          onClick={() => setActiveTab('system_health')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'system_health'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>9. System Health</span>
        </button>

        <button
          onClick={() => setActiveTab('predictive')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'predictive'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>11. Predictive</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'compliance'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4 text-indigo-400" />
          <span>12. Compliance</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: EXECUTIVE COMMAND CENTER */}
      {/* ========================================================= */}
      {activeTab === 'command_center' && (
        <div className="space-y-8">
          {/* Section 1 Grid: 12 Real-Time Metrics */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                <span>Executive Command Center Metrics</span>
              </h2>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Live System Sync Active • Updated Just Now
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Projects */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>Total Projects</span>
                  <Briefcase className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-slate-900 mt-2">
                  {commandCenterStats.totalProjects}
                </div>
                <div className="text-[11px] font-mono text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% YoY Growth
                </div>
              </div>

              {/* Card 2: Projects In Progress */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>In Progress</span>
                  <Clock className="w-4 h-4 text-sky-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-sky-700 mt-2">
                  {commandCenterStats.inProgress}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">Avg 8.4 days in pipeline</div>
              </div>

              {/* Card 3: Projects Completed */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>Completed</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-emerald-700 mt-2">
                  {commandCenterStats.completed}
                </div>
                <div className="text-[11px] font-mono text-emerald-600 font-bold mt-1">98.2% SLA Compliance</div>
              </div>

              {/* Card 4: Projects Delayed */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>Projects Delayed</span>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-rose-600 mt-2">
                  {commandCenterStats.delayed}
                </div>
                <div className="text-[11px] font-mono text-rose-600 font-bold mt-1">Action required in Health Monitor</div>
              </div>

              {/* Card 5: Certificates Issued */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>Certificates Issued</span>
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-amber-700 mt-2">
                  {commandCenterStats.certificatesIssued}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">Immutable Blockchain Hashes</div>
              </div>

              {/* Card 6: Certificates Expiring */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>Certificates Expiring</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-amber-600 mt-2">
                  {commandCenterStats.certificatesExpiring}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">Expiring within 60 days</div>
              </div>

              {/* Card 7: Renewals Due */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>Renewals Due</span>
                  <RefreshCw className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-indigo-700 mt-2">
                  {commandCenterStats.renewalsDue}
                </div>
                <div className="text-[11px] font-mono text-indigo-600 font-bold mt-1">92.8% Retention Rate</div>
              </div>

              {/* Card 8: Revenue This Month */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>Revenue This Month</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-slate-900 mt-2">
                  ${commandCenterStats.revenueThisMonth.toLocaleString()} USD
                </div>
                <div className="text-[11px] font-mono text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs Last Month
                </div>
              </div>

              {/* Card 9: Outstanding Invoices */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>Outstanding Invoices</span>
                  <Coins className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-amber-700 mt-2">
                  ${commandCenterStats.outstandingInvoices.toLocaleString()} USD
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">3 Accounts Pending Release</div>
              </div>

              {/* Card 10: AI Alerts */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>AI Alerts</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-amber-600 mt-2">
                  {commandCenterStats.aiAlertsCount}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">Contradiction Scans</div>
              </div>

              {/* Card 11: Critical Risks */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-400/50 transition">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-semibold">
                  <span>Critical Risks</span>
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-serif text-rose-600 mt-2">
                  {commandCenterStats.criticalRisksCount}
                </div>
                <div className="text-[11px] font-mono text-rose-600 font-bold mt-1">Requires Executive Approval</div>
              </div>

              {/* Card 12: System Health */}
              <div className="bg-[#0B132B] text-white p-5 rounded-2xl border border-amber-500/30 shadow-md">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase font-semibold">
                  <span>System Health</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl md:text-2xl font-bold font-mono text-emerald-400 mt-2">
                  {commandCenterStats.systemHealth}
                </div>
                <div className="text-[11px] font-mono text-slate-300 mt-1">All 8 Core Engine Services OK</div>
              </div>
            </div>
          </div>

          {/* Combined Overview Grid: Project Health Quick Matrix & Executive Alerts Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Project Health Preview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span>Project Health Monitor Overview</span>
                </h3>
                <button
                  onClick={() => setActiveTab('project_health')}
                  className="text-xs font-mono font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  View All ({projectHealthList.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {projectHealthList.slice(0, 4).map(p => (
                  <div key={p.projectId} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{p.projectName}</span>
                        <span className="text-xs font-mono text-slate-500">({p.projectId})</span>
                      </div>
                      <p className="text-xs text-slate-600">{p.reasons[0]}</p>
                      <div className="text-[11px] font-mono text-slate-500 flex items-center gap-3 mt-1">
                        <span>Chain: {p.blockchain}</span>
                        <span>•</span>
                        <span>Stage: {p.daysInCurrentStage}d elapsed</span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold whitespace-nowrap ${
                        p.healthCategory === 'Healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.healthCategory === 'Needs Attention'
                          ? 'bg-amber-100 text-amber-800'
                          : p.healthCategory === 'Delayed'
                          ? 'bg-orange-100 text-orange-800'
                          : p.healthCategory === 'Blocked'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.healthCategory}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Live Alerts Preview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Executive Live Alert Engine</span>
                </h3>
                <button
                  onClick={() => setActiveTab('alert_engine')}
                  className="text-xs font-mono font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  Manage Stream ({alerts.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {alerts.slice(0, 4).map(a => (
                  <div key={a.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{a.title}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          a.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                          a.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                          a.severity === 'warning' ? 'bg-orange-100 text-orange-800' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {a.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{a.message}</p>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        {a.timestamp} • {a.sourceModule}
                      </div>
                    </div>

                    {!a.isResolved ? (
                      <button
                        onClick={() => handleResolveAlert(a.id)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Resolved
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: COMPANY KPI ENGINE */}
      {/* ========================================================= */}
      {activeTab === 'kpi_engine' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Company KPI Engine & Performance Benchmarks</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Automated continuous calculation of operational efficiency, review speeds, customer satisfaction, and revenue margin.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All 11 Core KPIs Meeting Target SLA</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* KPI 1: Average Assessment Duration */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">1. Average Assessment Duration</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-slate-900">11.4 Days</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Target: &lt;14 Days
                </span>
              </div>
              <p className="text-xs text-slate-600">End-to-end elapsed time from client document submission to final certificate emission.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '81%' }} />
              </div>
            </div>

            {/* KPI 2: Average Review Time */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">2. Average Review Time</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-slate-900">3.2 Days</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Target: &lt;4.0 Days
                </span>
              </div>
              <p className="text-xs text-slate-600">Average review duration for Sharia Scholars and Technical Auditors per milestone.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            {/* KPI 3: Average Customer Response Time */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">3. Customer Response Time</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-slate-900">4.8 Hours</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Target: &lt;6.0 Hours
                </span>
              </div>
              <p className="text-xs text-slate-600">Average client response time for clarification requests and document re-submissions.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            {/* KPI 4: Reviewer Productivity */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">4. Reviewer Productivity Index</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-indigo-700">94.2 / 100</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Optimal Range
                </span>
              </div>
              <p className="text-xs text-slate-600">Combined productivity score across all 5 active reviewers evaluating velocity and accuracy.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            {/* KPI 5: QA Rework Percentage */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">5. QA Rework Percentage</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-emerald-700">3.8%</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Target: &lt;5.0%
                </span>
              </div>
              <p className="text-xs text-slate-600">Percentage of audit reports returned by QA officers for scholar or technical revisions.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>

            {/* KPI 6: Certificate Approval Rate */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">6. Certificate Approval Rate</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-amber-700">96.5%</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  High Rigor
                </span>
              </div>
              <p className="text-xs text-slate-600">Percentage of submitted applications approved for final certificate release post-audit.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '96.5%' }} />
              </div>
            </div>

            {/* KPI 7: Customer Satisfaction */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">7. Customer Satisfaction (CSAT)</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-slate-900">4.9 / 5.0</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ★ World Class
                </span>
              </div>
              <p className="text-xs text-slate-600">Client satisfaction rating recorded upon certificate delivery and portal access.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>

            {/* KPI 8: Renewal Rate */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">8. Annual Renewal Retention</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-indigo-700">92.8%</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Top Tier SaaS
                </span>
              </div>
              <p className="text-xs text-slate-600">Client re-subscription rate for annual Sharia governance and re-audit certification.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '92.8%' }} />
              </div>
            </div>

            {/* KPI 9: Lead Conversion Rate */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">9. Lead Conversion Rate</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-slate-900">68.4%</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  +8.2% MoM
                </span>
              </div>
              <p className="text-xs text-slate-600">Inbound marketing lead conversion to signed audit contract stage.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '68.4%' }} />
              </div>
            </div>

            {/* KPI 10: Revenue Growth */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">10. Revenue Growth (MoM)</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-emerald-700">+18.6%</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Accelerating
                </span>
              </div>
              <p className="text-xs text-slate-600">Month-over-month platform revenue growth rate driven by high-tier RWA projects.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            {/* KPI 11: Profit Margin */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">11. Net Operating Profit Margin</div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-serif text-amber-700">78.4%</div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Healthy Cashflow
                </span>
              </div>
              <p className="text-xs text-slate-600">Net operating margin after scholar honorariums and cloud infrastructure overhead.</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78.4%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: REVIEWER PERFORMANCE */}
      {/* ========================================================= */}
      {activeTab === 'reviewer_perf' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Reviewer Performance & Audit Scorecards</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Individual productivity, AI agreement rate, completion velocity, and QA correction tracking for Scholars & Auditors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold font-serif text-lg">Active Audit Team Scorecards</h3>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {reviewers.length} Reviewers Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                      <th className="p-4 font-semibold">Reviewer Name & Role</th>
                      <th className="p-4 font-semibold">Assigned</th>
                      <th className="p-4 font-semibold">Completed</th>
                      <th className="p-4 font-semibold">Avg Time</th>
                      <th className="p-4 font-semibold">AI Agreement</th>
                      <th className="p-4 font-semibold">QA Corrections</th>
                      <th className="p-4 font-semibold">Avg Confidence</th>
                      <th className="p-4 font-semibold">Capacity</th>
                      <th className="p-4 font-semibold">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {reviewers.map(r => (
                      <tr key={r.reviewerId} className="hover:bg-slate-50/80 transition">
                        <td className="p-4">
                          <div className="font-bold text-sm text-slate-900">{r.name}</div>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 uppercase">
                            {r.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-900">{r.assignedProjects} Projects</td>
                        <td className="p-4 text-emerald-700 font-bold">{r.completedProjects} Done</td>
                        <td className="p-4">{r.avgCompletionDays} Days</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900">{r.aiAgreementRatePct}%</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded font-bold ${r.qaCorrectionsCount === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {r.qaCorrectionsCount} QA Return
                          </span>
                        </td>
                        <td className="p-4 font-bold text-indigo-700">{r.avgConfidenceScore}%</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{r.capacityUtilizationPct}%</span>
                            <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${r.capacityUtilizationPct > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                style={{ width: `${r.capacityUtilizationPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" /> Improving
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PROJECT HEALTH MONITOR */}
      {/* ========================================================= */}
      {activeTab === 'project_health' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Project Health & SLA Risk Monitor</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Automatic multi-variate classification of project status with detailed root causes and recommended executive actions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {projectHealthList.map(p => (
              <div key={p.projectId} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold font-serif text-slate-900">{p.projectName}</span>
                      <span className="text-xs font-mono text-slate-500">ID: {p.projectId}</span>
                      <span className="text-xs font-mono bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {p.blockchain}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Client: {p.clientName} • Category: {p.category}</p>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold ${
                      p.healthCategory === 'Healthy'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : p.healthCategory === 'Needs Attention'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : p.healthCategory === 'Delayed'
                        ? 'bg-orange-100 text-orange-800 border border-orange-300'
                        : p.healthCategory === 'Blocked'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    STATUS: {p.healthCategory.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Root Causes & Risk Analysis:
                    </span>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside">
                      {p.reasons.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/50">
                    <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Recommended Action Plan:
                    </span>
                    <ul className="space-y-1 text-amber-900 font-semibold list-disc list-inside">
                      {p.recommendedActions.map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Assigned Reviewers: {p.assignedReviewers.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSmartReassign(p.projectId, 'Dr. Nizam Yaquby')}
                      className="bg-[#0B132B] hover:bg-slate-800 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Trigger Smart Re-assign
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: EXECUTIVE ALERT ENGINE */}
      {/* ========================================================= */}
      {activeTab === 'alert_engine' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Executive Real-Time Alert Stream</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Automated multi-channel notifications triggered on SLA delays, critical findings, AI contradictions, and invoice overdues.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {alerts.map(a => (
              <div
                key={a.id}
                className={`p-6 rounded-3xl border transition flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  a.isResolved ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-amber-400/40 shadow-sm'
                }`}
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-3">
                    <span className="font-bold font-serif text-lg text-slate-900">{a.title}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        a.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : a.severity === 'high'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {a.severity.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID: {a.id}</span>
                  </div>

                  <p className="text-sm text-slate-700">{a.message}</p>

                  <div className="text-xs font-mono text-slate-500 flex items-center gap-4">
                    <span>Source: {a.sourceModule}</span>
                    <span>•</span>
                    <span>Timestamp: {a.timestamp}</span>
                    {a.entityId && (
                      <>
                        <span>•</span>
                        <span>Entity ID: {a.entityId}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  {!a.isResolved ? (
                    <button
                      onClick={() => handleResolveAlert(a.id)}
                      className="bg-[#0B132B] hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-xl font-bold transition cursor-pointer"
                    >
                      Acknowledge & Dismiss
                    </button>
                  ) : (
                    <div className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Resolved by {a.resolvedBy || 'Admin'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: ENTERPRISE ANALYTICS */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Enterprise Analytics & Breakdown Dashboards</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Cross-sectional analysis of platform revenue, blockchain distributions, risk profiles, and sector performance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Breakdown 1: Revenue by Country */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold font-serif text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-500" /> Revenue by Country & Region
              </h3>
              <div className="space-y-3 text-xs font-mono">
                {[
                  { country: 'United Arab Emirates (UAE)', amount: '$38,400', pct: 45 },
                  { country: 'Saudi Arabia (KSA)', amount: '$24,200', pct: 28 },
                  { country: 'Malaysia & SE Asia', amount: '$12,800', pct: 15 },
                  { country: 'United Kingdom & Switzerland', amount: '$10,000', pct: 12 }
                ].map(item => (
                  <div key={item.country} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-700">{item.country}</span>
                      <span className="font-bold text-slate-900">{item.amount} ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown 2: Revenue by Service */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold font-serif text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" /> Revenue by Certification Service
              </h3>
              <div className="space-y-3 text-xs font-mono">
                {[
                  { service: 'Full Sharia & Technical Audit', amount: '$42,000', pct: 49 },
                  { service: 'Real World Asset (RWA) Cert', amount: '$22,500', pct: 26 },
                  { service: 'Annual Governance Subscription', amount: '$12,400', pct: 15 },
                  { service: 'Smart Contract Only Audit', amount: '$8,500', pct: 10 }
                ].map(item => (
                  <div key={item.service} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-700">{item.service}</span>
                      <span className="font-bold text-slate-900">{item.amount} ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown 3: Projects by Blockchain */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold font-serif text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Projects by Blockchain Ecosystem
              </h3>
              <div className="space-y-3 text-xs font-mono">
                {[
                  { chain: 'Cosmos / HAQQ Chain', count: 18, pct: 38 },
                  { chain: 'Ethereum Mainnet', count: 14, pct: 29 },
                  { chain: 'Arbitrum One / L2', count: 8, pct: 17 },
                  { chain: 'Polygon & BNB Chain', count: 8, pct: 16 }
                ].map(item => (
                  <div key={item.chain} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-700">{item.chain}</span>
                      <span className="font-bold text-slate-900">{item.count} Projects ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: AI PERFORMANCE MONITOR */}
      {/* ========================================================= */}
      {activeTab === 'ai_monitor' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">AI Quality & Precision Performance Monitor</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Continuous monitoring of Gemini 2.5 Flash / Pro model accuracy, agreement rates, false positive rates, and processing latency.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">Average AI Confidence</div>
              <div className="text-3xl font-bold font-serif text-emerald-700">96.4%</div>
              <p className="text-[11px] text-slate-500 font-mono">Verified across 1,420 clause scans</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">Reviewer Acceptance Rate</div>
              <div className="text-3xl font-bold font-serif text-slate-900">94.8%</div>
              <p className="text-[11px] text-emerald-600 font-mono font-bold">High human-AI alignment</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">False Positive Rate</div>
              <div className="text-3xl font-bold font-serif text-amber-700">1.8%</div>
              <p className="text-[11px] text-slate-500 font-mono">Target: &lt;3.0%</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">Avg Processing Latency</div>
              <div className="text-3xl font-bold font-serif text-indigo-700">0.42s</div>
              <p className="text-[11px] text-slate-500 font-mono">Gemini 2.5 Flash Engine</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 8: WORKLOAD BALANCER */}
      {/* ========================================================= */}
      {activeTab === 'workload' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Workload Balancer & Resource Capacity Engine</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Real-time capacity tracking, identifying overloaded reviewers, idle capacity, and automated load rebalancing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold font-serif text-lg text-slate-900">Reviewer Capacity Monitor</h3>
              <div className="space-y-4 text-xs font-mono">
                {reviewers.map(r => (
                  <div key={r.reviewerId} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{r.name} ({r.role.toUpperCase()})</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          r.capacityUtilizationPct > 85
                            ? 'bg-rose-100 text-rose-800'
                            : r.capacityUtilizationPct < 40
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {r.capacityUtilizationPct}% Capacity
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${r.capacityUtilizationPct > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${r.capacityUtilizationPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Assigned: {r.assignedProjects} Projects</span>
                      <span>Available: {r.availableCapacityHours} Hours</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold font-serif text-lg text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> AI Load Reassignment Suggestions
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
                  <div className="font-bold text-amber-900">Suggested Action #1: Reassign Project HC-2026-002</div>
                  <p className="text-slate-700">
                    Dr. Ahmad Al-Mansoor is at 88% capacity. Reassigning to Dr. Nizam Yaquby (65% capacity) will reduce completion time by 2.4 days.
                  </p>
                  <button
                    onClick={() => handleSmartReassign('HC-2026-002', 'Dr. Nizam Yaquby')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    Execute Reassignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 9: SYSTEM HEALTH DASHBOARD */}
      {/* ========================================================= */}
      {activeTab === 'system_health' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">System Infrastructure Health & Queues</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Real-time telemetry for API servers, Cloud SQL, Firestore, Document OCR queue, Gemini AI workers, and email gateways.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-500 uppercase font-semibold">API Server Status</span>
              <div className="text-xl font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> {systemMetrics.apiUptimePct}% Uptime
              </div>
              <p className="text-slate-500">Latency: {systemMetrics.apiLatencyMs}ms</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-500 uppercase font-semibold">Database & Firestore</span>
              <div className="text-xl font-bold text-emerald-600 flex items-center gap-2">
                <Database className="w-5 h-5" /> {systemMetrics.databaseStatus}
              </div>
              <p className="text-slate-500">PostgreSQL + Firestore Online</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-500 uppercase font-semibold">Cloud Storage</span>
              <div className="text-xl font-bold text-slate-900">
                {systemMetrics.storageUsageGB} GB / {systemMetrics.storageLimitGB} GB
              </div>
              <p className="text-slate-500">48.2% Storage Utilized</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-500 uppercase font-semibold">Document Queue Depth</span>
              <div className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                <FileText className="w-5 h-5" /> {systemMetrics.docQueueDepth} Queued
              </div>
              <p className="text-slate-500">Worker processing active</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 10: EXECUTIVE REPORT BUILDER */}
      {/* ========================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Executive Report Builder & Exporter</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Generate and export custom board dossiers, financial summaries, and Sharia compliance reports in PDF, Excel, Word, or CSV formats.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Select Report Cadence:</label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-400"
                >
                  <option value="daily">Daily Operational Briefing</option>
                  <option value="weekly">Weekly Audit Digest</option>
                  <option value="monthly">Monthly Executive Summary & Revenue Report</option>
                  <option value="quarterly">Quarterly Board Performance Presentation</option>
                  <option value="yearly">Yearly Sharia Governance & Security Dossier</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700">Export Format:</label>
                <select
                  value={reportFormat}
                  onChange={e => setReportFormat(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-400"
                >
                  <option value="pdf">PDF Document (.pdf)</option>
                  <option value="excel">Excel Spreadsheet (.xlsx)</option>
                  <option value="word">Word Dossier (.docx)</option>
                  <option value="csv">Raw CSV Data (.csv)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleGenerateReport}
                disabled={isExporting}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-mono text-sm font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
              >
                {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{isExporting ? 'Compiling Report...' : 'Compile & Download Report'}</span>
              </button>

              {exportSuccessMsg && (
                <div className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Report Generated: {exportSuccessMsg}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 11: PREDICTIVE ANALYTICS */}
      {/* ========================================================= */}
      {activeTab === 'predictive' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Predictive Analytics & Forecasting Models</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                AI statistical forecasting for revenue growth, certificate renewals, reviewer capacity demand, and client acquisition.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {forecastItems.map(item => (
              <div key={item.metricKey} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-serif text-lg text-slate-900">{item.metricName}</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    +{item.growthRatePct}% Forecasted
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Current:</span>
                    <span className="font-bold text-slate-900 text-sm">{item.currentValue}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">30-Day Proj:</span>
                    <span className="font-bold text-amber-700 text-sm">{item.projectedValue30d}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">90-Day Proj:</span>
                    <span className="font-bold text-emerald-700 text-sm">{item.projectedValue90d}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-mono">{item.insightSummary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 12: COMPLIANCE MONITOR */}
      {/* ========================================================= */}
      {activeTab === 'compliance' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Enterprise Compliance & Audit Readiness Monitor</h2>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Continuous compliance check across incomplete assessments, missing evidence items, expired docs, and pending approvals.
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-slate-500 block">Assessment Workflow Completion</span>
              <span className="text-2xl font-bold font-serif text-emerald-600">97.4%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs font-mono">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-500 uppercase font-semibold">Incomplete Assessments</span>
              <div className="text-2xl font-bold text-slate-900">3 Items</div>
              <p className="text-slate-500">Document upload phase</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-500 uppercase font-semibold">Missing Evidence Items</span>
              <div className="text-2xl font-bold text-amber-600">2 Pending</div>
              <p className="text-slate-500">Client action required</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-500 uppercase font-semibold">Expired Documents</span>
              <div className="text-2xl font-bold text-rose-600">0 Critical</div>
              <p className="text-emerald-600 font-bold">100% Up-to-date</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SEARCH RESULTS VIEW */}
      {/* ========================================================= */}
      {activeTab === 'search' && (
        <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-500" /> Enterprise Search Results for &quot;{searchQuery}&quot;
          </h2>

          {filteredSearchResults.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              No matching entity found for &quot;{searchQuery}&quot;. Try searching for &quot;GoldPact&quot;, &quot;Ahmad&quot;, or &quot;HC-2026&quot;.
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {filteredSearchResults.map(res => (
                <div
                  key={res.id}
                  onClick={() => setSelectedSearchItem(res)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/30 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded mr-2">
                      {res.type}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{res.title}</span>
                    <p className="text-slate-500 mt-1">{res.subtitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* PERSONALIZATION & CONFIGURATION MODAL / TAB */}
      {/* ========================================================= */}
      {activeTab === 'config' && (
        <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm font-mono text-xs">
          <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-500" /> Personalize Executive Dashboard Layout
          </h2>
          <p className="text-slate-500">Toggle individual monitoring widgets on or off to tailor your executive command dashboard.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(widgetVisibility).map(([key, isVisible]) => (
              <label key={key} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer">
                <span className="font-bold text-slate-800 uppercase">{key.replace(/([A-Z])/g, ' $1')}</span>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={e => setWidgetVisibility(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Mail,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  DollarSign,
  FileText,
  RefreshCw,
  Search,
  Filter,
  Star,
  Zap,
  Lock,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Award,
  Layers,
  HelpCircle,
  Eye,
  Plus,
  Play
} from 'lucide-react';
import {
  CertificationApplication,
  CustomerHealthScoreDetails,
  SalesOpportunity,
  RenewalOpportunity,
  CustomerSatisfactionSurvey,
  BusinessAutomationRule,
  AutomationAuditLog,
  EmailHistoryEntry,
  EmailTemplate,
  UserRole
} from '../../types';
import {
  INITIAL_AUTOMATION_RULES,
  INITIAL_AUTOMATION_AUDIT_LOGS,
  INITIAL_CSAT_SURVEYS,
  INITIAL_SALES_OPPORTUNITIES,
  calculateCustomerHealthScore,
  checkDuplicateEmail,
  generateAiCustomerBriefing,
  generateAiFollowUpEmailCopy,
  generateAiUpsellStrategy,
  generateAuditHash
} from '../../lib/customerSuccessEngine';
import { DEFAULT_EMAIL_TEMPLATES, buildBrandedHtmlEmail } from '../../lib/emailTemplateService';
import { exportReport } from '../../lib/reportEngine';
import { buildCustomerSuccessReportOptions } from '../../lib/reportGenerators';

interface CustomerSuccessPlatformViewProps {
  applications: CertificationApplication[];
  currentUserRole?: UserRole;
  currentUserName?: string;
  onRefreshData?: () => void;
}

export const CustomerSuccessPlatformView: React.FC<CustomerSuccessPlatformViewProps> = ({
  applications = [],
  currentUserRole = 'sales',
  currentUserName = 'Youssef Al-Mansoor',
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'c360' | 'pipeline' | 'email_automation' | 'renewals' | 'automation_rules' | 'csat' | 'ai_assistant'
  >('overview');

  // Core State
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>(INITIAL_SALES_OPPORTUNITIES);
  const [automationRules, setAutomationRules] = useState<BusinessAutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [auditLogs, setAuditLogs] = useState<AutomationAuditLog[]>(INITIAL_AUTOMATION_AUDIT_LOGS);
  const [csatSurveys, setCsatSurveys] = useState<CustomerSatisfactionSurvey[]>(INITIAL_CSAT_SURVEYS);
  const [emailHistory, setEmailHistory] = useState<EmailHistoryEntry[]>([]);

  // Selected Customer for C360 / Emailing
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  // Email Automation State
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(DEFAULT_EMAIL_TEMPLATES[0]);
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [overrideDuplicate, setOverrideDuplicate] = useState<boolean>(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // AI Assistant Modal/Output State
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Filter Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync recipient and variables when selectedApp or selectedTemplate changes
  useEffect(() => {
    if (selectedApp) {
      setRecipientEmail(selectedApp.contactEmail || 'contact@project.io');
      const sub = selectedTemplate.subject
        .replace(/\{\{Project Name\}\}/g, selectedApp.projectName || selectedApp.companyName)
        .replace(/\{\{Company Name\}\}/g, selectedApp.companyName)
        .replace(/\{\{Token Name\}\}/g, selectedApp.tokenSymbol || 'TOKEN');
      setEmailSubject(sub);

      const html = selectedTemplate.htmlContent
        .replace(/\{\{Project Name\}\}/g, selectedApp.projectName || selectedApp.companyName)
        .replace(/\{\{Sales Person\}\}/g, currentUserName)
        .replace(/\{\{Current Date\}\}/g, new Date().toLocaleDateString('en-US'))
        .replace(/\{\{HalalChain Website\}\}/g, 'https://halalchain.io');
      setEmailBody(html);

      // Check Duplicate
      const dupCheck = checkDuplicateEmail(emailHistory, selectedApp.contactEmail || '', selectedTemplate.id, 48);
      if (dupCheck.isDuplicate) {
        setDuplicateWarning(`Warning: An email with template "${selectedTemplate.name}" was sent to ${selectedApp.contactEmail} on ${dupCheck.lastSentDate}.`);
      } else {
        setDuplicateWarning(null);
      }
    }
  }, [selectedAppId, selectedTemplate]);

  // Handle Manual Trigger of Rules Engine
  const handleRunRulesEngine = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      const newLog: AutomationAuditLog = {
        id: `aut-log-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        ruleId: 'rule-inactivity-3d',
        ruleName: 'Manual Full Pipeline Business Rules Audit',
        triggeredBy: currentUserName,
        targetEntityId: selectedApp?.id || 'GLOBAL',
        targetEntityName: selectedApp?.projectName || 'All Active Projects',
        actionTaken: 'Evaluated inactivity, renewal deadlines, missing documents, and unpaid invoices.',
        result: 'Success',
        reason: 'Manual execution request by staff officer',
        digitalSignatureHash: generateAuditHash('Manual Rules Run', selectedApp?.projectName || 'Global', now)
      };

      setAuditLogs([newLog, ...auditLogs]);
      setIsGeneratingAi(false);
      setActionMessage('Business Automation Engine executed successfully! All rules evaluated & logged.');
      setTimeout(() => setActionMessage(null), 4000);
    }, 800);
  };

  // Handle Send Email with anti-duplicate enforcement
  const handleSendEmail = () => {
    if (duplicateWarning && !overrideDuplicate) {
      alert('Duplicate email protection enabled. Check "Override Duplicate Protection" to force sending.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const now = new Date();
      const newEntry: EmailHistoryEntry = {
        id: `eml-${Date.now()}`,
        prospectId: selectedApp?.id || 'custom',
        masterId: selectedApp?.halalChainId || 'HC-2026-000',
        companyName: selectedApp?.companyName || 'Valued Client',
        employeeName: currentUserName,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emailTemplate: selectedTemplate.name,
        templateId: selectedTemplate.id,
        recipient: recipientEmail,
        subject: emailSubject,
        deliveryStatus: 'Delivered',
        openStatus: 'Opened',
        clickStatus: 'No Clicks',
        replyStatus: 'No Reply',
        nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        renderedHtml: buildBrandedHtmlEmail(emailBody, {
          '{{Project Name}}': selectedApp?.projectName || 'Project',
          '{{Sales Person}}': currentUserName
        })
      };

      setEmailHistory([newEntry, ...emailHistory]);

      // Add audit log
      const auditLog: AutomationAuditLog = {
        id: `aut-${Date.now()}`,
        timestamp: now.toISOString(),
        ruleId: 'smart-email-dispatch',
        ruleName: 'Smart Email Automation Outreach Dispatch',
        triggeredBy: currentUserName,
        targetEntityId: selectedApp?.id || 'N/A',
        targetEntityName: selectedApp?.projectName || recipientEmail,
        actionTaken: `Sent "${selectedTemplate.name}" to ${recipientEmail}`,
        result: 'Success',
        reason: 'Staff approved outreach dispatch',
        digitalSignatureHash: generateAuditHash('Email Send', recipientEmail, now.toISOString())
      };
      setAuditLogs([auditLog, ...auditLogs]);

      setIsSending(false);
      setShowEmailPreviewModal(false);
      setActionMessage(`Email successfully dispatched to ${recipientEmail}!`);
      setTimeout(() => setActionMessage(null), 4000);
    }, 1000);
  };

  // Stage transition handler for pipeline
  const handleUpdateStage = (oppId: string, newStage: SalesOpportunity['stage']) => {
    setOpportunities(
      opportunities.map((opp) => {
        if (opp.id === oppId) {
          const updatedHistory = [
            ...opp.stageHistory,
            {
              stage: newStage,
              timestamp: new Date().toISOString(),
              note: `Stage changed to ${newStage}`,
              updatedBy: currentUserName
            }
          ];
          return { ...opp, stage: newStage, stageHistory: updatedHistory, lastActivityDate: new Date().toISOString() };
        }
        return opp;
      })
    );

    // Create Audit Log
    const now = new Date().toISOString();
    const log: AutomationAuditLog = {
      id: `aut-opp-${Date.now()}`,
      timestamp: now,
      ruleId: 'pipeline-stage-change',
      ruleName: 'Sales Pipeline Stage Transition',
      triggeredBy: currentUserName,
      targetEntityId: oppId,
      targetEntityName: opportunities.find((o) => o.id === oppId)?.projectName || 'Opportunity',
      actionTaken: `Updated stage to ${newStage}`,
      result: 'Success',
      reason: 'Staff manual pipeline update',
      digitalSignatureHash: generateAuditHash('Pipeline Stage', oppId, now)
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Export Customer Success Report
  const handleExportCSReport = () => {
    const reportOpts = buildCustomerSuccessReportOptions(
      applications,
      opportunities,
      automationRules,
      auditLogs,
      csatSurveys,
      currentUserName
    );
    exportReport(reportOpts);
  };

  // Compute overall Customer Health Metrics
  const healthSummaries = applications.map((app) => ({
    app,
    health: calculateCustomerHealthScore(app)
  }));

  const excellentCount = healthSummaries.filter((h) => h.health.status === 'Excellent').length;
  const healthyCount = healthSummaries.filter((h) => h.health.status === 'Healthy').length;
  const needsAttentionCount = healthSummaries.filter((h) => h.health.status === 'Needs Attention').length;
  const highRiskCount = healthSummaries.filter((h) => h.health.status === 'High Risk').length;

  const totalPipelineRevenue = opportunities.reduce((sum, o) => sum + (o.estimatedValueUSD || 0), 0);
  const avgCsat = csatSurveys.length > 0
    ? (csatSurveys.reduce((sum, c) => sum + c.ratingStars, 0) / csatSurveys.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Enterprise Customer Experience & Success
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customer Success & Business Automation Platform
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Automated customer journey tracking, health scoring, renewal management, sales opportunity pipeline, and AI-assisted engagement — with full human control.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunRulesEngine}
              disabled={isGeneratingAi}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              Run Automation Rules
            </button>
            <button
              onClick={handleExportCSReport}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              Export CS Report
            </button>
          </div>
        </div>

        {/* Global Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Active Customers</div>
            <div className="text-xl font-bold text-white mt-1">{applications.length} Accounts</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Pipeline Value</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">${totalPipelineRevenue.toLocaleString()} USD</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Avg Customer CSAT</div>
            <div className="text-xl font-bold text-amber-400 mt-1 flex items-center gap-1">
              ★ {avgCsat} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Customer Health</div>
            <div className="text-xl font-bold text-emerald-300 mt-1">
              {excellentCount + healthyCount} <span className="text-xs text-slate-400 font-normal">/ {applications.length} Healthy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toast Message */}
      {actionMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-4 rounded-xl flex items-center gap-3 text-sm animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-medium">{actionMessage}</span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'overview', label: 'CS Dashboard', icon: BarChart3 },
          { id: 'c360', label: 'Customer 360', icon: Users },
          { id: 'pipeline', label: 'Sales & Renewal Pipeline', icon: TrendingUp },
          { id: 'email_automation', label: 'Smart Email Automation', icon: Mail },
          { id: 'renewals', label: 'Renewal Management', icon: Clock },
          { id: 'automation_rules', label: 'Rules & Audit Log', icon: Zap },
          { id: 'csat', label: 'CSAT & Feedback', icon: Star },
          { id: 'ai_assistant', label: 'AI Success Assistant', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-xs whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW / CS DASHBOARD ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Health Distribution & Risk Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Excellent Health</span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{excellentCount}</div>
              <p className="text-xs text-slate-500 mt-1">Score 85–100 (Low risk, prompt response)</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Healthy</span>
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{healthyCount}</div>
              <p className="text-xs text-slate-500 mt-1">Score 70–84 (On-track, standard pace)</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Needs Attention</span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              </div>
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">{needsAttentionCount}</div>
              <p className="text-xs text-slate-500 mt-1">Score 50–69 (Pending docs or response)</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">High Risk</span>
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              </div>
              <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">{highRiskCount}</div>
              <p className="text-xs text-slate-500 mt-1">Score &lt;50 (Inactivity / Payment hold)</p>
            </div>
          </div>

          {/* Customer Health Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Customer Account Health Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time health score evaluation across 5 operational dimensions</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Company & Project</th>
                    <th className="py-3.5 px-4">Stage</th>
                    <th className="py-3.5 px-4">Health Score</th>
                    <th className="py-3.5 px-4">Dimension Breakdown</th>
                    <th className="py-3.5 px-4">Risk Factors</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {healthSummaries
                    .filter((h) =>
                      h.app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      h.app.projectName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(({ app, health }) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{app.companyName}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{app.projectName} ({app.tokenSymbol})</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 capitalize">
                            {app.stage.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-black text-sm px-2.5 py-1 rounded-lg ${
                                health.status === 'Excellent'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : health.status === 'Healthy'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : health.status === 'Needs Attention'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {health.overallScore} / 100
                            </span>
                            <span className="text-[11px] text-slate-500">{health.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1 w-44">
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>Comm: {health.communicationScore}%</span>
                              <span>Docs: {health.documentScore}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  health.overallScore > 75 ? 'bg-emerald-500' : health.overallScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${health.overallScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {health.keyRisks.length > 0 ? (
                            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>{health.keyRisks[0]}</span>
                            </div>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> No Active Risks
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedAppId(app.id);
                              setActiveTab('c360');
                            }}
                            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            View C360
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: CUSTOMER 360 PROFILE ================= */}
      {activeTab === 'c360' && selectedApp && (
        <div className="space-y-6">
          {/* Customer Selection Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                {selectedApp.companyName.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {selectedApp.companyName}
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-mono">
                    {selectedApp.halalChainId || 'HC-CUST-360'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Project: {selectedApp.projectName} ({selectedApp.tokenSymbol}) • {selectedApp.country || 'Global'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-500">Switch Customer Account:</label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.companyName} ({a.projectName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* C360 Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Details & Assessment Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Overview Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Company & Contract Contact Matrix
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl">
                    <div className="text-slate-400 font-medium">Primary Contact Email</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-1">{selectedApp.contactEmail || 'N/A'}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl">
                    <div className="text-slate-400 font-medium">Official Website</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                      {selectedApp.websiteUrl || 'https://halalchain.io'}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl">
                    <div className="text-slate-400 font-medium">Smart Contract Address</div>
                    <div className="font-bold font-mono text-slate-900 dark:text-white mt-1 truncate">
                      {selectedApp.contractAddress || '0x71C...392A'}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl">
                    <div className="text-slate-400 font-medium">Certificate Number</div>
                    <div className="font-bold text-amber-600 dark:text-amber-400 mt-1 font-mono">
                      {selectedApp.certificateNumber || 'HC-CERT-PENDING'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email History for this Customer */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Automated & Manual Outreach Log
                  </h3>
                  <button
                    onClick={() => setActiveTab('email_automation')}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Send Email <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {emailHistory.filter((e) => e.prospectId === selectedApp.id || e.recipient === selectedApp.contactEmail).length > 0 ? (
                  <div className="space-y-3">
                    {emailHistory
                      .filter((e) => e.prospectId === selectedApp.id || e.recipient === selectedApp.contactEmail)
                      .map((e) => (
                        <div key={e.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{e.subject}</div>
                            <div className="text-slate-500 mt-0.5">Template: {e.emailTemplate} • Sent by {e.employeeName} on {e.date}</div>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg font-semibold">
                            {e.deliveryStatus}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    No outbound emails recorded for this client yet. Use "Smart Email Automation" tab to initiate outreach.
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Col: Health Radar & AI Advisory */}
            <div className="space-y-6">
              {/* Health Score Card */}
              {(() => {
                const health = calculateCustomerHealthScore(selectedApp);
                return (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Health Radar</h3>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{health.status}</span>
                    </div>

                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      <div className="text-4xl font-black text-slate-900 dark:text-white">{health.overallScore}</div>
                      <div className="text-xs text-slate-500 mt-1 font-medium">Overall Score (0-100)</div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                          <span>Communication Frequency</span>
                          <span className="font-bold">{health.communicationScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${health.communicationScore}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                          <span>Document Intake Completeness</span>
                          <span className="font-bold">{health.documentScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full" style={{ width: `${health.documentScore}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                          <span>Assessment Workflow Progress</span>
                          <span className="font-bold">{health.assessmentScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${health.assessmentScore}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* AI Strategic Advisory */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-slate-700 shadow-md space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">AI Senior Success Advisory</h3>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/60 p-3.5 rounded-xl border border-slate-700/60">
                  {generateAiCustomerBriefing(selectedApp.companyName, selectedApp.projectName, selectedApp.stage)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SALES & RENEWAL OPPORTUNITY PIPELINE ================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sales & Renewal Opportunity Kanban Pipeline</h2>
              <p className="text-xs text-slate-500">Track customer conversion from initial lead to certificate issuance & annual renewal</p>
            </div>

            <button
              onClick={() => {
                const newOpp: SalesOpportunity = {
                  id: `opp-${Date.now()}`,
                  customerId: selectedApp?.id || 'cust-new',
                  companyName: selectedApp?.companyName || 'New Prospect Inc',
                  projectName: selectedApp?.projectName || 'New Token',
                  tokenName: selectedApp?.tokenSymbol || 'NTK',
                  stage: 'Lead',
                  estimatedValueUSD: 20000,
                  closeProbabilityPct: 50,
                  assignedSalesRep: currentUserName,
                  createdDate: new Date().toISOString().split('T')[0],
                  lastActivityDate: new Date().toISOString(),
                  stageHistory: [{ stage: 'Lead', timestamp: new Date().toISOString(), note: 'Created manually', updatedBy: currentUserName }]
                };
                setOpportunities([newOpp, ...opportunities]);
                setActionMessage('New Opportunity added to Pipeline!');
                setTimeout(() => setActionMessage(null), 3000);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Opportunity
            </button>
          </div>

          {/* Pipeline Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
            {[
              { title: 'Leads & Contacted', stages: ['Lead', 'Contacted', 'Interested'] },
              { title: 'Proposal & Audit Quote', stages: ['Meeting Scheduled', 'Proposal Sent'] },
              { title: 'In Assessment / Active', stages: ['Assessment Started'] },
              { title: 'Certified & Renewal', stages: ['Certificate Issued', 'Renewal'] }
            ].map((col, idx) => {
              const colOpps = opportunities.filter((o) => col.stages.includes(o.stage));
              return (
                <div key={idx} className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{col.title}</h3>
                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">
                      {colOpps.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colOpps.map((opp) => (
                      <div key={opp.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white truncate">{opp.companyName}</span>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            ${(opp.estimatedValueUSD || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px]">{opp.projectName} ({opp.tokenName})</div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono">Rep: {opp.assignedSalesRep}</span>
                          <select
                            value={opp.stage}
                            onChange={(e) => handleUpdateStage(opp.id, e.target.value as any)}
                            className="text-[11px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300 px-2 py-1"
                          >
                            <option value="Lead">Lead</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Assessment Started">Assessment Started</option>
                            <option value="Certificate Issued">Certificate Issued</option>
                            <option value="Renewal">Renewal</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: SMART EMAIL AUTOMATION ================= */}
      {activeTab === 'email_automation' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Smart Personalized Email Dispatch Engine
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select from standard branded HALALCHAIN™ templates with automatic variable substitution and duplicate send safeguards.
              </p>
            </div>

            {/* Template & Client Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Account:</label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  {applications.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.companyName} ({a.projectName}) — {a.contactEmail || 'No email'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Template (9 Supported Types):</label>
                <select
                  value={selectedTemplate.id}
                  onChange={(e) => {
                    const found = DEFAULT_EMAIL_TEMPLATES.find((t) => t.id === e.target.value) || DEFAULT_EMAIL_TEMPLATES[0];
                    setSelectedTemplate(found);
                  }}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  {DEFAULT_EMAIL_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      [{tpl.category}] {tpl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Anti-Duplicate Warning */}
            {duplicateWarning && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 p-4 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>{duplicateWarning}</span>
                </div>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideDuplicate}
                    onChange={(e) => setOverrideDuplicate(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  Override Duplicate Protection
                </label>
              </div>
            )}

            {/* Editable Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Recipient Email:</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Line (Personalized):</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email HTML Body (Editable Preview):</label>
                <textarea
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowEmailPreviewModal(true)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-2 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" /> Preview Branded HTML
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSending}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Dispatch Email & Log Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Full Branded Email Preview */}
      {showEmailPreviewModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">Branded Email Render Preview</span>
              <button onClick={() => setShowEmailPreviewModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                Close ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950">
              <div
                dangerouslySetInnerHTML={{
                  __html: buildBrandedHtmlEmail(emailBody, {
                    '{{Project Name}}': selectedApp?.projectName || 'Project',
                    '{{Sales Person}}': currentUserName
                  })
                }}
              ></div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
              >
                Back to Edit
              </button>
              <button
                onClick={handleSendEmail}
                className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: RENEWAL MANAGEMENT ================= */}
      {activeTab === 'renewals' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Annual Certificate Expiry & Renewal Management
              </h2>
              <p className="text-xs text-slate-500">Automatically flag accounts expiring in 30, 60, and 90 days to prevent gap in Master Registry listing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {applications.map((app) => {
                const expiry = app.certificateExpiryDate || '2026-11-01';
                const daysLeft = Math.floor((new Date(expiry).getTime() - Date.now()) / (1000 * 3600 * 24));
                return (
                  <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{app.companyName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          daysLeft <= 30 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {daysLeft <= 0 ? 'Expired' : `${daysLeft} days left`}
                      </span>
                    </div>

                    <div className="text-slate-500 font-mono text-[11px]">
                      Cert ID: {app.certificateNumber || 'HC-CERT-2026-001'}<br />
                      Expiry Date: {expiry}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAppId(app.id);
                        setSelectedTemplate(DEFAULT_EMAIL_TEMPLATES.find((t) => t.id === 'tpl-renewal-reminder') || DEFAULT_EMAIL_TEMPLATES[0]);
                        setActiveTab('email_automation');
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" /> Send Renewal Notice
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: BUSINESS AUTOMATION RULES & AUDIT LOG ================= */}
      {activeTab === 'automation_rules' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Business Automation Triggers & Rules Engine
                </h2>
                <p className="text-xs text-slate-500">Configured triggers that execute background checks for inactivity, renewals, and payments.</p>
              </div>

              <button
                onClick={handleRunRulesEngine}
                className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" /> Trigger Rules Audit
              </button>
            </div>

            <div className="space-y-3">
              {automationRules.map((rule) => (
                <div key={rule.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {rule.ruleName}
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono rounded">
                        {rule.triggerEvent}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1">Condition: {rule.condition}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">Triggered: {rule.triggerCount} times</span>
                    <button
                      onClick={() => {
                        setAutomationRules(
                          automationRules.map((r) => (r.id === rule.id ? { ...r, isEnabled: !r.isEnabled } : r))
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        rule.isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {rule.isEnabled ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Audit History Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Automation Digital Audit Trail Logs
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Automation Rule</th>
                    <th className="py-3 px-4">Target Entity</th>
                    <th className="py-3 px-4">Action & Result</th>
                    <th className="py-3 px-4 font-mono">SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{log.ruleName}</td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{log.targetEntityName}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{log.actionTaken}</span>
                        <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400">({log.result})</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{log.digitalSignatureHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: CSAT & FEEDBACK ================= */}
      {activeTab === 'csat' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Customer Satisfaction (CSAT) Ratings & Reviews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {csatSurveys.map((survey) => (
                <div key={survey.id} className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{survey.companyName}</span>
                    <div className="flex items-center text-amber-500 font-bold">
                      {'★'.repeat(survey.ratingStars)}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic">"{survey.comments}"</p>
                  <div className="text-slate-400 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-700">
                    Contact: {survey.contactPerson} • Submitted: {new Date(survey.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 8: AI SUCCESS ASSISTANT ================= */}
      {activeTab === 'ai_assistant' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              AI Senior Customer Success Advisor
            </h2>

            <div className="flex gap-3">
              <button
                onClick={() => setAiOutput(generateAiCustomerBriefing(selectedApp.companyName, selectedApp.projectName, selectedApp.stage))}
                className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-500 cursor-pointer"
              >
                Generate Briefing
              </button>
              <button
                onClick={() => setAiOutput(generateAiUpsellStrategy(selectedApp.projectName).join('\n'))}
                className="px-4 py-2 bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
              >
                Suggest Upsell SLA Strategy
              </button>
            </div>

            {aiOutput && (
              <div className="p-4 bg-slate-950 text-emerald-300 font-mono text-xs rounded-xl border border-slate-800 whitespace-pre-wrap">
                {aiOutput}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

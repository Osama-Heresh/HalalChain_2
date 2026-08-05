import React, { useState } from 'react';
import {
  EnterpriseAiIntelligenceReport,
  AiContradictionAlert,
  MandatoryEvidenceItem,
  CategorizedRecommendation,
  ClassclassifiedRiskItem,
  HistoricalPrecedentInsight,
  UserRole
} from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  BarChart3,
  Scale,
  BrainCircuit,
  Lock,
  Unlock,
  Building2,
  Code,
  ShieldCheck,
  Eye,
  BookOpen,
  HelpCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  Copy,
  Printer,
  XCircle,
  FileText,
  Zap,
  Info,
  Check
} from 'lucide-react';

interface AiAssessmentIntelligenceConsoleProps {
  intelligence: EnterpriseAiIntelligenceReport;
  currentUserRole: UserRole;
  onResolveContradiction?: (alertId: string, resolutionNote: string) => void;
  onAcceptRecommendation?: (recId: string) => void;
}

export const AiAssessmentIntelligenceConsole: React.FC<AiAssessmentIntelligenceConsoleProps> = ({
  intelligence,
  currentUserRole,
  onResolveContradiction,
  onAcceptRecommendation
}) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'confidence' | 'contradictions' | 'evidence' | 'exec_summary' | 'recommendations' | 'risks' | 'historical'
  >('overview');

  const [expandedContradictionId, setExpandedContradictionId] = useState<string | null>(
    intelligence.contradictionAlerts[0]?.id || null
  );
  const [resolutionText, setResolutionText] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const handleCopyExecSummary = () => {
    const text = `
HALALCHAIN™ ENTERPRISE AI EXECUTIVE ASSESSMENT REPORT
Project: ${intelligence.projectName} (${intelligence.projectId})
Recommended Decision: ${intelligence.executiveSummary.recommendedDecision}
Overall Assessment Score: ${intelligence.executiveSummary.overallAssessmentScore}/100

MAJOR FINDINGS:
${intelligence.executiveSummary.majorFindings.map(f => `- ${f}`).join('\n')}

MAJOR RISKS:
${intelligence.executiveSummary.majorRisks.map(r => `- [${r.severity}] ${r.title}: ${r.explanation}`).join('\n')}

POSITIVE OBSERVATIONS:
${intelligence.executiveSummary.positiveObservations.map(p => `- ${p}`).join('\n')}

CONCLUSION:
${intelligence.executiveSummary.executiveConclusionText}

Label: ${intelligence.executiveSummary.label}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Human Authority Strict Banner Header */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <span>ENTERPRISE AI ASSESSMENT INTELLIGENCE ENGINE</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Recommendation – Human Review Required</span>
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white">
              {lang === 'ar' ? 'مساعد التقييم الذكي للمشاريع' : `${intelligence.projectName} — AI Intelligence Review Suite`}
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              {lang === 'ar'
                ? 'مساعد ذكاء اصطناعي مؤسسي يدعم المراجعين البشريين من خلال حساب ثقة البيانات، اكتشاف التناقضات بين الأدوار، والتحقق الإجباري من الأدلة.'
                : 'Enterprise AI review assistant calculating confidence scores across 7 assessment dimensions, continuously auditing for cross-role contradictions, validating mandatory evidence, and synthesizing executive consulting summaries. Human reviewers retain 100% final authority.'}
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700/80 px-4 py-3 rounded-2xl text-center min-w-[110px]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">AI Confidence</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{intelligence.overallAiConfidencePct}%</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 px-4 py-3 rounded-2xl text-center min-w-[110px]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Contradictions</span>
              <span className={`text-2xl font-black font-mono ${intelligence.contradictionAlerts.filter(a => a.status === 'Active Alert').length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {intelligence.contradictionAlerts.filter(a => a.status === 'Active Alert').length}
              </span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 px-4 py-3 rounded-2xl text-center min-w-[110px]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Completeness</span>
              <span className="text-2xl font-black text-indigo-400 font-mono">{intelligence.completenessPct}%</span>
            </div>
          </div>
        </div>

        {/* Blocking Certification Warning Banner */}
        {intelligence.isFinalCertificationBlocked && (
          <div className="mt-5 bg-rose-950/80 border border-rose-500/50 p-4 rounded-2xl flex items-start gap-3 text-rose-200 text-xs">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-300 uppercase tracking-wider block font-mono">
                FINAL CERTIFICATION BLOCKED — MANDATORY REQUIREMENTS OUTSTANDING
              </span>
              <p className="text-rose-200">
                Final certificate generation is blocked until all mandatory evidence is verified and active critical contradictions are resolved. Human authority overrides apply once requirements are fulfilled.
              </p>
              <ul className="list-disc list-inside space-y-0.5 pt-1 text-rose-300 font-mono text-[11px]">
                {intelligence.blockingReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'overview', label: 'Intelligence Overview', icon: BrainCircuit },
          { key: 'confidence', label: 'Confidence Engine (7 Pillars)', icon: BarChart3 },
          { key: 'contradictions', label: `Contradictions (${intelligence.contradictionAlerts.filter(a => a.status === 'Active Alert').length})`, icon: ShieldAlert },
          { key: 'evidence', label: `Mandatory Evidence (${intelligence.missingEvidenceCount} Missing)`, icon: FileCheck2 },
          { key: 'exec_summary', label: 'Executive Summary Report', icon: FileText },
          { key: 'recommendations', label: 'AI Recommendations', icon: Zap },
          { key: 'risks', label: 'Risk Classification', icon: AlertTriangle },
          { key: 'historical', label: 'Historical Learning', icon: Scale }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column: Overall Progress & Confidence Summary */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Discipline Completion Matrix */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Review Discipline Completion Engine
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {intelligence.completenessPct}% Overall Progress
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {intelligence.disciplineProgress.map((disc) => (
                  <div
                    key={disc.disciplineKey}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900 dark:text-white font-mono">{disc.title}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">{disc.completionPct}%</span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${disc.completionPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span>Tasks: {disc.completedTasks}/{disc.totalTasks} Done</span>
                      <span className="capitalize">{disc.role.replace('_', ' ')}</span>
                    </div>

                    {disc.remainingTasks.length > 0 && (
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 pt-1 font-mono">
                        Remaining: {disc.remainingTasks[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contradiction Preview Cards */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Cross-Role Contradiction Detection Alerts
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('contradictions')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>View All ({intelligence.contradictionAlerts.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {intelligence.contradictionAlerts.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero conflicting findings detected across Business, Technical, Governance, and Scholar reviews.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {intelligence.contradictionAlerts.slice(0, 2).map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-300 font-mono flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          {alert.contradictionTitle}
                        </span>
                        <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                          {alert.severity} SEVERITY
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {alert.aiExplanation}
                      </p>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Disciplines: {alert.disciplinesInvolved.join(' vs ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side Column: Mandatory Evidence & Historical Learning Preview */}
          <div className="space-y-6">
            
            {/* Mandatory Evidence Checklist */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Mandatory Evidence Status
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {intelligence.mandatoryEvidenceItems.filter(i => i.isCollected).length}/{intelligence.mandatoryEvidenceItems.length}
                </span>
              </div>

              <div className="space-y-2">
                {intelligence.mandatoryEvidenceItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 transition-all ${
                      item.isCollected
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 text-slate-800 dark:text-slate-200'
                        : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                    }`}
                  >
                    {item.isCollected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <span className="font-bold block text-[11px] leading-snug">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                        Discipline: {item.discipline}
                      </span>
                      {!item.isCollected && (
                        <p className="text-[10px] text-rose-700 dark:text-rose-300 italic pt-0.5">
                          {item.missingImpact}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation Badge Footer */}
            <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block font-mono">
                AI Recommendation – Human Review Required
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                All AI confidence scores, contradiction flags, and recommendations are advisory tools. Final certification decisions rest exclusively with human reviewers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONFIDENCE ENGINE (7 Pillars) */}
      {activeTab === 'confidence' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {intelligence.confidenceDimensions.map((dim) => (
              <div
                key={dim.dimensionKey}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                    {dim.dimensionKey.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full border ${
                      dim.scorePct >= 90
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        : dim.scorePct >= 75
                        ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {dim.confidenceLevel}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {lang === 'ar' ? dim.titleAr : dim.titleEn}
                  </h3>
                  <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {dim.scorePct}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${dim.scorePct}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {dim.explanation}
                </p>

                {/* Factors List */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block font-mono">
                    Positive Influencing Factors:
                  </span>
                  <ul className="space-y-1">
                    {dim.positiveFactors.map((pf, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pf}</span>
                      </li>
                    ))}
                  </ul>

                  {dim.riskFactors.length > 0 && dim.riskFactors[0] !== 'None' && (
                    <>
                      <span className="font-bold text-amber-700 dark:text-amber-400 block font-mono pt-2">
                        Attention / Risk Factors:
                      </span>
                      <ul className="space-y-1">
                        {dim.riskFactors.map((rf, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-amber-800 dark:text-amber-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span>{rf}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 font-mono pt-2 text-right">
                  AI Recommendation – Human Review Required
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTRADICTIONS */}
      {activeTab === 'contradictions' && (
        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-5 rounded-3xl flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider block font-mono">
                CONTRADICTION AUDIT ENGINE — CROSS-ROLE REVIEW SANITY
              </span>
              <p>
                The Contradiction Detection Engine continuously cross-evaluates findings entered by Technical Auditors, Business Analysts, Sharia Scholars, and QA Officers. Conflicting statements are highlighted as active alerts requiring human resolution before certification.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {intelligence.contradictionAlerts.map((alert) => {
              const isExpanded = expandedContradictionId === alert.id;
              return (
                <div
                  key={alert.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedContradictionId(isExpanded ? null : alert.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${alert.severity === 'Critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">{alert.id}</span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {alert.contradictionCategory}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                          {alert.contradictionTitle}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                        alert.status === 'Resolved by Human'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {alert.status}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-5 bg-slate-50/50 dark:bg-slate-900/50">
                      
                      {/* Side-by-side comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono uppercase">
                            Finding A — {alert.findingA.role}
                          </div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                            "{alert.findingA.summary}"
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono uppercase">
                            Finding B — {alert.findingB.role}
                          </div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                            "{alert.findingB.summary}"
                          </p>
                        </div>
                      </div>

                      {/* AI Explanation & Recommended Action */}
                      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2 text-xs">
                        <span className="font-bold text-amber-900 dark:text-amber-300 font-mono block">
                          AI Contradiction Analysis:
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                          {alert.aiExplanation}
                        </p>
                        <span className="font-bold text-amber-900 dark:text-amber-300 font-mono block pt-2">
                          Recommended Resolution Action:
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                          {alert.recommendedResolution}
                        </p>
                      </div>

                      {/* Resolution Form for Human Authority */}
                      {alert.status === 'Active Alert' && (
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono block">
                            Human Reviewer Contradiction Override & Resolution Note:
                          </span>
                          <textarea
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            placeholder="Enter human reviewer resolution justification (e.g., Client agreed to remove fixed APY phrasing and deploy 48-hour timelock)..."
                            className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            rows={2}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-mono">
                              AI Recommendation – Human Review Required
                            </span>
                            <button
                              onClick={() => {
                                if (onResolveContradiction && resolutionText.trim()) {
                                  onResolveContradiction(alert.id, resolutionText);
                                  setResolutionText('');
                                }
                              }}
                              disabled={!resolutionText.trim()}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all shadow-md flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Mark Contradiction Resolved</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MANDATORY EVIDENCE VALIDATION */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Mandatory Evidence Audit & Certification Gate
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verifies that all mandatory evidence items are collected prior to allowing final report completion and certificate generation.
                </p>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full ${
                intelligence.isFinalCertificationBlocked
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
              }`}>
                {intelligence.isFinalCertificationBlocked ? 'FINAL CERTIFICATION BLOCKED' : 'ALL MANDATORY EVIDENCE VERIFIED'}
              </span>
            </div>

            <div className="space-y-3">
              {intelligence.mandatoryEvidenceItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    item.isCollected
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.isCollected ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{item.id}</span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.discipline}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      {item.isCollected ? (
                        <p className="text-xs text-emerald-800 dark:text-emerald-300">
                          Verified: {item.collectedDetails}
                        </p>
                      ) : (
                        <p className="text-xs text-rose-700 dark:text-rose-300">
                          Impact: {item.missingImpact}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                      item.isCollected
                        ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                    }`}>
                      {item.isCollected ? 'COLLECTED' : 'MISSING'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXECUTIVE SUMMARY */}
      {activeTab === 'exec_summary' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                  ENTERPRISE CONSULTING REPORT
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Executive Assessment & Decision Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Project: {intelligence.projectName} ({intelligence.projectId}) — Generated {intelligence.executiveSummary.generatedAt}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyExecSummary}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-all flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedSummary ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>
              </div>
            </div>

            {/* Recommended Decision Callout */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
              intelligence.executiveSummary.recommendedDecision === 'RECOMMENDED_FOR_CERTIFICATION'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block">
                  AI Recommended Assessment Outcome
                </span>
                <span className="text-lg font-black font-mono">
                  {intelligence.executiveSummary.recommendedDecision.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] uppercase text-slate-500 block font-bold">Overall Score</span>
                <span className="text-2xl font-black">{intelligence.executiveSummary.overallAssessmentScore}/100</span>
              </div>
            </div>

            {/* Major Findings & Positive Observations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                  Major Assessment Findings
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {intelligence.executiveSummary.majorFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                  Positive Observations
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {intelligence.executiveSummary.positiveObservations.map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Major Risks & Outstanding Issues */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                Major Risks & Outstanding Issues
              </h4>
              <div className="space-y-2">
                {intelligence.executiveSummary.majorRisks.map((risk) => (
                  <div key={risk.id} className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 dark:text-rose-300">{risk.title}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 bg-rose-200 dark:bg-rose-900 rounded font-bold uppercase text-rose-900 dark:text-rose-200">
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{risk.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Conclusion */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">
                Executive Synthesis Conclusion
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {intelligence.executiveSummary.executiveConclusionText}
              </p>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs font-bold text-slate-500 font-mono">
                AI Recommendation – Human Review Required
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intelligence.categorizedRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Category: {rec.category}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded ${
                    rec.priority === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>

                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {rec.title}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <p><strong className="text-slate-900 dark:text-white">Suggested Action:</strong> {rec.suggestedAction}</p>
                  <p className="text-slate-500 dark:text-slate-400"><strong className="text-slate-700 dark:text-slate-300">Rationale:</strong> {rec.rationale}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">Target Role: {rec.targetRole}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold font-mono">
                    AI Recommendation – Human Review Required
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: RISKS */}
      {activeTab === 'risks' && (
        <div className="space-y-4">
          {intelligence.classifiedRisks.map((risk) => (
            <div
              key={risk.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">{risk.id}</span>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                  risk.severity === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {risk.severity} Severity
                </span>
              </div>

              <h4 className="text-base font-black text-slate-900 dark:text-white">
                {risk.title}
              </h4>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 font-mono block">
                  Classification Reasoning:
                </span>
                <p className="text-slate-800 dark:text-slate-200">{risk.classificationReasoning}</p>
                <span className="font-bold text-slate-700 dark:text-slate-300 font-mono block pt-2">
                  Evidence Location: {risk.referenceLocation}
                </span>
                <p className="text-slate-500 dark:text-slate-400 italic font-mono text-[11px]">"{risk.evidenceQuote}"</p>
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-right">
                AI Recommendation – Human Review Required
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 8: HISTORICAL LEARNING */}
      {activeTab === 'historical' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 p-5 rounded-3xl flex items-start gap-3 text-indigo-900 dark:text-indigo-200 text-xs">
            <Scale className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider block font-mono">
                HISTORICAL LEARNING & PRECEDENT ENGINE
              </span>
              <p>
                Analyzes previously completed assessments stored in the database to identify similar projects, tokenomics architectures, and applicable AAOIFI standards. Presents reusable insights to human reviewers without overwriting human findings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {intelligence.historicalInsights.map((insight) => (
              <div
                key={insight.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {insight.similarityScorePct}% Match
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{insight.similarProjectId}</span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {insight.similarProjectName}
                  </h4>

                  <span className="text-[11px] font-mono font-bold text-slate-500 block">
                    Dimension: {insight.matchingDimension}
                  </span>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{insight.reusableInsight}"
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono block">
                    Outcome: {insight.precedentOutcome}
                  </span>
                  {insight.applicableAaoifiStandard && (
                    <span className="text-slate-500 font-mono block">
                      Standard: {insight.applicableAaoifiStandard}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono block text-right pt-1">
                    AI Recommendation – Human Review Required
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

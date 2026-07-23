import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MemberEvaluation, UserRole } from '../../types';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  X,
  Award,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Printer,
  Download,
  FileText,
  User,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  BarChart3,
  Check,
  Save,
  ChevronRight,
  MessageSquare,
  AlertCircle,
  Briefcase,
  Loader2
} from 'lucide-react';

interface TeamMemberEvaluationModalProps {
  evaluation: MemberEvaluation;
  onClose: () => void;
  onSaveAssessment?: (updatedEvaluation: MemberEvaluation) => void;
}

export const TeamMemberEvaluationModal: React.FC<TeamMemberEvaluationModalProps> = ({
  evaluation,
  onClose,
  onSaveAssessment
}) => {
  const { lang } = useLanguage();

  // Local state for PM Manual Assessment sliders and notes
  const [leadershipScore, setLeadershipScore] = useState(
    evaluation.pmManualAssessment.leadershipScore || 95
  );
  const [analyticalDepth, setAnalyticalDepth] = useState(
    evaluation.pmManualAssessment.analyticalDepth || 96
  );
  const [teamCollaboration, setTeamCollaboration] = useState(
    evaluation.pmManualAssessment.teamCollaboration || 94
  );
  const [technicalRigour, setTechnicalRigour] = useState(
    evaluation.pmManualAssessment.technicalRigour || 98
  );
  const [deliverablePunctuality, setDeliverablePunctuality] = useState(
    evaluation.pmManualAssessment.deliverablePunctuality || 95
  );
  const [evaluatorNotes, setEvaluatorNotes] = useState(
    evaluation.pmManualAssessment.evaluatorNotes ||
      (lang === 'ar'
        ? 'عضو متميز، أظهر دقة عالية في فحص العقود الذكية والالتزام التام بالمعايير الشرعية وأوقات التسليم.'
        : 'Outstanding team member. Demonstrated exceptional diligence in auditing protocols with strict adherence to SLA timelines.')
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'form' | 'print'>('dashboard');
  const [isExporting, setIsExporting] = useState(false);

  // Calculate live PM overall score & combined score
  const computedPmScore = Math.round(
    (leadershipScore + analyticalDepth + teamCollaboration + technicalRigour + deliverablePunctuality) / 5
  );

  const autoScore = evaluation.systemAutoMetrics.overallAutoScore || 96;
  const computedFinalCombined = Math.round(autoScore * 0.5 + computedPmScore * 0.5);

  const getCategory = (score: number) => {
    if (score >= 95) return 'Exceptional (A+)';
    if (score >= 88) return 'Strong (A)';
    if (score >= 78) return 'Satisfactory (B)';
    return 'Needs Improvement (C)';
  };

  const handleSave = () => {
    const updated: MemberEvaluation = {
      ...evaluation,
      pmManualAssessment: {
        leadershipScore,
        analyticalDepth,
        teamCollaboration,
        technicalRigour,
        deliverablePunctuality,
        overallPmScore: computedPmScore,
        evaluatorNotes,
        evaluatedDate: new Date().toISOString().split('T')[0],
        evaluatorName: 'Omar Khayyam (PM Lead)'
      },
      finalCombinedScore: computedFinalCombined,
      ratingCategory: getCategory(computedFinalCombined)
    };

    if (onSaveAssessment) {
      onSaveAssessment(updated);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const reportElement = document.getElementById('printable-evaluation-report');
      if (!reportElement) {
        window.print();
        return;
      }

      const dataUrl = await toPng(reportElement, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
        cacheBust: true,
        filter: (node) => !(node instanceof HTMLElement && node.classList.contains('export-ignore')),
        style: {
          margin: '0',
          transform: 'none',
        },
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();   // 210 mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

      const margin = 8;
      const maxW = pdfWidth - margin * 2;
      const maxH = pdfHeight - margin * 2;

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const imgAspect = img.width / img.height;
      let finalW = maxW;
      let finalH = maxW / imgAspect;

      if (finalH > maxH) {
        finalH = maxH;
        finalW = maxH * imgAspect;
      }

      const xPos = (pdfWidth - finalW) / 2;
      const yPos = margin;

      pdf.addImage(dataUrl, 'PNG', xPos, yPos, finalW, finalH);
      const safeName = (evaluation.employeeName || 'Member').replace(/\s+/g, '_');
      pdf.save(`HalalChain_Employee_Evaluation_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF export error, falling back to window.print:', err);
      try {
        window.print();
      } catch (e) {
        console.error('Window print failed:', e);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'scholar':
        return lang === 'ar' ? 'عالم شرعي' : 'Sharia Scholar';
      case 'tech_auditor':
        return lang === 'ar' ? 'مدقق عقود ذكية' : 'Lead Tech Auditor';
      case 'business_analyst':
        return lang === 'ar' ? 'محلل توكنوميكس' : 'Business Analyst';
      case 'qa':
        return lang === 'ar' ? 'مسؤول جودة' : 'QA Officer';
      default:
        return r;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-0 print:rounded-none">
        
        {/* PRINTABLE REPORT CONTAINER */}
        <div id="printable-evaluation-report" className="bg-white flex flex-col flex-1 overflow-y-auto">
          {/* Top Executive Banner */}
          <div className="bg-[#0B132B] text-white p-6 sm:p-8 shrink-0 relative overflow-hidden print:bg-slate-900">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer z-10 print:hidden export-ignore"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold font-serif text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-xl border-2 border-amber-400/50">
                  {evaluation.employeeName.charAt(0)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {getRoleLabel(evaluation.role)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {evaluation.ratingCategory}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                    {evaluation.employeeName}
                  </h2>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 flex-wrap">
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Briefcase className="w-3.5 h-3.5" />
                      {evaluation.projectName}
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">Task: {evaluation.currentTask}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Header */}
              <div className="flex items-center gap-2 print:hidden shrink-0 export-ignore">
                <button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <Printer className="w-4 h-4 text-slate-950" />
                  )}
                  <span>
                    {isExporting
                      ? (lang === 'ar' ? 'جاري التحميل...' : 'Downloading PDF...')
                      : (lang === 'ar' ? 'طباعة / حفظ PDF' : 'Print / Save as PDF')}
                  </span>
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{savedSuccess ? 'Saved!' : 'Save PM Evaluation'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* View Selection Tabs */}
          <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 pt-3 font-mono text-xs flex items-center gap-2 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x print:hidden export-ignore">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeView === 'dashboard'
                ? 'bg-white text-slate-900 border-amber-500 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <span>{lang === 'ar' ? 'لوحة تحليلات الأداء الشاملة' : 'Performance Analytics Dashboard'}</span>
          </button>

          <button
            onClick={() => setActiveView('form')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeView === 'form'
                ? 'bg-white text-slate-900 border-amber-500 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>{lang === 'ar' ? 'نموذج تقييم مدير المشروع (PM Review)' : 'PM Assessment Matrix Form'}</span>
          </button>
        </div>

        {/* Main Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 font-sans text-slate-900">
          {/* TOP HERO PERFORMANCE SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {/* Combined Score Card */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0B132B] text-white p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-2 right-2 text-amber-400">
                <Sparkles className="w-5 h-5 opacity-80" />
              </div>
              <span className="text-[10px] text-amber-400 font-bold uppercase block tracking-wider">
                {lang === 'ar' ? 'الدرجة الكلية المدمجة' : 'Final Combined Score'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold font-serif text-white">{computedFinalCombined}</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>50% Auto + 50% PM Score</span>
              </div>
            </div>

            {/* System Auto Score Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">
                {lang === 'ar' ? 'التقييم الآلي للنظام' : 'System Auto-Evaluation'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold font-serif text-slate-900">{autoScore}</span>
                <span className="text-xs text-slate-500 font-bold">/ 100</span>
              </div>
              <div className="mt-2 text-[11px] text-indigo-700 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Computed from Running Milestones</span>
              </div>
            </div>

            {/* PM Assessment Score Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">
                {lang === 'ar' ? 'تقييم مدير المشروع' : 'PM Assessment Score'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold font-serif text-slate-900">{computedPmScore}</span>
                <span className="text-xs text-slate-500 font-bold">/ 100</span>
              </div>
              <div className="mt-2 text-[11px] text-amber-800 font-bold flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                <span>PM Live Rating Matrix</span>
              </div>
            </div>

            {/* SLA Adherence Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">
                {lang === 'ar' ? 'نسبة الالتزام بالوقت SLA' : 'SLA On-Time Delivery'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold font-serif text-emerald-700">
                  {evaluation.systemAutoMetrics.slaAdherenceScore}%
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Deadline Violations</span>
              </div>
            </div>
          </div>

          {/* DASHBOARD TAB / CHARTS VIEW */}
          {(activeView === 'dashboard' || activeView === 'print') && (
            <div className="space-y-8">
              {/* Modern Visual Chart 1: Dimension Metrics Bar Comparison */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-amber-600" />
                      <span>
                        {lang === 'ar'
                          ? 'مقارنة الأداء الآلي مقابل تقييم مدير المشروع'
                          : 'System Auto Metrics vs. PM Manual Evaluation Matrix'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Visual comparison across key project delivery & compliance dimensions
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                    Benchmark Target: 90%
                  </span>
                </div>

                {/* SVG Visual Metric Distribution Bars */}
                <div className="space-y-5 font-mono text-xs">
                  {/* Metric 1: SLA Adherence vs Deliverable Punctuality */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>SLA Adherence & Delivery Punctuality</span>
                      <span className="text-emerald-700">
                        Auto: {evaluation.systemAutoMetrics.slaAdherenceScore}% | PM: {deliverablePunctuality}%
                      </span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${evaluation.systemAutoMetrics.slaAdherenceScore}%` }}
                        title="Auto SLA Score"
                      />
                    </div>
                  </div>

                  {/* Metric 2: Audit Accuracy vs Technical/Sharia Rigour */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Audit Accuracy & Methodological Rigour</span>
                      <span className="text-emerald-700">
                        Auto: {evaluation.systemAutoMetrics.auditAccuracyScore}% | PM: {technicalRigour}%
                      </span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${evaluation.systemAutoMetrics.auditAccuracyScore}%` }}
                        title="Auto Accuracy"
                      />
                    </div>
                  </div>

                  {/* Metric 3: Report Completeness vs Analytical Depth */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Report Completeness & Analytical Depth</span>
                      <span className="text-emerald-700">
                        Auto: {evaluation.systemAutoMetrics.reportCompleteness}% | PM: {analyticalDepth}%
                      </span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${evaluation.systemAutoMetrics.reportCompleteness}%` }}
                        title="Report Completeness"
                      />
                    </div>
                  </div>

                  {/* Metric 4: Communication Speed vs Team Collaboration */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Communication Speed & Team Collaboration</span>
                      <span className="text-emerald-700">
                        Auto: {evaluation.systemAutoMetrics.communicationResponsiveness}% | PM: {teamCollaboration}%
                      </span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${evaluation.systemAutoMetrics.communicationResponsiveness}%` }}
                        title="Communication Speed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Visual Chart 2: Spider/Radar Dashboard & Milestone Velocity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System Auto Metrics Breakdown Panel */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                  <h4 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'ar' ? 'تفاصيل التقييم الآلي للنظام' : 'System Auto Metrics Breakdown'}</span>
                  </h4>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">SLA Adherence Rate</span>
                      <span className="font-bold text-emerald-700">{evaluation.systemAutoMetrics.slaAdherenceScore}%</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Audit Code / Sharia Accuracy</span>
                      <span className="font-bold text-emerald-700">{evaluation.systemAutoMetrics.auditAccuracyScore}%</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Documentation Completeness</span>
                      <span className="font-bold text-emerald-700">{evaluation.systemAutoMetrics.reportCompleteness}%</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Response Latency Score</span>
                      <span className="font-bold text-emerald-700">{evaluation.systemAutoMetrics.communicationResponsiveness}%</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">AAOIFI & Sharia Compliance</span>
                      <span className="font-bold text-emerald-700">{evaluation.systemAutoMetrics.complianceQuality}%</span>
                    </div>
                  </div>
                </div>

                {/* PM Evaluator Notes & Observations Card */}
                <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-200 space-y-4">
                  <h4 className="text-sm font-bold font-serif text-amber-950 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-700" />
                    <span>{lang === 'ar' ? 'ملاحظات مدير المشروع والتقييم اليدوي' : 'PM Evaluation Notes & Sign-off'}</span>
                  </h4>

                  <p className="text-xs text-slate-800 leading-relaxed font-sans bg-white p-4 rounded-2xl border border-amber-200">
                    "{evaluatorNotes}"
                  </p>

                  <div className="pt-2 font-mono text-xs text-slate-600 space-y-1">
                    <div>
                      Evaluated By: <span className="font-bold text-slate-900">{evaluation.pmManualAssessment.evaluatorName || 'Omar Khayyam (PM Lead)'}</span>
                    </div>
                    <div>
                      Date: <span className="font-bold text-slate-900">{evaluation.pmManualAssessment.evaluatedDate || new Date().toISOString().split('T')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PM FORM TAB */}
          {activeView === 'form' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'ar' ? 'تعديل درجات تقييم مدير المشروع' : 'Adjust PM Manual Evaluation Ratings'}</span>
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Update performance scores for this active project team member (0 - 100 Scale).
                </p>
              </div>

              <div className="space-y-6 font-mono text-xs">
                {/* Slider 1: Leadership & Initiative */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <label className="text-slate-800">1. Leadership & Initiative (القيادة والمبادرة)</label>
                    <span className="text-amber-800 font-bold">{leadershipScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={leadershipScore}
                    onChange={(e) => setLeadershipScore(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Slider 2: Analytical Depth */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <label className="text-slate-800">2. Analytical Depth & Rigour (العمق التحليلي والدقة)</label>
                    <span className="text-amber-800 font-bold">{analyticalDepth} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={analyticalDepth}
                    onChange={(e) => setAnalyticalDepth(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Slider 3: Team Collaboration */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <label className="text-slate-800">3. Team Collaboration & Review Speed (التعاون والعمل الجماعي)</label>
                    <span className="text-amber-800 font-bold">{teamCollaboration} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={teamCollaboration}
                    onChange={(e) => setTeamCollaboration(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Slider 4: Technical / Sharia Rigour */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <label className="text-slate-800">4. Audit & Protocol Compliance (الالتزام بالمعايير الشرعية/الفنية)</label>
                    <span className="text-amber-800 font-bold">{technicalRigour} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={technicalRigour}
                    onChange={(e) => setTechnicalRigour(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Slider 5: Deliverable Punctuality */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <label className="text-slate-800">5. Deliverable Punctuality & SLA (الالتزام بالمواعيد)</label>
                    <span className="text-amber-800 font-bold">{deliverablePunctuality} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={deliverablePunctuality}
                    onChange={(e) => setDeliverablePunctuality(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Evaluator Notes */}
                <div className="space-y-2 pt-2">
                  <label className="font-bold text-slate-800 block">PM Evaluator Notes & Qualitative Feedback</label>
                  <textarea
                    rows={4}
                    value={evaluatorNotes}
                    onChange={(e) => setEvaluatorNotes(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                    placeholder="Enter notes on candidate performance, communication, or audit quality..."
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'حفظ التقييم وتحديث الدرجات' : 'Save & Lock PM Assessment'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 flex items-center justify-between shrink-0 font-mono text-xs print:hidden export-ignore">
          <div className="text-slate-500">
            HalalChain Remote Workforce Quality Governance • Certified SLA Evaluation
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

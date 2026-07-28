import React, { useState } from 'react';
import {
  EvidenceDossierReport,
  EvidenceItem,
  CertificationApplication,
  UserRole
} from '../../types';
import { EvidenceInspectorModal } from './EvidenceInspectorModal';
import { KnowledgeRepositoryModal } from './KnowledgeRepositoryModal';
import { exportReport } from '../../lib/reportEngine';
import { buildProjectAssessmentReportOptions } from '../../lib/reportGenerators';
import {
  Sparkles,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Printer,
  Download,
  Database,
  ExternalLink,
  ShieldCheck,
  Building,
  Coins,
  Cpu,
  Layers,
  BarChart3,
  BookOpen,
  ArrowRight,
  Info,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';

interface BigFourDossierViewProps {
  application: CertificationApplication;
  dossier: EvidenceDossierReport | null;
  currentUserRole: UserRole;
  isExtracting: boolean;
  onRunExtraction: () => void;
}

export const BigFourDossierView: React.FC<BigFourDossierViewProps> = ({
  application,
  dossier,
  currentUserRole,
  isExtracting,
  onRunExtraction
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [isKnowledgeRepoOpen, setIsKnowledgeRepoOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dossier' | 'evidence' | 'questions'>('dossier');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = async (format: 'PDF' | 'Excel' | 'CSV' | 'Print') => {
    setIsExporting(true);
    try {
      const opts = buildProjectAssessmentReportOptions(application, dossier);
      opts.format = format;
      await exportReport(opts);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Actions */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Big Four Style Assessment Dossier
              </span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Human Decision Architecture Enforced
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              {application.companyName} ({application.projectSymbol || 'PROTOCOL'})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evidence-based factual extraction report prepared for HalalChain Sharia & Technical Reviewers
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsKnowledgeRepoOpen(true)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Knowledge Repository
          </button>

          <button
            onClick={() => handleExport('PDF')}
            disabled={isExporting}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" /> PDF
          </button>

          <button
            onClick={() => handleExport('Excel')}
            disabled={isExporting}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
          </button>

          <button
            onClick={() => handleExport('CSV')}
            disabled={isExporting}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>

          <button
            onClick={onRunExtraction}
            disabled={isExtracting}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Extracting Documents...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Re-Run AI Evidence Engine
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mandatory Principle Banner */}
      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs flex items-start gap-3 shadow-inner">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Mandatory Governance Framework: AI Neutrality & Human Final Signoff
          </h4>
          <p className="text-slate-300 leading-relaxed">
            The AI engine strictly refrains from rendering Halal/Haram compliance decisions. All statements in this dossier represent objective extracted facts, linked directly to source documents with page numbers and supporting verbatim quotes. The final Sharia decision belongs exclusively to the authorized HalalChain Review Board.
          </p>
        </div>
      </div>

      {/* Quality Control Metrics Toolbar */}
      {dossier && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
              Documents Processed
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {dossier.qualityControl.documentsProcessedCount} Sources
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
              Pages Analyzed
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {dossier.qualityControl.pagesReadCount} Pages
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
              Evidence Quotes
            </span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {dossier.qualityControl.evidenceCount} Linked
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
              Extracted Facts
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {dossier.qualityControl.findingsCount} Findings
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
              Reviewer Questions
            </span>
            <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
              {dossier.qualityControl.reviewerQuestionsCount} Generated
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 block mb-0.5">
              Extraction Confidence
            </span>
            <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">
              {dossier.qualityControl.extractionConfidence}%
            </span>
          </div>
        </div>
      )}

      {/* Main Big Four Dossier Document Body */}
      {dossier ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:border-none print:shadow-none">
          {/* Corporate Cover Sheet Header */}
          <div className="p-8 bg-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Building className="w-64 h-64 text-emerald-400" />
            </div>

            <div className="relative z-10 space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-widest rounded-md">
                  BIG FOUR DOSSIER REPORT
                </span>
                <span className="text-xs text-slate-400 font-mono">Ref: {dossier.id}</span>
              </div>

              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {dossier.executiveProfile.projectName} Assessment Dossier
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs border-t border-slate-800">
                <div>
                  <span className="text-slate-500 block">Category</span>
                  <span className="font-semibold text-emerald-400">{dossier.executiveProfile.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Blockchain</span>
                  <span className="font-semibold text-white">{dossier.executiveProfile.blockchain}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Document Language</span>
                  <span className="font-semibold text-white">{dossier.executiveProfile.documentLanguage}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Extraction Date</span>
                  <span className="font-semibold text-white">{dossier.extractedAt.split('T')[0]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dossier Report Sections */}
          <div className="p-8 space-y-8">
            {/* 1. Executive Summary & Profile */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Executive Profile & Document Scope
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Project Name:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dossier.executiveProfile.projectName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Ticker Symbol:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dossier.executiveProfile.ticker}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Parent Foundation:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dossier.executiveProfile.companyFoundation}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Website:</span>
                    <a
                      href={dossier.executiveProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {dossier.executiveProfile.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Whitepaper Version:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dossier.executiveProfile.whitepaperVersion}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Total Pages Parsed:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dossier.executiveProfile.numberOfPages} Pages</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Project Category:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{dossier.executiveProfile.category}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Completeness Score:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{dossier.assessmentCompletenessPct}%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Business Model Analysis */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Business Purpose & Economic Activities
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Business Purpose Statement</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {dossier.businessModel.businessPurpose}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Products & Services</h5>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
                      {dossier.businessModel.products.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                      {dossier.businessModel.services.map((s, idx) => (
                        <li key={`s-${idx}`}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Revenue Model</h5>
                    <p className="text-slate-600 dark:text-slate-400">{dossier.businessModel.revenueModel}</p>
                  </div>
                </div>

                {/* Evidence quotes for business model */}
                {dossier.businessModel.evidence?.map((ev) => (
                  <div
                    key={ev.evidenceId}
                    onClick={() => setSelectedEvidence(ev)}
                    className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 cursor-pointer hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        [{ev.evidenceId}] {ev.sourceDocument} (Page {ev.pageNumber || 'N/A'})
                      </span>
                      <span className="text-slate-400 font-medium">Confidence: {ev.confidenceScore}%</span>
                    </div>
                    <p className="font-serif italic text-slate-700 dark:text-slate-300">
                      "{ev.supportingQuote}"
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Tokenomics Analysis */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Token Utility & Distribution Architecture
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Token Mechanics</h4>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Supply Model:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dossier.tokenAnalysis.supplyModel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Inflation / Minting:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dossier.tokenAnalysis.minting}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Deflation / Burning:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dossier.tokenAnalysis.burning}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Vesting Schedule:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dossier.tokenAnalysis.vesting}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Token Distribution Breakdown</h4>
                  <div className="space-y-1.5">
                    {dossier.tokenAnalysis.distribution.map((dist, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-600 dark:text-slate-300">{dist.label}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{dist.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${dist.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Financial Features Identification */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Financial Mechanics Inventory (Sharia Context Neutral)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {dossier.financialFeatures.map((fin) => (
                  <div
                    key={fin.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      fin.isDetected
                        ? 'bg-amber-500/5 border-amber-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-emerald-500" />
                        {fin.featureName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fin.isDetected
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {fin.isDetected ? 'Detected' : 'Not Detected'}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {fin.description}
                    </p>

                    {fin.evidence && (
                      <button
                        onClick={() => setSelectedEvidence(fin.evidence)}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 mt-1"
                      >
                        View Supporting Quote [{fin.evidence.evidenceId}] &rarr;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Risk Indicators */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center">
                  5
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Reviewer Attention Flags & Risk Indicators
                </h3>
              </div>

              <div className="space-y-2">
                {dossier.riskIndicators.map((risk) => (
                  <div
                    key={risk.id}
                    className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="font-bold text-slate-900 dark:text-white">{risk.flag}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            risk.severity === 'High'
                              ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                              : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {risk.severity} Severity
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] pl-6">
                        {risk.description}
                      </p>
                    </div>

                    {risk.evidence && (
                      <button
                        onClick={() => setSelectedEvidence(risk.evidence)}
                        className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-colors whitespace-nowrap"
                      >
                        Inspect Quote ({risk.evidence.evidenceId})
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Reviewer Questions Generator */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                  6
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Targeted Reviewer Deliberation Questions
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tech Questions */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <Cpu className="w-4 h-4 text-emerald-500" />
                    Technical Auditor Questions
                  </h4>
                  {dossier.reviewerQuestions.technicalQuestions?.map((q) => (
                    <div key={q.id} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">
                        Aspect: {q.targetAspect}
                      </span>
                      <p className="text-slate-700 dark:text-slate-200 font-medium">{q.question}</p>
                    </div>
                  ))}
                </div>

                {/* Business Questions */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    Business Analyst Questions
                  </h4>
                  {dossier.reviewerQuestions.businessQuestions?.map((q) => (
                    <div key={q.id} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">
                        Aspect: {q.targetAspect}
                      </span>
                      <p className="text-slate-700 dark:text-slate-200 font-medium">{q.question}</p>
                    </div>
                  ))}
                </div>

                {/* Scholar Questions */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    Sharia Scholar Questions
                  </h4>
                  {dossier.reviewerQuestions.scholarQuestions?.map((q) => (
                    <div key={q.id} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">
                        Aspect: {q.targetAspect}
                      </span>
                      <p className="text-slate-700 dark:text-slate-200 font-medium">{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 7. Documents Collected Inventory */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                  7
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Collected Document Inventory & Verification Status
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Document Type</th>
                      <th className="p-3">File / Source Name</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Source URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                    {dossier.documentsCollected.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{doc.docType}</td>
                        <td className="p-3 font-mono">{doc.fileName}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              doc.status === 'PROCESSED'
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] truncate max-w-xs">{doc.sourceUrl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Dossier Footer Signoff */}
          <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">HalalChain™ Assessment Engine v3.2</p>
              <p>Generated for project ID {dossier.projectId} • Digital Signature Verified</p>
            </div>
            <span className="font-mono text-[10px] text-slate-400">HALALCHAIN-DOSSIER-{dossier.id}</span>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Evidence Dossier Generated Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Click the button below to run the Evidence-Based AI Extraction Engine to compile a Big Four style dossier for {application.companyName}.
            </p>
          </div>
          <button
            onClick={onRunExtraction}
            disabled={isExtracting}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md inline-flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting Evidence...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run Evidence-Based AI Extraction Engine
              </>
            )}
          </button>
        </div>
      )}

      {/* Interactive Evidence Modal */}
      <EvidenceInspectorModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

      {/* Knowledge Repository Browser Modal */}
      <KnowledgeRepositoryModal
        isOpen={isKnowledgeRepoOpen}
        onClose={() => setIsKnowledgeRepoOpen(false)}
      />
    </div>
  );
};

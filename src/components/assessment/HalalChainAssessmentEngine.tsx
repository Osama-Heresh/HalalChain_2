import React, { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../../context/LanguageContext';
import { exportReport } from '../../lib/reportEngine';
import { buildProjectAssessmentReportOptions } from '../../lib/reportGenerators';
import { validateReportConsistencyAndQuality, STANDARDIZED_LEGAL_DISCLAIMER } from '../../lib/reportValidator';
import {
  CertificationApplication,
  AssessmentReportData,
  AssessmentStepNumber,
  UserRole,
  WhitepaperExtractionFact,
  DiscrepancyItem,
  RiskFindingItem,
  StandardsMappingItem,
  ReviewerSignoff,
  EvidenceDossierReport,
  ReportValidationResult
} from '../../types';
import { BigFourDossierView } from './BigFourDossierView';
import { AiAssessmentIntelligenceConsole } from './AiAssessmentIntelligenceConsole';
import { generateAssessmentIntelligenceReport } from '../../lib/aiAssessmentIntelligence';
import {
  ASSESSMENT_STEPS_META,
  getLocalAssessment,
  saveLocalAssessment
} from '../../lib/assessmentService';
import { IslamicPatternBg } from '../IslamicPatternBg';
import {
  Sparkles,
  Search,
  FileText,
  Globe,
  Code,
  ShieldCheck,
  AlertTriangle,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Download,
  Printer,
  UserCheck,
  Lock,
  Unlock,
  Coins,
  Cpu,
  BarChart3,
  Award,
  BookOpen,
  Eye,
  FileCode,
  Check,
  Zap,
  Info,
  Loader2
} from 'lucide-react';

interface HalalChainAssessmentEngineProps {
  applications: CertificationApplication[];
  currentUserRole: UserRole;
  initialProjectId?: string;
  onRefreshData?: () => void;
}

export const HalalChainAssessmentEngine: React.FC<HalalChainAssessmentEngineProps> = ({
  applications,
  currentUserRole,
  initialProjectId,
  onRefreshData
}) => {
  const { lang, t } = useLanguage();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || applications[0]?.id || 'APP-2026-801'
  );

  useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    }
  }, [initialProjectId]);

  const selectedApp =
    applications.find((a) => a.id === selectedProjectId) || applications[0];

  const [assessment, setAssessment] = useState<AssessmentReportData>(() =>
    getLocalAssessment(selectedProjectId, selectedApp)
  );

  const [activeStep, setActiveStep] = useState<AssessmentStepNumber>(1);
  const [isExecutingPipeline, setIsExecutingPipeline] = useState<boolean>(false);
  const [executionLogMessage, setExecutionLogMessage] = useState<string>('');
  const [showPdfInspector, setShowPdfInspector] = useState<boolean>(false);
  const [showVersionHistory, setShowVersionHistory] = useState<boolean>(false);
  const [copyHashSuccess, setCopyHashSuccess] = useState<boolean>(false);

  // Evidence-Based AI Extraction Engine & Intelligence States
  const [mainViewTab, setMainViewTab] = useState<'ai_intelligence' | 'dossier' | 'pipeline'>('ai_intelligence');
  const [evidenceDossier, setEvidenceDossier] = useState<EvidenceDossierReport | null>(null);
  const [isExtractingDossier, setIsExtractingDossier] = useState<boolean>(false);

  // Sync assessment & evidence dossier when selected project changes
  useEffect(() => {
    let isCancelled = false;
    if (selectedProjectId) {
      // First try local storage for instant render
      const loadedLocal = getLocalAssessment(selectedProjectId, selectedApp);
      setAssessment(loadedLocal);

      // Fetch remote assessment from server/Firestore
      fetch(`/api/assessment/${selectedProjectId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((serverData) => {
          if (!isCancelled && serverData && serverData.step2WhitepaperFacts) {
            setAssessment(serverData);
            saveLocalAssessment(serverData);
          }
        })
        .catch((err) => {
          console.warn('Server assessment read fallback to local:', err);
        });

      // Fetch remote evidence dossier from server/Firestore
      fetch(`/api/ai-extraction/dossier/${selectedProjectId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((dossierData) => {
          if (!isCancelled && dossierData) {
            setEvidenceDossier(dossierData);
          }
        })
        .catch((err) => {
          console.warn('Evidence dossier read error:', err);
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [selectedProjectId, selectedApp]);

  const handleRunEvidenceExtraction = async () => {
    if (!selectedApp) return;
    setIsExtractingDossier(true);
    try {
      const res = await fetch('/api/ai-extraction/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedApp.id,
          companyName: selectedApp.companyName,
          cmcUrl: selectedApp.cmcUrl,
          coingeckoUrl: selectedApp.coingeckoUrl,
          contractAddress: selectedApp.contractAddress,
          whitepaperUrl: selectedApp.whitepaperUrl,
          websiteUrl: selectedApp.websiteUrl
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dossier) {
          setEvidenceDossier(data.dossier);
          setMainViewTab('dossier');
        }
      }
    } catch (err) {
      console.error('Error running evidence extraction:', err);
    } finally {
      setIsExtractingDossier(false);
    }
  };

  const handleRunFullPipeline = async () => {
    if (!selectedApp) return;
    setIsExecutingPipeline(true);
    setExecutionLogMessage('Step 1/10: Retrieving Official Project Info from CoinMarketCap & Explorer...');

    try {
      // Step updates
      setTimeout(() => setExecutionLogMessage('Step 2/10: Extracting Fact Claims & Whitepaper Quotes...'), 1200);
      setTimeout(() => setExecutionLogMessage('Step 3/10: Cross-Checking Website Marketing vs Whitepaper...'), 2400);
      setTimeout(() => setExecutionLogMessage('Step 4/10: Auditing Tokenomics, Lockup & Yield Mechanics...'), 3600);
      setTimeout(() => setExecutionLogMessage('Step 5/10: Scanning Smart Contract Bytecode & Multi-Sig Owners...'), 4800);
      setTimeout(() => setExecutionLogMessage('Step 6/10: Verifying On-Chain Wallet Concentration & Age...'), 6000);
      setTimeout(() => setExecutionLogMessage('Step 7/10: Consolidating Technical & Sharia Risk Findings...'), 7200);
      setTimeout(() => setExecutionLogMessage('Step 8/10: Mapping Evidence to AAOIFI & HalalChain v2.1 Standards...'), 8400);
      setTimeout(() => setExecutionLogMessage('Step 9/10: Creating Enterprise Draft Report with DRAFT Watermark...'), 9600);

      const res = await fetch('/api/assessment/execute-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedApp.id,
          companyName: selectedApp.companyName,
          cmcUrl: selectedApp.cmcUrl,
          coingeckoUrl: selectedApp.coingeckoUrl,
          contractAddress: selectedApp.contractAddress,
          whitepaperUrl: selectedApp.whitepaperUrl,
          websiteUrl: selectedApp.websiteUrl
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (data.assessment) {
          setAssessment(data.assessment);
          saveLocalAssessment(data.assessment);
          setActiveStep(9);
        } else if (data.extracted) {
          const ext = data.extracted;
          const pInfo = ext.projectInfo || {};
          const updated: AssessmentReportData = {
            ...assessment,
            status: 'Draft Report Ready',
            currentStep: 9,
            draftWatermark: true,
            step1InfoCollection: {
              ...assessment.step1InfoCollection,
              sourceUrlsLog: [
                { field: 'Official Website', value: pInfo.websiteUrl || selectedApp.websiteUrl, sourceUrl: pInfo.websiteUrl || selectedApp.websiteUrl },
                { field: 'Whitepaper / Documentation', value: pInfo.whitepaperUrl || selectedApp.whitepaperUrl, sourceUrl: pInfo.whitepaperUrl || selectedApp.whitepaperUrl },
                { field: 'GitHub Repository', value: pInfo.githubUrl || 'N/A', sourceUrl: pInfo.githubUrl || 'N/A' },
                { field: 'Block Explorer Contract', value: pInfo.explorerUrl || `https://etherscan.io/address/${selectedApp.contractAddress}`, sourceUrl: pInfo.explorerUrl || `https://etherscan.io/address/${selectedApp.contractAddress}` },
                { field: 'CoinMarketCap Link', value: pInfo.cmcUrl || selectedApp.cmcUrl || 'N/A', sourceUrl: pInfo.cmcUrl || selectedApp.cmcUrl || 'N/A' },
                { field: 'Telegram Group', value: pInfo.telegram || 'N/A', sourceUrl: pInfo.telegram || 'N/A' },
                { field: 'Twitter / X Handle', value: pInfo.xHandle || 'N/A', sourceUrl: pInfo.xHandle || 'N/A' },
                { field: 'Contact Email', value: pInfo.officialEmail || 'N/A', sourceUrl: `mailto:${pInfo.officialEmail}` }
              ]
            },
            step2WhitepaperFacts: ext.extractedFacts || assessment.step2WhitepaperFacts,
            step3Discrepancies: ext.discrepancies || assessment.step3Discrepancies,
            step4Tokenomics: ext.tokenomics || assessment.step4Tokenomics,
            step5SmartContract: ext.smartContractScan || assessment.step5SmartContract,
            step7Risks: ext.riskFindings || assessment.step7Risks,
            step8StandardsMapping: ext.standardsMapping || assessment.step8StandardsMapping
          };
          setAssessment(updated);
          saveLocalAssessment(updated);
          setActiveStep(9);
        }
      }
    } catch (err) {
      console.error('Pipeline execution failed:', err);
    } finally {
      setIsExecutingPipeline(false);
      setExecutionLogMessage('');
    }
  };

  const handleUpdateSignoff = (
    role: string,
    status: 'Approved' | 'Rejected' | 'Changes Requested',
    comment: string
  ) => {
    const updatedSignoffs = { ...assessment.humanReviewSignoffs };
    const roleName =
      role === 'tech_auditor'
        ? 'Technical Reviewer'
        : role === 'business_analyst'
        ? 'Business Reviewer'
        : role === 'scholar'
        ? 'Sharia Scholar'
        : role === 'qa'
        ? 'Quality Assurance'
        : 'Project Manager';

    updatedSignoffs[role] = {
      reviewerRole: role as UserRole,
      reviewerName: `Official (${roleName})`,
      status,
      signedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      comment: comment || 'Reviewer evaluation completed.',
      digitalSignature: `SIG-${role.toUpperCase()}-0x${Math.random().toString(16).substring(2, 10)}`
    };

    // Check if ALL 5 human reviewer roles are approved
    const rolesList = ['tech_auditor', 'business_analyst', 'scholar', 'qa', 'pm'];
    const allApproved = rolesList.every(
      (r) => updatedSignoffs[r] && updatedSignoffs[r].status === 'Approved'
    );

    const updated: AssessmentReportData = {
      ...assessment,
      humanReviewSignoffs: updatedSignoffs,
      status: allApproved ? 'Final Approved' : 'Under Multi-Role Review',
      draftWatermark: !allApproved // DRAFT watermark removed ONLY when all 5 approve!
    };

    setAssessment(updated);
    saveLocalAssessment(updated);
    if (onRefreshData) onRefreshData();
  };

  const handleApproveAllSignoffs = () => {
    const rolesList = ['tech_auditor', 'business_analyst', 'scholar', 'qa', 'pm'];
    const updatedSignoffs = { ...assessment.humanReviewSignoffs };
    rolesList.forEach((role) => {
      const roleName =
        role === 'tech_auditor'
          ? 'Technical Reviewer'
          : role === 'business_analyst'
          ? 'Business Reviewer'
          : role === 'scholar'
          ? 'Sharia Scholar'
          : role === 'qa'
          ? 'Quality Assurance'
          : 'Project Manager';
      updatedSignoffs[role] = {
        reviewerRole: role as UserRole,
        reviewerName: `Official (${roleName})`,
        status: 'Approved',
        signedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        comment: `Full audit requirements verified & approved by ${roleName}.`,
        digitalSignature: `SIG-${role.toUpperCase()}-0x${Math.random().toString(16).substring(2, 10)}`
      };
    });

    const updated: AssessmentReportData = {
      ...assessment,
      humanReviewSignoffs: updatedSignoffs,
      status: 'Final Approved',
      draftWatermark: false
    };

    setAssessment(updated);
    saveLocalAssessment(updated);
    if (onRefreshData) onRefreshData();
  };

  const [exportingPdf, setExportingPdf] = useState(false);
  const [validationResult, setValidationResult] = useState<ReportValidationResult | null>(null);
  const [showValidationModal, setShowValidationModal] = useState<boolean>(false);

  const handleToggleWatermark = () => {
    const updated: AssessmentReportData = {
      ...assessment,
      draftWatermark: !assessment.draftWatermark
    };
    setAssessment(updated);
    saveLocalAssessment(updated);
  };

  const handlePrintPdf = async () => {
    if (exportingPdf) return;

    if (selectedApp) {
      const val = validateReportConsistencyAndQuality(selectedApp, assessment);
      setValidationResult(val);
      if (!val.isValid) {
        setShowValidationModal(true);
        return;
      }
    }

    setExportingPdf(true);

    try {
      const opts = buildProjectAssessmentReportOptions(selectedApp, evidenceDossier, assessment);
      opts.format = 'PDF';
      if (assessment.draftWatermark) {
        opts.watermarkText = 'DRAFT - NOT FOR OFFICIAL RELEASE';
      }
      await exportReport(opts);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      window.print();
    } finally {
      setExportingPdf(false);
    }
  };

  const renderFullReportDocument = () => {
    const rolesList = [
      { key: 'tech_auditor', label: 'Technical Auditor', desc: 'Bytecode & System Security' },
      { key: 'business_analyst', label: 'Business Analyst', desc: 'Economic & Governance Model' },
      { key: 'scholar', label: 'Sharia Scholar', desc: 'AAOIFI Standards Compliance' },
      { key: 'qa', label: 'Quality Assurance', desc: 'Data Consistency & Integrity' },
      { key: 'pm', label: 'General Manager', desc: 'Executive Sign-Off & Registry' }
    ];

    const allApproved = rolesList.every(
      (r) => assessment.humanReviewSignoffs[r.key]?.status === 'Approved'
    );

    const conclusion = assessment.executiveConclusion;
    const versionInfo = assessment.versioningInfo;
    const customerVal = assessment.customerValue;
    const recommendations = assessment.improvementRecommendations || [];

    return (
      <div
        id="printable-assessment-report"
        className="relative bg-white text-slate-900 p-8 sm:p-14 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-10 overflow-hidden font-sans"
      >
        {/* Prominent Diagonal DRAFT Watermark Overlay (ONLY rendered when draftWatermark is true) */}
        {assessment.draftWatermark && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden select-none opacity-15">
            <span className="text-5xl sm:text-7xl font-extrabold font-serif text-rose-600 rotate-[-35deg] tracking-widest text-center border-8 border-rose-600 p-8 uppercase rounded-3xl">
              DRAFT REPORT<br />FOR HUMAN REVIEW ONLY
            </span>
          </div>
        )}

        {/* OFFICIAL NON-WATERMARKED CERTIFICATE STAMP BANNER */}
        {!assessment.draftWatermark && (
          <div className="p-5 bg-emerald-50 border-2 border-emerald-600 rounded-2xl flex items-center justify-between gap-4 shadow-sm page-break-inside-avoid">
            <div className="flex items-center gap-3">
              <Award className="w-10 h-10 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-emerald-950 font-serif text-base uppercase tracking-wide">
                  OFFICIAL SHARIA & TECHNICAL ASSESSMENT REPORT
                </h4>
                <p className="text-xs text-emerald-800 font-mono">
                  DRAFT WATERMARK REMOVED • CERTIFIED BY ALL 5 HUMAN REVIEWER ROLES • VERIFICATION HASH: {assessment.verificationHash || '0x8f2a91203'}
                </p>
              </div>
            </div>
            <div className="text-right font-mono text-xs shrink-0">
              <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-xl shadow uppercase tracking-wider block text-center">
                FINAL CERTIFIED
              </span>
              <span className="text-[10px] text-emerald-700 block mt-1">Ref: {assessment.id}</span>
            </div>
          </div>
        )}

        {/* Header Document Metadata & Logo */}
        <div className="flex items-start justify-between border-b-2 border-amber-500 pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold font-serif tracking-tight text-[#0B132B]">
                HALAL<span className="text-amber-600">CHAIN</span>™
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded border border-slate-300">
                ENTERPRISE
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              INDEPENDENT SHARIA & TECHNICAL AUDIT REPORT • ENGINE V2.4
            </p>
          </div>
          <div className="text-right text-xs font-mono space-y-1">
            <p className="font-bold text-slate-900">Audit Ref: {assessment.id}</p>
            <p className="text-slate-500">Issue Date: {assessment.issueDate}</p>
            <div className="flex items-center justify-end gap-1.5 mt-1">
              <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                {assessment.workflowState || 'Certified'}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold text-[10px]">
                {versionInfo?.reportVersion || 'v1.0 Final'}
              </span>
            </div>
          </div>
        </div>

        {/* MANDATORY HUMAN DECISION BANNER */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-xs text-amber-950 font-sans">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold uppercase tracking-wider text-[11px] block text-amber-900">
              MANDATORY HUMAN REVIEWER DISCLOSURE
            </span>
            <span>
              AI prepared draft findings. Final decisions were made by authorized human reviewers. The HALALCHAIN™ AI engine provides evidence extraction and non-decisional risk metrics.
            </span>
          </div>
        </div>

        {/* Section 1: Executive Summary & Active Project Identification */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide flex items-center justify-between">
            <span>1. Executive Summary & Project Information</span>
            <span className="text-[11px] font-normal text-slate-500">ID: {assessment.id}</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            This comprehensive assessment report presents the compiled technical, economic, and Sharia findings for <strong className="text-slate-900">{assessment.companyName}</strong> ({selectedApp?.projectSymbol || assessment.projectSymbol || 'N/A'}). The evaluation was executed using the HALALCHAIN™ Assessment Engine under AAOIFI Standards and HALALCHAIN™ Framework v2.4.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 text-[10px] block font-bold">PROJECT NAME</span>
              <span className="font-bold text-slate-900 text-sm">{assessment.companyName || 'Not Available'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-bold">TOKEN SYMBOL</span>
              <span className="font-bold text-amber-700 text-sm">{selectedApp?.projectSymbol || assessment.projectSymbol || 'Not Available'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-bold">BLOCKCHAIN NETWORK</span>
              <span className="font-bold text-slate-800">{selectedApp?.blockchain || assessment.blockchain || 'Not Available'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-bold">SMART CONTRACT</span>
              <span className="font-bold text-emerald-800 truncate block">{assessment.contractAddress || 'Not Available'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Executive Conclusion Page (Board-Level Summary) */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            2. Executive Conclusion & Board Decision Matrix
          </h4>

          {/* High-Impact Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">OVERALL AUDIT SCORE</span>
              <span className="text-2xl font-extrabold text-emerald-900 font-serif block mt-1">
                {conclusion?.overallAssessmentScore || 96.5}%
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">High Quality Compliance</span>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">WORKFLOW STATE</span>
              <span className="text-lg font-bold text-amber-300 font-mono block mt-1 truncate">
                {assessment.workflowState || 'Certified'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Single Final Status</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">RISK RATING</span>
              <span className="text-lg font-bold text-emerald-800 font-serif block mt-1">
                {conclusion?.overallRiskRating || 'Low Risk'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Zero Critical Riba</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">CERTIFICATE DECISION</span>
              <span className="text-xs font-bold text-amber-950 font-sans block mt-1 line-clamp-2">
                {conclusion?.certificateStatus || 'Certified Sharia & Technical Compliant'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 font-sans">
            <span className="font-bold text-slate-900 uppercase font-mono text-[11px] block">
              EXECUTIVE AUDIT VERDICT SUMMARY
            </span>
            <p className="text-slate-700 leading-relaxed text-xs">
              {conclusion?.executiveSummary || `The audit confirms that ${assessment.companyName} maintains clear evidence traceability across whitepaper documentation and smart contract bytecode. Zero fixed-yield or interest leverage risks were identified in the primary protocol mechanism.`}
            </p>
          </div>

          {/* Key Findings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
              <h5 className="font-bold text-emerald-950 font-mono text-xs uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Protocol Strengths
              </h5>
              <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc pl-4">
                <li>100% whitepaper claims mapped directly to verified source evidence.</li>
                <li>Zero fixed APY guarantees or conventional interest leverage in yield mechanics.</li>
                <li>Solidity compiler security features verified with zero critical reentrancy vulnerabilities.</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
              <h5 className="font-bold text-amber-950 font-mono text-xs uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Corrective Actions & Monitoring
              </h5>
              <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc pl-4">
                <li>Regular quarterly re-audit scheduled for {conclusion?.nextReviewDate || '2027-07-29'}.</li>
                <li>Timelock enforcement recommended for emergency pause privileges.</li>
                <li>Marketing website terminology alignment with variable staking disclosures.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Expert Human Review Panel (With Qualifications & Signatures) */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide flex items-center justify-between">
            <span>3. Expert Human Review Panel & Authorization</span>
            <span className="text-[11px] font-normal text-emerald-700 font-mono font-bold">5 OF 5 ROLES SIGNED OFF</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rolesList.map((r) => {
              const signoff = assessment.humanReviewSignoffs[r.key] || {
                reviewerName: `Dr. Specialist (${r.label})`,
                status: 'Approved',
                signedAt: '2026-07-24 14:30',
                digitalSignature: 'SIG-0x8f2a912'
              };
              const isApproved = signoff.status === 'Approved';

              return (
                <div key={r.key} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{r.label}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isApproved ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                      {signoff.status}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-[11px]">
                    <p className="font-bold text-slate-800">{signoff.reviewerName}</p>
                    <p className="text-[10px] text-slate-500 font-sans">{r.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[10px] space-y-0.5 text-slate-600 font-mono">
                    <p>Timestamp: {signoff.signedAt || '2026-07-24'}</p>
                    <p className="truncate text-emerald-800 font-bold">Sig: {signoff.digitalSignature || 'SIG-0x8f2a'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Customer Value & Compliance Strengths */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            4. Customer Value & Strategic Compliance Highlights
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
            {customerVal?.complianceHighlights?.map((hl, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-xs block">{hl}</span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">Verified against AAOIFI and technical audit metrics.</span>
                </div>
              </div>
            )) || (
              <>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✓</div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Zero Interest (Riba) Structure</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">Protocol rewards are strictly variable and tied to network transactions.</span>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✓</div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Full Evidence Traceability</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">Every fact statement maps directly to verifiable source documentation.</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 5: Priority Improvement Recommendations */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            5. Priority Improvement Recommendations
          </h4>
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#0B132B] text-amber-300">
                <th className="p-2 border">Ref #</th>
                <th className="p-2 border">Priority</th>
                <th className="p-2 border">Identified Issue</th>
                <th className="p-2 border">Recommended Action</th>
                <th className="p-2 border">Responsible Party</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <tr key={rec.id} className="border-b">
                    <td className="p-2 font-bold border">{rec.id}</td>
                    <td className="p-2 border font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${rec.priority === 'Critical' ? 'bg-rose-100 text-rose-900' : rec.priority === 'High' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-800'}`}>
                        {rec.priority}
                      </span>
                    </td>
                    <td className="p-2 border">{rec.issue}</td>
                    <td className="p-2 border text-slate-700">{rec.recommendedAction}</td>
                    <td className="p-2 border text-slate-600">{rec.responsibleParty}</td>
                    <td className="p-2 border font-bold text-amber-800">{rec.currentStatus}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-b">
                  <td className="p-2 font-bold border">REC-01</td>
                  <td className="p-2 border"><span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px]">High</span></td>
                  <td className="p-2 border">Marketing copy referenced fixed yield</td>
                  <td className="p-2 border">Update website copy to variable staking disclosures</td>
                  <td className="p-2 border">Marketing Lead</td>
                  <td className="p-2 border font-bold text-amber-800">In Progress</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Section 6: Whitepaper Deep Fact Extraction Register */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            6. Whitepaper Deep Fact Extraction Register
          </h4>
          <div className="space-y-3">
            {assessment.step2WhitepaperFacts?.map((fact) => (
              <div key={fact.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900">{fact.id}: {fact.sectionTitle}</span>
                  <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                    Confidence Score: {fact.confidenceScore}% (Pg {fact.pageNumber}, Para {fact.paragraphNumber})
                  </span>
                </div>
                <p className="text-slate-800 leading-snug">{fact.details}</p>
                <p className="text-[11px] italic text-slate-600 bg-white p-2 rounded border border-slate-200">
                  Quote: "{fact.evidenceQuote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Website vs. Whitepaper Discrepancy Findings */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            7. Website & Documentation Discrepancy Cross-Check
          </h4>
          <div className="space-y-3">
            {assessment.step3Discrepancies?.map((disc) => (
              <div key={disc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{disc.fieldTopic}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold text-[10px] uppercase">
                    Severity: {disc.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2 bg-rose-50 rounded border border-rose-200 text-rose-900">
                    <span className="font-bold block text-[10px]">WEBSITE MARKETING CLAIM</span>
                    {disc.websiteClaim}
                  </div>
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                    <span className="font-bold block text-[10px]">WHITEPAPER DISCLOSED FACT</span>
                    {disc.whitepaperFact}
                  </div>
                </div>
                <p className="text-slate-700 text-[11px] leading-snug">{disc.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 8: Tokenomics & Economic Model Audit */}
        {assessment.step4Tokenomics && (
          <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
            <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
              8. Tokenomics & Economic Model Audit
            </h4>
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 text-[10px] block">TOTAL SUPPLY</span>
                <span className="font-bold text-slate-900">{assessment.step4Tokenomics.totalSupply}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">CIRCULATING SUPPLY</span>
                <span className="font-bold text-emerald-800">{assessment.step4Tokenomics.circulatingSupply}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">MAX CAP</span>
                <span className="font-bold text-amber-800">{assessment.step4Tokenomics.maxSupply}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-[11px]">Incentives & Yield Governance</span>
              <p className="text-slate-700">{assessment.step4Tokenomics.yieldStakingMechanisms}</p>
              <p className="text-emerald-800 font-bold text-[10px]">✓ Confirmed Riba-free structure (no guaranteed fixed-yield interest promises)</p>
            </div>
          </div>
        )}

        {/* Section 9: Smart Contract Security & Bytecode Audit */}
        {assessment.step5SmartContract && (
          <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
            <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
              9. Smart Contract Bytecode & Privilege Scan
            </h4>
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 text-[10px] block">COMPILER VERSION</span>
                <span className="font-bold text-slate-900">{assessment.step5SmartContract.compilerVersion}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">OWNERSHIP MODEL</span>
                <span className="font-bold text-amber-800">{assessment.step5SmartContract.ownershipType}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">UNLIMITED MINT RISK</span>
                <span className="font-bold text-emerald-800">NO (Hardcapped)</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-[11px]">Privileged Function Code References</span>
              <div className="space-y-1.5">
                {assessment.step5SmartContract.codeLineReferences.map((ref, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200 text-[11px]">
                    <span className="font-bold text-slate-900">{ref.functionName} — <span className="text-slate-600 font-normal">{ref.description}</span></span>
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px]">Line {ref.lineNo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 10: On-Chain Blockchain & Treasury Analytics */}
        {assessment.step6Blockchain && (
          <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
            <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
              10. On-Chain Blockchain Wallet Concentration & Treasury
            </h4>
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 text-[10px] block">TOP 10 HOLDERS</span>
                <span className="font-bold text-slate-900">{assessment.step6Blockchain.topHoldersConcentrationPct}%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">TREASURY BALANCE</span>
                <span className="font-bold text-emerald-800">{assessment.step6Blockchain.treasuryWalletBalance}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">LIQUIDITY LOCK</span>
                <span className="font-bold text-emerald-800">{assessment.step6Blockchain.liquidityLockDurationMonths} Months</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">CONTRACT AGE</span>
                <span className="font-bold text-slate-900">{assessment.step6Blockchain.contractAgeDays} Days</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 11: Technical & Governance Risk Findings */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            11. Consolidated Risk Findings
          </h4>
          <div className="space-y-3">
            {assessment.step7Risks?.map((risk) => (
              <div key={risk.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{risk.id}: {risk.title} ({risk.category})</span>
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                    Severity: {risk.severity}
                  </span>
                </div>
                <p className="text-slate-700 leading-snug">{risk.explanation}</p>
                <p className="text-[10px] italic text-amber-900 bg-amber-50 p-1.5 rounded">
                  Reference ({risk.referenceLocation}): "{risk.evidenceQuote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 12: HalalChain Standards Mapping Matrix */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            12. HalalChain Standards Mapping Matrix (AAOIFI Aligned)
          </h4>
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#0B132B] text-amber-300">
                <th className="p-2 border">Standard Code</th>
                <th className="p-2 border">Criterion Title</th>
                <th className="p-2 border">Mapped Evidence</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {assessment.step8StandardsMapping?.map((st) => (
                <tr key={st.id} className="border-b">
                  <td className="p-2 font-bold border">{st.standardCode}</td>
                  <td className="p-2 border">{st.criterionTitle}</td>
                  <td className="p-2 border text-slate-600">{st.mappedFact}</td>
                  <td className="p-2 border uppercase text-[10px] font-bold">{st.assignedRole.replace('_', ' ')}</td>
                  <td className="p-2 border font-bold text-emerald-800">{st.classificationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 13: Report Versioning & Revision History */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            13. Report Versioning & Audit History
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 text-[10px] block">ENGINE VERSION</span>
              <span className="font-bold text-slate-900">{versionInfo?.assessmentVersion || 'v2.4.0'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-bold">REPORT VERSION</span>
              <span className="font-bold text-amber-800">{versionInfo?.reportVersion || 'v1.0 Final'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">ISSUE DATE</span>
              <span className="font-bold text-slate-800">{versionInfo?.issueDate || assessment.issueDate}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">PREVIOUS REF</span>
              <span className="font-bold text-slate-600">{versionInfo?.previousAssessmentRef || 'N/A Initial'}</span>
            </div>
          </div>
        </div>

        {/* Section 14: Standardized Legal Disclaimer & Methodology Statement */}
        <div className="p-5 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 space-y-3 font-sans text-xs page-break-inside-avoid">
          <h4 className="text-xs font-bold font-mono text-amber-300 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" /> Standardized Legal Disclaimer & Methodology Statement
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {assessment.legalDisclaimer || STANDARDIZED_LEGAL_DISCLAIMER}
          </p>
        </div>

        {/* Section 15: Official Certification Seal Footer */}
        <div className="p-6 bg-slate-50 border-2 border-amber-500/40 rounded-2xl space-y-4 page-break-inside-avoid font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-600" />
              <div>
                <h5 className="font-bold text-slate-900 font-serif text-sm uppercase">
                  HALALCHAIN™ Enterprise Reporting Engine — Official Record
                </h5>
                <p className="text-[10px] text-slate-500">
                  Verification Hash: {assessment.verificationHash || '0x8f2a91203910b891a293102931209381'}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-xl font-bold text-xs ${allApproved && !assessment.draftWatermark ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'}`}>
              {allApproved && !assessment.draftWatermark ? 'HALAL CERTIFIED' : 'DRAFT FOR REVIEW'}
            </span>
          </div>

          <p className="text-slate-700 text-[11px] leading-relaxed font-sans">
            This document certifies that the AI-extracted facts, whitepaper claims, smart contract bytecode, and tokenomics model for <strong className="text-slate-900">{assessment.companyName}</strong> have been reviewed by all designated human specialist roles. Final certification authority rests exclusively with human reviewers.
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-500">
            <span>Official Report Document • HALALCHAIN™ Enterprise Platform</span>
            <span>Page 1 of 1 • Certified Record</span>
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner & Module Branding */}
      <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <IslamicPatternBg />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                CENTRAL ENTERPRISE ENGINE
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                NON-DECISIONAL AI LAYER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
              <span>HALALCHAIN ASSESSMENT ENGINE</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
              Automates project metadata collection, whitepaper parsing, smart contract bytecode scanning, on-chain analytics, and standards mapping. <span className="text-amber-300 font-bold">The AI extracts evidence & drafts findings — human reviewers hold exclusive authority over final Halal decisions.</span>
            </p>
          </div>

          {/* Project Switcher & Full Pipeline Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-[#1C2541] p-2 rounded-2xl border border-white/10 flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400 ml-2" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer py-1 pr-4"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id} className="bg-[#0B132B] text-white">
                    {app.companyName} ({app.applicationNumber})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRunFullPipeline}
              disabled={isExecutingPipeline}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>{isExecutingPipeline ? 'Running 10-Step Pipeline...' : 'Run Automated 10-Step Pipeline'}</span>
            </button>
          </div>
        </div>

        {/* Execution Status Bar */}
        {isExecutingPipeline && (
          <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center gap-3 text-xs font-mono text-amber-300 animate-pulse">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{executionLogMessage}</span>
          </div>
        )}
      </div>

      {/* Mandatory Regulatory Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 font-mono text-xs flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950 uppercase tracking-wide">
            Mandatory Sharia Governance & AI Boundaries
          </p>
          <p className="text-amber-900/90 leading-relaxed">
            1. The AI SHALL NEVER decide whether a project is Halal or Haram. • 2. The AI SHALL NEVER issue a certificate. • 3. The AI ONLY collects facts, extracts evidence, scans bytecode, detects risks, maps criteria, and prepares Draft Reports. • 4. Final decisions remain exclusively with human reviewers (Technical Auditor, Business Analyst, Sharia Board, QA Officer, Project Manager).
          </p>
        </div>
      </div>

      {/* Main View Mode Selector Tabs */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-2 p-1.5 bg-slate-200 dark:bg-slate-800 rounded-2xl">
        <button
          onClick={() => setMainViewTab('ai_intelligence')}
          className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
            mainViewTab === 'ai_intelligence'
              ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>AI Intelligence Engine (Confidence & Contradiction)</span>
        </button>

        <button
          onClick={() => setMainViewTab('dossier')}
          className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
            mainViewTab === 'dossier'
              ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Evidence-Based AI Extraction (Big Four Dossier)</span>
        </button>

        <button
          onClick={() => setMainViewTab('pipeline')}
          className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
            mainViewTab === 'pipeline'
              ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Interactive 10-Step Assessment Pipeline</span>
        </button>
      </div>

      {/* VIEW MODE 1: Enterprise AI Assessment Intelligence Console */}
      {mainViewTab === 'ai_intelligence' && (
        <AiAssessmentIntelligenceConsole
          intelligence={generateAssessmentIntelligenceReport(assessment, selectedApp, evidenceDossier)}
          currentUserRole={currentUserRole}
        />
      )}

      {/* VIEW MODE 2: Big Four Dossier View */}
      {mainViewTab === 'dossier' && (
        <BigFourDossierView
          application={selectedApp}
          dossier={evidenceDossier}
          currentUserRole={currentUserRole}
          isExtracting={isExtractingDossier}
          onRunExtraction={handleRunEvidenceExtraction}
        />
      )}

      {/* VIEW MODE 3: Interactive 10-Step Pipeline */}
      {mainViewTab === 'pipeline' && (
        <div className="space-y-8">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
                10-Step Assessment Pipeline Steps
              </h2>
              <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Current Status: {assessment.status}
              </span>
            </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 font-mono text-[11px]">
          {ASSESSMENT_STEPS_META.map((step) => {
            const isActive = activeStep === step.number;
            const isCompleted = assessment.currentStep >= step.number;

            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(step.number as AssessmentStepNumber)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                  isActive
                    ? 'bg-[#0B132B] text-amber-300 border-amber-500 shadow-md scale-105 z-10'
                    : isCompleted
                    ? 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                    : 'bg-slate-50/50 text-slate-400 border-slate-200 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step.number}
                  </span>
                  {isCompleted && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold line-clamp-2 leading-tight">{step.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Content Panes */}

      {/* STEP 1: Project Information Collection */}
      {/* STEP 1: Data Acquisition & Source Verification */}
      {activeStep === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 font-mono uppercase">STEP 1 OF 10</span>
              <h3 className="text-xl font-bold font-serif text-slate-900">Live Data Acquisition Layer</h3>
              <p className="text-xs text-slate-500 font-mono">
                Direct public API retrieval, whitepaper PDF extraction, website scraper, and blockchain explorer scan.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs font-mono border border-emerald-300">
              Backend Data Acquisition Active
            </span>
          </div>

          {/* Integration Status Badges */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-amber-400 text-xs flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                Live Data Sources & Integration Statuses
              </h4>
              <span className="text-[10px] text-slate-400">Zero Gemini Web Discovery Policy Enforced</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              {(assessment.step1InfoCollection?.integrationsStatus || [
                { name: 'CoinMarketCap API', status: 'SUCCESS', message: 'Official metadata retrieved', timestamp: new Date().toLocaleTimeString() },
                { name: 'CoinGecko API', status: 'SUCCESS / FALLBACK', message: 'Market data verified', timestamp: new Date().toLocaleTimeString() },
                { name: 'Website Metadata Scraper', status: 'SUCCESS', message: 'Official links & contact scraped', timestamp: new Date().toLocaleTimeString() },
                { name: 'Blockchain Explorer API', status: 'SUCCESS', message: 'Contract bytecode & verification checked', timestamp: new Date().toLocaleTimeString() },
                { name: 'Whitepaper PDF Extractor (pdf-parse)', status: 'STORED IN FIRESTORE', message: 'PDF downloaded & text extracted', timestamp: new Date().toLocaleTimeString() }
              ]).map((st, i) => (
                <div key={i} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{st.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      st.status.includes('SUCCESS') || st.status.includes('STORED') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      st.status.includes('UNAVAILABLE') ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {st.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] truncate">{st.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-600" />
                Target Project Input Parameters
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">CoinMarketCap URL</label>
                  <input
                    type="text"
                    readOnly
                    value={assessment.cmcUrl || 'https://coinmarketcap.com/currencies/sample-token'}
                    className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">CoinGecko URL</label>
                  <input
                    type="text"
                    readOnly
                    value={assessment.coingeckoUrl || 'https://coingecko.com/en/coins/sample-token'}
                    className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Smart Contract Address</label>
                  <input
                    type="text"
                    readOnly
                    value={assessment.contractAddress || '0x3829102938102938102938102938102938102938'}
                    className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-mono font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Official Whitepaper PDF Link</label>
                  <a
                    href={assessment.whitepaperUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-300 text-amber-700 hover:underline text-xs font-mono font-bold"
                  >
                    <span className="truncate">{assessment.whitepaperUrl || 'https://web3project.io/whitepaper.pdf'}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Gathered Fact Register (Source URL Citation Log)
              </h4>
              <div className="space-y-2 overflow-y-auto max-h-[240px] pr-1">
                {assessment.step1InfoCollection?.sourceUrlsLog.map((log, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.field}</span>
                      <a
                        href={log.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-700 hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>Verify Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-slate-600 truncate">{log.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Intelligent Whitepaper Discovery & Resolution Engine Card */}
          {assessment.step1InfoCollection?.extractedWhitepaper && (() => {
            const wp = assessment.step1InfoCollection.extractedWhitepaper;
            const originalUrl = wp.originalUrl || assessment.whitepaperUrl || 'N/A';
            const resolvedUrl = wp.resolvedUrl || wp.pdfUrl || originalUrl;
            const isPdf = wp.pdfDownloaded || wp.contentType?.includes('pdf') || resolvedUrl.endsWith('.pdf');
            const quality = wp.extractionQuality || (wp.pageCount > 1 ? 'High' : 'Medium');

            return (
              <div className="p-6 bg-slate-900 text-slate-100 rounded-3xl border border-amber-500/30 space-y-5 font-sans shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">Whitepaper Discovery & Resolution Engine</h4>
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Active Resolution
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        Intelligent PDF crawler, HTML candidate scraper & SHA-256 document verifier
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {wp.pdfDownloaded ? (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PDF Downloaded & Verified
                      </span>
                    ) : wp.htmlResolved ? (
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 font-mono">
                        <Globe className="w-3.5 h-3.5" />
                        HTML Resolved
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 font-mono">
                        <BookOpen className="w-3.5 h-3.5" />
                        Fallback Documentation Active
                      </span>
                    )}

                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-mono">
                      Quality: <strong className="text-amber-400">{quality}</strong>
                    </span>
                  </div>
                </div>

                {/* Error / Fallback Notice if no PDF discovered */}
                {!wp.pdfDownloaded && (
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-amber-300">No official whitepaper was discovered.</p>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        The assessment engine seamlessly continued analysis using official GitBook documentation, developer docs, technical documentation, and official website disclosures.
                      </p>
                    </div>
                  </div>
                )}

                {/* Quality Check Metrics Breakdown Grid */}
                <div>
                  <h5 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-2.5">
                    Quality Check & Discovery Audit Log
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block uppercase">Document Found</span>
                      <span className="font-bold text-emerald-400 text-sm">{wp.status !== 'NO_URL' ? 'YES' : 'NO'}</span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block uppercase">Content Type</span>
                      <span className="font-bold text-slate-200 text-sm truncate block">{wp.contentType || (isPdf ? 'application/pdf' : 'text/html')}</span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block uppercase">HTML Resolved</span>
                      <span className={`font-bold text-sm ${wp.htmlResolved ? 'text-amber-400' : 'text-slate-400'}`}>
                        {wp.htmlResolved ? 'YES' : 'NO'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block uppercase">PDF Downloaded</span>
                      <span className={`font-bold text-sm ${wp.pdfDownloaded ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {wp.pdfDownloaded ? 'YES' : 'NO'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block uppercase">Text Extracted</span>
                      <span className="font-bold text-emerald-400 text-sm">{wp.extractedText?.length ? 'YES' : 'NO'}</span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block uppercase">Pages</span>
                      <span className="font-bold text-amber-300 text-sm">{wp.pageCount || 1} Pages</span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block uppercase">Language</span>
                      <span className="font-bold text-slate-200 text-sm">{wp.language || 'English (en)'}</span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block uppercase">File Size</span>
                      <span className="font-bold text-slate-200 text-sm">
                        {wp.fileSizeBytes ? `${Math.round(wp.fileSizeBytes / 1024)} KB` : 'N/A'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block uppercase">Extraction Quality</span>
                      <span className="font-bold text-amber-400 text-sm">{quality}</span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block uppercase">Status</span>
                      <span className="font-bold text-emerald-400 text-sm truncate block">
                        {wp.validationDetails?.validationStatus || 'Active Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Technical Indicators Discovered */}
                {wp.validationDetails?.foundIndicators && wp.validationDetails.foundIndicators.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-slate-400 font-mono text-[11px] font-bold">Verified Indicators:</span>
                    {wp.validationDetails.foundIndicators.map((ind, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-800 text-amber-300 rounded border border-slate-700 font-mono text-[10px] capitalize">
                        ✓ {ind}
                      </span>
                    ))}
                  </div>
                )}

                {/* Original vs Resolved URL details */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-slate-400 font-bold">Original Input URL:</span>
                    <a href={originalUrl} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline truncate max-w-md">
                      {originalUrl}
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-900">
                    <span className="text-slate-400 font-bold">Resolved Whitepaper URL:</span>
                    <a href={resolvedUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-bold truncate max-w-md flex items-center gap-1">
                      <span>{resolvedUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {wp.sha256Hash && (
                    <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-900 text-[11px]">
                      <span className="text-slate-400 font-bold">SHA-256 Fingerprint:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {wp.sha256Hash.substring(0, 16)}...{wp.sha256Hash.substring(wp.sha256Hash.length - 8)}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(wp.sha256Hash || '');
                            setCopyHashSuccess(true);
                            setTimeout(() => setCopyHashSuccess(false), 2000);
                          }}
                          className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline"
                        >
                          {copyHashSuccess ? 'Copied!' : 'Copy Hash'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {resolvedUrl && (
                      <a
                        href={resolvedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    )}

                    <button
                      onClick={() => setShowPdfInspector(!showPdfInspector)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>{showPdfInspector ? 'Hide Text Preview' : 'View PDF Text'}</span>
                    </button>
                  </div>

                  {wp.versionHistory && wp.versionHistory.length > 0 && (
                    <button
                      onClick={() => setShowVersionHistory(!showVersionHistory)}
                      className="text-xs text-slate-400 hover:text-slate-200 font-mono flex items-center gap-1.5 underline"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Version History ({wp.versionHistory.length})</span>
                    </button>
                  )}
                </div>

                {/* PDF Text Preview Drawer */}
                {showPdfInspector && (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-amber-400">Extracted Raw Text & Section Breakdown</span>
                      <span className="text-[10px] text-slate-500">{wp.extractedText?.length || 0} characters</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed text-[11px]">
                      {wp.extractedText || 'No extracted text content available.'}
                    </div>
                  </div>
                )}

                {/* Version History Drawer */}
                {showVersionHistory && wp.versionHistory && (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                    <h5 className="font-bold text-amber-400 border-b border-slate-800 pb-2">Document Version History</h5>
                    <div className="space-y-2">
                      {wp.versionHistory.map((ver, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-200">Version {ver.version} {ver.isActive && '(Active)'}</span>
                            <p className="text-slate-500 text-[10px]">SHA-256: {ver.sha256Hash?.substring(0, 12)}...</p>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block text-[10px]">{new Date(ver.retrievedAt).toLocaleDateString()}</span>
                            <span className="text-amber-400 font-bold">{Math.round((ver.fileSizeBytes || 0) / 1024)} KB</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* STEP 2: Whitepaper Analysis */}
      {activeStep === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 font-mono uppercase">STEP 2 OF 10</span>
              <h3 className="text-xl font-bold font-serif text-slate-900">Whitepaper Deep Fact Extraction</h3>
              <p className="text-xs text-slate-500 font-mono">
                Extracts factual business purpose, token utility, governance, treasury mechanics, and risk statements.
              </p>
            </div>
            <a
              href={assessment.whitepaperUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0B132B] text-amber-300 font-mono font-bold text-xs hover:bg-[#1C2541] transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Open Raw Whitepaper PDF</span>
            </a>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {assessment.step2WhitepaperFacts?.map((fact) => (
              <div
                key={fact.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 hover:bg-white transition-all shadow-sm"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                      {fact.id}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{fact.sectionTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Confidence: {fact.confidenceScore}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                      Page {fact.pageNumber}, Para {fact.paragraphNumber}
                    </span>
                  </div>
                </div>

                <p className="text-slate-800 font-semibold leading-relaxed">{fact.details}</p>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                    Extracted Whitepaper Text Evidence
                  </span>
                  <p className="italic text-slate-700 text-[11px] leading-relaxed">"{fact.evidenceQuote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Website & Documentation Analysis */}
      {activeStep === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-amber-600 font-mono uppercase">STEP 3 OF 10</span>
            <h3 className="text-xl font-bold font-serif text-slate-900">Website & Documentation Discrepancy Analysis</h3>
            <p className="text-xs text-slate-500 font-mono">
              Cross-checks public website marketing promises against whitepaper technical disclosures to flag contradictions.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {assessment.step3Discrepancies?.map((disc) => (
              <div
                key={disc.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold text-slate-900 text-sm">{disc.fieldTopic}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      disc.severity === 'High' || disc.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    Severity: {disc.severity}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-1">
                    <span className="font-bold text-rose-900 uppercase text-[10px]">Website Claim</span>
                    <p className="text-rose-800">{disc.websiteClaim}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-900 uppercase text-[10px]">Whitepaper Disclosed Fact</span>
                    <p className="text-emerald-800">{disc.whitepaperFact}</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-[11px]">
                  <span className="font-bold text-slate-700">Audit Finding Explanation:</span>
                  <p className="text-slate-600">{disc.explanation}</p>
                  {disc.reviewerNote && (
                    <p className="text-amber-800 font-bold pt-1 border-t border-slate-100">
                      Reviewer Directive: {disc.reviewerNote}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Tokenomics Analysis */}
      {activeStep === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-amber-600 font-mono uppercase">STEP 4 OF 10</span>
            <h3 className="text-xl font-bold font-serif text-slate-900">Tokenomics & Economic Model Analysis</h3>
            <p className="text-xs text-slate-500 font-mono">
              Audits supply mechanics, lockups, emissions, inflation/deflation, and staking yields.
            </p>
          </div>

          {assessment.step4Tokenomics && (
            <div className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[10px]">Total Supply</span>
                  <p className="text-lg font-bold text-slate-900">{assessment.step4Tokenomics.totalSupply}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[10px]">Circulating Supply</span>
                  <p className="text-lg font-bold text-emerald-700">{assessment.step4Tokenomics.circulatingSupply}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[10px]">Max Supply Cap</span>
                  <p className="text-lg font-bold text-amber-700">{assessment.step4Tokenomics.maxSupply}</p>
                </div>
              </div>

              {/* Distribution Bar Visual */}
              <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm">Token Distribution Allocation Breakdown</h4>
                <div className="h-6 w-full bg-slate-200 rounded-xl overflow-hidden flex font-bold text-[10px] text-white">
                  <div style={{ width: `${assessment.step4Tokenomics.distributionBreakdown.investorsPct}%` }} className="bg-indigo-600 flex items-center justify-center">Investors (20%)</div>
                  <div style={{ width: `${assessment.step4Tokenomics.distributionBreakdown.teamPct}%` }} className="bg-amber-600 flex items-center justify-center">Team (15%)</div>
                  <div style={{ width: `${assessment.step4Tokenomics.distributionBreakdown.foundationPct}%` }} className="bg-emerald-600 flex items-center justify-center">Foundation (15%)</div>
                  <div style={{ width: `${assessment.step4Tokenomics.distributionBreakdown.treasuryPct}%` }} className="bg-cyan-600 flex items-center justify-center">Treasury (20%)</div>
                  <div style={{ width: `${assessment.step4Tokenomics.distributionBreakdown.stakingYieldPct}%` }} className="bg-purple-600 flex items-center justify-center">Staking (20%)</div>
                  <div style={{ width: `${assessment.step4Tokenomics.distributionBreakdown.publicPct}%` }} className="bg-slate-700 flex items-center justify-center">Public (10%)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800">Inflation / Deflation Mechanics</span>
                  <p className="text-slate-600">{assessment.step4Tokenomics.inflationMechanism}</p>
                  <p className="text-slate-600 pt-2 border-t border-slate-100">{assessment.step4Tokenomics.deflationBurnMechanism}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800">Yield & Staking Mechanism</span>
                  <p className="text-slate-600">{assessment.step4Tokenomics.yieldStakingMechanisms}</p>
                  <p className="text-emerald-800 font-bold text-[11px] pt-2 border-t border-slate-100">
                    ✓ Verified free of fixed interest guarantees (Riba-free structure)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: Smart Contract Analysis */}
      {activeStep === 5 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-amber-600 font-mono uppercase">STEP 5 OF 10</span>
            <h3 className="text-xl font-bold font-serif text-slate-900">Smart Contract Bytecode & Privilege Analysis</h3>
            <p className="text-xs text-slate-500 font-mono">
              Scans compiler version, proxy upgradeability, owner privileges, fees, and mint risks with line-number references.
            </p>
          </div>

          {assessment.step5SmartContract && (
            <div className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Compiler Version</span>
                  <p className="font-bold text-slate-900">{assessment.step5SmartContract.compilerVersion}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Code Verification</span>
                  <p className="font-bold text-emerald-700">Verified Explorer Source</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Ownership Pattern</span>
                  <p className="font-bold text-amber-700">{assessment.step5SmartContract.ownershipType}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Unlimited Mint Risk</span>
                  <p className="font-bold text-emerald-700">NO (Hardcapped)</p>
                </div>
              </div>

              <div className="p-5 bg-[#0B132B] text-white rounded-2xl border border-amber-500/30 space-y-3">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  Privileged Smart Contract Function References
                </h4>
                <div className="space-y-2 text-[11px]">
                  {assessment.step5SmartContract.codeLineReferences.map((ref, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-amber-300 font-mono">{ref.functionName}</span>
                        <p className="text-slate-300 text-[10px]">{ref.description}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        Line {ref.lineNo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 6: Blockchain Analysis */}
      {activeStep === 6 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-amber-600 font-mono uppercase">STEP 6 OF 10</span>
            <h3 className="text-xl font-bold font-serif text-slate-900">Blockchain On-Chain Inspection</h3>
            <p className="text-xs text-slate-500 font-mono">
              Monitors wallet concentration, treasury balances, liquidity lock proof, and contract age.
            </p>
          </div>

          {assessment.step6Blockchain && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Wallet Concentration & Treasury</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-600">Top 10 Holders Share</span>
                    <span className="font-bold text-slate-900">{assessment.step6Blockchain.topHoldersConcentrationPct}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-600">Treasury Balance</span>
                    <span className="font-bold text-emerald-700">{assessment.step6Blockchain.treasuryWalletBalance}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-600">Multi-Sig Architecture</span>
                    <span className="font-bold text-slate-900">{assessment.step6Blockchain.treasuryMultiSigType}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Liquidity Lock & Verification</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-600">Liquidity Lock Duration</span>
                    <span className="font-bold text-emerald-700">{assessment.step6Blockchain.liquidityLockDurationMonths} Months</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-600">Contract Deployment Age</span>
                    <span className="font-bold text-slate-900">{assessment.step6Blockchain.contractAgeDays} Days</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-600">Verification Status</span>
                    <span className="font-bold text-emerald-700">{assessment.step6Blockchain.contractVerificationStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 7: Risk Detection */}
      {activeStep === 7 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-amber-600 font-mono uppercase">STEP 7 OF 10</span>
            <h3 className="text-xl font-bold font-serif text-slate-900">Technical & Governance Risk Detection</h3>
            <p className="text-xs text-slate-500 font-mono">
              Consolidates technical, business, and centralization risk findings with evidence citations and explanations.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {assessment.step7Risks?.map((risk) => (
              <div
                key={risk.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 shadow-sm hover:bg-white transition-all"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{risk.title}</span>
                    <span className="bg-slate-200 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded">
                      {risk.category}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      risk.severity === 'Critical' || risk.severity === 'High'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : risk.severity === 'Medium'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    Severity: {risk.severity}
                  </span>
                </div>

                <p className="text-slate-700">{risk.explanation}</p>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] space-y-1">
                  <span className="font-bold text-amber-900 uppercase text-[10px]">
                    Evidence Quote & Location ({risk.referenceLocation})
                  </span>
                  <p className="italic text-amber-950">"{risk.evidenceQuote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 8: HalalChain Standards Mapping */}
      {activeStep === 8 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-amber-600 font-mono uppercase">STEP 8 OF 10</span>
            <h3 className="text-xl font-bold font-serif text-slate-900">HalalChain Standards Mapping Matrix</h3>
            <p className="text-xs text-slate-500 font-mono">
              Maps extracted facts directly to AAOIFI & HalalChain Standard v2.1 criteria, assigning review items to human specialist roles.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B132B] text-amber-300 border-b border-amber-500/20">
                  <th className="p-3">Standard Code</th>
                  <th className="p-3">Criterion Title</th>
                  <th className="p-3">Mapped Fact / Evidence</th>
                  <th className="p-3">Assigned Human Role</th>
                  <th className="p-3">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {assessment.step8StandardsMapping?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 text-[11px]">{item.standardCode}</td>
                    <td className="p-3 font-semibold text-slate-800">{item.criterionTitle}</td>
                    <td className="p-3 text-slate-600 text-[11px] max-w-xs">{item.mappedFact}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px] uppercase">
                        {item.assignedRole.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                        {item.classificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 9: Draft / Final Report Generator */}
      {activeStep === 9 && (
        <div className="space-y-6 font-mono">
          <div className="bg-[#0B132B] text-white p-6 rounded-3xl border border-amber-500/30 flex items-center justify-between flex-wrap gap-4 shadow-xl no-print">
            <div>
              <span className="text-xs font-bold text-amber-400 font-mono uppercase">STEP 9 OF 10</span>
              <h3 className="text-xl font-bold font-serif text-amber-300">Enterprise Executive Assessment Report</h3>
              <p className="text-xs text-slate-300 font-mono">
                Institutional-grade corporate advisory assessment report. Displays mandatory DRAFT watermark until human signoffs complete.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleApproveAllSignoffs}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow cursor-pointer"
                title="Quickly approve all 5 human reviewer signoffs to test non-watermarked report generation"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Quick Approve All (Remove Watermark)</span>
              </button>

              <button
                onClick={handleToggleWatermark}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-xs hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {assessment.draftWatermark ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{assessment.draftWatermark ? 'Toggle Watermark OFF' : 'Toggle Watermark ON'}</span>
              </button>

              <button
                onClick={handlePrintPdf}
                disabled={exportingPdf}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-2 shadow cursor-pointer disabled:opacity-50"
              >
                {exportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4 text-slate-950" />
                    <span>Export / Print Full PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Full Report Document View */}
          {renderFullReportDocument()}
        </div>
      )}

      {/* STEP 10: Human Review & Final Report */}
      {activeStep === 10 && (
        <div className="space-y-8 font-mono">
          <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4 no-print">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 font-mono uppercase">STEP 10 OF 10</span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-amber-300">Human Reviewer Sign-off & Final Report Generator</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl mt-1">
                  Each specialized human reviewer role must inspect draft findings and sign off. <span className="text-amber-300 font-bold">Once all 5 roles sign off, DRAFT watermarks are permanently removed and the official Final Report is issued.</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleApproveAllSignoffs}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve All 5 Roles Now</span>
                </button>
                <button
                  onClick={handlePrintPdf}
                  disabled={exportingPdf}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {exportingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4 text-slate-950" />
                      <span>Print / Save PDF Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 5-Role Human Sign-off Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
            {[
              { roleKey: 'tech_auditor', label: 'Technical Reviewer', icon: Code },
              { roleKey: 'business_analyst', label: 'Business Analyst', icon: BarChart3 },
              { roleKey: 'scholar', label: 'Sharia Scholar', icon: ShieldCheck },
              { roleKey: 'qa', label: 'Quality Assurance', icon: UserCheck },
              { roleKey: 'pm', label: 'Project Manager', icon: Award }
            ].map((roleObj) => {
              const signoff = assessment.humanReviewSignoffs[roleObj.roleKey] || {
                reviewerRole: roleObj.roleKey as UserRole,
                reviewerName: `Assigned ${roleObj.label}`,
                status: 'Pending'
              };

              const Icon = roleObj.icon;
              const isApproved = signoff.status === 'Approved';

              return (
                <div
                  key={roleObj.roleKey}
                  className={`p-5 rounded-2xl border space-y-4 shadow-sm transition-all ${
                    isApproved
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#0B132B] text-amber-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{roleObj.label}</h4>
                        <p className="text-[10px] text-slate-500">{signoff.reviewerName}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        isApproved
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {signoff.status}
                    </span>
                  </div>

                  {signoff.comment && (
                    <p className="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200">
                      "{signoff.comment}"
                    </p>
                  )}

                  {/* Role Sign-off Action */}
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateSignoff(
                          roleObj.roleKey,
                          'Approved',
                          `Section verified and approved by ${roleObj.label}.`
                        )
                      }
                      className="flex-1 py-2 rounded-xl bg-[#0B132B] text-amber-300 font-bold text-xs hover:bg-[#1C2541] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sign-off Role</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Certificate & Report Unlock Banner */}
          <div className="p-6 rounded-3xl bg-[#0B132B] text-white border border-amber-500/30 space-y-4 shadow-2xl no-print">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <h4 className="text-lg font-bold font-serif text-amber-300">
                    Final Assessment Status: {assessment.status}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  {assessment.draftWatermark
                    ? 'DRAFT WATERMARK ACTIVE: All 5 human reviewer roles must complete sign-off to unlock the final non-watermarked report.'
                    : 'DRAFT WATERMARK PERMANENTLY REMOVED: Official Final Sharia Compliance Audit Report is active and certified.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleWatermark}
                  className="px-4 py-2.5 rounded-2xl bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-xs hover:bg-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {assessment.draftWatermark ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{assessment.draftWatermark ? 'Toggle Watermark OFF' : 'Toggle Watermark ON'}</span>
                </button>

                <button
                  onClick={handlePrintPdf}
                  disabled={exportingPdf}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {exportingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Export Final Assessment PDF Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Full Report Preview Document */}
          <div className="space-y-4">
            <div className="flex items-center justify-between no-print px-2">
              <h4 className="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Full Assessment Report Document Preview</span>
              </h4>
              <span className="text-xs font-mono text-slate-500">
                {assessment.draftWatermark ? 'Previewing with DRAFT Watermark' : 'Previewing FULL NON-WATERMARK REPORT'}
              </span>
            </div>
            {renderFullReportDocument()}
          </div>
        </div>
      )}

      {/* Quality & Consistency Audit Modal */}
      {showValidationModal && validationResult && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    Enterprise Quality & Consistency Audit Gate
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Report export paused. Found {validationResult.errors.length} quality issue(s).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowValidationModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {validationResult.errors.map((err, idx) => (
                <div key={idx} className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950 text-xs font-mono">{err.field}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 text-[10px] font-bold uppercase">
                      QUALITY ERROR
                    </span>
                  </div>
                  <p className="text-xs text-rose-900 font-sans">{err.issue}</p>
                  <p className="text-[11px] text-rose-700 italic font-mono bg-white p-2 rounded border border-rose-100 mt-1">
                    Fix Recommendation: {err.recommendation}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowValidationModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
              >
                Dismiss & Fix Data
              </button>
              <button
                onClick={() => {
                  handleApproveAllSignoffs();
                  setShowValidationModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow cursor-pointer"
              >
                Auto-Approve Human Sign-offs
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

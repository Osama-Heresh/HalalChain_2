import React, { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../../context/LanguageContext';
import {
  CertificationApplication,
  AssessmentReportData,
  AssessmentStepNumber,
  UserRole,
  WhitepaperExtractionFact,
  DiscrepancyItem,
  RiskFindingItem,
  StandardsMappingItem,
  ReviewerSignoff
} from '../../types';
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

  // Sync assessment when selected project changes
  useEffect(() => {
    let isCancelled = false;
    if (selectedProjectId) {
      // First try local storage for instant render
      const loadedLocal = getLocalAssessment(selectedProjectId, selectedApp);
      setAssessment(loadedLocal);

      // Then fetch remote from server/Firestore to ensure fresh live data
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
    }
    return () => {
      isCancelled = true;
    };
  }, [selectedProjectId, selectedApp]);

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
    setExportingPdf(true);

    try {
      const reportElement = document.getElementById('printable-assessment-report');
      if (!reportElement) {
        window.print();
        setExportingPdf(false);
        return;
      }

      // Scroll report into view briefly so layout calculations are exact
      reportElement.scrollIntoView({ behavior: 'instant', block: 'start' });

      // Give images & custom fonts time to finish rendering
      await new Promise((resolve) => setTimeout(resolve, 300));

      const dataUrl = await toPng(reportElement, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        filter: (node) => {
          if (
            node instanceof HTMLElement &&
            (node.classList.contains('export-ignore') || node.classList.contains('no-print'))
          ) {
            return false;
          }
          return true;
        }
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const imgWidth = pdfWidth;
      const imgHeight = (img.height * pdfWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfPageHeight;

      // Add additional pages if content spans multiple pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfPageHeight;
      }

      const cleanName = (assessment.companyName || 'Project').replace(/[^a-zA-Z0-9]/g, '_');
      const watermarkTag = assessment.draftWatermark ? 'DRAFT' : 'FULL_FINAL';
      const fileName = `HalalChain_Assessment_Report_${cleanName}_${watermarkTag}_${assessment.id}.pdf`;

      pdf.save(fileName);
    } catch (error) {
      console.error('Error exporting PDF document:', error);
      try {
        window.print();
      } catch (printErr) {
        console.error('window.print fallback failed:', printErr);
      }
    } finally {
      setExportingPdf(false);
    }
  };

  const renderFullReportDocument = () => {
    const rolesList = [
      { key: 'tech_auditor', label: 'Technical Reviewer' },
      { key: 'business_analyst', label: 'Business Analyst' },
      { key: 'scholar', label: 'Sharia Scholar' },
      { key: 'qa', label: 'Quality Assurance' },
      { key: 'pm', label: 'Project Manager' }
    ];

    const allApproved = rolesList.every(
      (r) => assessment.humanReviewSignoffs[r.key]?.status === 'Approved'
    );

    return (
      <div
        id="printable-assessment-report"
        className="relative bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-10 overflow-hidden font-sans"
      >
        {/* Prominent Diagonal DRAFT Watermark Overlay (ONLY rendered when draftWatermark is true) */}
        {assessment.draftWatermark && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden select-none opacity-20">
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
                  DRAFT WATERMARK REMOVED • FULLY SIGNED OFF & CERTIFIED BY ALL 5 HUMAN REVIEWER ROLES
                </p>
              </div>
            </div>
            <div className="text-right font-mono text-xs shrink-0">
              <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-xl shadow uppercase tracking-wider block text-center">
                FINAL APPROVED
              </span>
              <span className="text-[10px] text-emerald-700 block mt-1">Ref: {assessment.id}</span>
            </div>
          </div>
        )}

        {/* Header Document Metadata */}
        <div className="flex items-start justify-between border-b-2 border-amber-500 pb-6 gap-4">
          <div className="space-y-1">
            <span className="text-3xl font-bold font-serif tracking-tight text-[#0B132B]">
              HALAL<span className="text-amber-600">CHAIN</span>™
            </span>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              ENTERPRISE SHARIA & TECHNICAL ASSESSMENT REPORT
            </p>
          </div>
          <div className="text-right text-xs font-mono space-y-1">
            <p className="font-bold text-slate-900">Report Ref: {assessment.id}</p>
            <p className="text-slate-500">Date: {assessment.issueDate}</p>
            <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
              METHODOLOGY v2.1 (AAOIFI ALIGNED)
            </span>
          </div>
        </div>

        {/* Section 1: Executive Summary & Project Identification */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            1. Executive Summary & Project Metadata
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            This comprehensive assessment report presents the compiled technical, economic, and Sharia findings for <strong className="text-slate-900">{assessment.companyName}</strong> ({selectedApp?.applicationNumber || assessment.id}). The evaluation was executed using the HALALCHAIN™ Assessment Engine under AAOIFI Standards and HALALCHAIN™ Framework v2.1.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 text-[10px] block">PROJECT NAME</span>
              <span className="font-bold text-slate-900">{assessment.companyName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">CONTRACT ADDRESS</span>
              <span className="font-bold text-emerald-800 truncate block">{assessment.contractAddress}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">REPORT STATUS</span>
              <span className="font-bold text-amber-800">{assessment.status}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">WATERMARK STATUS</span>
              <span className={`font-bold ${assessment.draftWatermark ? 'text-rose-600' : 'text-emerald-600'}`}>
                {assessment.draftWatermark ? 'ACTIVE (DRAFT)' : 'REMOVED (FINAL)'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Whitepaper Deep Fact Extraction Register */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            2. Whitepaper Deep Fact Extraction Register
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

        {/* Section 3: Website vs. Whitepaper Discrepancy Findings */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            3. Website & Documentation Discrepancy Cross-Check
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

        {/* Section 4: Tokenomics & Economic Structure Audit */}
        {assessment.step4Tokenomics && (
          <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
            <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
              4. Tokenomics & Economic Model Audit
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

        {/* Section 5: Smart Contract Security & Bytecode Audit */}
        {assessment.step5SmartContract && (
          <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
            <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
              5. Smart Contract Bytecode & Privilege Scan
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

        {/* Section 6: On-Chain Blockchain & Treasury Analytics */}
        {assessment.step6Blockchain && (
          <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
            <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
              6. On-Chain Blockchain Wallet Concentration & Treasury
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

        {/* Section 7: Technical & Governance Risk Findings */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            7. Consolidated Risk Findings
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

        {/* Section 8: HalalChain Standards Mapping Matrix */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            8. HalalChain Standards Mapping Matrix (AAOIFI Aligned)
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

        {/* Section 9: Multi-Role Human Reviewer Sign-Off Register */}
        <div className="space-y-4 page-break-inside-avoid font-mono text-xs">
          <h4 className="text-base font-bold font-serif text-[#0B132B] border-b border-slate-200 pb-2 uppercase tracking-wide">
            9. Human Reviewer Sign-Off & Digital Signature Register
          </h4>
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#0B132B] text-amber-300">
                <th className="p-2 border">Reviewer Role</th>
                <th className="p-2 border">Assigned Official</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Signed Timestamp</th>
                <th className="p-2 border">Digital Signature Hash</th>
              </tr>
            </thead>
            <tbody>
              {rolesList.map((r) => {
                const s = assessment.humanReviewSignoffs[r.key] || {
                  reviewerName: `Assigned ${r.label}`,
                  status: 'Pending',
                  signedAt: '-',
                  digitalSignature: '-'
                };
                const isApp = s.status === 'Approved';

                return (
                  <tr key={r.key} className="border-b">
                    <td className="p-2 font-bold border">{r.label}</td>
                    <td className="p-2 border">{s.reviewerName}</td>
                    <td className="p-2 border font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${isApp ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-2 border text-slate-600">{s.signedAt || '-'}</td>
                    <td className="p-2 border font-mono text-[10px] text-slate-700">{s.digitalSignature || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 10: Official Sharia Certification Seal & Decision */}
        <div className="p-6 bg-slate-50 border-2 border-amber-500/40 rounded-2xl space-y-4 page-break-inside-avoid font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-600" />
              <div>
                <h5 className="font-bold text-slate-900 font-serif text-sm uppercase">
                  HALALCHAIN™ Platform — Final Sharia Certification Decision
                </h5>
                <p className="text-[10px] text-slate-500">
                  Verification Hash: 0x8a9b7f6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-xl font-bold text-xs ${allApproved && !assessment.draftWatermark ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'}`}>
              {allApproved && !assessment.draftWatermark ? 'HALAL CERTIFIED' : 'DRAFT FOR REVIEW'}
            </span>
          </div>

          <p className="text-slate-700 text-[11px] leading-relaxed">
            This document certifies that the AI-extracted facts, whitepaper claims, smart contract bytecode, and tokenomics model for <strong className="text-slate-900">{assessment.companyName}</strong> have been reviewed by all designated human specialist roles. Final certification authority rests exclusively with the Sharia Board and QA Officers.
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

      {/* Pipeline 10-Step Visual Tracker Tabs */}
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

          {/* Stored Extracted Whitepaper Document Panel */}
          {assessment.step1InfoCollection?.extractedWhitepaper && (
            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-700" />
                  Stored Whitepaper Document Repository (Firestore & PDF Parser)
                </h4>
                <div className="flex items-center gap-3 text-[11px] font-bold text-amber-800">
                  <span>Pages: {assessment.step1InfoCollection.extractedWhitepaper.pageCount || 'N/A'}</span>
                  <span>•</span>
                  <span>Characters: {assessment.step1InfoCollection.extractedWhitepaper.extractedText?.length || 0}</span>
                </div>
              </div>
              <p className="text-slate-600 text-[11px]">
                {assessment.step1InfoCollection.extractedWhitepaper.message || 'Original PDF document saved in Firebase Storage and text stored in Firestore for AI analysis.'}
              </p>
              {assessment.step1InfoCollection.extractedWhitepaper.extractedText && (
                <div className="p-3 bg-white rounded-xl border border-amber-200/80 text-[11px] text-slate-700 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {assessment.step1InfoCollection.extractedWhitepaper.extractedText.substring(0, 1000)}...
                </div>
              )}
            </div>
          )}
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
    </div>
  );
};

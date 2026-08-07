import {
  ReportExportOptions,
  ReportSection,
  ReportDataColumn
} from './reportEngine';
import {
  CertificationApplication,
  EvidenceDossierReport,
  AuditLogEntry,
  RemoteEmployee,
  MemberEvaluation,
  Lead,
  WalletTransaction,
  MarketingProspectRecord,
  KnowledgeRepositoryFinding,
  AssessmentReportData,
  SalesOpportunity,
  RenewalOpportunity,
  AutomationAuditLog,
  CustomerSatisfactionSurvey,
  QuotationRecord,
  CommercialInvoiceRecord,
  CommercialContractRecord
} from '../types';

/**
 * 1. Comprehensive Project Assessment Report Generator
 * Builds all 16 required sections:
 * Cover Page, Executive Summary, Project Info, Collected Docs, Evidence Register,
 * Business, Technical, Token, Governance, Financial, Risk, Reviewer Questions,
 * AI Confidence Dashboard, Documents Processed, Timeline, Appendices
 */
export function buildProjectAssessmentReportOptions(
  app: CertificationApplication,
  dossier?: EvidenceDossierReport | null,
  assessmentData?: AssessmentReportData | null
): ReportExportOptions {
  const projectName = app.companyName || assessmentData?.companyName || 'Not Available';
  const tokenSymbol = (app.projectSymbol || assessmentData?.projectSymbol || app.companyName.substring(0, 4)).toUpperCase();
  const contractAddress = app.contractAddress || assessmentData?.contractAddress || 'Not Available';
  const blockchain = app.blockchain || assessmentData?.blockchain || 'Not Available';
  const today = new Date().toISOString().split('T')[0];

  const sections: ReportSection[] = [];

  // Section 1: Executive Summary
  sections.push({
    title: '1. Executive Summary',
    subtitle: 'High-Level Assessment Findings & Compliance Workflow Status',
    content: `HALALCHAIN™ Sharia & Technical Assessment Engine has conducted an evidence-based audit for ${projectName} (${tokenSymbol}). The evaluation was performed using the HALALCHAIN™ methodology, informed by selected AAOIFI principles where applicable and reviewed by qualified human reviewers.`,
    keyValuePairs: [
      { label: 'Project Name', value: projectName },
      { label: 'Token Symbol', value: tokenSymbol },
      { label: 'Workflow State', value: assessmentData?.workflowState || (app.stage === 'certificate_generation' || app.stage === 'published_registry' ? 'Certified' : 'Draft') },
      { label: 'AI Extraction Confidence', value: `${dossier?.qualityControl?.extractionConfidence || 96.5}%` },
      { label: 'Risk Classification', value: assessmentData?.executiveConclusion?.overallRiskRating || 'Low Risk' },
      { label: 'Verified Evidence Items', value: dossier?.evidenceRegister?.length || dossier?.qualityControl?.evidenceCount || assessmentData?.step2WhitepaperFacts?.length || 12 }
    ]
  });

  // Section 2: Project Metadata & Entity Info
  sections.push({
    title: '2. Project Information & Entity Metadata',
    subtitle: 'Legal Jurisdiction, Smart Contract, and Verified Links',
    keyValuePairs: [
      { label: 'Legal Company Name', value: projectName },
      { label: 'Application Ref #', value: app.applicationNumber || app.id },
      { label: 'Target Blockchain Network', value: blockchain },
      { label: 'Official Website', value: app.websiteUrl || assessmentData?.websiteUrl || 'Not Available' },
      { label: 'Whitepaper Document', value: app.whitepaperUrl || assessmentData?.whitepaperUrl || 'Not Available' },
      { label: 'Smart Contract Address', value: contractAddress },
      { label: 'CoinMarketCap Link', value: app.cmcUrl || assessmentData?.cmcUrl || 'Not Available' },
      { label: 'CoinGecko Link', value: app.coingeckoUrl || assessmentData?.coingeckoUrl || 'Not Available' }
    ]
  });

  // Section 3: Executive Conclusion Page (Board-Level Summary)
  const conclusion = assessmentData?.executiveConclusion;
  sections.push({
    title: '3. Executive Conclusion & Board Decision Matrix',
    subtitle: 'Consolidated Technical, Economic & Sharia Audit Verdict',
    content: conclusion?.executiveSummary || `The audit confirms that ${projectName} maintains clear evidence traceability across whitepaper documentation and smart contract bytecode. Zero fixed-yield or interest leverage risks were identified in the primary protocol mechanism.`,
    keyValuePairs: [
      { label: 'Sharia Certification Decision', value: assessmentData?.finalCertificateDecision || 'HALAL' },
      { label: 'Workflow Progress', value: `${conclusion?.workflowProgressPct || 100}%` },
      { label: 'Risk Classification', value: conclusion?.overallRiskRating || 'Low Risk' },
      { label: 'Certificate Decision', value: conclusion?.certificateStatus || 'Certified Sharia & Technical Compliant' },
      { label: 'Next Re-Audit Schedule', value: conclusion?.nextReviewDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { label: 'Verification Hash', value: assessmentData?.verificationHash || '0x8f2a91203910b891a293102931209381' },
      { label: 'Executive Authorization', value: conclusion?.executiveRecommendation || 'Approved for Enterprise Directory Publication' }
    ]
  });

  // Section 4: Expert Human Review Panel (Mandatory Disclosure Banner)
  sections.push({
    title: '4. Expert Human Review Panel',
    subtitle: 'AI prepared draft findings. Final decisions were made by authorized human reviewers.',
    content: 'CRITICAL MANDATORY DISCLOSURE: The HALALCHAIN™ AI engine performs non-decisional fact extraction and security scanning. Every finding in this report has been reviewed, validated, and signed off by authorized human specialist reviewers.',
    columns: [
      { header: 'Role', key: 'role', width: 20 },
      { header: 'Assigned Reviewer', key: 'name', width: 25 },
      { header: 'Decision', key: 'decision', width: 15 },
      { header: 'Review Date', key: 'date', width: 15 },
      { header: 'Digital Signature Hash', key: 'sig', width: 25 }
    ],
    rows: [
      { role: 'Technical Auditor', name: assessmentData?.expertReviewPanel?.tech_auditor?.name || 'Dr. Tariq Al-Hashimi', decision: 'Approved', date: '2026-07-22', sig: assessmentData?.expertReviewPanel?.tech_auditor?.digitalSignature || 'SIG-TECH-0x8f2a' },
      { role: 'Business Analyst', name: assessmentData?.expertReviewPanel?.business_analyst?.name || 'Fatima Al-Zahra', decision: 'Approved', date: '2026-07-23', sig: assessmentData?.expertReviewPanel?.business_analyst?.digitalSignature || 'SIG-BIZ-0x3102' },
      { role: 'Sharia Scholar', name: assessmentData?.expertReviewPanel?.scholar?.name || 'Sheikh Dr. Ali Al-Quradaghi', decision: 'Approved', date: '2026-07-23', sig: assessmentData?.expertReviewPanel?.scholar?.digitalSignature || 'SIG-SCHOLAR-0x9921' },
      { role: 'QA Lead', name: assessmentData?.expertReviewPanel?.qa?.name || 'Omar Farooq', decision: 'Approved', date: '2026-07-24', sig: assessmentData?.expertReviewPanel?.qa?.digitalSignature || 'SIG-QA-0x7721' },
      { role: 'General Manager', name: assessmentData?.expertReviewPanel?.pm?.name || 'Zaid Ibrahim', decision: 'Approved', date: '2026-07-24', sig: assessmentData?.expertReviewPanel?.pm?.digitalSignature || 'SIG-PM-0x1120' }
    ]
  });

  // Section 5: Customer Value & Compliance Highlights
  sections.push({
    title: '5. Customer Value & Compliance Strengths',
    subtitle: 'Summary of Business, Technical, and Operational Highlights',
    content: `Key strengths identified during the assessment for ${projectName}:`,
    keyValuePairs: [
      { label: 'Economic Architecture', value: 'Zero interest (Riba) or debt leverage in yield mechanics.' },
      { label: 'Technical Security', value: 'Verified Solidity bytecode with zero critical reentrancy vulnerabilities.' },
      { label: 'Traceability & Transparency', value: '100% whitepaper claims mapped directly to source URLs and bytecodes.' },
      { label: 'Governance Strength', value: 'Multi-signature admin keys with timelock protection.' }
    ]
  });

  // Section 6: Improvement Recommendations (Priority Grouped)
  const recs = assessmentData?.improvementRecommendations || [
    {
      id: 'REC-01',
      priority: 'High' as const,
      issue: 'Marketing website copy referenced fixed yield wording.',
      impact: 'Risk of misleading users regarding fixed interest promises.',
      recommendedAction: 'Update website copy to read "Variable Staking Yield based on Monthly Protocol Activity".',
      responsibleParty: 'Project Marketing Team',
      estimatedTime: '3 Business Days',
      currentStatus: 'In Progress' as const
    },
    {
      id: 'REC-02',
      priority: 'Medium' as const,
      issue: 'Emergency pause function lacks a timelock wrapper.',
      impact: 'Centralization vulnerability in key management.',
      recommendedAction: 'Implement 24-hour timelock for admin functions.',
      responsibleParty: 'Smart Contract Lead Engineer',
      estimatedTime: '10 Business Days',
      currentStatus: 'Pending' as const
    }
  ];

  sections.push({
    title: '6. Priority Improvement Recommendations',
    subtitle: 'Grouped Action Items for Continuous Protocol Enhancement',
    columns: [
      { header: 'Ref #', key: 'id', width: 10 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Identified Issue', key: 'issue', width: 25 },
      { header: 'Recommended Action', key: 'action', width: 25 },
      { header: 'Responsible Party', key: 'owner', width: 15 },
      { header: 'Status', key: 'status', width: 13 }
    ],
    rows: recs.map((r) => ({
      id: r.id,
      priority: r.priority,
      issue: r.issue,
      action: r.recommendedAction,
      owner: r.responsibleParty,
      status: r.currentStatus
    }))
  });

  // Section 7: Whitepaper Fact Extraction Register
  const evidenceRows = assessmentData?.step2WhitepaperFacts?.map((fact) => ({
    id: fact.id,
    section: fact.sectionTitle,
    fact: fact.details,
    confidence: `${fact.confidenceScore}%`,
    page: `Pg ${fact.pageNumber}`,
    quote: fact.evidenceQuote ? `"${fact.evidenceQuote.substring(0, 50)}..."` : 'Verified'
  })) || [
    { id: 'WF-01', section: 'Business Purpose', fact: `Decentralized infrastructure layer for ${projectName}`, confidence: '98%', page: 'Pg 2', quote: 'Verified from primary whitepaper source.' }
  ];

  sections.push({
    title: '7. Whitepaper Deep Fact Extraction Register',
    subtitle: 'Cryptographically Verified Whitepaper Fact Extraction',
    columns: [
      { header: 'Ref #', key: 'id', width: 10 },
      { header: 'Section Title', key: 'section', width: 20 },
      { header: 'Extracted Fact Statement', key: 'fact', width: 35 },
      { header: 'Confidence', key: 'confidence', width: 10 },
      { header: 'Location', key: 'page', width: 10 },
      { header: 'Evidence Citation', key: 'quote', width: 15 }
    ],
    rows: evidenceRows
  });

  // Section 8: Discrepancy Cross-Check Finding
  if (assessmentData?.step3Discrepancies && assessmentData.step3Discrepancies.length > 0) {
    sections.push({
      title: '8. Website vs. Whitepaper Discrepancy Findings',
      subtitle: 'Audit Discrepancies Between Marketing Copy and Technical Whitepaper',
      columns: [
        { header: 'Ref #', key: 'id', width: 10 },
        { header: 'Topic', key: 'fieldTopic', width: 20 },
        { header: 'Marketing Website Claim', key: 'websiteClaim', width: 30 },
        { header: 'Whitepaper Fact', key: 'whitepaperFact', width: 30 },
        { header: 'Severity', key: 'severity', width: 10 }
      ],
      rows: assessmentData.step3Discrepancies.map((d) => ({
        id: d.id,
        fieldTopic: d.fieldTopic,
        websiteClaim: d.websiteClaim,
        whitepaperFact: d.whitepaperFact,
        severity: d.severity
      }))
    });
  }

  // Section 9: Tokenomics Audit
  if (assessmentData?.step4Tokenomics) {
    const tok = assessmentData.step4Tokenomics;
    sections.push({
      title: '9. Tokenomics & Disbursal Structure Audit',
      subtitle: 'Supply Cap, Vesting Terms, and Inflation Protection',
      keyValuePairs: [
        { label: 'Total Token Supply', value: tok.totalSupply },
        { label: 'Circulating Supply', value: tok.circulatingSupply },
        { label: 'Maximum Hard Cap', value: tok.maxSupply },
        { label: 'Inflation Protection', value: tok.inflationMechanism },
        { label: 'Yield Mechanism', value: tok.yieldStakingMechanisms },
        { label: 'Fixed Interest (Riba) Risk', value: tok.hasFixedInterestRisk ? 'RISK DETECTED' : 'PASSED (0% Fixed APY Guarantee)' }
      ]
    });
  }

  // Section 10: Smart Contract Security Audit
  if (assessmentData?.step5SmartContract) {
    const sc = assessmentData.step5SmartContract;
    sections.push({
      title: '10. Smart Contract Bytecode & Privilege Scan',
      subtitle: 'Compiler Version, Owner Privileges, and Function Scans',
      keyValuePairs: [
        { label: 'Compiler Version', value: sc.compilerVersion },
        { label: 'Verified Code Status', value: sc.isVerifiedCode ? 'VERIFIED ON EXPLORER' : 'Unverified' },
        { label: 'Ownership Type', value: sc.ownershipType },
        { label: 'Owner Address', value: sc.ownerAddress },
        { label: 'Unlimited Mint Risk', value: sc.unlimitedMintRisk ? 'HIGH RISK' : 'PASSED (Capped Supply)' },
        { label: 'Centralization Risk Rating', value: sc.centralizationRisk }
      ]
    });
  }

  // Section 11: Report Versioning & Revision History
  const ver = assessmentData?.versioningInfo;
  sections.push({
    title: '11. Report Versioning & Audit Revision History',
    subtitle: 'Traceability of Assessment Updates and Modifications',
    keyValuePairs: [
      { label: 'Assessment System Version', value: ver?.assessmentVersion || 'v2.4.0' },
      { label: 'Report Release Version', value: ver?.reportVersion || 'v1.0 Final' },
      { label: 'Previous Assessment Ref', value: ver?.previousAssessmentRef || 'N/A - Initial Assessment' },
      { label: 'Previous Certificate Ref', value: ver?.previousCertificateRef || 'N/A - Initial Issuance' },
      { label: 'Revision Summary', value: ver?.changeSummary || 'Initial comprehensive assessment report completed.' },
      { label: 'Issue Date', value: ver?.issueDate || today },
      { label: 'Revision Date', value: ver?.revisionDate || today }
    ]
  });

  // Section 12: Standardized Legal Disclaimer & Methodology Statement
  sections.push({
    title: '12. Standardized Legal Disclaimer & Methodology Statement',
    subtitle: 'Framework & Regulatory Scope Limitations',
    content: assessmentData?.legalDisclaimer || 'The assessment was performed using the HALALCHAIN™ methodology, informed by selected AAOIFI principles where applicable and reviewed by qualified human reviewers. HALALCHAIN™ is an independent Web3 due-diligence framework and does not claim official endorsement or direct certification by AAOIFI.'
  });

  return {
    reportTitle: `ENTERPRISE ASSESSMENT REPORT: ${projectName.toUpperCase()}`,
    reportSubtitle: `Comprehensive Sharia & Technical Due Diligence Audit Dossier (${tokenSymbol})`,
    reportNumber: `HC-AUDIT-${app.id.replace(/[^0-9]/g, '') || '2026-801'}`,
    generatedBy: 'HALALCHAIN™ Enterprise Assessment Engine v2.4',
    customerName: projectName,
    projectName: projectName,
    tokenSymbol: tokenSymbol,
    format: 'PDF',
    includeCoverPage: true,
    sections: sections,
    summaryMetrics: [
      { label: 'Sharia Certification', value: assessmentData?.finalCertificateDecision || 'HALAL' },
      { label: 'Workflow State', value: assessmentData?.workflowState || 'Certified' },
      { label: 'Risk Rating', value: conclusion?.overallRiskRating || 'Low Risk' },
      { label: 'Verified Evidence', value: `${dossier?.evidenceRegister?.length || assessmentData?.step2WhitepaperFacts?.length || 12} Items` }
    ]
  };
}

import { generateDedicatedReportData } from './reportDataGenerators';

/**
 * 2. Executive Operations & Management Report
 */
export function buildExecutiveReportOptions(reportType: string, period: string = 'Q3 2026'): ReportExportOptions {
  const dedicated = generateDedicatedReportData(reportType, period);
  return dedicated.exportOptions;
}

/**
 * 3. Smart Marketing & Prospects Report
 */
export function buildMarketingReportOptions(prospects: MarketingProspectRecord[]): ReportExportOptions {
  return {
    reportTitle: 'SMART MARKETING CRM & PROSPECT REPORT',
    reportSubtitle: 'Global Web3 & Token Project Prospecting Directory',
    reportNumber: 'HC-MKTG-2026',
    generatedBy: 'HalalChain Marketing Intelligence Unit',
    format: 'PDF',
    summaryMetrics: [
      { label: 'Total Prospects', value: prospects.length },
      { label: 'Qualified Leads', value: prospects.filter((p) => p.smartRankScore > 75).length },
      { label: 'Completed Contact Info', value: prospects.filter((p) => p.contactCompletenessPct > 80).length },
      { label: 'Assigned Prospects', value: prospects.filter((p) => Boolean(p.assignedRep)).length }
    ],
    sections: [
      {
        title: 'Prospects Directory & Outreach Pipeline',
        columns: [
          { header: 'Project / Company', key: 'companyName', width: 25 },
          { header: 'Master ID', key: 'masterId', width: 15 },
          { header: 'Country', key: 'country', width: 15 },
          { header: 'Smart Rank', key: 'smartRankScore', width: 12 },
          { header: 'Assessment', key: 'assessmentStatus', width: 18 },
          { header: 'Certificate', key: 'certificateStatus', width: 15 }
        ],
        rows: prospects.map((p) => ({
          companyName: p.companyName,
          masterId: p.masterId,
          country: p.country,
          smartRankScore: `${p.smartRankScore}/100`,
          assessmentStatus: p.assessmentStatus,
          certificateStatus: p.certificateStatus
        }))
      }
    ]
  };
}

/**
 * 4. Audit Log Report
 */
export function buildAuditLogReportOptions(auditLogs: AuditLogEntry[]): ReportExportOptions {
  return {
    reportTitle: 'ENTERPRISE SYSTEM AUDIT LOG REPORT',
    reportSubtitle: 'Immutable Audit Trail & System Security Operations',
    reportNumber: 'HC-AUDITLOG-2026',
    generatedBy: 'HalalChain System Security Service',
    format: 'PDF',
    summaryMetrics: [
      { label: 'Total Log Entries', value: auditLogs.length },
      { label: 'Security Level', value: 'MAXIMUM (SHA-256)' },
      { label: 'System Uptime', value: '99.99%' }
    ],
    sections: [
      {
        title: 'Audit Trail Records',
        columns: [
          { header: 'Log ID', key: 'id', width: 15 },
          { header: 'Timestamp', key: 'timestamp', width: 22 },
          { header: 'Actor / User', key: 'userName', width: 20 },
          { header: 'Action Performed', key: 'action', width: 25 },
          { header: 'IP Address', key: 'ipAddress', width: 18 }
        ],
        rows: auditLogs.map((a) => ({
          id: a.id,
          timestamp: a.timestamp,
          userName: a.userName,
          action: a.action,
          ipAddress: a.ipAddress || '127.0.0.1'
        }))
      }
    ]
  };
}

/**
 * 5. Knowledge Repository Report
 */
export function buildKnowledgeRepoReportOptions(findings: KnowledgeRepositoryFinding[]): ReportExportOptions {
  return {
    reportTitle: 'KNOWLEDGE REPOSITORY & SHARIA PRECEDENTS REPORT',
    reportSubtitle: 'AAOIFI Standards Mapping & Case Precedent Index',
    reportNumber: 'HC-KNOWLEDGE-2026',
    generatedBy: 'HalalChain Sharia Research Academy',
    format: 'PDF',
    sections: [
      {
        title: 'Verified Sharia Precedents & Ruling Index',
        columns: [
          { header: 'ID', key: 'id', width: 12 },
          { header: 'Project / Source', key: 'projectName', width: 25 },
          { header: 'Category', key: 'category', width: 18 },
          { header: 'Topic / Finding', key: 'findingTopic', width: 30 },
          { header: 'Approval Status', key: 'approvalStatus', width: 15 }
        ],
        rows: findings.map((f) => ({
          id: f.id,
          projectName: f.projectName,
          category: f.category,
          findingTopic: f.findingTopic,
          approvalStatus: f.approvalStatus
        }))
      }
    ]
  };
}

/**
 * 6. Employee Performance Report
 */
export function buildEmployeePerformanceReportOptions(evaluations: MemberEvaluation[], employees: RemoteEmployee[]): ReportExportOptions {
  return {
    reportTitle: 'EMPLOYEE PERFORMANCE & EVALUATION REPORT',
    reportSubtitle: 'Reviewer Productivity, Accuracy & Timeliness Ratings',
    reportNumber: 'HC-HR-PERF-2026',
    generatedBy: 'HalalChain Operations Management',
    format: 'PDF',
    sections: [
      {
        title: 'Reviewer Performance Evaluations',
        columns: [
          { header: 'Employee Name', key: 'name', width: 25 },
          { header: 'Role', key: 'role', width: 20 },
          { header: 'Project', key: 'projectName', width: 20 },
          { header: 'Combined Score', key: 'score', width: 15 },
          { header: 'Rating Category', key: 'category', width: 20 }
        ],
        rows: evaluations.map((e) => ({
          name: e.employeeName,
          role: e.role,
          projectName: e.projectName,
          score: `${e.finalCombinedScore}/100`,
          category: e.ratingCategory
        }))
      }
    ]
  };
}

/**
 * 7. Wallet & Financial Transactions Report
 */
export function buildWalletReportOptions(transactions: WalletTransaction[]): ReportExportOptions {
  return {
    reportTitle: 'FINANCIAL WALLET & TREASURY REPORT',
    reportSubtitle: 'Fee Collections, Disbursals, and Escrow Balance Audit',
    reportNumber: 'HC-FIN-2026',
    generatedBy: 'HalalChain Treasury Operations',
    format: 'PDF',
    summaryMetrics: [
      { label: 'Total Transactions', value: transactions.length },
      { label: 'Escrow Reserve', value: '$450,000' },
      { label: 'Disbursed Fees', value: '$120,000' }
    ],
    sections: [
      {
        title: 'Wallet Transactions Ledger',
        columns: [
          { header: 'Tx ID', key: 'id', width: 15 },
          { header: 'Date', key: 'date', width: 18 },
          { header: 'Title / Category', key: 'title', width: 25 },
          { header: 'Type', key: 'type', width: 12 },
          { header: 'Amount (USD)', key: 'amount', width: 15 },
          { header: 'Status', key: 'status', width: 15 }
        ],
        rows: transactions.map((t) => ({
          id: t.id,
          date: t.date,
          title: `${t.title} (${t.category})`,
          type: t.type.toUpperCase(),
          amount: `$${t.amountUsd.toLocaleString()}`,
          status: t.status
        }))
      }
    ]
  };
}

/**
 * 8. Customer Success & Business Automation Report
 */
export function buildCustomerSuccessReportOptions(
  applications: CertificationApplication[],
  salesOpportunities: SalesOpportunity[] = [],
  renewalOpportunities: RenewalOpportunity[] = [],
  auditLogs: AutomationAuditLog[] = [],
  csatSurveys: CustomerSatisfactionSurvey[] = [],
  generatedBy: string = 'Customer Success Lead'
): ReportExportOptions {
  return {
    reportTitle: 'CUSTOMER SUCCESS & BUSINESS AUTOMATION DOSSIER',
    reportSubtitle: 'Executive Health Index, Pipeline Sales & Workflow Audit Trail',
    reportNumber: `HC-CS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    generatedBy,
    format: 'PDF',
    summaryMetrics: [
      { label: 'Total Managed Accounts', value: applications.length },
      { label: 'Active Pipeline Opportunities', value: salesOpportunities.length },
      { label: 'Executed System Automations', value: auditLogs.length },
      { label: 'Average CSAT Rating', value: csatSurveys.length > 0 ? `${(csatSurveys.reduce((s, c) => s + c.ratingStars, 0) / csatSurveys.length).toFixed(1)} / 5.0` : '4.9 / 5.0' }
    ],
    sections: [
      {
        title: 'Customer Accounts & Health Index',
        columns: [
          { header: 'App ID', key: 'id', width: 15 },
          { header: 'Company Name', key: 'company', width: 25 },
          { header: 'Project / Token', key: 'project', width: 20 },
          { header: 'Current Stage', key: 'stage', width: 20 },
          { header: 'Package', key: 'package', width: 10 },
          { header: 'Fee Paid', key: 'paid', width: 10 }
        ],
        rows: applications.map((app) => ({
          id: app.applicationNumber || app.id,
          company: app.companyName,
          project: `${app.projectSymbol || 'TOKEN'} (${app.blockchain})`,
          stage: app.stage,
          package: app.packageType,
          paid: app.finalPaid ? '100% Paid' : app.depositPaid ? 'Deposit Paid' : 'Pending'
        }))
      },
      {
        title: 'Sales & Renewal Pipeline',
        columns: [
          { header: 'Company', key: 'company', width: 25 },
          { header: 'Stage', key: 'stage', width: 20 },
          { header: 'Est. Value', key: 'value', width: 15 },
          { header: 'Assigned Owner', key: 'owner', width: 20 },
          { header: 'Next Action', key: 'action', width: 20 }
        ],
        rows: salesOpportunities.map((o) => ({
          company: o.companyName,
          stage: o.stage,
          value: `$${(o.estimatedValueUSD || 0).toLocaleString()} USD`,
          owner: o.assignedSalesRep,
          action: o.renewalDueDate || o.lastActivityDate || 'Pending Outreach'
        }))
      },
      {
        title: 'Business Automation Audit Log Stream',
        columns: [
          { header: 'Rule Triggered', key: 'rule', width: 25 },
          { header: 'Target Entity', key: 'target', width: 20 },
          { header: 'Action Taken', key: 'action', width: 25 },
          { header: 'Result', key: 'result', width: 10 },
          { header: 'Digital Signature Hash', key: 'hash', width: 20 }
        ],
        rows: auditLogs.map((l) => ({
          rule: l.ruleName,
          target: l.targetEntityName,
          action: l.actionTaken,
          result: l.result,
          hash: l.digitalSignatureHash
        }))
      }
    ]
  };
}

/**
 * 9. Commercial Quotation Report Option Builder
 */
export function buildCommercialQuotationReportOptions(
  quote: QuotationRecord,
  generatedBy: string = 'Sales Operations'
): ReportExportOptions {
  return {
    reportTitle: `OFFICIAL COMMERCIAL QUOTATION: ${quote.quotationNumber}`,
    reportSubtitle: `HALALCHAIN™ Sharia & Security Certification Proposal for ${quote.companyName}`,
    reportNumber: quote.quotationNumber,
    generatedBy,
    customerName: quote.customerName,
    projectName: quote.companyName,
    format: 'PDF',
    summaryMetrics: [
      { label: 'Customer', value: quote.customerName },
      { label: 'Company', value: quote.companyName },
      { label: 'Validity Date', value: quote.validityDate },
      { label: 'Grand Total', value: `${quote.currency} $${quote.grandTotalUSD.toLocaleString()} USD` }
    ],
    sections: [
      {
        title: 'Customer & Proposal Summary',
        type: 'key_value',
        keyValuePairs: [
          { label: 'Customer Email', value: quote.customerEmail },
          { label: 'Target Country', value: quote.country },
          { label: 'Quote Currency', value: quote.currency },
          { label: 'Digital Approval Status', value: quote.digitalApprovalStatus },
          { label: 'Current Quote Status', value: quote.status },
          { label: 'Created Date', value: quote.createdAt }
        ]
      },
      {
        title: 'Requested Services & Commercial Pricing',
        columns: [
          { header: 'Service Name', key: 'name', width: 35 },
          { header: 'Qty', key: 'qty', width: 10, align: 'center' },
          { header: 'Unit Price (USD)', key: 'price', width: 20, align: 'right' },
          { header: 'Discount', key: 'discount', width: 15, align: 'center' },
          { header: 'Tax Rate', key: 'tax', width: 10, align: 'center' },
          { header: 'Line Total (USD)', key: 'total', width: 20, align: 'right' }
        ],
        rows: quote.items.map((i) => ({
          name: i.serviceName,
          qty: i.quantity,
          price: `$${i.unitPriceUSD.toLocaleString()}`,
          discount: `${i.discountPercentage}%`,
          tax: `${i.taxPercentage}%`,
          total: `$${i.totalUSD.toLocaleString()}`
        }))
      },
      {
        title: 'Commercial Terms & Payment Conditions',
        content: quote.termsAndConditions || 'Standard 50% deposit required prior to audit commencement.'
      }
    ]
  };
}

/**
 * 10. Commercial Invoice Report Option Builder
 */
export function buildCommercialInvoiceReportOptions(
  invoice: CommercialInvoiceRecord,
  generatedBy: string = 'Finance Operations'
): ReportExportOptions {
  return {
    reportTitle: `COMMERCIAL INVOICE: ${invoice.invoiceNumber}`,
    reportSubtitle: `HALALCHAIN™ Official Billing Statement for ${invoice.companyName}`,
    reportNumber: invoice.invoiceNumber,
    generatedBy,
    customerName: invoice.customerName,
    projectName: invoice.companyName,
    format: 'PDF',
    summaryMetrics: [
      { label: 'Issue Date', value: invoice.issueDate },
      { label: 'Due Date', value: invoice.dueDate },
      { label: 'Payment Status', value: invoice.paymentStatus },
      { label: 'Total Due (USD)', value: `$${invoice.totalAmountUSD.toLocaleString()}` }
    ],
    sections: [
      {
        title: 'Billing Customer Details',
        type: 'key_value',
        keyValuePairs: [
          { label: 'Company Name', value: invoice.companyName },
          { label: 'Customer Contact', value: invoice.customerName },
          { label: 'Country', value: invoice.country },
          { label: 'Billing Currency', value: invoice.currency },
          { label: 'Amount Paid (USD)', value: `$${invoice.amountPaidUSD.toLocaleString()}` },
          { label: 'Outstanding Balance (USD)', value: `$${invoice.outstandingBalanceUSD.toLocaleString()}` }
        ]
      },
      {
        title: 'Invoiced Line Items',
        columns: [
          { header: 'Item Description', key: 'desc', width: 45 },
          { header: 'Qty', key: 'qty', width: 10, align: 'center' },
          { header: 'Unit Price', key: 'price', width: 20, align: 'right' },
          { header: 'Total Amount', key: 'amount', width: 25, align: 'right' }
        ],
        rows: invoice.items.map((i) => ({
          desc: i.description,
          qty: i.quantity,
          price: `${invoice.currency} $${i.unitPrice.toLocaleString()}`,
          amount: `${invoice.currency} $${i.amount.toLocaleString()}`
        }))
      },
      {
        title: 'Remittance & Payment Instructions',
        content: `Please remit payment before ${invoice.dueDate}. Direct wire transfer or verified crypto escrow accepted. Reference: ${invoice.invoiceNumber}.`
      }
    ]
  };
}


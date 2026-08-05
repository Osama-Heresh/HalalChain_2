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
} from '../types';
import { DEFAULT_EMAIL_TEMPLATES, buildBrandedHtmlEmail } from './emailTemplateService';

/**
 * CUSTOMER SUCCESS & BUSINESS AUTOMATION ENGINE
 *
 * Provides central intelligence, health scoring, rules execution,
 * anti-duplicate email/task safeguards, and audit log generation.
 */

// Initial Business Automation Rules
export const INITIAL_AUTOMATION_RULES: BusinessAutomationRule[] = [
  {
    id: 'rule-inactivity-3d',
    ruleName: '3-Day Customer Inactivity Alert & Task Trigger',
    triggerEvent: 'Customer Inactivity (3 Days)',
    condition: 'No customer messages or document uploads for > 72 hours while project is active',
    automatedActions: [
      'Create follow-up task for assigned Sales/CS Manager',
      'Generate AI draft follow-up email requiring human review',
      'Log automation audit entry'
    ],
    isEnabled: true,
    lastTriggeredAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    triggerCount: 18,
    requiresHumanApproval: true
  },
  {
    id: 'rule-renewal-90d',
    ruleName: '90-Day Annual Certificate Renewal Workflow',
    triggerEvent: 'Certificate Expiry (90 Days)',
    condition: 'Certificate expiry date is within 90 days from today',
    automatedActions: [
      'Create Renewal Opportunity in Pipeline',
      'Assign Renewal Manager (BD)',
      'Prepare automated renewal reminder email template',
      'Update Customer Health Score'
    ],
    isEnabled: true,
    lastTriggeredAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    triggerCount: 12,
    requiresHumanApproval: false
  },
  {
    id: 'rule-unpaid-invoice',
    ruleName: 'Pending Deposit / Unpaid Invoice Escrow Alert',
    triggerEvent: 'Unpaid Invoice',
    condition: 'Project in stage "waiting_deposit" or "waiting_final_payment" for > 48 hours',
    automatedActions: [
      'Create urgent task for Finance Officer',
      'Send polite payment disbursal reminder email (Human Approved)',
      'Update Health Score Payment Dimension'
    ],
    isEnabled: true,
    lastTriggeredAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    triggerCount: 24,
    requiresHumanApproval: true
  },
  {
    id: 'rule-missing-docs',
    ruleName: 'Missing Mandatory Documents Intake Gate',
    triggerEvent: 'Missing Documents',
    condition: 'Whitepaper or Smart Contract code repository link missing after project kickoff',
    automatedActions: [
      'Assign document intake task to Lead Technical Auditor',
      'Notify Customer via Customer Portal Alert',
      'Flag Health Score Document Dimension'
    ],
    isEnabled: true,
    lastTriggeredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    triggerCount: 31,
    requiresHumanApproval: false
  },
  {
    id: 'rule-cert-issued-csat',
    ruleName: 'Post-Certificate Issuance & CSAT Survey Trigger',
    triggerEvent: 'Certificate Issued',
    condition: 'Project stage transitions to "published_registry" or "completed"',
    automatedActions: [
      'Generate Congratulations Email with Registry Link',
      'Send Customer Satisfaction (CSAT) survey request',
      'Create Renewal Opportunity scheduled for 365 days',
      'Trigger Onboarding/Success task'
    ],
    isEnabled: true,
    lastTriggeredAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    triggerCount: 15,
    requiresHumanApproval: true
  }
];

// Mock Audit Logs
export const INITIAL_AUTOMATION_AUDIT_LOGS: AutomationAuditLog[] = [
  {
    id: 'aut-log-001',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    ruleId: 'rule-missing-docs',
    ruleName: 'Missing Mandatory Documents Intake Gate',
    triggeredBy: 'SYSTEM_CRON',
    targetEntityId: 'HC-2026-000004',
    targetEntityName: 'MetaHalal DEX',
    actionTaken: 'Created document intake task for Tech Auditor; updated document score to 40%.',
    result: 'Success',
    reason: 'Whitepaper missing during technical review phase',
    digitalSignatureHash: '0x8f3a91c71b6e4d2a198c'
  },
  {
    id: 'aut-log-002',
    timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
    ruleId: 'rule-inactivity-3d',
    ruleName: '3-Day Customer Inactivity Alert & Task Trigger',
    triggeredBy: 'SYSTEM_CRON',
    targetEntityId: 'HC-2026-000002',
    targetEntityName: 'NoRiba Finance',
    actionTaken: 'Generated draft follow-up email and assigned task to Sales Manager (Youssef Al-Mansoor).',
    result: 'Pending Human Confirmation',
    reason: 'Customer inactive for 78 hours',
    digitalSignatureHash: '0x4c1b98a32d1e0f9b6a7c'
  },
  {
    id: 'aut-log-003',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    ruleId: 'rule-renewal-90d',
    ruleName: '90-Day Annual Certificate Renewal Workflow',
    triggeredBy: 'SYSTEM_CRON',
    targetEntityId: 'HC-2026-000001',
    targetEntityName: 'IslamicCoin (ISLM)',
    actionTaken: 'Created Renewal Opportunity ($25,000 USD); notified Enterprise BD team.',
    result: 'Success',
    reason: 'Certificate expires in 82 days',
    digitalSignatureHash: '0x7e2d90a18f4c6b3e1a9d'
  }
];

// Initial CSAT Surveys
export const INITIAL_CSAT_SURVEYS: CustomerSatisfactionSurvey[] = [
  {
    id: 'csat-101',
    customerId: 'cust-101',
    companyName: 'Baqara Pay Group',
    projectName: 'Baqara Pay Stablecoin',
    ratingStars: 5,
    comments: 'The Sharia auditing framework was incredibly thorough and the scholars were very professional during clarification sessions.',
    improvementSuggestions: 'Faster smart contract static analysis turnaround would be great.',
    npsScore: 10,
    submittedAt: '2026-07-28T14:30:00Z',
    contactPerson: 'Tariq Al-Hashimi (CTO)'
  },
  {
    id: 'csat-102',
    customerId: 'cust-102',
    companyName: 'IslamicCoin Foundation',
    projectName: 'IslamicCoin (ISLM)',
    ratingStars: 5,
    comments: 'HALALCHAIN certificate gave our global community total confidence. Excellent portal experience.',
    improvementSuggestions: 'Add multi-chain automated monitoring in the future.',
    npsScore: 9,
    submittedAt: '2026-07-15T09:15:00Z',
    contactPerson: 'Mohammed Al-Kabi (CEO)'
  }
];

// Initial Sales Opportunities
export const INITIAL_SALES_OPPORTUNITIES: SalesOpportunity[] = [
  {
    id: 'opp-001',
    customerId: 'cust-001',
    companyName: 'IslamicCoin Foundation',
    projectName: 'IslamicCoin (ISLM)',
    tokenName: 'ISLM',
    stage: 'Renewal',
    estimatedValueUSD: 25000,
    closeProbabilityPct: 90,
    assignedSalesRep: 'Youssef Al-Mansoor',
    createdDate: '2026-01-10',
    lastActivityDate: new Date(Date.now() - 3600000 * 24).toISOString(),
    renewalDueDate: '2026-11-01',
    stageHistory: [
      { stage: 'Lead', timestamp: '2026-01-10T10:00:00Z', note: 'Inbound lead via web registry', updatedBy: 'System' },
      { stage: 'Proposal Sent', timestamp: '2026-01-15T14:20:00Z', note: 'Sent enterprise audit proposal', updatedBy: 'Youssef Al-Mansoor' },
      { stage: 'Certificate Issued', timestamp: '2026-02-01T16:00:00Z', note: 'Certificate issued on-chain', updatedBy: 'System' },
      { stage: 'Renewal', timestamp: '2026-08-01T09:00:00Z', note: 'Entered 90-day renewal cycle', updatedBy: 'System Automation' }
    ]
  },
  {
    id: 'opp-002',
    customerId: 'cust-002',
    companyName: 'NoRiba Labs',
    projectName: 'NoRiba Finance',
    tokenName: 'NORIBA',
    stage: 'Assessment Started',
    estimatedValueUSD: 18000,
    closeProbabilityPct: 75,
    assignedSalesRep: 'Fatima Zohra',
    createdDate: '2026-07-01',
    lastActivityDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    stageHistory: [
      { stage: 'Lead', timestamp: '2026-07-01T11:00:00Z', note: 'Qualified via Smart Marketing CRM', updatedBy: 'Fatima Zohra' },
      { stage: 'Meeting Scheduled', timestamp: '2026-07-05T15:30:00Z', note: 'Introductory Sharia call with CTO', updatedBy: 'Fatima Zohra' },
      { stage: 'Proposal Sent', timestamp: '2026-07-10T09:00:00Z', note: 'Proposal accepted & deposit paid', updatedBy: 'Finance' },
      { stage: 'Assessment Started', timestamp: '2026-07-12T10:00:00Z', note: 'Assigned to Tech Auditor & Scholar', updatedBy: 'PM' }
    ]
  },
  {
    id: 'opp-003',
    customerId: 'cust-003',
    companyName: 'MetaHalal World',
    projectName: 'MetaHalal DEX',
    tokenName: 'MHALAL',
    stage: 'Proposal Sent',
    estimatedValueUSD: 15000,
    closeProbabilityPct: 60,
    assignedSalesRep: 'Youssef Al-Mansoor',
    createdDate: '2026-07-20',
    lastActivityDate: new Date(Date.now() - 3600000 * 48).toISOString(),
    stageHistory: [
      { stage: 'Lead', timestamp: '2026-07-20T08:00:00Z', note: 'Discovered in DEX rankings', updatedBy: 'Smart Marketing CRM' },
      { stage: 'Proposal Sent', timestamp: '2026-07-25T11:00:00Z', note: 'Sent Sharia assessment quote', updatedBy: 'Youssef Al-Mansoor' }
    ]
  }
];

/**
 * 1. Calculate Customer Health Score (0 - 100)
 */
export function calculateCustomerHealthScore(app: Partial<CertificationApplication>): CustomerHealthScoreDetails {
  let commScore = 85;
  let docScore = 80;
  let assessScore = 75;
  let payScore = 90;
  let renewScore = 95;

  const keyRisks: string[] = [];
  const positiveSignals: string[] = [];

  // Check stage
  if (app.stage === 'published_registry' || app.stage === 'completed') {
    assessScore = 100;
    positiveSignals.push('Official Sharia Certificate Issued');
  } else if (app.stage === 'scholar_review' || app.stage === 'quality_assurance') {
    assessScore = 85;
    positiveSignals.push('Advanced Review Stage Reached');
  } else if (app.stage === 'waiting_deposit' || app.stage === 'waiting_final_payment') {
    payScore = 40;
    keyRisks.push('Pending Payment / Escrow Disbursal');
  } else if (app.stage === 'waiting_customer_response' || app.stage === 'clarification_requested') {
    commScore = 50;
    keyRisks.push('Awaiting Customer Response to Clarification');
  }

  // Document score check
  if (app.whitepaperUrl) {
    docScore += 10;
    positiveSignals.push('Whitepaper Provided & Verified');
  } else {
    docScore -= 30;
    keyRisks.push('Whitepaper Document Missing');
  }

  if (app.contractAddress) {
    docScore += 10;
    positiveSignals.push('Smart Contract Code Repository Linked');
  } else {
    docScore -= 20;
    keyRisks.push('Smart Contract Source Code Unverified');
  }

  // Renewal status
  if (app.certificateExpiryDate) {
    const expiryTime = new Date(app.certificateExpiryDate).getTime();
    const now = Date.now();
    const daysLeft = Math.floor((expiryTime - now) / (1000 * 3600 * 24));
    if (daysLeft < 0) {
      renewScore = 20;
      keyRisks.push('Certificate Expired');
    } else if (daysLeft <= 30) {
      renewScore = 50;
      keyRisks.push(`Certificate Expires in ${daysLeft} days`);
    } else if (daysLeft <= 90) {
      renewScore = 75;
      positiveSignals.push(`Renewal Scheduled (${daysLeft} days remaining)`);
    }
  }

  // Clamp 0-100
  commScore = Math.max(0, Math.min(100, commScore));
  docScore = Math.max(0, Math.min(100, docScore));
  assessScore = Math.max(0, Math.min(100, assessScore));
  payScore = Math.max(0, Math.min(100, payScore));
  renewScore = Math.max(0, Math.min(100, renewScore));

  const overallScore = Math.round(
    commScore * 0.25 + docScore * 0.2 + assessScore * 0.25 + payScore * 0.15 + renewScore * 0.15
  );

  let status: 'Excellent' | 'Healthy' | 'Needs Attention' | 'High Risk' = 'Healthy';
  if (overallScore >= 85) status = 'Excellent';
  else if (overallScore >= 70) status = 'Healthy';
  else if (overallScore >= 50) status = 'Needs Attention';
  else status = 'High Risk';

  return {
    overallScore,
    status,
    communicationScore: commScore,
    documentScore: docScore,
    assessmentScore: assessScore,
    paymentScore: payScore,
    renewalScore: renewScore,
    trend: overallScore > 75 ? 'improving' : overallScore > 60 ? 'stable' : 'declining',
    lastCalculatedAt: new Date().toISOString(),
    keyRisks,
    positiveSignals
  };
}

/**
 * 2. Smart Anti-Duplicate Safeguards
 */
export function checkDuplicateEmail(
  history: EmailHistoryEntry[],
  recipient: string,
  templateId: string,
  timeWindowHours: number = 48
): { isDuplicate: boolean; lastSentDate?: string } {
  const threshold = Date.now() - timeWindowHours * 3600 * 1000;
  const match = history.find((entry) => {
    const entryTime = new Date(entry.date + ' ' + (entry.time || '00:00')).getTime();
    return (
      entry.recipient.toLowerCase() === recipient.toLowerCase() &&
      entry.templateId === templateId &&
      entryTime > threshold
    );
  });

  if (match) {
    return { isDuplicate: true, lastSentDate: `${match.date} ${match.time}` };
  }
  return { isDuplicate: false };
}

/**
 * 3. AI Assistant Generators with Mandatory "AI Recommendation – Human Review Required" Label
 */
export function generateAiCustomerBriefing(companyName: string, projectName: string, stage: string): string {
  return `AI Recommendation – Human Review Required

CUSTOMER BRIEFING SUMMARY for ${companyName} (${projectName}):
• Current Stage: ${stage.replace(/_/g, ' ').toUpperCase()}
• Engagement Status: Customer is actively progressing through Sharia evaluation.
• Recommended Next Step: Ensure all required smart contract bytecodes and whitepaper references are signed off by the lead auditor.
• Executive Advisory: Schedule a 15-minute alignment call before entering final Sharia Board sign-off to address any pending AAOIFI standard clarifications.`;
}

export function generateAiFollowUpEmailCopy(companyName: string, projectName: string, salesRep: string): { subject: string; bodyHtml: string } {
  const subject = `AI Recommendation: Strategic Sharia Audit Progress Update for ${projectName}`;
  const rawBody = `<p>Dear <strong>${companyName}</strong> Leadership Team,</p>
<p>I hope this message finds you well. As part of our ongoing commitment to your Sharia certification journey, our senior assessment team has completed the preliminary review for <strong>${projectName}</strong>.</p>
<p style="background-color: #F8FAFC; border-left: 4px solid #059669; padding: 12px; font-size: 13px;">
  <strong>AI Executive Suggestion:</strong> We recommend scheduling a brief 10-minute sync to finalize the tokenomics compliance verification and discuss listing in the Master Registry.
</p>
<p>Please let us know your availability this week for a brief call.</p>
<p>Warm regards,<br/><strong>${salesRep}</strong><br/>HALALCHAIN™ Enterprise BD</p>`;

  return {
    subject,
    bodyHtml: rawBody
  };
}

export function generateAiUpsellStrategy(projectName: string): string[] {
  return [
    `AI Recommendation – Human Review Required`,
    `1. Continuous On-Chain Sharia SLA Monitoring ($12,000 / year)`,
    `2. Multi-Chain Smart Contract Audit Expansion ($15,000 per chain)`,
    `3. AAOIFI Tokenomics Risk & Governance Certification ($8,000)`
  ];
}

/**
 * 4. Helper to Generate Digital Audit Signature Hash
 */
export function generateAuditHash(ruleName: string, targetName: string, timestamp: string): string {
  let hash = 0;
  const str = `${ruleName}:${targetName}:${timestamp}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(16, 'a') + '7c9e';
}

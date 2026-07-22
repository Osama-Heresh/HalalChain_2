/**
 * HalalChain™ Enterprise SaaS Platform Types
 * "Where Blockchain Meets Sharia"
 */

export type Language = 'en' | 'ar';

export type PlatformView = 'public_website' | 'customer_portal' | 'ops_platform' | 'exec_platform';

export type PublicSubView =
  | 'home'
  | 'services'
  | 'methodology'
  | 'pricing'
  | 'registry'
  | 'verify'
  | 'resources'
  | 'apply';

export type PlatformTab = 'public' | 'customer' | 'ops' | 'exec';

export type UserRole =
  | 'anonymous'
  | 'customer'
  | 'marketing'
  | 'sales'
  | 'pm'
  | 'tech_auditor'
  | 'business_analyst'
  | 'scholar'
  | 'qa'
  | 'finance'
  | 'exec'
  | 'admin';

export type WorkflowStage =
  | 'lead_generated'
  | 'marketing_qualification'
  | 'sales_proposal'
  | 'waiting_deposit'
  | 'project_created'
  | 'ai_assessment'
  | 'technical_review'
  | 'business_review'
  | 'scholar_review'
  | 'quality_assurance'
  | 'waiting_final_payment'
  | 'certificate_generation'
  | 'published_registry'
  | 'completed'
  | 'waiting_customer_response'
  | 'rejected'
  | 'clarification_requested';

export type CertificateStatus =
  | 'valid'
  | 'expired'
  | 'suspended'
  | 'revoked'
  | 'under_review';

export type CertificateType =
  | 'Sharia Compliance Certificate'
  | 'Sharia Governance Certificate'
  | 'Smart Contract Technical Assessment'
  | 'Tokenomics Sustainability Assessment'
  | 'Halal Web3 Script Assessment';

export type RiskRating = 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Compliant' | 'Non-Compliant';

export interface PublicCertifiedProject {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string;
  blockchain: string;
  category: string;
  certificateStatus: CertificateStatus;
  certificateType: CertificateType;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  riskRating: RiskRating;
  websiteUrl: string;
  whitepaperUrl: string;
  contractAddress?: string;
  shariaSummaryEn: string;
  shariaSummaryAr: string;
  scholarSignatures: string[];
  verificationHash: string;
}

export interface Lead {
  id: string;
  companyName: string;
  projectSymbol: string;
  country: string;
  website: string;
  contactEmail: string;
  telegram?: string;
  source: 'CoinMarketCap' | 'CoinGecko' | 'Website Discovery' | 'Conference' | 'Referral' | 'API Import';
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost';
  assignedSalesperson: string;
  probability: number;
  estimatedValue: number;
  notes: string;
  createdDate: string;
}

export interface CertificationApplication {
  id: string;
  applicationNumber: string;
  companyName: string;
  legalCountry: string;
  representativeName: string;
  officialEmail: string;
  phone: string;
  telegram?: string;
  xHandle?: string;
  githubUrl?: string;
  walletAddress?: string;
  cmcUrl?: string;
  coingeckoUrl?: string;
  websiteUrl: string;
  whitepaperUrl: string;
  contractAddress: string;
  blockchain: string;
  projectDescription: string;
  packageType: 'Starter' | 'Professional' | 'Enterprise';
  stage: WorkflowStage;
  submittedAt: string;
  targetCompletionDate: string;
  depositPaid: boolean;
  finalPaid: boolean;
  totalFee: number;
  depositAmount: number;
  remainingAmount: number;
}

export interface AiExtractionResult {
  projectId: string;
  extractedAt: string;
  whitepaperSummary: {
    purpose: string;
    revenueSources: string[];
    tokenUtility: string[];
    governanceModel: string;
    stakingYieldDetails: string;
    lendingBorrowing: boolean;
    missingInformation: string[];
  };
  smartContractAnalysis: {
    verifiedCode: boolean;
    compilerVersion: string;
    ownerAddress: string;
    isProxy: boolean;
    isUpgradeable: boolean;
    mintFunction: boolean;
    burnFunction: boolean;
    pauseFunction: boolean;
    blacklistFunction: boolean;
    feePercentage: number;
    treasuryWallets: string[];
    privilegedFunctions: string[];
  };
  businessAnalysis: {
    coreActivities: string[];
    revenueStructure: string;
    shariaRiskScore: number;
    transparencyLevel: 'High' | 'Medium' | 'Low';
  };
  aiDraftFindings: AiFinding[];
}

export interface AiFinding {
  id: string;
  category: 'Business Model' | 'Smart Contract' | 'Tokenomics' | 'Governance' | 'Sharia Compliance';
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidenceScore: number; // 0-100
  evidenceSource: string;
  suggestedReviewerRole: UserRole;
  status: 'Draft' | 'Confirmed' | 'Rejected' | 'Modified';
  reviewerNotes?: string;
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  assignedRole: UserRole;
  assignedEmployeeName: string;
  stage: WorkflowStage;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  estimatedHours: number;
  actualHours?: number;
  status: 'Pending' | 'In Progress' | 'Waiting Clarification' | 'Approved' | 'Rejected';
  slaHours: number;
  deadline: string;
  comments: string[];
}

export interface ClarificationMessage {
  id: string;
  projectId: string;
  senderRole: UserRole | 'customer';
  senderName: string;
  timestamp: string;
  message: string;
  attachments?: string[];
  isCustomerRead: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  projectId?: string;
  action: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  digitalSignature: string;
  ipAddress: string;
}

export interface AiServiceLog {
  id: string;
  timestamp: string;
  project: string;
  customer: string;
  feature: string;
  aiProvider: string;
  aiModel: string;
  requestTimeMs: number;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  estimatedCostUsd: number;
  status: 'Success' | 'Error' | 'Fallback';
}

export interface AiConfig {
  activeProvider: 'Google Gemini' | 'HalalChain Enterprise AI' | 'Custom Provider';
  defaultModel: string;
  taskModelMapping: Record<string, string>;
  maxTokenLimit: number;
  autoAssessEnabled: boolean;
}

export interface RemoteEmployee {
  id: string;
  name: string;
  role: UserRole;
  country: string;
  timeZone: string;
  skills: string[];
  currentWorkload: number; // percentage
  hourlyCostUsd: number;
  qualityScore: number; // 0-100
  completedProjects: number;
  status: 'Available' | 'Busy' | 'On Leave';
}

export interface QuestionLibraryItem {
  id: string;
  category: string;
  questionEn: string;
  questionAr: string;
  evidenceRequired: string;
  reviewerRole: UserRole;
  applicableMethodology: string;
  status: 'Active' | 'Retired';
}

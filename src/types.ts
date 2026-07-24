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
  | 'apply'
  | 'join_team';

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
  | 'admin'
  | string; // Allow custom roles created by GM

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  category: 'Executive' | 'Operations' | 'External Client' | 'Custom';
  isSystemRole?: boolean;
  createdAt?: string;
}

export interface PermissionDefinition {
  key: string;
  label: string;
  category: 'Platform Views' | 'Executive Modules' | 'Operations Workspace' | 'Customer Portal' | 'System Actions';
  description: string;
}

export interface RolePermissionsMap {
  [roleId: string]: {
    [permissionKey: string]: boolean;
  };
}

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
  isRecruitedRemote?: boolean;
  cvSummary?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  bio?: string;
  education?: string;
  experienceDetails?: string;
  cvAttachmentUrl?: string;
  cvFileName?: string;
  cvFileSize?: string;
}

export interface TalentApplication {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  country: string;
  timeZone: string;
  expectedHourlyRateUsd: number;
  skills: string[];
  experienceYears: number;
  cvSummary: string;
  portfolioUrl?: string;
  githubUrl?: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  appliedDate: string;
  notes?: string;
  phone?: string;
  whatsappNumber?: string;
  bio?: string;
  education?: string;
  experienceDetails?: string;
  cvAttachmentUrl?: string;
  cvFileName?: string;
  cvFileSize?: string;
}

export interface ReassignmentHistoryItem {
  date: string;
  role: UserRole;
  previousMemberName: string;
  newMemberName: string;
  reason: string;
}

export interface ProjectTeamAssignment {
  projectId: string;
  leadTechAuditorId: string;
  leadTechAuditorName: string;
  shariaScholarId: string;
  shariaScholarName: string;
  businessAnalystId: string;
  businessAnalystName: string;
  qaOfficerId: string;
  qaOfficerName: string;
  lastUpdated: string;
  reassignmentHistory: ReassignmentHistoryItem[];
}

export interface SystemAutoMetrics {
  slaAdherenceScore: number; // 0-100
  auditAccuracyScore: number; // 0-100
  reportCompleteness: number; // 0-100
  communicationResponsiveness: number; // 0-100
  complianceQuality: number; // 0-100
  overallAutoScore: number; // 0-100
}

export interface PmManualAssessment {
  leadershipScore: number; // 1-5 or 0-100
  analyticalDepth: number; // 0-100
  teamCollaboration: number; // 0-100
  technicalRigour: number; // 0-100
  deliverablePunctuality: number; // 0-100
  overallPmScore: number; // 0-100
  evaluatorNotes: string;
  evaluatedDate: string;
  evaluatorName: string;
}

export interface MemberEvaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  role: UserRole;
  projectId: string;
  projectName: string;
  currentTask: string;
  assignedDate: string;
  systemAutoMetrics: SystemAutoMetrics;
  pmManualAssessment: PmManualAssessment;
  finalCombinedScore: number;
  ratingCategory: 'Exceptional (A+)' | 'Strong (A)' | 'Satisfactory (B)' | 'Needs Improvement (C)';
}

export interface WorkLogEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  role: UserRole;
  projectId: string;
  projectName: string;
  hoursWorked: number;
  hourlyRateUsd: number;
  totalPayUsd: number;
  dateLogged: string;
  taskDescription: string;
  performanceScore: number; // 0-100
  paymentStatus: 'Pending Approval' | 'Approved for Release' | 'Paid';
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'new_task' | 'task_completed' | 'clarification' | 'payment' | 'certificate' | 'deadline' | 'overdue' | 'message';
  timestamp: string;
  isRead: boolean;
  linkTab?: PlatformTab;
  projectId?: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  title: string;
  category: 'Payroll' | 'Bonus' | 'Deduction' | 'Customer Deposit' | 'Customer Final Payment' | 'AI Operating Expense' | 'Audit Fee' | 'Refund' | 'Subscription';
  type: 'credit' | 'debit';
  amountUsd: number;
  status: 'Completed' | 'Pending' | 'Processing';
  relatedProject?: string;
  description: string;
}

export interface EmployeeWalletData {
  employeeId: string;
  employeeName: string;
  currentBalanceUsd: number;
  pendingPayrollUsd: number;
  totalEarnedUsd: number;
  bonusesUsd: number;
  deductionsUsd: number;
  preferredCurrency: 'USD' | 'HLC';
  transactions: WalletTransaction[];
}

export interface CompanyWalletData {
  currentBalanceUsd: number;
  totalIncomeUsd: number;
  totalExpensesUsd: number;
  customerPaymentsUsd: number;
  refundsUsd: number;
  payrollPaymentsUsd: number;
  subscriptionsUsd: number;
  operatingExpensesUsd: number;
  monthlySummary: { month: string; income: number; expenses: number; netProfit: number }[];
  transactions: WalletTransaction[];
}

// ==================== HALALCHAIN ASSESSMENT ENGINE TYPES ====================

export type AssessmentStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface AssessmentStepInfo {
  number: AssessmentStepNumber;
  title: string;
  subtitle: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Flagged';
}

export interface WhitepaperExtractionFact {
  id: string;
  sectionTitle: string;
  keyFact: string;
  details: string;
  confidenceScore: number; // 0 - 100
  evidenceQuote: string;
  pageNumber: number;
  paragraphNumber: number;
  sourceUrl: string;
  isHalalDecision: false; // Mandatory constraint: AI NEVER decides Halal/Haram!
}

export interface DiscrepancyItem {
  id: string;
  fieldTopic: string;
  websiteClaim: string;
  whitepaperFact: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  explanation: string;
  reviewerStatus: 'Pending Review' | 'Validated Discrepancy' | 'Cleared by Reviewer';
  reviewerNote?: string;
}

export interface DetailedTokenomics {
  totalSupply: string;
  circulatingSupply: string;
  maxSupply: string;
  distributionBreakdown: {
    investorsPct: number;
    teamPct: number;
    foundationPct: number;
    treasuryPct: number;
    publicPct: number;
    stakingYieldPct: number;
  };
  inflationMechanism: string;
  deflationBurnMechanism: string;
  lockupPeriodMonths: number;
  unlockSchedule: string;
  emissionRateDescription: string;
  yieldStakingMechanisms: string;
  hasFixedInterestRisk: boolean;
}

export interface SmartContractSecurityScan {
  compilerVersion: string;
  isVerifiedCode: boolean;
  ownershipType: 'Single Owner' | 'Multi-Sig Council' | 'DAO Governance' | 'Renounced' | 'Proxy Admin';
  ownerAddress: string;
  isUpgradeableProxy: boolean;
  proxyImplementationAddress?: string;
  hasMintFunction: boolean;
  hasBurnFunction: boolean;
  hasPauseFunction: boolean;
  hasBlacklistFunction: boolean;
  feeTaxPercentage: number;
  reflectionMechanisms: string;
  treasuryWallets: string[];
  privilegedFunctions: string[];
  codeLineReferences: { functionName: string; lineNo: number; description: string }[];
  unlimitedMintRisk: boolean;
  centralizationRisk: 'High' | 'Medium' | 'Low';
}

export interface OnChainBlockchainData {
  topHoldersConcentrationPct: number;
  treasuryWalletBalance: string;
  treasuryMultiSigType: string;
  liquidityLockDurationMonths: number;
  liquidityLockProofUrl: string;
  contractVerificationStatus: 'Verified on Etherscan/Explorer' | 'Unverified Bytecode Only';
  contractAgeDays: number;
  deployerWallet: string;
  recentTxVolume24hUsd: number;
}

export interface RiskFindingItem {
  id: string;
  title: string;
  category: 'Smart Contract' | 'Tokenomics' | 'Governance' | 'Business Model' | 'Blockchain Centralization';
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  evidenceQuote: string;
  referenceLocation: string;
  explanation: string;
  reviewerStatus: 'Pending Review' | 'Validated' | 'Overridden / Cleared';
  reviewerComment?: string;
}

export interface StandardsMappingItem {
  id: string;
  standardCode: string;
  criterionTitle: string;
  mappedFact: string;
  evidenceSnippet: string;
  assignedRole: 'tech_auditor' | 'business_analyst' | 'scholar' | 'qa' | 'pm';
  classificationStatus: 'Tech Review Required' | 'Business Review Required' | 'Scholar Review Required' | 'QA Review Required' | 'Already Confirmed';
  status: 'Draft' | 'Pending' | 'Confirmed' | 'Flagged';
  reviewerNotes?: string;
}

export interface ReviewerSignoff {
  reviewerRole: UserRole;
  reviewerName: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Changes Requested';
  signedAt?: string;
  comment?: string;
  digitalSignature?: string;
}

export interface AssessmentReportData {
  id: string;
  projectId: string;
  companyName: string;
  projectSymbol: string;
  cmcUrl?: string;
  coingeckoUrl?: string;
  contractAddress?: string;
  blockchain: string;
  whitepaperUrl: string;
  websiteUrl: string;
  status: 'In Progress' | 'Draft Report Ready' | 'Under Multi-Role Review' | 'Final Approved';
  currentStep: AssessmentStepNumber;
  draftWatermark: boolean; // True by default!
  finalCertificateDecision?: 'APPROVED_HALAL' | 'REJECTED_HARAM' | 'CONDITIONAL_APPROVAL' | 'PENDING';
  certificateNumber?: string;
  issueDate?: string;
  verificationHash?: string;
  
  // Step Data
  step1InfoCollection?: {
    cmcData: any;
    coingeckoData: any;
    contractMetaData: any;
    sourceUrlsLog: { field: string; value: string; sourceUrl: string }[];
  };
  step2WhitepaperFacts?: WhitepaperExtractionFact[];
  step3Discrepancies?: DiscrepancyItem[];
  step4Tokenomics?: DetailedTokenomics;
  step5SmartContract?: SmartContractSecurityScan;
  step6Blockchain?: OnChainBlockchainData;
  step7Risks?: RiskFindingItem[];
  step8StandardsMapping?: StandardsMappingItem[];
  
  // Human Review
  humanReviewSignoffs: Record<string, ReviewerSignoff>;
  auditTrail: AuditLogEntry[];
}



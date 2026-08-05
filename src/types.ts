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
  | 'join_team'
  | 'whitepaper_repository';

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

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  title?: string;
  avatarUrl?: string;
  targetPlatform?: PlatformView;
  assignedProjectIds?: string[];
}

export type MasterProject = MasterProjectRecord;

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
  phone?: string;
  address?: string;
  supportContact?: string;
  mediaContact?: string;
  cmcUrl?: string;
  coingeckoUrl?: string;
  contractAddress?: string;
  logoUrl?: string;
  xAccount?: string;
  githubUrl?: string;
  whitepaperUrl?: string;
  blockchain?: string;
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
  applicationNumber?: string;
  companyName: string;
  projectSymbol?: string;
  legalCountry: string;
  representativeName: string;
  officialEmail: string;
  phone?: string;
  telegram?: string;
  xHandle?: string;
  githubUrl?: string;
  walletAddress?: string;
  cmcUrl?: string;
  coingeckoUrl?: string;
  websiteUrl: string;
  whitepaperUrl: string;
  originalWhitepaperUrl?: string;
  resolvedPdfUrl?: string;
  firebaseStorageUrl?: string;
  contractAddress: string;
  blockchain: string;
  projectDescription: string;
  packageType: 'Starter' | 'Professional' | 'Enterprise';
  stage: WorkflowStage;
  submittedAt: string;
  targetCompletionDate: string;
  depositPaid: boolean;
  finalPaid?: boolean;
  totalFee: number;
  depositAmount: number;
  remainingAmount?: number;
  depositTxHash?: string;
  parentAppId?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  notes?: string;
  isArchived?: boolean;
  archiveReason?: string;
  archivedAt?: string;
  versionNumber?: number;
  masterProjectId?: string;
  whitepaperRepositoryId?: string;
  whitepaperSha256?: string;
  whitepaperVersion?: number;
  assignedReviewers?: {
    tech_auditor?: string;
    scholar?: string;
    business_analyst?: string;
    qa?: string;
    qa_officer?: string;
    pm?: string;
    teamLead?: string;
  };
  certificateExpiryDate?: string;
}

export interface WhitepaperRepositoryItem {
  id: string; // e.g. WP-2026-001 or WP-HASH
  projectId: string;
  coinSymbol: string;
  coinName: string;
  cmcUrl?: string;
  originalWhitepaperUrl: string;
  resolvedPdfUrl: string;
  firebaseStorageUrl: string;
  sha256: string;
  fileSize: number;
  pages: number;
  uploadDate: string;
  lastChecked: string;
  contentHash: string;
  assessmentId?: string;
  version: number;
  language: string;
  status: 'current' | 'archived' | 'superseded';
  etag?: string;
  lastModifiedHeader?: string;
  
  extractedKnowledge?: {
    executiveSummary: string;
    businessModel: string;
    products: string[];
    services: string[];
    revenueSources: string[];
    governance: string;
    utility: string[];
    tokenomics: {
      totalSupply?: string;
      circulatingSupply?: string;
      maxSupply?: string;
      distributionBreakdown?: Record<string, number>;
      inflationMechanism?: string;
      deflationBurnMechanism?: string;
      lockupPeriodMonths?: number;
      unlockSchedule?: string;
      yieldStakingMechanisms?: string;
      hasFixedInterestRisk?: boolean;
    };
    riskFactors: Array<{
      id: string;
      title: string;
      category: string;
      severity: string;
      explanation: string;
      evidenceQuote?: string;
    }>;
    complianceStatements: Array<{
      id: string;
      standardCode: string;
      criterionTitle: string;
      mappedFact: string;
      evidenceSnippet: string;
    }>;
    technologyStack: {
      blockchain?: string;
      consensus?: string;
      smartContractLanguages?: string[];
      securityAudits?: string[];
      architectureType?: string;
    };
    consensus: string;
    roadmap: string[];
    jurisdiction: string;
    disclaimers: string;
    extractedTextSnippet?: string;
    fullText?: string;
    sections?: Array<{ title: string; content: string }>;
  };

  versionHistory?: Array<{
    version: number;
    sha256: string;
    uploadDate: string;
    fileSize: number;
    pages: number;
    resolvedPdfUrl: string;
    firebaseStorageUrl: string;
    status: 'current' | 'archived' | 'superseded';
    changeNotes?: string;
  }>;
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
  leadTechAuditorId?: string;
  leadTechAuditorName?: string;
  shariaScholarId?: string;
  shariaScholarName?: string;
  businessAnalystId?: string;
  businessAnalystName?: string;
  qaOfficerId?: string;
  qaOfficerName?: string;
  lastUpdated?: string;
  reassignmentHistory?: ReassignmentHistoryItem[];
  teamLead?: string;
  members?: string[];
  assignedAt?: string;
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

export interface DomainTermGlossaryItem {
  term: string;
  category: string;
  en: string;
  ar: string;
  definitionEn: string;
  definitionAr: string;
  canonicalUsage: string;
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

export interface WhitepaperVersionItem {
  version: number;
  sha256Hash: string;
  retrievedAt: string;
  pdfUrl: string;
  fileSizeBytes: number;
  isActive: boolean;
}

export interface ExtractedWhitepaperData {
  status: 'FOUND' | 'FALLBACK_DOCS' | 'NOT_FOUND' | 'SUCCESS' | 'HTTP_ERROR' | 'NO_URL';
  message: string;
  originalUrl?: string;
  resolvedUrl?: string;
  pdfUrl: string;
  extractedText: string;
  pageCount: number;
  fileSizeBytes: number;
  sha256Hash?: string;
  retrievalDate?: string;
  httpStatus?: number;
  contentType?: string;
  htmlResolved?: boolean;
  pdfDownloaded?: boolean;
  textExtracted?: boolean;
  language?: string;
  extractionQuality?: 'High' | 'Medium' | 'Low' | 'Fallback';
  validationDetails?: {
    isValidWhitepaper: boolean;
    validationScore: number;
    validationStatus: string;
    foundIndicators: string[];
    rejectedReason?: string;
  };
  sections: { title: string; content: string }[];
  versionHistory?: WhitepaperVersionItem[];
}

export type ReportWorkflowState =
  | 'Draft'
  | 'Technical Review'
  | 'Business Review'
  | 'Sharia Review'
  | 'QA Review'
  | 'Approved'
  | 'Certified'
  | 'Published';

export interface ReportExecutiveConclusion {
  executiveSummary: string;
  overallRiskRating: 'Low Risk' | 'Medium Risk' | 'High Risk';
  overallAssessmentScore: number;
  strengths: string[];
  weaknesses: string[];
  majorFindings: string[];
  correctiveRecommendations: string[];
  futureMonitoringRecommendations: string[];
  scopeOfAssessment: string;
  assessmentLimitations: string;
  nextReviewDate: string;
  certificateStatus: string;
  reviewerRecommendation: string;
  executiveRecommendation: string;
  qrVerificationUrl?: string;
  digitalSignatureHash?: string;
}

export interface ExpertReviewerDetail {
  role: string;
  name: string;
  roleTitle: string;
  qualificationTitle?: string;
  reviewDate: string;
  decision: 'Approved' | 'Pending' | 'Rejected' | 'Requires Revision';
  comments: string;
  digitalSignature: string;
}

export interface CustomerValueSection {
  keyPositiveFindings: string[];
  complianceHighlights: string[];
  operationalStrengths: string[];
  technologyStrengths: string[];
  businessStrengths: string[];
  transparencyHighlights: string[];
}

export interface ImprovementRecommendationItem {
  id: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  issue: string;
  impact: string;
  recommendedAction: string;
  responsibleParty: string;
  estimatedTime: string;
  currentStatus: 'Pending' | 'In Progress' | 'Resolved' | 'Mitigated';
}

export interface ReportVersioningInfo {
  assessmentVersion: string;
  reportVersion: string;
  previousAssessmentRef: string;
  previousCertificateRef: string;
  changeSummary: string;
  issueDate: string;
  revisionDate: string;
}

export interface ReportValidationIssue {
  code: string;
  message: string;
  section?: string;
  severity: 'error' | 'warning';
}

export interface ReportValidationResult {
  isValid: boolean;
  errors: ReportValidationIssue[];
  warnings: ReportValidationIssue[];
  validatedAt: string;
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
  workflowState?: ReportWorkflowState;
  currentStep: AssessmentStepNumber;
  draftWatermark: boolean; // True by default!
  finalCertificateDecision?: 'APPROVED_HALAL' | 'REJECTED_HARAM' | 'CONDITIONAL_APPROVAL' | 'PENDING';
  certificateNumber?: string;
  issueDate?: string;
  verificationHash?: string;
  
  // Executive Reporting Extensions
  executiveConclusion?: ReportExecutiveConclusion;
  expertReviewPanel?: Record<string, ExpertReviewerDetail>;
  customerValueHighlights?: CustomerValueSection;
  improvementRecommendations?: ImprovementRecommendationItem[];
  versioningInfo?: ReportVersioningInfo;
  legalDisclaimer?: string;

  // Step Data
  step1InfoCollection?: {
    cmcData: any;
    coingeckoData: any;
    contractMetaData: any;
    sourceUrlsLog: { field: string; value: string; sourceUrl: string }[];
    integrationsStatus?: { name: string; status: string; message: string; timestamp: string }[];
    extractedWhitepaper?: ExtractedWhitepaperData;
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

// ==================== EVIDENCE-BASED AI EXTRACTION ENGINE TYPES ====================

export type ProjectCategoryClassification =
  | 'Layer 1'
  | 'Layer 2'
  | 'Infrastructure'
  | 'Oracle'
  | 'AI'
  | 'Gaming'
  | 'RWA'
  | 'Stablecoin'
  | 'DEX'
  | 'Lending'
  | 'Payments'
  | 'Identity'
  | 'DePIN'
  | 'NFT'
  | 'DAO'
  | 'Other';

export interface EvidenceItem {
  evidenceId: string; // e.g. "EV-028"
  sourceDocument: 'Whitepaper PDF' | 'Litepaper' | 'Official Website' | 'Technical Documentation' | 'GitHub Repository' | 'Verified Smart Contract' | 'Blockchain Metadata' | 'Token Metadata' | 'CoinMarketCap' | 'CoinGecko' | string;
  pageNumber?: number | null;
  sectionName: string;
  paragraphNumber?: number | null;
  supportingQuote: string;
  confidenceScore: number; // e.g. 98%
}

export interface ExecutiveProfile {
  projectName: string;
  ticker: string;
  blockchain: string;
  category: ProjectCategoryClassification;
  launchDate: string;
  companyFoundation: string;
  website: string;
  whitepaperVersion: string;
  documentLanguage: string;
  numberOfPages: number;
}

export interface BusinessModelAnalysis {
  businessPurpose: string;
  targetMarket: string;
  products: string[];
  services: string[];
  revenueModel: string;
  customerSegments: string[];
  economicActivities: string[];
  categoryClassification: ProjectCategoryClassification;
  evidence: EvidenceItem[];
}

export interface TokenDistributionBreakdown {
  label: string;
  percentage: number;
}

export interface TokenAnalysis {
  purpose: string;
  utility: string[];
  governance: string;
  gas: string;
  payment: string;
  rewards: string;
  staking: string;
  treasury: string;
  accessRights: string;
  distribution: TokenDistributionBreakdown[];
  supplyModel: string;
  inflation: string;
  deflation: string;
  burning: string;
  minting: string;
  vesting: string;
  evidence: EvidenceItem[];
}

export interface GovernanceAnalysis {
  governanceType: 'DAO' | 'Foundation' | 'Company Controlled' | 'Hybrid';
  votingMechanisms: string;
  treasuryControl: string;
  multiSigSetup: string;
  emergencyPowers: string;
  upgradeAuthority: string;
  evidence: EvidenceItem[];
}

export interface FinancialFeatureItem {
  id: string;
  featureName:
    | 'Trading'
    | 'Margin'
    | 'Derivatives'
    | 'Leverage'
    | 'Borrowing'
    | 'Lending'
    | 'Interest'
    | 'Yield'
    | 'Farming'
    | 'Liquidity Mining'
    | 'Synthetic Assets'
    | 'Perpetuals'
    | 'Collateral'
    | 'Stablecoins'
    | string;
  description: string;
  isDetected: boolean;
  evidence: EvidenceItem;
}

export interface TechnicalFeatureItem {
  id: string;
  featureName:
    | 'Consensus'
    | 'Validators'
    | 'Nodes'
    | 'Cross-chain'
    | 'Bridge'
    | 'Oracle'
    | 'Zero Knowledge'
    | 'Rollups'
    | 'Privacy'
    | 'Smart Contracts'
    | string;
  details: string;
  evidence: EvidenceItem;
}

export interface RiskIndicator {
  id: string;
  flag:
    | 'Potential Interest Mechanism'
    | 'Potential Lending Function'
    | 'Potential Derivatives'
    | 'Complex Treasury'
    | 'Centralized Governance'
    | 'Upgradeable Contracts'
    | 'Unlimited Mint'
    | string;
  description: string;
  severity: 'Attention' | 'Moderate' | 'High';
  evidence: EvidenceItem;
}

export interface ReviewerQuestionItem {
  id: string;
  question: string;
  targetAspect: string;
  reviewerRole: 'tech_auditor' | 'business_analyst' | 'scholar';
  evidenceRefId?: string;
}

export interface ReviewerQuestions {
  technicalQuestions: ReviewerQuestionItem[];
  businessQuestions: ReviewerQuestionItem[];
  scholarQuestions: ReviewerQuestionItem[];
}

export interface QualityControlMetrics {
  documentsProcessedCount: number;
  pagesReadCount: number;
  evidenceCount: number;
  findingsCount: number;
  reviewerQuestionsCount: number;
  extractionConfidence: number; // 0 - 100
  missingInformation: string[];
}

export interface CollectedDocumentItem {
  docType: string;
  fileName: string;
  status: 'COLLECTED' | 'PROCESSED' | 'MISSING' | 'FALLBACK';
  sourceUrl: string;
  pageCount?: number;
}

export interface EvidenceDossierReport {
  id: string;
  projectId: string;
  extractedAt: string;
  executiveProfile: ExecutiveProfile;
  businessModel: BusinessModelAnalysis;
  tokenAnalysis: TokenAnalysis;
  governanceAnalysis: GovernanceAnalysis;
  financialFeatures: FinancialFeatureItem[];
  technicalFeatures: TechnicalFeatureItem[];
  riskIndicators: RiskIndicator[];
  reviewerQuestions: ReviewerQuestions;
  qualityControl: QualityControlMetrics;
  evidenceRegister: EvidenceItem[];
  documentsCollected: CollectedDocumentItem[];
  assessmentCompletenessPct: number;
}

export interface KnowledgeRepositoryFinding {
  id: string;
  projectId: string;
  projectName: string;
  category: string;
  findingTopic: string;
  extractedStatement: string;
  supportingQuote: string;
  sourceDocument: string;
  pageNumber?: number | null;
  sectionName?: string;
  confidenceScore: number;
  approvalStatus: 'Approved' | 'Pending Review';
  approvedBy: string;
  approvedAt: string;
  tags: string[];
}

// ==================== ENTERPRISE OPERATIONS PLATFORM TYPES ====================

export type LifecycleStageEnum =
  | 'Prospect'
  | 'Marketing'
  | 'Sales'
  | 'Customer'
  | 'Assessment'
  | 'Technical Review'
  | 'Business Review'
  | 'Scholar Review'
  | 'QA Review'
  | 'Certificate Issued'
  | 'Public Registry'
  | 'Annual Monitoring'
  | 'Renewal';

export interface StageAuditLogItem {
  id: string;
  date: string;
  user: string;
  userRole?: string;
  action: string;
  comment?: string;
}

export interface LifecycleStageTrackerInfo {
  stage: LifecycleStageEnum;
  assignedUser?: string;
  assignedUserRole?: string;
  startDate?: string;
  completionDate?: string;
  expectedCompletion?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  comments?: string;
  auditLog: StageAuditLogItem[];
}

export interface MasterProjectRecord {
  id: string; // HalalChain Unique ID e.g. HC-2026-000001
  projectId: string;
  projectName: string;
  tokenSymbol: string;
  coinMarketCapId?: string;
  coinGeckoId?: string;
  contractAddress?: string;
  officialWebsite?: string;
  companyName: string;
  country: string;
  city?: string;
  currentStatus: string;
  lifecycleStage: LifecycleStageEnum;
  certificateStatus: 'Pending' | 'Active' | 'Expired' | 'Under Review' | 'Revoked';
  assessmentVersion: string;
  lastAssessmentDate?: string;
  renewalDate?: string;
  assignedTeams: string[];
  stages?: Partial<Record<LifecycleStageEnum, LifecycleStageTrackerInfo>>;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTaskLock {
  projectId: string;
  taskId: string;
  lockedBy: string; // User Name
  lockedByRole: string;
  lockedAt: string; // ISO date string
  expectedFinish: string; // ISO date string
  isLocked: boolean;
}

export interface DuplicateCheckRequest {
  coinMarketCapId?: string;
  coinGeckoId?: string;
  contractAddress?: string;
  website?: string;
  githubUrl?: string;
  whitepaperHash?: string;
  projectName?: string;
  tokenSymbol?: string;
}

export interface DuplicateMatchDetail {
  field: string;
  value: string;
  matchedProjectId: string;
  matchedProjectName: string;
  halalChainId: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matches: DuplicateMatchDetail[];
  existingRecord?: MasterProjectRecord;
}

export interface MarketingProspectRecord {
  id: string;
  masterId: string; // e.g. HC-2026-000001
  companyName: string;
  website: string;
  generalEmail: string;
  supportEmail: string;
  partnershipEmail: string;
  bdEmail: string;
  mediaEmail: string;
  contactFormUrl: string;
  officialPhone: string;
  mailingAddress: string;
  country: string;
  city: string;
  xTwitter: string;
  telegram: string;
  discord: string;
  linkedIn: string;
  githubOrg: string;
  coinMarketCapLink: string;
  coinGeckoLink: string;
  assessmentStatus: string;
  certificateStatus: string;
  marketCapUSD?: number;
  contactCompletenessPct: number;
  smartRankScore: number; // calculated priority ranking score
  lastContactedAt?: string;
  invitationSent: boolean;
  assignedRep?: string;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'Invitation' | 'Follow-up' | 'Reminder' | 'Certificate Issued' | 'Renewal Reminder' | 'Payment Reminder' | 'Welcome Email';
  subject: string;
  isDefault: boolean;
  language: 'en' | 'ar';
  version: string;
  lastUpdated: string;
  htmlContent: string;
  variables: string[];
}

export interface EmailHistoryEntry {
  id: string;
  prospectId: string;
  masterId: string;
  companyName?: string;
  employeeName: string;
  date: string;
  time: string;
  emailTemplate: string;
  templateId?: string;
  recipient: string;
  subject: string;
  deliveryStatus: 'Delivered' | 'Opened' | 'Bounced' | 'Pending';
  openStatus?: 'Opened' | 'Unopened';
  clickStatus?: 'Clicked' | 'No Clicks';
  replyStatus: 'No Reply' | 'Replied' | 'Unsubscribed' | 'Interested';
  nextFollowUpDate: string;
  renderedHtml?: string;
  followUpTaskCreated?: boolean;
}

export interface SmartMarketingQueueItem {
  prospect: MarketingProspectRecord;
  rankPriority: number;
  reason: string;
  suggestedAction: string;
}

export interface ProjectIntelligenceReport {
  projectId: string;
  halalChainId: string;
  projectName: string;
  tokenSymbol: string;
  projectCompletenessPct: number;
  crmStatus: string;
  contactInfoCompletenessPct: number;
  marketingStatus: string;
  salesStatus: string;
  customerStatus: string;
  assessmentProgressPct: number;
  documentsCollectedCount: number;
  documentsRequiredCount: number;
  whitepaperStatus: 'Missing' | 'Collected' | 'Verified' | 'Updated';
  websiteStatus: 'Active' | 'Offline' | 'Under Review';
  githubStatus: 'Active' | 'Inactive' | 'No Repo';
  smartContractStatus: 'Verified' | 'Unverified' | 'Audited' | 'High Risk';
  evidenceCount: number;
  aiFindingsCount: number;
  aiConfidencePct: number;
  technicalReviewStatus: 'Pending' | 'In Progress' | 'Approved' | 'Revision Required';
  businessReviewStatus: 'Pending' | 'In Progress' | 'Approved' | 'Revision Required';
  scholarReviewStatus: 'Pending' | 'In Progress' | 'Approved' | 'Revision Required';
  qaReviewStatus: 'Pending' | 'In Progress' | 'Approved' | 'Revision Required';
  certificateStatus: string;
  registryStatus: 'Published' | 'Unpublished' | 'Pending';
  renewalStatus: 'Up-to-Date' | 'Due Soon' | 'Expired';
  overallCompletionPct: number;
}

export interface OperationsKPIOverview {
  totalProspects: number;
  neverContacted: number;
  contacted: number;
  waitingForReply: number;
  positiveResponses: number;
  negativeResponses: number;
  qualifiedLeads: number;
  activeCustomers: number;
  projectsInProgress: number;
  projectsWaitingReview: number;
  certificatesIssued: number;
  certificatesExpiringSoon: number;
  projectsBlocked: number;
  averageAssessmentDays: number;
  averageAiConfidencePct: number;
  employeeUtilizationPct: number;
  departmentWorkloadPct: number;
  revenuePipelineUSD: number;
  upcomingRenewalsCount: number;
}

export interface WorkloadManagementEntry {
  employeeId: string;
  employeeName: string;
  role: string;
  currentAssignmentsCount: number;
  estimatedRemainingHours: number;
  weeklyCapacityHours: number;
  capacityUtilizationPct: number;
  assignedProjects: Array<{ projectId: string; projectName: string; deadline: string; stage: string }>;
}

export interface SystemAlertItem {
  id: string;
  type:
    | 'task_overdue'
    | 'customer_waiting'
    | 'reviewer_inactive'
    | 'cert_expiring'
    | 'whitepaper_changed'
    | 'contract_changed'
    | 'github_updated'
    | 'assessment_blocked'
    | 'customer_replied'
    | 'high_priority_prospect';
  severity: 'high' | 'medium' | 'info';
  projectId?: string;
  projectName: string;
  message: string;
  timestamp: string;
  assignedTo: string;
  isRead: boolean;
}

export interface EnterpriseReportExport {
  reportType:
    | 'marketing_performance'
    | 'sales_performance'
    | 'reviewer_productivity'
    | 'assessment_turnaround'
    | 'certificate_statistics'
    | 'customer_satisfaction'
    | 'revenue_report'
    | 'renewal_forecast';
  title: string;
  generatedAt: string;
  generatedBy: string;
  summaryMetrics: Record<string, any>;
  dataRows: Array<Record<string, any>>;
}

/**
 * Enterprise Multilingual Collaboration Engine Types
 */
export type TranslationStatus =
  | 'AI Generated'
  | 'Awaiting Verification'
  | 'Verified'
  | 'Rejected'
  | 'Modified';

export type MultilingualFieldKey =
  | 'assessment_finding'
  | 'recommendation'
  | 'scholar_opinion'
  | 'business_finding'
  | 'technical_finding'
  | 'qa_notes'
  | 'executive_summary'
  | 'final_conclusion'
  | 'certificate_remarks'
  | 'internal_notes'
  | 'customer_messages'
  | 'report_comments';

export type ReportDisplayLanguage = 'en' | 'ar' | 'bilingual';

export interface MultilingualTextRecord {
  id: string;
  fieldKey: MultilingualFieldKey | string;
  entityId?: string;
  entityName?: string;
  originalLanguage: 'en' | 'ar' | string;
  originalText: string;
  translations: Record<string, string>; // { en: '...', ar: '...', fr: '...', tr: '...', ms: '...', id: '...', ur: '...' }
  translationStatus: TranslationStatus;
  translationConfidence: number; // 0.0 - 1.0 or 0 - 100
  translationGeneratedDate: string;
  generatedBy: string;
  verifiedBy?: string;
  verificationDate?: string;
  reviewerNotes?: string;
  aaoifiReferences?: string[]; // Standard IDs or codes attached
}

export interface AaoifiStandardReference {
  id: string; // e.g. "AAOIFI-21"
  standardNumber: string; // e.g. "AAOIFI Standard No. 21 (Financial Sukuk)"
  sectionCode: string; // e.g. "Para 3/2 - Ownership & Risk Transfer"
  titleEn: string;
  titleAr: string;
  arabicText: string;
  officialEnglishText: string;
  internalExplanationEn: string;
  internalExplanationAr: string;
  aiSummaryEn: string;
  aiSummaryAr: string;
  category: 'Sukuk' | 'Gharar & Derivatives' | 'Governance' | 'Cryptocurrency & Tokens' | 'Profit Sharing & Mudarabah';
}



// ==================== ENTERPRISE AI ASSESSMENT INTELLIGENCE ENGINE TYPES ====================

export interface AiConfidenceDimension {
  dimensionKey: 'whitepaper' | 'smart_contract' | 'business_model' | 'governance' | 'tokenomics' | 'transparency' | 'sharia_readiness';
  titleEn: string;
  titleAr: string;
  scorePct: number; // 0 - 100
  confidenceLevel: 'High Confidence' | 'Medium Confidence' | 'Attention Required';
  positiveFactors: string[];
  riskFactors: string[];
  explanation: string;
}

export interface AiContradictionAlert {
  id: string;
  projectId: string;
  contradictionTitle: string;
  contradictionCategory: 'Technical vs Governance' | 'Business vs Sharia' | 'Whitepaper vs On-Chain Code' | 'Scholar vs Business Analyst' | 'QA vs Technical Reviewer';
  disciplinesInvolved: UserRole[];
  findingA: { role: string; summary: string; quoteRef?: string };
  findingB: { role: string; summary: string; quoteRef?: string };
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  detectedAt: string;
  aiExplanation: string;
  recommendedResolution: string;
  status: 'Active Alert' | 'Resolved by Human';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
  label: 'AI Recommendation – Human Review Required';
}

export interface MandatoryEvidenceItem {
  id: string;
  title: string;
  discipline: 'Technical Review' | 'Business Review' | 'Governance' | 'Sharia Review' | 'QA Review';
  evidenceType: 'Whitepaper Source Quote' | 'Bytecode Explorer Verification' | 'On-Chain Liquidity Lock Proof' | 'Multi-Sig Governance Spec' | 'AAOIFI Standard Clause Mapping' | 'Representative Identity Verification';
  isCollected: boolean;
  isRequiredForCertification: boolean;
  collectedDetails?: string;
  sourceRef?: string;
  missingImpact: string;
}

export interface DisciplineProgress {
  disciplineKey: 'technical' | 'business' | 'governance' | 'sharia' | 'qa' | 'operations';
  title: string;
  role: UserRole;
  completionPct: number;
  totalTasks: number;
  completedTasks: number;
  remainingTasks: string[];
}

export interface AiExecutiveSummaryReport {
  id: string;
  projectId: string;
  projectName: string;
  generatedAt: string;
  recommendedDecision: 'RECOMMENDED_FOR_CERTIFICATION' | 'REQUIRES_REVISION_AND_MITIGATION' | 'HIGH_SHARIA_RISK_REJECTED' | 'INCOMPLETE_EVIDENCE_HOLD';
  overallAssessmentScore: number;
  majorFindings: string[];
  majorRisks: Array<{
    id: string;
    title: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
    explanation: string;
  }>;
  positiveObservations: string[];
  outstandingIssues: string[];
  executiveConclusionText: string;
  consultingReportQuality: true;
  label: 'AI Recommendation – Human Review Required';
}

export interface CategorizedRecommendation {
  id: string;
  category: 'Business' | 'Technology' | 'Governance' | 'Transparency' | 'Sharia';
  title: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  suggestedAction: string;
  rationale: string;
  targetRole: UserRole;
  status: 'Suggested' | 'Accepted by Reviewer' | 'Dismissed';
  reviewerNote?: string;
  label: 'AI Recommendation – Human Review Required';
}

export interface ClassclassifiedRiskItem {
  id: string;
  title: string;
  category: 'Smart Contract' | 'Tokenomics' | 'Governance' | 'Business Model' | 'Blockchain Centralization' | 'Sharia Compliance';
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  classificationReasoning: string;
  evidenceQuote: string;
  referenceLocation: string;
  reviewerStatus: 'Pending Review' | 'Validated' | 'Overridden / Cleared';
  reviewerComment?: string;
}

export interface HistoricalPrecedentInsight {
  id: string;
  similarProjectId: string;
  similarProjectName: string;
  similarityScorePct: number;
  matchingDimension: string;
  reusableInsight: string;
  precedentOutcome: string;
  applicableAaoifiStandard?: string;
  label: 'AI Recommendation – Human Review Required';
}

export interface EnterpriseAiIntelligenceReport {
  projectId: string;
  projectName: string;
  analyzedAt: string;
  isCached: boolean;
  confidenceDimensions: AiConfidenceDimension[];
  overallAiConfidencePct: number;
  contradictionAlerts: AiContradictionAlert[];
  mandatoryEvidenceItems: MandatoryEvidenceItem[];
  missingEvidenceCount: number;
  isFinalCertificationBlocked: boolean;
  blockingReasons: string[];
  completenessPct: number;
  disciplineProgress: DisciplineProgress[];
  executiveSummary: AiExecutiveSummaryReport;
  categorizedRecommendations: CategorizedRecommendation[];
  classifiedRisks: ClassclassifiedRiskItem[];
  historicalInsights: HistoricalPrecedentInsight[];
}

export interface CustomerHealthScoreDetails {
  overallScore: number; // 0 - 100
  status: 'Excellent' | 'Healthy' | 'Needs Attention' | 'High Risk';
  communicationScore: number; // 0 - 100
  documentScore: number; // 0 - 100
  assessmentScore: number; // 0 - 100
  paymentScore: number; // 0 - 100
  renewalScore: number; // 0 - 100
  trend: 'improving' | 'stable' | 'declining';
  lastCalculatedAt: string;
  keyRisks: string[];
  positiveSignals: string[];
}

export interface SalesOpportunity {
  id: string;
  customerId: string;
  companyName: string;
  projectName: string;
  tokenName: string;
  stage: 'Lead' | 'Contacted' | 'Interested' | 'Meeting Scheduled' | 'Proposal Sent' | 'Assessment Started' | 'Certificate Issued' | 'Renewal' | 'Closed' | 'Lost';
  estimatedValueUSD: number;
  closeProbabilityPct: number;
  assignedSalesRep: string;
  createdDate: string;
  lastActivityDate: string;
  renewalDueDate?: string;
  stageHistory: Array<{ stage: string; timestamp: string; note: string; updatedBy: string }>;
}

export interface RenewalOpportunity {
  id: string;
  certificateNumber: string;
  companyName: string;
  projectName: string;
  issueDate: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: 'Expiring in 90 Days' | 'Expiring in 60 Days' | 'Expiring in 30 Days' | 'Expired' | 'Renewed' | 'In Renewal Review';
  annualFeeUSD: number;
  assignedRep: string;
  contactEmail: string;
  renewalStage: 'Pending Contact' | 'Outreach Sent' | 'Terms Agreed' | 'Re-Audit In Progress' | 'Completed';
}

export interface CustomerSatisfactionSurvey {
  id: string;
  customerId: string;
  companyName: string;
  projectName: string;
  ratingStars: number; // 1-5
  comments: string;
  improvementSuggestions: string;
  npsScore: number; // 0-10
  submittedAt: string;
  contactPerson: string;
}

export interface BusinessAutomationRule {
  id: string;
  ruleName: string;
  triggerEvent: 'Customer Inactivity (3 Days)' | 'Customer Inactivity (7 Days)' | 'Unpaid Invoice' | 'Missing Documents' | 'Certificate Expiry (90 Days)' | 'Certificate Issued' | 'CSAT Survey Submitted';
  condition: string;
  automatedActions: string[];
  isEnabled: boolean;
  lastTriggeredAt: string;
  triggerCount: number;
  requiresHumanApproval: boolean;
}

export interface AutomationAuditLog {
  id: string;
  timestamp: string;
  ruleId: string;
  ruleName: string;
  triggeredBy: string;
  targetEntityId: string;
  targetEntityName: string;
  actionTaken: string;
  result: 'Success' | 'Skipped (Duplicate)' | 'Failed' | 'Pending Human Confirmation';
  reason: string;
  digitalSignatureHash: string;
}

export interface ServiceCatalogItem {
  id: string;
  serviceName: string;
  description: string;
  category: 'Sharia Compliance' | 'Smart Contract Audit' | 'Whitepaper Audit' | 'Governance Review' | 'Tokenomics Assessment' | 'Annual Monitoring' | 'Enterprise Subscription' | 'Training Services' | 'Consulting';
  basePriceUSD: number;
  currency: string; // 'USD' | 'AED' | 'SAR' | 'EUR' | 'MYR' | 'GBP'
  estimatedDurationDays: number;
  deliverables: string[];
  renewalRequired: boolean;
  isActive: boolean;
  pricingModel: 'Fixed' | 'Custom' | 'Discount' | 'Promotional' | 'Enterprise' | 'Partner' | 'Regional';
  regionalMultipliers?: Record<string, number>; // e.g. GCC: 1.0, SEA: 0.85, EU: 1.15
  createdAt: string;
  updatedAt: string;
}

export interface PriceHistoryEntry {
  id: string;
  serviceId: string;
  serviceName: string;
  oldPriceUSD: number;
  newPriceUSD: number;
  currency: string;
  reason: string;
  changedBy: string;
  timestamp: string;
}

export interface QuotationItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPriceUSD: number;
  discountPercentage: number;
  taxPercentage: number;
  totalUSD: number;
}

export interface QuotationRecord {
  id: string;
  quotationNumber: string;
  customerName: string;
  companyName: string;
  customerEmail: string;
  country: string;
  currency: string; // 'USD' | 'AED' | 'SAR' | 'EUR' | 'MYR' | 'GBP'
  exchangeRateToBaseUSD: number;
  items: QuotationItem[];
  subtotalUSD: number;
  totalDiscountUSD: number;
  taxTotalUSD: number;
  grandTotalUSD: number;
  validityDate: string;
  termsAndConditions: string;
  digitalApprovalStatus: 'Pending Signature' | 'Digitally Approved' | 'Declined';
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  createdBy: string;
  createdAt: string;
  convertedToProjectId?: string;
  convertedToContractId?: string;
}

export interface CommercialContractRecord {
  id: string;
  contractNumber: string;
  quotationId?: string;
  customerName: string;
  companyName: string;
  servicesIncluded: string[];
  totalContractValueUSD: number;
  currency: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  status: 'Draft' | 'Pending Signature' | 'Active' | 'Renewed' | 'Terminated' | 'Expired';
  signedDocumentUrl?: string;
  signedAt?: string;
  notes: string;
  autoRenewal: boolean;
  partnerReferralCode?: string;
}

export interface CommercialInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CommercialInvoiceRecord {
  id: string;
  invoiceNumber: string;
  contractId?: string;
  quotationId?: string;
  customerName: string;
  companyName: string;
  country: string;
  currency: string;
  exchangeRateToBaseUSD: number;
  items: CommercialInvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  totalAmountUSD: number;
  amountPaidUSD: number;
  outstandingBalanceUSD: number;
  issueDate: string;
  dueDate: string;
  paymentStatus: 'Draft' | 'Issued' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
  pdfGeneratedUrl?: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  companyName: string;
  amountPaidUSD: number;
  paymentType: 'Payment Received' | 'Refund' | 'Partial Payment';
  paymentMethod: 'Bank Wire Transfer' | 'Crypto Escrow' | 'Credit Card' | 'Corporate Transfer' | 'Letter of Credit';
  referenceNumber: string;
  paymentDate: string;
  recordedBy: string;
  status: 'Cleared' | 'Pending Verification' | 'Refunded';
  notes?: string;
}

export interface CommercialSubscriptionRecord {
  id: string;
  subscriptionNumber: string;
  customerName: string;
  companyName: string;
  serviceCategory: string;
  annualFeeUSD: number;
  currency: string;
  startDate: string;
  renewalDate: string;
  autoRenewal: boolean;
  status: 'Active' | 'Past Due' | 'Auto-Renewing' | 'Canceled' | 'Expired';
  lastReminderSentDate?: string;
  associatedCertificateId?: string;
}

export interface PartnerRecord {
  id: string;
  partnerName: string;
  companyName: string;
  country: string;
  referralCode: string;
  commissionPercentage: number;
  projectsReferredCount: number;
  revenueGeneratedUSD: number;
  commissionPaidUSD: number;
  commissionPendingUSD: number;
  isActive: boolean;
  contactEmail: string;
}

export interface ReviewerPayrollRecord {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'Sharia Scholar' | 'Technical Auditor' | 'Tokenomics Lead' | 'Legal Expert';
  completedTasksCount: number;
  approvedAssessmentsCount: number;
  basePayUSD: number;
  bonusAmountUSD: number;
  commissionAmountUSD: number;
  totalPaymentsDueUSD: number;
  paymentStatus: 'Pending Payroll Approval' | 'Approved' | 'Disbursed';
  periodMonthYear: string;
  isImmutableForReviewers: true;
}

export interface FinancialAuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: 'Catalog' | 'Pricing' | 'Quotation' | 'Contract' | 'Invoice' | 'Payment' | 'Subscription' | 'Partner' | 'Payroll';
  entityId: string;
  oldValue: string;
  newValue: string;
  reason: string;
  digitalSignatureHash: string;
}

export interface CurrencyRate {
  code: 'USD' | 'AED' | 'SAR' | 'EUR' | 'MYR' | 'GBP';
  name: string;
  symbol: string;
  rateToBaseUSD: number; // e.g. 1 USD = 3.67 AED -> 3.67
  lastUpdated: string;
}

export interface PlatformAiExecutiveMetrics {
  averageAiConfidencePct: number;
  activeContradictionsCount: number;
  missingEvidenceCount: number;
  projectsReadyForQaCount: number;
  projectsReadyForCertificationCount: number;
  criticalRisksCount: number;
  overallPlatformHealthPct: number;
  overallPlatformHealthStatus: 'Optimal' | 'Stable' | 'Attention Required' | 'Critical Alerts';
}









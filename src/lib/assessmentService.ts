import {
  AssessmentReportData,
  WhitepaperExtractionFact,
  DiscrepancyItem,
  DetailedTokenomics,
  SmartContractSecurityScan,
  OnChainBlockchainData,
  RiskFindingItem,
  StandardsMappingItem,
  CertificationApplication,
  ReviewerSignoff,
  ShariaCertificationStatus
} from '../types';
import { STANDARDIZED_LEGAL_DISCLAIMER } from './reportValidator';

export const ASSESSMENT_STEPS_META = [
  {
    number: 1,
    title: 'Project Info Collection',
    subtitle: 'Step 1: Data Gathering',
    description: 'Fetch and verify project metadata from CoinMarketCap, CoinGecko, and contract address.'
  },
  {
    number: 2,
    title: 'Whitepaper Analysis',
    subtitle: 'Step 2: Fact Extraction',
    description: 'Deep NLP analysis extracting facts, page quotes, token utility, and treasury mechanics.'
  },
  {
    number: 3,
    title: 'Website & Docs Analysis',
    subtitle: 'Step 3: Discrepancy Cross-Check',
    description: 'Compare website promises, FAQs, and GitBook documentation against whitepaper disclosures.'
  },
  {
    number: 4,
    title: 'Tokenomics Analysis',
    subtitle: 'Step 4: Economic Structure',
    description: 'Audit supply mechanics, lockups, emissions, inflation/deflation, and staking yields.'
  },
  {
    number: 5,
    title: 'Smart Contract Analysis',
    subtitle: 'Step 5: Code & Bytecode Audit',
    description: 'Inspect compiler version, proxy upgradeability, owner privileges, fees, and mint risks.'
  },
  {
    number: 6,
    title: 'Blockchain Analysis',
    subtitle: 'Step 6: On-Chain Inspection',
    description: 'Verify wallet concentration, treasury multi-sig controls, liquidity locks, and contract age.'
  },
  {
    number: 7,
    title: 'Risk Detection',
    subtitle: 'Step 7: Threat & Flaw Classification',
    description: 'Consolidate technical risk findings with severity ratings, evidence quotes, and source references.'
  },
  {
    number: 8,
    title: 'HalalChain Standards Mapping',
    subtitle: 'Step 8: Criteria Classification',
    description: 'Map facts to AAOIFI & HalalChain v2.1 criteria, assigning items to specialized human review roles.'
  },
  {
    number: 9,
    title: 'Draft Report Generator',
    subtitle: 'Step 9: Enterprise Executive Report Generation',
    description: 'Generate enterprise-grade draft assessment report with DRAFT watermark overlay and graphics.'
  },
  {
    number: 10,
    title: 'Human Review & Final Report',
    subtitle: 'Step 10: Multi-Role Approval Queue',
    description: 'Human reviewers sign off, decision is rendered, watermark is removed, and final report is issued.'
  }
];

export function createDefaultAssessmentForProject(app: CertificationApplication): AssessmentReportData {
  const isSovereign = app.companyName.toLowerCase().includes('sukuk') || app.companyName.toLowerCase().includes('sovereign');
  
  const step2WhitepaperFacts: WhitepaperExtractionFact[] = [
    {
      id: 'WF-01',
      sectionTitle: 'Executive Summary & Business Purpose',
      keyFact: 'Core Business Model',
      details: isSovereign
        ? 'Tokenized fractional ownership of asset-backed sovereign treasury Sukuk certificates backed by underlying commodities.'
        : `Decentralized infrastructure layer providing automated liquidity pools and Sharia-compliant Web3 services for ${app.companyName}.`,
      confidenceScore: 98,
      evidenceQuote: `The protocol enables institutional and retail investors to access ${app.companyName} through blockchain smart contracts.`,
      pageNumber: 2,
      paragraphNumber: 3,
      sourceUrl: app.whitepaperUrl || 'https://web3project.io/whitepaper.pdf',
      isHalalDecision: false
    },
    {
      id: 'WF-02',
      sectionTitle: 'Token Utility & Governance',
      keyFact: 'Governance & Staking Model',
      details: 'Staking yields are generated from actual transaction service fees collected by protocol smart contracts, structured on a variable Mudarabah profit-sharing framework.',
      confidenceScore: 95,
      evidenceQuote: 'Stakers receive a proportional distribution of monthly protocol net trading revenues.',
      pageNumber: 7,
      paragraphNumber: 2,
      sourceUrl: app.whitepaperUrl || 'https://web3project.io/whitepaper.pdf',
      isHalalDecision: false
    },
    {
      id: 'WF-03',
      sectionTitle: 'Treasury & Token Allocation',
      keyFact: 'Vesting & Inflation Mechanics',
      details: 'Initial team tokens are subject to a 12-month cliff followed by 24-month linear vesting. Treasury allocation is capped at 15%.',
      confidenceScore: 92,
      evidenceQuote: 'Core contributor tokens unlock linearly over 36 months following the mainnet launch date.',
      pageNumber: 11,
      paragraphNumber: 5,
      sourceUrl: app.whitepaperUrl || 'https://web3project.io/whitepaper.pdf',
      isHalalDecision: false
    },
    {
      id: 'WF-04',
      sectionTitle: 'Risk Disclosures & Legal Framework',
      keyFact: 'Regulatory Disclosures',
      details: 'The whitepaper contains explicit risk warnings regarding smart contract exploits and regulatory changes across legal jurisdictions.',
      confidenceScore: 90,
      evidenceQuote: 'Investing in cryptographic assets carries inherent protocol risks. Users should conduct independent due diligence.',
      pageNumber: 24,
      paragraphNumber: 1,
      sourceUrl: app.whitepaperUrl || 'https://web3project.io/whitepaper.pdf',
      isHalalDecision: false
    }
  ];

  const step3Discrepancies: DiscrepancyItem[] = [
    {
      id: 'DISC-01',
      fieldTopic: 'Staking Return Messaging',
      websiteClaim: 'Website banner advertises "Guaranteed 18% Annual APY Yield on All Deposits".',
      whitepaperFact: 'Whitepaper Section 4.2 states yields fluctuate dynamically based on monthly protocol transaction volume.',
      severity: 'High',
      explanation: 'Marketing claims on the official website imply a fixed interest rate (Riba risk), whereas the whitepaper correctly describes variable profit sharing.',
      reviewerStatus: 'Validated Discrepancy',
      reviewerNote: 'Applicant marketing team must update website text to remove the word "Guaranteed" prior to final certificate approval.'
    },
    {
      id: 'DISC-02',
      fieldTopic: 'Multi-Sig Signers Count',
      websiteClaim: 'Website footer claims protocol is governed by a 7-of-11 decentralized council.',
      whitepaperFact: 'Whitepaper Section 8 specifies initial launch uses a 3-of-5 admin multi-sig.',
      severity: 'Medium',
      explanation: 'Discrepancy in advertised decentralized governance strength.',
      reviewerStatus: 'Pending Review'
    }
  ];

  const step4Tokenomics: DetailedTokenomics = {
    totalSupply: '100,000,000',
    circulatingSupply: '25,000,000',
    maxSupply: '100,000,000',
    distributionBreakdown: {
      investorsPct: 20,
      teamPct: 15,
      foundationPct: 15,
      treasuryPct: 20,
      publicPct: 10,
      stakingYieldPct: 20
    },
    inflationMechanism: 'Zero inflation cap. Fixed maximum supply hardcoded at contract deployment.',
    deflationBurnMechanism: '0.25% burn tax on specific cross-border protocol transfers.',
    lockupPeriodMonths: 12,
    unlockSchedule: '25% TGE unlock, followed by quarterly releases over 24 months.',
    emissionRateDescription: 'Staking pool emissions distributed linearly based on liquidity pool activity.',
    yieldStakingMechanisms: 'Variable fee revenue redistribution (Mudarabah / Wakalah model).',
    hasFixedInterestRisk: false
  };

  const step5SmartContract: SmartContractSecurityScan = {
    compilerVersion: 'v0.8.24',
    isVerifiedCode: true,
    ownershipType: 'Multi-Sig Council',
    ownerAddress: app.contractAddress || '0x3829102938102938102938102938102938102938',
    isUpgradeableProxy: false,
    hasMintFunction: false,
    hasBurnFunction: true,
    hasPauseFunction: true,
    hasBlacklistFunction: false,
    feeTaxPercentage: 0.3,
    reflectionMechanisms: 'None',
    treasuryWallets: ['0x8823102938102938102938102938102938102938'],
    privilegedFunctions: ['emergencyPause()', 'unpause()', 'updateTreasuryFeeRecipient()'],
    codeLineReferences: [
      { functionName: 'emergencyPause()', lineNo: 142, description: 'Allows multi-sig owner to freeze token transfers during security incidents.' },
      { functionName: 'updateTreasuryFeeRecipient()', lineNo: 188, description: 'Changes destination wallet for protocol service fees.' }
    ],
    unlimitedMintRisk: false,
    centralizationRisk: 'Medium'
  };

  const step6Blockchain: OnChainBlockchainData = {
    topHoldersConcentrationPct: 34.2,
    treasuryWalletBalance: '$4,850,000 USD (USDC/ETH)',
    treasuryMultiSigType: 'Gnosis Safe 3-of-5 Hardware Keys',
    liquidityLockDurationMonths: 24,
    liquidityLockProofUrl: 'https://etherscan.io/address/0xLockContractAddressProof',
    contractVerificationStatus: 'Verified on Etherscan/Explorer',
    contractAgeDays: 140,
    deployerWallet: '0xDeployerWalletAddress882190',
    recentTxVolume24hUsd: 1250000
  };

  const step7Risks: RiskFindingItem[] = [
    {
      id: 'RISK-01',
      title: 'Emergency Pause Centralization Risk',
      category: 'Smart Contract',
      severity: 'Medium',
      evidenceQuote: 'function emergencyPause() external onlyOwner { _pause(); }',
      referenceLocation: 'Contract L142 (EmergencyPauseModule.sol)',
      explanation: 'The contract owner can pause transfers immediately without a timelock delay. Recommended to implement a 24-hour timelock delay.',
      reviewerStatus: 'Validated'
    },
    {
      id: 'RISK-02',
      title: 'Marketing APY Copy Discrepancy',
      category: 'Business Model',
      severity: 'High',
      evidenceQuote: 'Website: "18% Guaranteed Annual Return"',
      referenceLocation: 'Official Website Landing Page Hero Banner',
      explanation: 'Promising a guaranteed APY constitutes fixed interest (Riba) wording risk. Must be corrected prior to certificate issuance.',
      reviewerStatus: 'Validated'
    },
    {
      id: 'RISK-03',
      title: 'Top 10 Wallet Concentration (34.2%)',
      category: 'Blockchain Centralization',
      severity: 'Low',
      evidenceQuote: 'Top 10 addresses hold 34.2% of circulating supply.',
      referenceLocation: 'On-Chain Holder Analysis (Etherscan API)',
      explanation: 'Concentration includes institutional custodian and liquidity pool addresses. Acceptable within normal startup distribution parameters.',
      reviewerStatus: 'Validated'
    }
  ];

  const step8StandardsMapping: StandardsMappingItem[] = [
    {
      id: 'MAP-01',
      standardCode: 'HC-STD-2.1-SEC-01',
      criterionTitle: 'Smart Contract Privilege & Control Audit',
      mappedFact: 'Multi-sig owner possesses pause() capability without timelock.',
      evidenceSnippet: 'Code Line 142: emergencyPause() function executable by 3-of-5 multisig.',
      assignedRole: 'tech_auditor',
      classificationStatus: 'Tech Review Required',
      status: 'Pending',
      reviewerNotes: 'Technical Auditor must verify timelock migration or multisig signer identity checks.'
    },
    {
      id: 'MAP-02',
      standardCode: 'AAOIFI-STD-32',
      criterionTitle: 'Sharia Prohibitions: Riba (Interest) & Fixed Yield Guarantees',
      mappedFact: 'Marketing claims on website mention "guaranteed APY" while whitepaper describes Mudarabah profit share.',
      evidenceSnippet: 'Website Hero Text vs Whitepaper Section 4.2',
      assignedRole: 'scholar',
      classificationStatus: 'Scholar Review Required',
      status: 'Pending',
      reviewerNotes: 'Sharia Board requires written commitment from project team to update public marketing material.'
    },
    {
      id: 'MAP-03',
      standardCode: 'HC-STD-2.1-BIZ-04',
      criterionTitle: 'Underlying Asset Verification & Business Purpose',
      mappedFact: isSovereign
        ? 'Sukuk tokens backed by physical infrastructure lease assets under Ijarah structure.'
        : 'Services limited to ethical Web3 technology provision with zero gambling or adult content involvement.',
      evidenceSnippet: 'Whitepaper Section 2.1 & Legal Opinion Annex A',
      assignedRole: 'business_analyst',
      classificationStatus: 'Business Review Required',
      status: 'Pending',
      reviewerNotes: 'Business Analyst confirmed underlying economic utility is clear and verifiable.'
    },
    {
      id: 'MAP-04',
      standardCode: 'HC-STD-2.1-QA-02',
      criterionTitle: 'Evidence Register & Documentation Verification',
      mappedFact: 'All whitepaper facts linked directly to source URLs, contract bytecodes, and Etherscan verifications.',
      evidenceSnippet: 'Complete 10-step evidence register generated.',
      assignedRole: 'qa',
      classificationStatus: 'QA Review Required',
      status: 'Pending',
      reviewerNotes: 'QA Officer verifies completeness of source link citations.'
    }
  ];

  const humanReviewSignoffs: Record<string, ReviewerSignoff> = {
    tech_auditor: {
      reviewerRole: 'tech_auditor',
      reviewerName: 'Dr. Tariq Al-Hashimi (Lead Blockchain Auditor)',
      status: 'Approved',
      signedAt: '2026-07-22 14:30',
      comment: 'Bytecode verified. Pause function centralization mitigated by 3-of-5 Gnosis Safe multi-sig keys.',
      digitalSignature: 'SIG-TECH-0x8f2a91203910'
    },
    business_analyst: {
      reviewerRole: 'business_analyst',
      reviewerName: 'Fatima Al-Zahra (Senior Business Analyst)',
      status: 'Approved',
      signedAt: '2026-07-23 09:15',
      comment: 'Tokenomics model verified. Revenue sharing operates purely on fee-percentage model.',
      digitalSignature: 'SIG-BIZ-0x31029310293'
    },
    scholar: {
      reviewerRole: 'scholar',
      reviewerName: 'Sheikh Dr. Ali Al-Quradaghi (Chairman of Sharia Board)',
      status: 'Approved',
      signedAt: '2026-07-23 16:45',
      comment: 'Certified Sharia Compliant under AAOIFI Standard 32 and HalalChain Standard v2.1. Website marketing APY text resolved.',
      digitalSignature: 'SIG-SCHOLAR-0x9921029312093'
    },
    qa: {
      reviewerRole: 'qa',
      reviewerName: 'Omar Farooq (Quality Assurance Lead)',
      status: 'Approved',
      signedAt: '2026-07-24 11:00',
      comment: 'All evidence register citations verified against whitepaper page numbers and contract lines.',
      digitalSignature: 'SIG-QA-0x7721029381029'
    },
    pm: {
      reviewerRole: 'pm',
      reviewerName: 'Zaid Ibrahim (Senior Project Manager)',
      status: 'Approved',
      signedAt: '2026-07-24 12:30',
      comment: 'Final assessment pipeline complete. All 5 reviewer roles signed off.',
      digitalSignature: 'SIG-PM-0x1120391029381'
    }
  };

  return {
    id: `ASSESS-${app.id}`,
    projectId: app.id,
    companyName: app.companyName,
    projectSymbol: app.companyName.substring(0, 4).toUpperCase(),
    cmcUrl: app.cmcUrl || 'https://coinmarketcap.com/currencies/sample-token',
    coingeckoUrl: app.coingeckoUrl || 'https://coingecko.com/en/coins/sample-token',
    contractAddress: app.contractAddress || '0x3829102938102938102938102938102938102938',
    blockchain: app.blockchain || 'Ethereum Mainnet',
    whitepaperUrl: app.whitepaperUrl || 'https://web3project.io/whitepaper.pdf',
    websiteUrl: app.websiteUrl || 'https://web3project.io',
    status: 'Draft Report Ready',
    currentStep: 9,
    draftWatermark: true, // Remains true until human signoff condition is tested
    finalCertificateDecision: 'HALAL',
    certificateNumber: `HC-CERT-2026-${Math.floor(8000 + Math.random() * 1000)}`,
    issueDate: new Date().toISOString().split('T')[0],
    verificationHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
    
    step1InfoCollection: {
      cmcData: { rank: 142, marketCapUsd: 145000000, volume24hUsd: 12500000 },
      coingeckoData: { id: app.companyName.toLowerCase().replace(/\s+/g, '-'), sentimentPct: 92 },
      contractMetaData: { verified: true, compiler: 'v0.8.24', runs: 200 },
      sourceUrlsLog: [
        { field: 'CoinMarketCap Link', value: app.cmcUrl || 'https://coinmarketcap.com/sample', sourceUrl: app.cmcUrl || 'https://coinmarketcap.com' },
        { field: 'CoinGecko Link', value: app.coingeckoUrl || 'https://coingecko.com/sample', sourceUrl: app.coingeckoUrl || 'https://coingecko.com' },
        { field: 'Contract Explorer', value: `https://etherscan.io/address/${app.contractAddress}`, sourceUrl: `https://etherscan.io/address/${app.contractAddress}` }
      ]
    },
    step2WhitepaperFacts,
    step3Discrepancies,
    step4Tokenomics,
    step5SmartContract,
    step6Blockchain,
    step7Risks,
    step8StandardsMapping,
    humanReviewSignoffs,
    workflowState: 'Draft',
    executiveConclusion: {
      executiveSummary: `The HALALCHAIN™ Sharia & Technical Assessment Engine has completed an end-to-end evidence audit for ${app.companyName}. Evaluation encompassed whitepaper extraction, smart contract bytecode security scanning, tokenomics disbursal validation, and alignment with AAOIFI-informed principles.`,
      overallRiskRating: 'Low Risk',
      workflowProgressPct: 100,
      aiEvidenceConfidencePct: 96.5,
      strengths: [
        `Zero conventional interest (Riba) or debt-leveraged yield structures detected in ${app.companyName} token model.`,
        `Bytecode verification confirmed multi-signature Gnosis Safe controls with emergency pause limits.`,
        'Complete transparency across all whitepaper claim citations linked directly to verified sources.'
      ],
      weaknesses: [
        'Marketing website copy initially contained fixed-yield wording that required clarification.',
        'Emergent centralization risk during initial launch phase prior to full timelock migration.'
      ],
      majorFindings: [
        'Tokenomics model relies on Mudarabah / Wakalah variable revenue redistribution.',
        'Smart contract hardcap prevents uncapped token minting inflation.',
        'All 5 designated human specialist roles have conducted independent review.'
      ],
      correctiveRecommendations: [
        'Update marketing landing page copy to explicitly state variable profit-sharing rather than guaranteed APY.',
        'Establish a 24-hour timelock on emergency pause privileges prior to mainnet expansion.'
      ],
      futureMonitoringRecommendations: [
        'Conduct quarterly automated on-chain treasury monitoring for wallet concentration changes.',
        'Perform mandatory re-audit upon any major proxy contract upgrade.'
      ],
      scopeOfAssessment: `Detailed technical, economic, and Sharia compliance review of ${app.companyName} whitepaper v2.1, deployed smart contract bytecode, and published documentation.`,
      assessmentLimitations: 'Assessment reflects protocol code and documentation at the time of review. External market volatility and third-party oracle dependencies are outside direct contract scope.',
      nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      certificateStatus: 'HALAL',
      reviewerRecommendation: 'Proceed with Certificate Issuance upon completion of website text updates.',
      executiveRecommendation: 'Approved for Enterprise Directory Publication & Investor Distribution.',
      qrVerificationUrl: `https://halalchain.io/verify/HC-CERT-2026-${app.id}`,
      digitalSignatureHash: '0x8f2a91203910b891a293102931209381029381092830129'
    },
    expertReviewPanel: {
      tech_auditor: {
        role: 'tech_auditor',
        name: 'Dr. Tariq Al-Hashimi',
        roleTitle: 'Lead Blockchain & Smart Contract Auditor',
        qualificationTitle: 'Ph.D. Computer Science, Certified Smart Contract Auditor',
        reviewDate: '2026-07-22',
        decision: 'Approved',
        comments: 'Bytecode verified. Emergency pause capability restricted by 3-of-5 Gnosis Safe hardware keys.',
        digitalSignature: 'SIG-TECH-0x8f2a91203910'
      },
      business_analyst: {
        role: 'business_analyst',
        name: 'Fatima Al-Zahra',
        roleTitle: 'Senior Web3 Business & Tokenomics Analyst',
        qualificationTitle: 'M.Sc. Financial Economics, CFA',
        reviewDate: '2026-07-23',
        decision: 'Approved',
        comments: 'Token disbursal model audited. Treasury reserve cap verified at 15%.',
        digitalSignature: 'SIG-BIZ-0x31029310293'
      },
      scholar: {
        role: 'scholar',
        name: 'Sheikh Dr. Ali Al-Quradaghi',
        roleTitle: 'Chairman of Sharia Board',
        qualificationTitle: 'Doctorate in Islamic Jurisprudence & Islamic Banking',
        reviewDate: '2026-07-23',
        decision: 'Approved',
        comments: 'Certified Sharia Compliant under AAOIFI-informed principles. Marketing APY copy resolved.',
        digitalSignature: 'SIG-SCHOLAR-0x9921029312093'
      },
      qa: {
        role: 'qa',
        name: 'Omar Farooq',
        roleTitle: 'Quality Assurance & Regulatory Officer',
        qualificationTitle: 'Certified Lead Auditor ISO 27001',
        reviewDate: '2026-07-24',
        decision: 'Approved',
        comments: 'All whitepaper claims mapped to source URLs and contract line references.',
        digitalSignature: 'SIG-QA-0x7721029381029'
      },
      pm: {
        role: 'pm',
        name: 'Zaid Ibrahim',
        roleTitle: 'General Manager / Lead Project Manager',
        qualificationTitle: 'PMP, Enterprise Audit Director',
        reviewDate: '2026-07-24',
        decision: 'Approved',
        comments: 'Final authorization complete. Report ready for executive distribution.',
        digitalSignature: 'SIG-PM-0x1120391029381'
      }
    },
    customerValueHighlights: {
      keyPositiveFindings: [
        'Robust zero-Riba economic architecture.',
        'High evidence extraction accuracy with cryptographic source hashing.',
        'Verified multi-sig governance security.'
      ],
      complianceHighlights: [
        'Full alignment with AAOIFI-informed Sharia due-diligence standards.',
        'Transparent whitepaper disclosures with 100% evidence traceability.'
      ],
      operationalStrengths: [
        'Automated continuous risk scanning.',
        'Established multi-role human signoff governance.'
      ],
      technologyStrengths: [
        'Solidity bytecode security verified with zero critical reentrancy risks.',
        'Fixed maximum supply cap enforcing inflation protection.'
      ],
      businessStrengths: [
        'Sustainable utility-driven revenue model based on transaction service fees.',
        'Clear institutional utility and market positioning.'
      ],
      transparencyHighlights: [
        'Public on-chain contract verifications on block explorer.',
        'Open audit trail for every assessment pipeline step.'
      ]
    },
    improvementRecommendations: [
      {
        id: 'REC-01',
        priority: 'High',
        issue: 'Marketing website APY language could be misunderstood as guaranteed fixed yield.',
        impact: 'Potential Sharia compliance non-conformity regarding fixed interest (Riba) perception.',
        recommendedAction: 'Update website copy to read "Variable Staking Yield based on Monthly Protocol Activity".',
        responsibleParty: 'Project Marketing Team',
        estimatedTime: '3 Business Days',
        currentStatus: 'In Progress'
      },
      {
        id: 'REC-02',
        priority: 'Medium',
        issue: 'Emergency pause function lacks a timelock delay.',
        impact: 'Centralization risk in the event of compromised admin keys.',
        recommendedAction: 'Implement a 24-hour timelock contract wrapper for emergency administration functions.',
        responsibleParty: 'Smart Contract Lead Engineer',
        estimatedTime: '10 Business Days',
        currentStatus: 'Pending'
      },
      {
        id: 'REC-03',
        priority: 'Low',
        issue: 'Top 10 holder concentration stands at 34.2%.',
        impact: 'Minor market liquidity concentration during early launch phase.',
        recommendedAction: 'Enforce planned institutional vesting schedules transparently on-chain.',
        responsibleParty: 'Tokenomics Lead',
        estimatedTime: 'Ongoing',
        currentStatus: 'Mitigated'
      }
    ],
    versioningInfo: {
      assessmentVersion: 'v2.4.0',
      reportVersion: 'v1.0 Final',
      previousAssessmentRef: 'N/A - Initial Comprehensive Audit',
      previousCertificateRef: 'N/A - First Issuance',
      changeSummary: 'Initial comprehensive assessment report completed and approved by all 5 human reviewer roles.',
      issueDate: new Date().toISOString().split('T')[0],
      revisionDate: new Date().toISOString().split('T')[0]
    },
    legalDisclaimer: STANDARDIZED_LEGAL_DISCLAIMER,
    auditTrail: [
      {
        id: 'AUD-01',
        timestamp: '2026-07-22 10:00',
        userName: 'HALALCHAIN Assessment Engine',
        userRole: 'admin',
        projectId: app.id,
        action: 'Automated Pipeline Step 1-8 Completed',
        newValue: 'Extracted 4 Facts, 2 Discrepancies, 3 Risks, 4 Standard Mappings',
        digitalSignature: 'SIG-AI-PIPELINE-0x001',
        ipAddress: '127.0.0.1'
      }
    ]
  };
}

export function getLocalAssessment(projectId: string, fallbackApp?: CertificationApplication): AssessmentReportData {
  const storageKey = `halalchain_assessment_${projectId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed reading local assessment:', err);
  }

  const defaultApp = fallbackApp || {
    id: projectId,
    applicationNumber: `HC-APP-2026-8801`,
    companyName: `Sample Web3 Enterprise`,
    legalCountry: 'United Arab Emirates',
    representativeName: 'Lead Founder',
    officialEmail: 'founder@web3project.io',
    phone: '+971 50 000 0000',
    websiteUrl: 'https://web3project.io',
    whitepaperUrl: 'https://web3project.io/whitepaper.pdf',
    contractAddress: '0x3829102938102938102938102938102938102938',
    blockchain: 'Ethereum Mainnet',
    projectDescription: 'Sharia-compliant Web3 infrastructure',
    packageType: 'Enterprise',
    stage: 'ai_assessment',
    submittedAt: '2026-07-20',
    targetCompletionDate: '2026-08-03',
    depositPaid: true,
    finalPaid: true,
    totalFee: 19500,
    depositAmount: 9750,
    remainingAmount: 0
  };

  const initialAssessment = createDefaultAssessmentForProject(defaultApp);
  saveLocalAssessment(initialAssessment);
  return initialAssessment;
}

export function saveLocalAssessment(data: AssessmentReportData): void {
  const storageKey = `halalchain_assessment_${data.projectId}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed saving local assessment:', err);
  }
}

/**
 * MANDATORY SHARIA DECISION EVALUATION
 * Enforces strict Sharia governance rule: HALALCHAIN is NOT a scoring platform.
 * Returns solely one of the 7 official certification states.
 */
export function evaluateShariaCertificationStatus(data: Partial<AssessmentReportData>): ShariaCertificationStatus {
  const certStatusStr = data.executiveConclusion?.certificateStatus?.toString().toUpperCase();
  if (certStatusStr === 'CERTIFICATION SUSPENDED') return 'CERTIFICATION SUSPENDED';
  if (certStatusStr === 'CERTIFICATION EXPIRED') return 'CERTIFICATION EXPIRED';

  // Rule 1: Any unresolved Critical finding -> HARAM
  const risks = data.step7Risks || [];
  const hasCriticalFinding = risks.some(
    r => r.severity === 'Critical' && r.reviewerStatus !== 'Overridden / Cleared'
  );
  if (hasCriticalFinding) {
    return 'HARAM';
  }

  // Rule 2: Scholar rejection -> HARAM
  const scholarSignoff = data.humanReviewSignoffs?.scholar || (data.expertReviewPanel?.scholar as any);
  if (scholarSignoff && (scholarSignoff.status === 'Rejected' || scholarSignoff.decision === 'Rejected')) {
    return 'HARAM';
  }

  // Rule 3: Insufficient evidence -> INSUFFICIENT EVIDENCE
  const hasInsufficientEvidence =
    data.step1InfoCollection?.extractedWhitepaper?.status === 'NOT_FOUND' ||
    (data.step2WhitepaperFacts && data.step2WhitepaperFacts.length === 0);
  if (hasInsufficientEvidence) {
    return 'INSUFFICIENT EVIDENCE';
  }

  // Rule 4: Critical/High recommendations or unresolved High risks -> REMEDIATION REQUIRED
  const hasUnresolvedHighRisks = risks.some(
    r => r.severity === 'High' && r.reviewerStatus === 'Pending Review'
  );
  const hasCriticalRemediation = data.improvementRecommendations?.some(
    rec => rec.priority === 'Critical' || (rec.priority === 'High' && rec.currentStatus === 'In Progress')
  );
  if (hasUnresolvedHighRisks || hasCriticalRemediation) {
    return 'REMEDIATION REQUIRED';
  }

  // Rule 5: Signoffs check
  const signoffs = data.humanReviewSignoffs;
  const allApproved =
    signoffs &&
    signoffs.tech_auditor?.status === 'Approved' &&
    signoffs.business_analyst?.status === 'Approved' &&
    signoffs.scholar?.status === 'Approved' &&
    signoffs.qa?.status === 'Approved' &&
    signoffs.pm?.status === 'Approved';

  if (!allApproved) {
    return 'PENDING SCHOLAR REVIEW';
  }

  return 'HALAL';
}

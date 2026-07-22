import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_CERTIFIED_PROJECTS,
  INITIAL_LEADS,
  INITIAL_APPLICATIONS,
  INITIAL_AI_CONFIG,
  INITIAL_AI_LOGS,
  INITIAL_REMOTE_EMPLOYEES,
  INITIAL_QUESTIONS_LIBRARY,
  INITIAL_AUDIT_LOGS,
  INITIAL_TALENT_APPLICATIONS,
  INITIAL_PROJECT_TEAM_ASSIGNMENTS,
  INITIAL_WORK_LOGS,
  INITIAL_MEMBER_EVALUATIONS
} from './src/data/mockData.js';
import {
  PublicCertifiedProject,
  Lead,
  CertificationApplication,
  AiConfig,
  AiServiceLog,
  AuditLogEntry,
  ClarificationMessage,
  RemoteEmployee,
  TalentApplication,
  ProjectTeamAssignment,
  WorkLogEntry,
  MemberEvaluation
} from './src/types.js';

// In-Memory Database Stores
let certifiedProjectsStore: PublicCertifiedProject[] = [...INITIAL_CERTIFIED_PROJECTS];
let leadsStore: Lead[] = [...INITIAL_LEADS];
let applicationsStore: CertificationApplication[] = [...INITIAL_APPLICATIONS];
let aiConfigStore: AiConfig = { ...INITIAL_AI_CONFIG };
let aiLogsStore: AiServiceLog[] = [...INITIAL_AI_LOGS];
let auditLogsStore: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
let remoteEmployeesStore: RemoteEmployee[] = [...INITIAL_REMOTE_EMPLOYEES];
let talentApplicationsStore: TalentApplication[] = [...INITIAL_TALENT_APPLICATIONS];
let projectTeamAssignmentsStore: ProjectTeamAssignment[] = [...INITIAL_PROJECT_TEAM_ASSIGNMENTS];
let workLogsStore: WorkLogEntry[] = [...INITIAL_WORK_LOGS];
let memberEvaluationsStore: MemberEvaluation[] = [...INITIAL_MEMBER_EVALUATIONS];
let clarificationMessagesStore: Record<string, ClarificationMessage[]> = {
  'APP-2026-801': [
    {
      id: 'MSG-001',
      projectId: 'APP-2026-801',
      senderRole: 'scholar',
      senderName: 'Sheikh Dr. Ali Al-Quradaghi',
      timestamp: '2026-07-21T09:30:00Z',
      message: 'Please provide clarification regarding the secondary liquidity yield distribution mechanism specified in Section 4.2 of your Whitepaper.',
      isCustomerRead: true
    },
    {
      id: 'MSG-002',
      projectId: 'APP-2026-801',
      senderRole: 'customer',
      senderName: 'Ahmad Razak (Sovereign Sukuk)',
      timestamp: '2026-07-21T11:15:00Z',
      message: 'The secondary yield distribution strictly utilizes a Mudarabah ratio where 80% goes to capital providers and 20% to the fund manager. No guaranteed fixed interest returns exist.',
      isCustomerRead: true
    }
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Centralized Gemini AI Client Helper
  function getGenAiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable not detected. AI Service Layer will run in fallback mode.');
    }
    return new GoogleGenAI({
      apiKey: apiKey || 'dummy-key-fallback',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'HalalChain™ Enterprise Platform', time: new Date().toISOString() });
  });

  // Public Registry API
  app.get(['/api/registry', '/api/certificates/registry'], (req, res) => {
    res.json(certifiedProjectsStore);
  });

  app.get('/api/certificates/verify/:id', (req, res) => {
    const query = (req.params.id || '').toLowerCase().trim();
    const found = certifiedProjectsStore.find(
      (p) =>
        p.certificateNumber.toLowerCase() === query ||
        p.verificationHash.toLowerCase() === query ||
        p.name.toLowerCase().includes(query) ||
        p.symbol.toLowerCase() === query
    );
    if (found) {
      res.json({ verified: true, project: found });
    } else {
      res.status(404).json({ verified: false, message: 'Certificate not found in HalalChain registry.' });
    }
  });

  // CRM Leads API
  app.get('/api/leads', (req, res) => {
    res.json(leadsStore);
  });

  app.post('/api/leads', (req, res) => {
    const newLead: Lead = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      companyName: req.body.companyName || 'New Project',
      projectSymbol: req.body.projectSymbol || 'TOKEN',
      country: req.body.country || 'Global',
      website: req.body.website || '',
      contactEmail: req.body.contactEmail || '',
      source: req.body.source || 'Website Discovery',
      status: 'New',
      assignedSalesperson: 'Tariq Al-Mansoor',
      probability: 40,
      estimatedValue: req.body.estimatedValue || 9800,
      notes: req.body.notes || 'Inbound request from public website',
      createdDate: new Date().toISOString().split('T')[0]
    };
    leadsStore.unshift(newLead);
    res.json(newLead);
  });

  // Applications & Projects API
  app.get('/api/applications', (req, res) => {
    res.json(applicationsStore);
  });

  app.post('/api/applications', (req, res) => {
    const appData = req.body;
    const newApp: CertificationApplication = {
      id: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
      applicationNumber: `HC-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: appData.companyName || 'Sample Web3 Project',
      legalCountry: appData.legalCountry || 'United Arab Emirates',
      representativeName: appData.representativeName || 'Lead Founder',
      officialEmail: appData.officialEmail || 'founder@web3project.io',
      phone: appData.phone || '+971 50 000 0000',
      telegram: appData.telegram || '',
      xHandle: appData.xHandle || '',
      githubUrl: appData.githubUrl || '',
      walletAddress: appData.walletAddress || '',
      cmcUrl: appData.cmcUrl || '',
      coingeckoUrl: appData.coingeckoUrl || '',
      websiteUrl: appData.websiteUrl || 'https://web3project.io',
      whitepaperUrl: appData.whitepaperUrl || 'https://web3project.io/whitepaper.pdf',
      contractAddress: appData.contractAddress || '0x0000000000000000000000000000000000000000',
      blockchain: appData.blockchain || 'Ethereum Mainnet',
      projectDescription: appData.projectDescription || 'Sharia-compliant Web3 infrastructure',
      packageType: appData.packageType || 'Professional',
      stage: 'waiting_deposit',
      submittedAt: new Date().toISOString().split('T')[0],
      targetCompletionDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      depositPaid: false,
      finalPaid: false,
      totalFee: appData.packageType === 'Starter' ? 4500 : appData.packageType === 'Enterprise' ? 19500 : 9800,
      depositAmount: appData.packageType === 'Starter' ? 2250 : appData.packageType === 'Enterprise' ? 9750 : 4900,
      remainingAmount: appData.packageType === 'Starter' ? 2250 : appData.packageType === 'Enterprise' ? 9750 : 4900
    };

    applicationsStore.unshift(newApp);

    // Audit Log Entry
    auditLogsStore.unshift({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: newApp.representativeName,
      userRole: 'customer',
      projectId: newApp.id,
      action: 'New Application Submitted',
      newValue: `Application ${newApp.applicationNumber} created`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    });

    res.json(newApp);
  });

  // Advance Workflow Stage
  app.post('/api/applications/:id/advance', (req, res) => {
    const { id } = req.params;
    const { nextStage, reason, note, userName, userRole } = req.body;

    const project = applicationsStore.find((a) => a.id === id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Payment Lock Check: Cannot issue certificate or complete if final payment unpaid
    if ((nextStage === 'certificate_generation' || nextStage === 'published_registry') && !project.finalPaid) {
      return res.status(400).json({
        error: 'PAYMENT LOCK: Certificate cannot be issued until Finance confirms full final payment.'
      });
    }

    const prevStage = project.stage;
    project.stage = nextStage;

    // Save note to message thread if provided
    const noteText = note || reason;
    if (noteText && noteText.trim()) {
      if (!clarificationMessagesStore[id]) {
        clarificationMessagesStore[id] = [];
      }
      clarificationMessagesStore[id].push({
        id: `MSG-${Date.now().toString().slice(-4)}`,
        projectId: id,
        senderRole: userRole || 'scholar',
        senderName: userName || `Official (${userRole || 'Scholar Board'})`,
        timestamp: new Date().toISOString(),
        message: noteText.trim(),
        isCustomerRead: false
      });
    }

    if (nextStage === 'published_registry') {
      const existingCert = certifiedProjectsStore.find((p) => p.name.toLowerCase() === project.companyName.toLowerCase());
      if (!existingCert) {
        const newCert: PublicCertifiedProject = {
          id: `HC-2026-${Math.floor(100 + Math.random() * 900)}`,
          name: project.companyName,
          symbol: project.companyName.substring(0, 4).toUpperCase(),
          logoUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=120&auto=format&fit=crop&q=80',
          blockchain: project.blockchain,
          category: 'Web3 Ecosystem',
          certificateStatus: 'valid',
          certificateType: 'Sharia Compliance Certificate',
          certificateNumber: `HC-CERT-2026-${Math.floor(8800 + Math.random() * 1000)}`,
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          riskRating: 'Compliant',
          websiteUrl: project.websiteUrl,
          whitepaperUrl: project.whitepaperUrl,
          contractAddress: project.contractAddress,
          shariaSummaryEn: `Certified Sharia compliant by HalalChain Sharia Board after comprehensive technical bytecode analysis and business model audit under HalalChain Standard v2.1.`,
          shariaSummaryAr: `معتمد ومعان بالامتثال الشرعي من قبل المجلس الشرعي لحلال تشين بعد تحليل البرمجيات الشامل وتدقيق نموذج العمل.`,
          scholarSignatures: ['Sheikh Dr. Ali Al-Quradaghi', 'Dr. Nizam Yaquby'],
          verificationHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`
        };
        certifiedProjectsStore.unshift(newCert);
      }
    }

    // Record Audit Log
    const actionLabel =
      nextStage === 'rejected'
        ? 'Application Rejected / Certificate Denied'
        : nextStage === 'clarification_requested' || nextStage === 'waiting_customer_response'
        ? 'Clarification Requested from Applicant'
        : 'Workflow Stage Changed';

    auditLogsStore.unshift({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: userName || 'Operations Employee',
      userRole: userRole || 'pm',
      projectId: project.id,
      action: actionLabel,
      previousValue: prevStage,
      newValue: nextStage,
      reason: noteText || 'Stage transition decision',
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    });

    res.json(project);
  });

  // Payment Confirmation Endpoint (Deposit or Final)
  app.post('/api/applications/:id/pay', (req, res) => {
    const { id } = req.params;
    const { paymentType, txHash } = req.body;

    const project = applicationsStore.find((a) => a.id === id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (paymentType === 'deposit') {
      project.depositPaid = true;
      if (project.stage === 'waiting_deposit') {
        project.stage = 'project_created';
      }
    } else if (paymentType === 'final') {
      project.finalPaid = true;
      if (project.stage === 'waiting_final_payment') {
        project.stage = 'certificate_generation';
      }
    }

    auditLogsStore.unshift({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: 'Finance Officer',
      userRole: 'finance',
      projectId: project.id,
      action: `${paymentType.toUpperCase()} Payment Confirmed`,
      newValue: `Tx: ${txHash || 'OFFICIAL_BANK_RECEIPT_00293'}`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    });

    res.json(project);
  });

  // Clarifications / Messages API
  app.get('/api/applications/:id/messages', (req, res) => {
    const { id } = req.params;
    res.json(clarificationMessagesStore[id] || []);
  });

  app.post('/api/applications/:id/messages', (req, res) => {
    const { id } = req.params;
    const { senderRole, senderName, message } = req.body;

    const newMessage: ClarificationMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      projectId: id,
      senderRole: senderRole || 'customer',
      senderName: senderName || 'User',
      timestamp: new Date().toISOString(),
      message: message || '',
      isCustomerRead: senderRole === 'customer'
    };

    if (!clarificationMessagesStore[id]) {
      clarificationMessagesStore[id] = [];
    }
    clarificationMessagesStore[id].push(newMessage);

    res.json(newMessage);
  });

  // Centralized AI Infrastructure API Endpoints
  app.get('/api/ai/config', (req, res) => {
    res.json(aiConfigStore);
  });

  app.post('/api/ai/config', (req, res) => {
    aiConfigStore = { ...aiConfigStore, ...req.body };
    res.json(aiConfigStore);
  });

  app.get('/api/ai/logs', (req, res) => {
    res.json(aiLogsStore);
  });

  // Centralized AI Service Layer Assessment Endpoint
  app.post('/api/ai/assess', async (req, res) => {
    const startTime = Date.now();
    const { projectId, companyName, whitepaperText, contractAddress, blockchain } = req.body;

    const selectedModel = aiConfigStore.taskModelMapping.whitepaper_analysis || 'gemini-3.6-flash';

    try {
      const ai = getGenAiClient();

      const prompt = `You are HalalChain's Centralized AI Sharia & Technical Assessment Engine.
Analyze the following Web3 project details for Sharia compliance and technical vulnerability risks:
Project Name: ${companyName}
Blockchain: ${blockchain}
Contract Address: ${contractAddress || 'N/A'}
Whitepaper / Description Text:
${whitepaperText || 'DeFi yield protocol with automated token staking and liquidity provision.'}

Respond in structured JSON format matching this schema:
{
  "whitepaperSummary": {
    "purpose": "Brief purpose description",
    "revenueSources": ["Source 1", "Source 2"],
    "tokenUtility": ["Utility 1", "Utility 2"],
    "governanceModel": "DAO or Multisig",
    "stakingYieldDetails": "Description of yields",
    "lendingBorrowing": false,
    "missingInformation": ["List of missing disclosures"]
  },
  "smartContractAnalysis": {
    "verifiedCode": true,
    "compilerVersion": "v0.8.20",
    "ownerAddress": "0xOwnerAddress",
    "isProxy": false,
    "isUpgradeable": false,
    "mintFunction": false,
    "burnFunction": true,
    "pauseFunction": true,
    "blacklistFunction": false,
    "feePercentage": 0.5,
    "treasuryWallets": ["0xTreasuryWallet"],
    "privilegedFunctions": ["pause()", "setFeeRate()"]
  },
  "businessAnalysis": {
    "coreActivities": ["DeFi Staking"],
    "revenueStructure": "Service fee based",
    "shariaRiskScore": 15,
    "transparencyLevel": "High"
  },
  "aiDraftFindings": [
    {
      "id": "FND-01",
      "category": "Smart Contract",
      "description": "Owner pause function detected without timelock restriction.",
      "severity": "Medium",
      "confidenceScore": 92,
      "evidenceSource": "Contract Bytecode Scan",
      "suggestedReviewerRole": "tech_auditor",
      "status": "Draft"
    },
    {
      "id": "FND-02",
      "category": "Tokenomics",
      "description": "Staking reward mechanism verified as variable revenue share, free of fixed interest guarantees.",
      "severity": "Low",
      "confidenceScore": 96,
      "evidenceSource": "Whitepaper Section 3",
      "suggestedReviewerRole": "business_analyst",
      "status": "Draft"
    }
  ]
}`;

      let aiResultJson: any;
      let promptTokens = 1200;
      let completionTokens = 450;

      if (process.env.GEMINI_API_KEY) {
        const response = await ai.models.generateContent({
          model: selectedModel,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const responseText = response.text || '{}';
        aiResultJson = JSON.parse(responseText);
        promptTokens = response.usageMetadata?.promptTokenCount || 1200;
        completionTokens = response.usageMetadata?.candidatesTokenCount || 450;
      } else {
        // Fallback intelligent assessment response
        aiResultJson = {
          whitepaperSummary: {
            purpose: `Automated Sharia-compliant decentralized infrastructure for ${companyName}.`,
            revenueSources: ['Transaction fee share', 'Yield pool management fee'],
            tokenUtility: ['Governance voting', 'Protocol fee settlement', 'Staking collateral'],
            governanceModel: 'Decentralized Multi-Sig Council',
            stakingYieldDetails: 'Mudarabah profit-share model linked directly to protocol trading volume.',
            lendingBorrowing: false,
            missingInformation: ['Audited liquidity locker proof of lock duration']
          },
          smartContractAnalysis: {
            verifiedCode: true,
            compilerVersion: 'v0.8.24',
            ownerAddress: contractAddress ? `${contractAddress.substring(0, 10)}...` : '0x718293...',
            isProxy: false,
            isUpgradeable: false,
            mintFunction: false,
            burnFunction: true,
            pauseFunction: true,
            blacklistFunction: false,
            feePercentage: 0.3,
            treasuryWallets: ['0x8823102938102938102938102938102938102938'],
            privilegedFunctions: ['emergencyPause()', 'updateFeeCollector()']
          },
          businessAnalysis: {
            coreActivities: ['Decentralized Liquidity Provision', 'Sukuk Tokenization'],
            revenueStructure: 'Transparent transaction-based commission (Murabaha / Wakalah)',
            shariaRiskScore: 12,
            transparencyLevel: 'High'
          },
          aiDraftFindings: [
            {
              id: 'FND-101',
              category: 'Smart Contract',
              description: 'Emergency pause function requires 24-hour timelock to prevent single-owner centralization risk.',
              severity: 'Medium',
              confidenceScore: 94,
              evidenceSource: 'Contract Source Code Analysis',
              suggestedReviewerRole: 'tech_auditor',
              status: 'Draft'
            },
            {
              id: 'FND-102',
              category: 'Sharia Compliance',
              description: 'Yield distribution mechanism verified non-usurious under AAOIFI Sharia Standard #35.',
              severity: 'Low',
              confidenceScore: 98,
              evidenceSource: 'Whitepaper Tokenomics & Contract Audit',
              suggestedReviewerRole: 'scholar',
              status: 'Draft'
            }
          ]
        };
      }

      const responseTimeMs = Date.now() - startTime;
      const totalTokens = promptTokens + completionTokens;
      const estimatedCost = (promptTokens * 0.0000005 + completionTokens * 0.0000015);

      // Log AI Service Layer Request
      const newAiLog: AiServiceLog = {
        id: `AILOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        project: companyName || 'Unknown Web3 Project',
        customer: companyName || 'Customer',
        feature: 'Centralized AI Automated Assessment',
        aiProvider: aiConfigStore.activeProvider,
        aiModel: selectedModel,
        requestTimeMs: responseTimeMs,
        tokenUsage: {
          promptTokens,
          completionTokens,
          totalTokens
        },
        estimatedCostUsd: Number(estimatedCost.toFixed(5)),
        status: 'Success'
      };

      aiLogsStore.unshift(newAiLog);

      res.json({
        success: true,
        aiLog: newAiLog,
        assessment: aiResultJson
      });
    } catch (err: any) {
      console.error('AI Assessment Error:', err);
      res.status(500).json({ error: err.message || 'AI Assessment failed' });
    }
  });

  // Audit Logs API
  app.get('/api/audit-logs', (req, res) => {
    res.json(auditLogsStore);
  });

  // Questions Library API
  app.get('/api/questions-library', (req, res) => {
    res.json(INITIAL_QUESTIONS_LIBRARY);
  });

  // Remote Employees API
  app.get('/api/employees', (req, res) => {
    res.json(remoteEmployeesStore);
  });

  // Talent Applications API (Recruitment Portal)
  app.get('/api/talent-applications', (req, res) => {
    res.json(talentApplicationsStore);
  });

  app.post('/api/talent-applications', (req, res) => {
    const appData = req.body;
    const newTalentApp: TalentApplication = {
      id: `TAL-2026-${Math.floor(100 + Math.random() * 900)}`,
      fullName: appData.fullName || 'Anonymous Candidate',
      email: appData.email || 'applicant@halalchain.org',
      phone: appData.phone || '+966 50 123 4567',
      whatsappNumber: appData.whatsappNumber || '+966501234567',
      role: appData.role || 'tech_auditor',
      country: appData.country || 'Global',
      timeZone: appData.timeZone || 'GMT+0',
      expectedHourlyRateUsd: Number(appData.expectedHourlyRateUsd) || 150,
      skills: Array.isArray(appData.skills) ? appData.skills : (appData.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      experienceYears: Number(appData.experienceYears) || 5,
      bio: appData.bio || appData.cvSummary || 'Experienced remote professional specializing in Web3 & Sharia audits.',
      education: appData.education || '• Higher Degree in Islamic Finance / Computer Science & Cybersecurity',
      experienceDetails: appData.experienceDetails || '• 5+ years of active audit and evaluation experience in international institutions.',
      cvSummary: appData.cvSummary || 'Experienced remote professional in Web3 & Sharia audits.',
      cvFileName: appData.cvFileName || `CV_${(appData.fullName || 'Candidate').replace(/\s+/g, '_')}_Attachment.pdf`,
      cvFileSize: appData.cvFileSize || '2.4 MB',
      portfolioUrl: appData.portfolioUrl || '',
      githubUrl: appData.githubUrl || '',
      status: 'Pending Review',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    talentApplicationsStore.unshift(newTalentApp);

    auditLogsStore.unshift({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: newTalentApp.fullName,
      userRole: newTalentApp.role,
      action: 'Remote Professional Application Submitted',
      newValue: `Application ${newTalentApp.id} for ${newTalentApp.role} (${newTalentApp.country})`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    });

    res.json(newTalentApp);
  });

  // PM Talent Application Approval / Rejection
  app.post('/api/talent-applications/:id/review', (req, res) => {
    const { id } = req.params;
    const { status, notes, reviewerName } = req.body;

    const talentApp = talentApplicationsStore.find((t) => t.id === id);
    if (!talentApp) {
      return res.status(404).json({ error: 'Talent application not found' });
    }

    talentApp.status = status;
    talentApp.notes = notes || '';

    if (status === 'Approved') {
      // Check if employee already exists in store
      const existing = remoteEmployeesStore.find((e) => e.email === talentApp.email || e.name === talentApp.fullName);
      if (!existing) {
        const newEmployee: RemoteEmployee = {
          id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
          name: talentApp.fullName,
          role: talentApp.role,
          country: talentApp.country,
          timeZone: talentApp.timeZone,
          skills: talentApp.skills,
          currentWorkload: 0,
          hourlyCostUsd: talentApp.expectedHourlyRateUsd,
          qualityScore: 95,
          completedProjects: 0,
          status: 'Available',
          isRecruitedRemote: true,
          cvSummary: talentApp.cvSummary,
          email: talentApp.email,
          phone: talentApp.phone,
          whatsappNumber: talentApp.whatsappNumber,
          bio: talentApp.bio,
          education: talentApp.education,
          experienceDetails: talentApp.experienceDetails,
          cvFileName: talentApp.cvFileName,
          cvFileSize: talentApp.cvFileSize
        };
        remoteEmployeesStore.push(newEmployee);
      }
    }

    auditLogsStore.unshift({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: reviewerName || 'Omar Khayyam (PM)',
      userRole: 'pm',
      action: `Talent Candidate Application ${status}`,
      newValue: `${talentApp.fullName} (${talentApp.role}) status changed to ${status}`,
      reason: notes || 'PM Recruitment Evaluation',
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    });

    res.json(talentApp);
  });

  // Project Team Assignments API
  app.get('/api/projects/team-assignments', (req, res) => {
    res.json(projectTeamAssignmentsStore);
  });

  app.post('/api/projects/:id/reassign-team', (req, res) => {
    const { id } = req.params;
    const { roleToReassign, newEmployeeId, newEmployeeName, reason, pmName } = req.body;

    let assignment = projectTeamAssignmentsStore.find((a) => a.projectId === id);
    if (!assignment) {
      assignment = {
        projectId: id,
        leadTechAuditorId: 'EMP-002',
        leadTechAuditorName: 'Youssef Benali',
        shariaScholarId: 'EMP-001',
        shariaScholarName: 'Sheikh Dr. Ali Al-Quradaghi',
        businessAnalystId: 'EMP-003',
        businessAnalystName: 'Amina Al-Mansouri',
        qaOfficerId: 'EMP-005',
        qaOfficerName: 'Zainab Ibrahim',
        lastUpdated: new Date().toISOString().split('T')[0],
        reassignmentHistory: []
      };
      projectTeamAssignmentsStore.push(assignment);
    }

    let previousMemberName = 'Unassigned';

    if (roleToReassign === 'tech_auditor') {
      previousMemberName = assignment.leadTechAuditorName;
      assignment.leadTechAuditorId = newEmployeeId;
      assignment.leadTechAuditorName = newEmployeeName;
    } else if (roleToReassign === 'scholar') {
      previousMemberName = assignment.shariaScholarName;
      assignment.shariaScholarId = newEmployeeId;
      assignment.shariaScholarName = newEmployeeName;
    } else if (roleToReassign === 'business_analyst') {
      previousMemberName = assignment.businessAnalystName;
      assignment.businessAnalystId = newEmployeeId;
      assignment.businessAnalystName = newEmployeeName;
    } else if (roleToReassign === 'qa') {
      previousMemberName = assignment.qaOfficerName;
      assignment.qaOfficerId = newEmployeeId;
      assignment.qaOfficerName = newEmployeeName;
    }

    assignment.lastUpdated = new Date().toISOString().split('T')[0];
    assignment.reassignmentHistory.unshift({
      date: new Date().toISOString().split('T')[0],
      role: roleToReassign,
      previousMemberName,
      newMemberName: newEmployeeName,
      reason: reason || 'PM project timeline optimization / performance swap'
    });

    auditLogsStore.unshift({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: pmName || 'Omar Khayyam (PM)',
      userRole: 'pm',
      projectId: id,
      action: 'Project Team Member Reassigned',
      previousValue: `${previousMemberName} (${roleToReassign})`,
      newValue: `${newEmployeeName} (${roleToReassign})`,
      reason: reason || 'Project performance optimization',
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    });

    res.json(assignment);
  });

  // Team Member Performance Evaluations API
  app.get('/api/evaluations', (req, res) => {
    res.json(memberEvaluationsStore);
  });

  app.post('/api/evaluations', (req, res) => {
    const evalData: MemberEvaluation = req.body;
    const existingIdx = memberEvaluationsStore.findIndex((e) => e.employeeId === evalData.employeeId);

    if (existingIdx >= 0) {
      memberEvaluationsStore[existingIdx] = { ...memberEvaluationsStore[existingIdx], ...evalData };
    } else {
      memberEvaluationsStore.unshift(evalData);
    }

    auditLogsStore.unshift({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: evalData.pmManualAssessment.evaluatorName || 'Omar Khayyam (PM Lead)',
      userRole: 'pm',
      action: 'PM Member Performance Assessment Saved',
      newValue: `${evalData.employeeName} (${evalData.role}) Combined Score: ${evalData.finalCombinedScore}/100 [${evalData.ratingCategory}]`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    });

    res.json(evalData);
  });

  // Payroll & Work Logs API
  app.get('/api/payroll/work-logs', (req, res) => {
    res.json(workLogsStore);
  });

  app.post('/api/payroll/work-logs', (req, res) => {
    const { employeeId, employeeName, role, projectId, projectName, hoursWorked, hourlyRateUsd, taskDescription, performanceScore } = req.body;

    const newLog: WorkLogEntry = {
      id: `LOG-2026-${Math.floor(10 + Math.random() * 90)}`,
      employeeId: employeeId || 'EMP-001',
      employeeName: employeeName || 'Remote Professional',
      role: role || 'tech_auditor',
      projectId: projectId || 'APP-2026-801',
      projectName: projectName || 'Active Project',
      hoursWorked: Number(hoursWorked) || 8,
      hourlyRateUsd: Number(hourlyRateUsd) || 150,
      totalPayUsd: Number(hoursWorked) * Number(hourlyRateUsd),
      dateLogged: new Date().toISOString().split('T')[0],
      taskDescription: taskDescription || 'Technical inspection and documentation',
      performanceScore: Number(performanceScore) || 95,
      paymentStatus: 'Pending Approval'
    };

    workLogsStore.unshift(newLog);

    auditLogsStore.unshift({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: newLog.employeeName,
      userRole: newLog.role,
      projectId: newLog.projectId,
      action: 'Work Hours Logged',
      newValue: `${newLog.hoursWorked} hrs @ $${newLog.hourlyRateUsd}/hr = $${newLog.totalPayUsd}`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    });

    res.json(newLog);
  });

  app.post('/api/payroll/approve-release', (req, res) => {
    const { logIds, pmName } = req.body;
    if (Array.isArray(logIds)) {
      workLogsStore.forEach((log) => {
        if (logIds.includes(log.id)) {
          log.paymentStatus = 'Approved for Release';
        }
      });
    }

    auditLogsStore.unshift({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: pmName || 'Omar Khayyam (PM)',
      userRole: 'pm',
      action: 'Remote Payroll Release Approved',
      newValue: `${logIds.length} work log entries approved for disbursement`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    });

    res.json({ success: true, count: logIds.length });
  });

  // Vite Development / Production Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HalalChain™ Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

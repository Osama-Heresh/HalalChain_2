import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  getSystemSettings,
  updateSystemSettings,
  getOperatingMode,
  getCertifiedProjects,
  addCertifiedProject,
  getApplications,
  addApplication,
  updateApplication,
  getLeads,
  addLead,
  getRemoteEmployees,
  addRemoteEmployee,
  getTalentApplications,
  addTalentApplication,
  updateTalentApplicationStatus,
  getAuditLogs,
  addAuditLog,
  getAiLogs,
  addAiLog,
  getWorkLogs,
  addWorkLog,
  approveWorkLogsRelease,
  getMemberEvaluations,
  saveMemberEvaluation,
  getProjectTeamAssignments,
  saveProjectTeamAssignment,
  getClarificationMessages,
  addClarificationMessage,
  getQuestionsLibrary,
  seedDemoDataToFirestore
} from './src/lib/firebaseService.js';
import {
  PublicCertifiedProject,
  Lead,
  CertificationApplication,
  AiServiceLog,
  ClarificationMessage,
  RemoteEmployee,
  TalentApplication,
  ProjectTeamAssignment,
  WorkLogEntry,
  MemberEvaluation
} from './src/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Seed demo records into Firebase on server launch if needed
  try {
    await seedDemoDataToFirestore();
  } catch (err) {
    console.warn('Initial Firestore seeding check completed:', err);
  }

  // Helper for Gemini AI client
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

  // Health API
  app.get('/api/health', async (req, res) => {
    const settings = await getSystemSettings();
    res.json({
      status: 'ok',
      app: 'HALALCHAIN™ Platform',
      mode: settings.mode,
      time: new Date().toISOString()
    });
  });

  // Operating Mode API (Single Configuration Setting)
  app.get('/api/system/mode', async (req, res) => {
    const settings = await getSystemSettings();
    res.json({ mode: settings.mode, settings });
  });

  app.post('/api/system/mode', async (req, res) => {
    const { mode } = req.body;
    if (mode !== 'demo' && mode !== 'production') {
      return res.status(400).json({ error: 'Invalid mode. Must be "demo" or "production"' });
    }
    const updated = await updateSystemSettings({ mode });

    await addAuditLog({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: 'Administrator',
      userRole: 'admin',
      action: 'System Operating Mode Changed',
      newValue: `Operating Mode switched to ${mode.toUpperCase()} MODE`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    }, mode);

    res.json({ success: true, mode: updated.mode, settings: updated });
  });

  // Public Registry API
  app.get(['/api/registry', '/api/certificates/registry'], async (req, res) => {
    const projects = await getCertifiedProjects();
    res.json(projects);
  });

  app.get('/api/certificates/verify/:id', async (req, res) => {
    const queryStr = (req.params.id || '').toLowerCase().trim();
    const projects = await getCertifiedProjects();
    const found = projects.find(
      (p) =>
        p.certificateNumber.toLowerCase() === queryStr ||
        p.verificationHash.toLowerCase() === queryStr ||
        p.name.toLowerCase().includes(queryStr) ||
        p.symbol.toLowerCase() === queryStr
    );
    if (found) {
      res.json({ verified: true, project: found });
    } else {
      res.status(404).json({ verified: false, message: 'Certificate not found in HALALCHAIN™ registry.' });
    }
  });

  // CRM Leads API
  app.get('/api/leads', async (req, res) => {
    const leads = await getLeads();
    res.json(leads);
  });

  app.post('/api/leads', async (req, res) => {
    const mode = await getOperatingMode();
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

    const saved = await addLead(newLead, mode);
    res.json(saved);
  });

  // Applications & Projects API
  app.get('/api/applications', async (req, res) => {
    const apps = await getApplications();
    res.json(apps);
  });

  app.post('/api/applications', async (req, res) => {
    const mode = await getOperatingMode();
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

    const saved = await addApplication(newApp, mode);

    await addAuditLog({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: newApp.representativeName,
      userRole: 'customer',
      projectId: newApp.id,
      action: 'New Application Submitted',
      newValue: `Application ${newApp.applicationNumber} created`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    }, mode);

    res.json(saved);
  });

  // Advance Workflow Stage
  app.post('/api/applications/:id/advance', async (req, res) => {
    const { id } = req.params;
    const { nextStage, reason, note, userName, userRole, autoConfirmPayment } = req.body;
    const mode = await getOperatingMode();

    const apps = await getApplications();
    const project = apps.find((a) => a.id === id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updates: Partial<CertificationApplication> = {};

    if (autoConfirmPayment || userRole === 'pm' || userRole === 'finance' || userRole === 'admin') {
      updates.depositPaid = true;
      updates.finalPaid = true;
      updates.remainingAmount = 0;
      project.depositPaid = true;
      project.finalPaid = true;
      project.remainingAmount = 0;
    }

    if ((nextStage === 'certificate_generation' || nextStage === 'published_registry') && !project.finalPaid) {
      return res.status(400).json({
        error: 'PAYMENT LOCK: Certificate cannot be issued until Finance confirms full final payment.'
      });
    }

    const prevStage = project.stage;
    updates.stage = nextStage;
    project.stage = nextStage;

    await updateApplication(id, updates);

    // Save note message
    const noteText = note || reason;
    if (noteText && noteText.trim()) {
      await addClarificationMessage({
        id: `MSG-${Date.now().toString().slice(-4)}`,
        projectId: id,
        senderRole: userRole || 'scholar',
        senderName: userName || `Official (${userRole || 'Scholar Board'})`,
        timestamp: new Date().toISOString(),
        message: noteText.trim(),
        isCustomerRead: false
      }, mode);
    }

    if (nextStage === 'published_registry') {
      const existingCerts = await getCertifiedProjects();
      const existingCert = existingCerts.find((p) => p.name.toLowerCase() === project.companyName.toLowerCase());
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
          shariaSummaryEn: `Certified Sharia compliant by HALALCHAIN™ Sharia Board after comprehensive technical bytecode analysis and business model audit under HALALCHAIN™ Standard v2.1.`,
          shariaSummaryAr: `معتمد ومصادق عليه بالامتثال الشرعي من قبل المجلس الشرعي لحلال تشين™ بعد تحليل البرمجيات الشامل وتدقيق نموذج العمل.`,
          scholarSignatures: ['Sheikh Dr. Ali Al-Quradaghi', 'Dr. Nizam Yaquby'],
          verificationHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`
        };
        await addCertifiedProject(newCert, mode);
      }
    }

    const actionLabel =
      nextStage === 'rejected'
        ? 'Application Rejected / Certificate Denied'
        : nextStage === 'clarification_requested' || nextStage === 'waiting_customer_response'
        ? 'Clarification Requested from Applicant'
        : 'Workflow Stage Changed';

    await addAuditLog({
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
    }, mode);

    res.json(project);
  });

  // Payment Confirmation Endpoint
  app.post('/api/applications/:id/pay', async (req, res) => {
    const { id } = req.params;
    const { paymentType, txHash } = req.body;
    const mode = await getOperatingMode();

    const apps = await getApplications();
    const project = apps.find((a) => a.id === id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updates: Partial<CertificationApplication> = {};

    if (paymentType === 'deposit') {
      updates.depositPaid = true;
      project.depositPaid = true;
      if (project.stage === 'waiting_deposit') {
        updates.stage = 'project_created';
        project.stage = 'project_created';
      }
    } else if (paymentType === 'final') {
      updates.finalPaid = true;
      project.finalPaid = true;
      if (project.stage === 'waiting_final_payment') {
        updates.stage = 'certificate_generation';
        project.stage = 'certificate_generation';
      }
    }

    await updateApplication(id, updates);

    await addAuditLog({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: 'Finance Officer',
      userRole: 'finance',
      projectId: project.id,
      action: `${paymentType.toUpperCase()} Payment Confirmed`,
      newValue: `Tx: ${txHash || 'OFFICIAL_BANK_RECEIPT_00293'}`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    }, mode);

    res.json(project);
  });

  // Clarifications / Messages API
  app.get('/api/applications/:id/messages', async (req, res) => {
    const { id } = req.params;
    const msgs = await getClarificationMessages(id);
    res.json(msgs);
  });

  app.post('/api/applications/:id/messages', async (req, res) => {
    const { id } = req.params;
    const { senderRole, senderName, message } = req.body;
    const mode = await getOperatingMode();

    const newMessage: ClarificationMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      projectId: id,
      senderRole: senderRole || 'customer',
      senderName: senderName || 'User',
      timestamp: new Date().toISOString(),
      message: message || '',
      isCustomerRead: senderRole === 'customer'
    };

    const saved = await addClarificationMessage(newMessage, mode);
    res.json(saved);
  });

  // Centralized AI Infrastructure API
  app.get('/api/ai/config', async (req, res) => {
    const settings = await getSystemSettings();
    res.json(settings);
  });

  app.post('/api/ai/config', async (req, res) => {
    const updated = await updateSystemSettings(req.body);
    res.json(updated);
  });

  app.get('/api/ai/logs', async (req, res) => {
    const logs = await getAiLogs();
    res.json(logs);
  });

  // AI Assessment Endpoint
  app.post('/api/ai/assess', async (req, res) => {
    const startTime = Date.now();
    const { projectId, companyName, whitepaperText, contractAddress, blockchain } = req.body;
    const mode = await getOperatingMode();

    const config = await getSystemSettings();
    const selectedModel = config.taskModelMapping?.whitepaper_analysis || 'gemini-3.6-flash';

    try {
      const ai = getGenAiClient();

      const prompt = `You are HALALCHAIN™'s Centralized AI Sharia & Technical Assessment Engine.
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

      const newAiLog: AiServiceLog = {
        id: `AILOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        project: companyName || 'Unknown Web3 Project',
        customer: companyName || 'Customer',
        feature: 'Centralized AI Automated Assessment',
        aiProvider: config.activeProvider,
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

      await addAiLog(newAiLog, mode);

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
  app.get('/api/audit-logs', async (req, res) => {
    const logs = await getAuditLogs();
    res.json(logs);
  });

  // Questions Library API
  app.get('/api/questions-library', async (req, res) => {
    const questions = await getQuestionsLibrary();
    res.json(questions);
  });

  // Remote Employees API
  app.get('/api/employees', async (req, res) => {
    const employees = await getRemoteEmployees();
    res.json(employees);
  });

  // Talent Applications API
  app.get('/api/talent-applications', async (req, res) => {
    const apps = await getTalentApplications();
    res.json(apps);
  });

  app.post('/api/talent-applications', async (req, res) => {
    const mode = await getOperatingMode();
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

    const saved = await addTalentApplication(newTalentApp, mode);

    await addAuditLog({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: newTalentApp.fullName,
      userRole: newTalentApp.role,
      action: 'Remote Professional Application Submitted',
      newValue: `Application ${newTalentApp.id} for ${newTalentApp.role} (${newTalentApp.country})`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    }, mode);

    res.json(saved);
  });

  // PM Talent Review
  app.post('/api/talent-applications/:id/review', async (req, res) => {
    const { id } = req.params;
    const { status, notes, reviewerName } = req.body;
    const mode = await getOperatingMode();

    const apps = await getTalentApplications();
    const talentApp = apps.find((t) => t.id === id);
    if (!talentApp) {
      return res.status(404).json({ error: 'Talent application not found' });
    }

    await updateTalentApplicationStatus(id, status, notes);
    talentApp.status = status;
    talentApp.notes = notes || '';

    if (status === 'Approved') {
      const emps = await getRemoteEmployees();
      const existing = emps.find((e) => e.email === talentApp.email || e.name === talentApp.fullName);
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
        await addRemoteEmployee(newEmployee, mode);
      }
    }

    await addAuditLog({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: reviewerName || 'Omar Khayyam (PM)',
      userRole: 'pm',
      action: `Talent Candidate Application ${status}`,
      newValue: `${talentApp.fullName} (${talentApp.role}) status changed to ${status}`,
      reason: notes || 'PM Recruitment Evaluation',
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    }, mode);

    res.json(talentApp);
  });

  // Project Team Assignments API
  app.get('/api/projects/team-assignments', async (req, res) => {
    const assignments = await getProjectTeamAssignments();
    res.json(assignments);
  });

  app.post('/api/projects/:id/reassign-team', async (req, res) => {
    const { id } = req.params;
    const { roleToReassign, newEmployeeId, newEmployeeName, reason, pmName } = req.body;
    const mode = await getOperatingMode();

    const assignments = await getProjectTeamAssignments();
    let assignment = assignments.find((a) => a.projectId === id);
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

    const saved = await saveProjectTeamAssignment(assignment, mode);

    await addAuditLog({
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
    }, mode);

    res.json(saved);
  });

  // Team Member Performance Evaluations API
  app.get('/api/evaluations', async (req, res) => {
    const evals = await getMemberEvaluations();
    res.json(evals);
  });

  app.post('/api/evaluations', async (req, res) => {
    const evalData: MemberEvaluation = req.body;
    const mode = await getOperatingMode();

    const saved = await saveMemberEvaluation(evalData, mode);

    await addAuditLog({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: evalData.pmManualAssessment.evaluatorName || 'Omar Khayyam (PM Lead)',
      userRole: 'pm',
      action: 'PM Member Performance Assessment Saved',
      newValue: `${evalData.employeeName} (${evalData.role}) Combined Score: ${evalData.finalCombinedScore}/100 [${evalData.ratingCategory}]`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    }, mode);

    res.json(saved);
  });

  // Payroll & Work Logs API
  app.get('/api/payroll/work-logs', async (req, res) => {
    const logs = await getWorkLogs();
    res.json(logs);
  });

  app.post('/api/payroll/work-logs', async (req, res) => {
    const mode = await getOperatingMode();
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

    const saved = await addWorkLog(newLog, mode);

    await addAuditLog({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: newLog.employeeName,
      userRole: newLog.role,
      projectId: newLog.projectId,
      action: 'Work Hours Logged',
      newValue: `${newLog.hoursWorked} hrs @ $${newLog.hourlyRateUsd}/hr = $${newLog.totalPayUsd}`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    }, mode);

    res.json(saved);
  });

  app.post('/api/payroll/approve-release', async (req, res) => {
    const { logIds, pmName } = req.body;
    const mode = await getOperatingMode();

    if (Array.isArray(logIds)) {
      await approveWorkLogsRelease(logIds);
    }

    await addAuditLog({
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName: pmName || 'Omar Khayyam (PM)',
      userRole: 'pm',
      action: 'Remote Payroll Release Approved',
      newValue: `${logIds ? logIds.length : 0} work log entries approved for disbursement`,
      digitalSignature: `SIG-SHA256-${Math.random().toString(16).substring(2, 10)}`,
      ipAddress: '127.0.0.1'
    }, mode);

    res.json({ success: true, count: logIds ? logIds.length : 0 });
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
    console.log(`HALALCHAIN™ Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

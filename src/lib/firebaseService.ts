import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
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
} from '../data/mockData';
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
  MemberEvaluation,
  QuestionLibraryItem,
  MasterProjectRecord,
  DuplicateCheckRequest,
  DuplicateCheckResult,
  DuplicateMatchDetail,
  ProjectTaskLock,
  MarketingProspectRecord,
  EmailHistoryEntry,
  SystemAlertItem
} from '../types';

// Initialize Firebase App and Firestore Database
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

export type SystemOperatingMode = 'demo' | 'production';

export interface SystemSettings extends AiConfig {
  mode: SystemOperatingMode;
  updatedAt?: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  mode: 'demo',
  ...INITIAL_AI_CONFIG
};

// ==================== SYSTEM CONFIGURATION ====================

export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const settingsRef = doc(db, 'systemConfig', 'settings');
    const snap = await getDoc(settingsRef);

    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...(snap.data() as SystemSettings) };
    } else {
      await setDoc(settingsRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (err) {
    console.warn('Firestore read error for systemConfig, falling back to default:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSystemSettings(
  updates: Partial<SystemSettings>
): Promise<SystemSettings> {
  try {
    const settingsRef = doc(db, 'systemConfig', 'settings');
    const current = await getSystemSettings();
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await setDoc(settingsRef, updated, { merge: true });
    return updated;
  } catch (err) {
    console.error('Error updating system settings in Firestore:', err);
    throw err;
  }
}

export async function getOperatingMode(): Promise<SystemOperatingMode> {
  const settings = await getSystemSettings();
  return settings.mode || 'demo';
}

// ==================== DEMO DATA INITIALIZATION IN FIREBASE ====================

let isSeeded = false;

export async function seedDemoDataToFirestore(): Promise<void> {
  if (isSeeded) return;
  try {
    const settingsRef = doc(db, 'systemConfig', 'settings');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, DEFAULT_SETTINGS);
    }

    // Check if certifiedProjects has demo records seeded
    const certQuery = query(
      collection(db, 'certifiedProjects'),
      where('isDemo', '==', true)
    );
    const certSnap = await getDocs(certQuery);

    if (certSnap.empty) {
      console.log('Seeding initial demonstration records into Firebase Firestore...');

      // Seed Certified Projects
      for (const p of INITIAL_CERTIFIED_PROJECTS) {
        await setDoc(doc(db, 'certifiedProjects', p.id), {
          ...p,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Leads
      for (const lead of INITIAL_LEADS) {
        await setDoc(doc(db, 'leads', lead.id), {
          ...lead,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Applications
      for (const appItem of INITIAL_APPLICATIONS) {
        await setDoc(doc(db, 'applications', appItem.id), {
          ...appItem,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Ai Logs
      for (const log of INITIAL_AI_LOGS) {
        await setDoc(doc(db, 'aiLogs', log.id), {
          ...log,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Audit Logs
      for (const audit of INITIAL_AUDIT_LOGS) {
        await setDoc(doc(db, 'auditLogs', audit.id), {
          ...audit,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Remote Employees
      for (const emp of INITIAL_REMOTE_EMPLOYEES) {
        await setDoc(doc(db, 'remoteEmployees', emp.id), {
          ...emp,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Talent Applications
      for (const talent of INITIAL_TALENT_APPLICATIONS) {
        await setDoc(doc(db, 'talentApplications', talent.id), {
          ...talent,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Project Team Assignments
      for (const assign of INITIAL_PROJECT_TEAM_ASSIGNMENTS) {
        await setDoc(doc(db, 'projectTeamAssignments', assign.projectId), {
          ...assign,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Work Logs
      for (const wl of INITIAL_WORK_LOGS) {
        await setDoc(doc(db, 'workLogs', wl.id), {
          ...wl,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Member Evaluations
      for (const ev of INITIAL_MEMBER_EVALUATIONS) {
        await setDoc(doc(db, 'memberEvaluations', ev.id), {
          ...ev,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Clarification Messages
      const initialClarification: ClarificationMessage[] = [
        {
          id: 'MSG-001',
          projectId: 'APP-2026-801',
          senderRole: 'scholar',
          senderName: 'Sheikh Dr. Ali Al-Quradaghi',
          timestamp: '2026-07-21T09:30:00Z',
          message:
            'Please provide clarification regarding the secondary liquidity yield distribution mechanism specified in Section 4.2 of your Whitepaper.',
          isCustomerRead: true
        },
        {
          id: 'MSG-002',
          projectId: 'APP-2026-801',
          senderRole: 'customer',
          senderName: 'Ahmad Razak (Sovereign Sukuk)',
          timestamp: '2026-07-21T11:15:00Z',
          message:
            'The secondary yield distribution strictly utilizes a Mudarabah ratio where 80% goes to capital providers and 20% to the fund manager. No guaranteed fixed interest returns exist.',
          isCustomerRead: true
        }
      ];

      for (const msg of initialClarification) {
        await setDoc(doc(db, 'clarificationMessages', msg.id), {
          ...msg,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Questions Library
      for (const q of INITIAL_QUESTIONS_LIBRARY) {
        await setDoc(doc(db, 'questionsLibrary', q.id), {
          ...q,
          isDemo: true,
          createdAt: new Date().toISOString()
        });
      }

      console.log('Firebase Firestore demo records successfully seeded.');
    }
    isSeeded = true;
  } catch (err) {
    console.error('Error during Firebase demo seeding:', err);
  }
}

// ==================== GENERIC COLLECTION GETTER WITH MODE FILTERING ====================

async function getCollectionDocs<T>(
  collectionName: string,
  mode: SystemOperatingMode
): Promise<T[]> {
  try {
    await seedDemoDataToFirestore();
    const colRef = collection(db, collectionName);

    let q;
    if (mode === 'production') {
      // Production Mode MUST ignore all demo records
      q = query(colRef, where('isDemo', '==', false));
    } else {
      // Demo Mode returns demo records or all demo-enabled records
      q = query(colRef);
    }

    const snap = await getDocs(q);
    const docs = snap.docs.map((d) => d.data() as T);

    // If Demo Mode and Firestore returns empty for any reason, fallback to local initial mock data
    if (mode === 'demo' && docs.length === 0) {
      return getFallbackDemoData<T>(collectionName);
    }

    return docs;
  } catch (err) {
    console.warn(`Error reading collection '${collectionName}' from Firestore:`, err);
    if (mode === 'demo') {
      return getFallbackDemoData<T>(collectionName);
    }
    return [];
  }
}

function getFallbackDemoData<T>(collectionName: string): T[] {
  switch (collectionName) {
    case 'certifiedProjects':
      return INITIAL_CERTIFIED_PROJECTS as unknown as T[];
    case 'leads':
      return INITIAL_LEADS as unknown as T[];
    case 'applications':
      return INITIAL_APPLICATIONS as unknown as T[];
    case 'aiLogs':
      return INITIAL_AI_LOGS as unknown as T[];
    case 'auditLogs':
      return INITIAL_AUDIT_LOGS as unknown as T[];
    case 'remoteEmployees':
      return INITIAL_REMOTE_EMPLOYEES as unknown as T[];
    case 'talentApplications':
      return INITIAL_TALENT_APPLICATIONS as unknown as T[];
    case 'projectTeamAssignments':
      return INITIAL_PROJECT_TEAM_ASSIGNMENTS as unknown as T[];
    case 'workLogs':
      return INITIAL_WORK_LOGS as unknown as T[];
    case 'memberEvaluations':
      return INITIAL_MEMBER_EVALUATIONS as unknown as T[];
    case 'questionsLibrary':
      return INITIAL_QUESTIONS_LIBRARY as unknown as T[];
    default:
      return [];
  }
}

// ==================== DOMAIN SPECIFIC GETTERS & WRITERS ====================

export async function getCertifiedProjects(mode?: SystemOperatingMode): Promise<PublicCertifiedProject[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<PublicCertifiedProject>('certifiedProjects', currentMode);
}

export async function addCertifiedProject(
  project: PublicCertifiedProject,
  mode?: SystemOperatingMode
): Promise<PublicCertifiedProject> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...project,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'certifiedProjects', project.id), docData);
  return docData;
}

export async function getApplications(mode?: SystemOperatingMode): Promise<CertificationApplication[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<CertificationApplication>('applications', currentMode);
}

export async function addApplication(
  appData: CertificationApplication,
  mode?: SystemOperatingMode
): Promise<CertificationApplication> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...appData,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'applications', appData.id), docData);
  return docData;
}

export async function updateApplication(
  id: string,
  updates: Partial<CertificationApplication>
): Promise<void> {
  try {
    const docRef = doc(db, 'applications', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error(`Error updating application ${id} in Firestore:`, err);
  }
}

export async function getLeads(mode?: SystemOperatingMode): Promise<Lead[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<Lead>('leads', currentMode);
}

export async function addLead(
  lead: Lead,
  mode?: SystemOperatingMode
): Promise<Lead> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...lead,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'leads', lead.id), docData);
  return docData;
}

export async function getRemoteEmployees(mode?: SystemOperatingMode): Promise<RemoteEmployee[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<RemoteEmployee>('remoteEmployees', currentMode);
}

export async function addRemoteEmployee(
  emp: RemoteEmployee,
  mode?: SystemOperatingMode
): Promise<RemoteEmployee> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...emp,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'remoteEmployees', emp.id), docData);
  return docData;
}

export async function getTalentApplications(mode?: SystemOperatingMode): Promise<TalentApplication[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<TalentApplication>('talentApplications', currentMode);
}

export async function addTalentApplication(
  talent: TalentApplication,
  mode?: SystemOperatingMode
): Promise<TalentApplication> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...talent,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'talentApplications', talent.id), docData);
  return docData;
}

export async function updateTalentApplicationStatus(
  id: string,
  status: 'Pending Review' | 'Approved' | 'Rejected',
  notes?: string
): Promise<void> {
  try {
    const docRef = doc(db, 'talentApplications', id);
    await updateDoc(docRef, {
      status,
      notes: notes || '',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error(`Error updating talent application ${id} in Firestore:`, err);
  }
}

export async function getAuditLogs(mode?: SystemOperatingMode): Promise<AuditLogEntry[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<AuditLogEntry>('auditLogs', currentMode);
}

export async function addAuditLog(
  audit: AuditLogEntry,
  mode?: SystemOperatingMode
): Promise<AuditLogEntry> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...audit,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'auditLogs', audit.id), docData);
  return docData;
}

export async function getAiLogs(mode?: SystemOperatingMode): Promise<AiServiceLog[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<AiServiceLog>('aiLogs', currentMode);
}

export async function addAiLog(
  log: AiServiceLog,
  mode?: SystemOperatingMode
): Promise<AiServiceLog> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...log,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'aiLogs', log.id), docData);
  return docData;
}

export async function getWorkLogs(mode?: SystemOperatingMode): Promise<WorkLogEntry[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<WorkLogEntry>('workLogs', currentMode);
}

export async function addWorkLog(
  log: WorkLogEntry,
  mode?: SystemOperatingMode
): Promise<WorkLogEntry> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...log,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'workLogs', log.id), docData);
  return docData;
}

export async function approveWorkLogsRelease(logIds: string[]): Promise<void> {
  try {
    for (const id of logIds) {
      const ref = doc(db, 'workLogs', id);
      await updateDoc(ref, { paymentStatus: 'Approved for Release' });
    }
  } catch (err) {
    console.error('Error approving work logs release in Firestore:', err);
  }
}

export async function getMemberEvaluations(mode?: SystemOperatingMode): Promise<MemberEvaluation[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<MemberEvaluation>('memberEvaluations', currentMode);
}

export async function saveMemberEvaluation(
  evaluation: MemberEvaluation,
  mode?: SystemOperatingMode
): Promise<MemberEvaluation> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...evaluation,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'memberEvaluations', evaluation.id), docData);
  return docData;
}

export async function getProjectTeamAssignments(mode?: SystemOperatingMode): Promise<ProjectTeamAssignment[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<ProjectTeamAssignment>('projectTeamAssignments', currentMode);
}

export async function saveProjectTeamAssignment(
  assignment: ProjectTeamAssignment,
  mode?: SystemOperatingMode
): Promise<ProjectTeamAssignment> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...assignment,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'projectTeamAssignments', assignment.projectId), docData);
  return docData;
}

export async function getClarificationMessages(
  projectId: string,
  mode?: SystemOperatingMode
): Promise<ClarificationMessage[]> {
  const currentMode = mode || (await getOperatingMode());
  try {
    await seedDemoDataToFirestore();
    const colRef = collection(db, 'clarificationMessages');

    let q;
    if (currentMode === 'production') {
      q = query(
        colRef,
        where('projectId', '==', projectId),
        where('isDemo', '==', false)
      );
    } else {
      q = query(colRef, where('projectId', '==', projectId));
    }

    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ClarificationMessage);
  } catch (err) {
    console.warn('Error reading clarification messages from Firestore:', err);
    return [];
  }
}

export async function addClarificationMessage(
  msg: ClarificationMessage,
  mode?: SystemOperatingMode
): Promise<ClarificationMessage> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...msg,
    isDemo: isDemoRecord,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'clarificationMessages', msg.id), docData);
  return docData;
}

export async function getQuestionsLibrary(mode?: SystemOperatingMode): Promise<QuestionLibraryItem[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<QuestionLibraryItem>('questionsLibrary', currentMode);
}

// ==================== ASSESSMENT REPORTS ====================

export async function getAssessmentReport(
  projectId: string,
  mode?: SystemOperatingMode
): Promise<any | null> {
  try {
    const docRef = doc(db, 'assessments', projectId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('Error reading assessment from Firestore:', err);
  }
  return null;
}

export async function saveAssessmentReport(
  assessmentData: any,
  mode?: SystemOperatingMode
): Promise<any> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...assessmentData,
    isDemo: isDemoRecord,
    updatedAt: new Date().toISOString()
  };

  try {
    const docId = assessmentData.projectId || assessmentData.id;
    if (docId) {
      await setDoc(doc(db, 'assessments', docId), docData, { merge: true });
    }
  } catch (err) {
    console.error('Error saving assessment to Firestore:', err);
  }
  return docData;
}

// ==================== EVIDENCE DOSSIERS & KNOWLEDGE REPOSITORY ====================

export async function getEvidenceDossier(
  projectId: string,
  mode?: SystemOperatingMode
): Promise<any | null> {
  try {
    const docRef = doc(db, 'evidenceDossiers', projectId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('Error reading evidence dossier from Firestore:', err);
  }
  return null;
}

export async function saveEvidenceDossier(
  dossierData: any,
  mode?: SystemOperatingMode
): Promise<any> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...dossierData,
    isDemo: isDemoRecord,
    updatedAt: new Date().toISOString()
  };

  try {
    const docId = dossierData.projectId || dossierData.id;
    if (docId) {
      await setDoc(doc(db, 'evidenceDossiers', docId), docData, { merge: true });
    }
  } catch (err) {
    console.error('Error saving evidence dossier to Firestore:', err);
  }
  return docData;
}

export async function getKnowledgeRepository(
  mode?: SystemOperatingMode
): Promise<any[]> {
  const currentMode = mode || (await getOperatingMode());
  return getCollectionDocs<any>('knowledgeRepository', currentMode);
}

export async function saveKnowledgeFinding(
  finding: any,
  mode?: SystemOperatingMode
): Promise<any> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...finding,
    isDemo: isDemoRecord,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'knowledgeRepository', finding.id), docData, { merge: true });
  } catch (err) {
    console.error('Error saving knowledge finding to Firestore:', err);
  }
  return docData;
}

// ==================== ENTERPRISE OPERATIONS FIRESTORE SERVICES ====================

// 1. Master Project Registry & Lifecycle
export async function getMasterProjects(mode?: SystemOperatingMode): Promise<MasterProjectRecord[]> {
  const currentMode = mode || (await getOperatingMode());
  const records = await getCollectionDocs<MasterProjectRecord>('masterRegistry', currentMode);

  if (records.length === 0) {
    // Generate default master records from applications
    const apps = await getApplications(currentMode);
    const demoMasterRecords: MasterProjectRecord[] = apps.map((app, idx) => {
      const hcId = `HC-2026-${String(idx + 1).padStart(6, '0')}`;
      return {
        id: hcId,
        projectId: app.id,
        projectName: app.companyName || 'Haqq Protocol',
        tokenSymbol: app.blockchain ? app.blockchain.substring(0, 4).toUpperCase() : 'ISLM',
        coinMarketCapId: undefined,
        coinGeckoId: undefined,
        contractAddress: app.contractAddress || `0x${Math.random().toString(16).substring(2, 42)}`,
        officialWebsite: 'https://official.io',
        companyName: app.companyName || 'Haqq Network Inc.',
        country: 'United Arab Emirates',
        city: 'Dubai',
        currentStatus: app.stage || 'Under Shariah Assessment',
        lifecycleStage: 'Assessment',
        certificateStatus: app.stage === 'certificate_generation' || app.stage === 'published_registry' || app.stage === 'completed' ? 'Active' : 'Pending',
        assessmentVersion: 'v2.4 Enterprise',
        lastAssessmentDate: new Date().toISOString().split('T')[0],
        renewalDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
        assignedTeams: ['Technical Shariah Audit Team A', 'Islamic Finance Risk Advisory'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
    return demoMasterRecords;
  }
  return records;
}

export async function saveMasterProject(
  record: MasterProjectRecord,
  mode?: SystemOperatingMode
): Promise<MasterProjectRecord> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';

  const docData = {
    ...record,
    isDemo: isDemoRecord,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'masterRegistry', record.id), docData, { merge: true });
  } catch (err) {
    console.error('Error saving master project to Firestore:', err);
  }
  return docData;
}

// 2. Duplicate Check
export async function checkDuplicateProject(
  input: DuplicateCheckRequest,
  mode?: SystemOperatingMode
): Promise<DuplicateCheckResult> {
  const currentMode = mode || (await getOperatingMode());
  const masterList = await getMasterProjects(currentMode);

  const matches: DuplicateMatchDetail[] = [];
  let existingRecord: MasterProjectRecord | undefined = undefined;

  for (const master of masterList) {
    if (input.coinMarketCapId && master.coinMarketCapId?.toLowerCase() === input.coinMarketCapId.toLowerCase()) {
      matches.push({
        field: 'CoinMarketCap ID',
        value: input.coinMarketCapId,
        matchedProjectId: master.projectId,
        matchedProjectName: master.projectName,
        halalChainId: master.id
      });
      existingRecord = master;
    }
    if (input.coinGeckoId && master.coinGeckoId?.toLowerCase() === input.coinGeckoId.toLowerCase()) {
      matches.push({
        field: 'CoinGecko ID',
        value: input.coinGeckoId,
        matchedProjectId: master.projectId,
        matchedProjectName: master.projectName,
        halalChainId: master.id
      });
      existingRecord = master;
    }
    if (input.contractAddress && master.contractAddress?.toLowerCase() === input.contractAddress.toLowerCase()) {
      matches.push({
        field: 'Contract Address',
        value: input.contractAddress,
        matchedProjectId: master.projectId,
        matchedProjectName: master.projectName,
        halalChainId: master.id
      });
      existingRecord = master;
    }
    if (input.website && master.officialWebsite?.toLowerCase() === input.website.toLowerCase()) {
      matches.push({
        field: 'Website URL',
        value: input.website,
        matchedProjectId: master.projectId,
        matchedProjectName: master.projectName,
        halalChainId: master.id
      });
      existingRecord = master;
    }
    if (input.projectName && master.projectName.toLowerCase() === input.projectName.toLowerCase()) {
      matches.push({
        field: 'Project Name',
        value: input.projectName,
        matchedProjectId: master.projectId,
        matchedProjectName: master.projectName,
        halalChainId: master.id
      });
      existingRecord = master;
    }
  }

  return {
    isDuplicate: matches.length > 0,
    matches,
    existingRecord
  };
}

// 3. Project Task Locking
export async function getProjectTaskLock(projectId: string): Promise<ProjectTaskLock | null> {
  try {
    const docRef = doc(db, 'projectTaskLocks', projectId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ProjectTaskLock;
    }
  } catch (err) {
    console.warn('Task lock read error:', err);
  }
  return null;
}

export async function acquireProjectTaskLock(
  projectId: string,
  taskId: string,
  userName: string,
  userRole: string,
  finishInMinutes: number = 60
): Promise<ProjectTaskLock> {
  const lockData: ProjectTaskLock = {
    projectId,
    taskId,
    lockedBy: userName,
    lockedByRole: userRole,
    lockedAt: new Date().toISOString(),
    expectedFinish: new Date(Date.now() + finishInMinutes * 60000).toISOString(),
    isLocked: true
  };
  try {
    await setDoc(doc(db, 'projectTaskLocks', projectId), lockData);
  } catch (err) {
    console.error('Task lock acquire error:', err);
  }
  return lockData;
}

export async function releaseProjectTaskLock(projectId: string): Promise<void> {
  try {
    await setDoc(doc(db, 'projectTaskLocks', projectId), { isLocked: false, lockedBy: '', lockedAt: '' });
  } catch (err) {
    console.error('Task lock release error:', err);
  }
}

// 4. Marketing CRM Prospects & Email History
export async function getMarketingProspects(mode?: SystemOperatingMode): Promise<MarketingProspectRecord[]> {
  const currentMode = mode || (await getOperatingMode());
  const prospects = await getCollectionDocs<MarketingProspectRecord>('marketingProspects', currentMode);

  if (prospects.length === 0) {
    // Generate high quality demo prospects
    const masterProjects = await getMasterProjects(currentMode);
    return masterProjects.map((m, idx) => ({
      id: `PROSPECT-${m.id}`,
      masterId: m.id,
      companyName: m.companyName,
      website: m.officialWebsite || 'https://official.io',
      generalEmail: `info@${(m.projectName || 'crypto').toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
      supportEmail: `support@${(m.projectName || 'crypto').toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
      partnershipEmail: `partners@${(m.projectName || 'crypto').toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
      bdEmail: `bd@${(m.projectName || 'crypto').toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
      mediaEmail: `media@${(m.projectName || 'crypto').toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
      contactFormUrl: `${m.officialWebsite || 'https://official.io'}/contact`,
      officialPhone: '+971 4 800 4252',
      mailingAddress: 'Level 24, Al Khatem Tower, ADGM, Abu Dhabi, UAE',
      country: m.country || 'United Arab Emirates',
      city: m.city || 'Dubai',
      xTwitter: `https://x.com/${m.tokenSymbol.toLowerCase()}_official`,
      telegram: `https://t.me/${m.tokenSymbol.toLowerCase()}_community`,
      discord: `https://discord.gg/${m.tokenSymbol.toLowerCase()}`,
      linkedIn: `https://linkedin.com/company/${m.projectName.toLowerCase().replace(/\s+/g, '-')}`,
      githubOrg: `https://github.com/${m.tokenSymbol.toLowerCase()}-protocol`,
      coinMarketCapLink: `https://coinmarketcap.com/currencies/${m.projectName.toLowerCase().replace(/\s+/g, '-')}`,
      coinGeckoLink: `https://coingecko.com/en/coins/${m.projectName.toLowerCase().replace(/\s+/g, '-')}`,
      assessmentStatus: m.currentStatus,
      certificateStatus: m.certificateStatus,
      marketCapUSD: 150000000 + idx * 50000000,
      contactCompletenessPct: 95,
      smartRankScore: 88 - idx * 5,
      lastContactedAt: idx % 2 === 0 ? new Date(Date.now() - idx * 86400000).toISOString() : undefined,
      invitationSent: idx % 2 === 0,
      assignedRep: 'Marketing BD Manager',
      createdAt: new Date().toISOString()
    }));
  }
  return prospects;
}

export async function saveMarketingProspect(
  prospect: MarketingProspectRecord,
  mode?: SystemOperatingMode
): Promise<MarketingProspectRecord> {
  const currentMode = mode || (await getOperatingMode());
  const isDemoRecord = currentMode === 'demo';
  const docData = { ...prospect, isDemo: isDemoRecord };
  try {
    await setDoc(doc(db, 'marketingProspects', prospect.id), docData, { merge: true });
  } catch (err) {
    console.error('Error saving marketing prospect:', err);
  }
  return docData;
}

export async function getEmailHistory(prospectId?: string, mode?: SystemOperatingMode): Promise<EmailHistoryEntry[]> {
  const currentMode = mode || (await getOperatingMode());
  const allEntries = await getCollectionDocs<EmailHistoryEntry>('emailHistory', currentMode);
  if (prospectId) {
    return allEntries.filter((e) => e.prospectId === prospectId || e.masterId === prospectId);
  }
  return allEntries;
}

export async function addEmailEntry(
  entry: EmailHistoryEntry,
  mode?: SystemOperatingMode
): Promise<EmailHistoryEntry> {
  const currentMode = mode || (await getOperatingMode());
  const docData = { ...entry, isDemo: currentMode === 'demo' };
  try {
    await setDoc(doc(db, 'emailHistory', entry.id), docData);
  } catch (err) {
    console.error('Error adding email history entry:', err);
  }
  return docData;
}

export async function deleteApplicationPermanent(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'applications', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Error permanently deleting application ${id}:`, err);
  }
}

export async function resetDemoDataInFirestore(): Promise<void> {
  try {
    isSeeded = false;
    await seedDemoDataToFirestore();
  } catch (err) {
    console.error('Error resetting demo data:', err);
  }
}

// 5. System Alerts
export async function getSystemAlerts(mode?: SystemOperatingMode): Promise<SystemAlertItem[]> {
  const currentMode = mode || (await getOperatingMode());
  const alerts = await getCollectionDocs<SystemAlertItem>('systemAlerts', currentMode);

  if (alerts.length === 0) {
    return [
      {
        id: 'ALT-101',
        type: 'cert_expiring',
        severity: 'high',
        projectId: 'APP-101',
        projectName: 'Haqq Network (ISLM)',
        message: 'Shariah Certificate renewal due in 14 days.',
        timestamp: new Date().toISOString(),
        assignedTo: 'Compliance Manager',
        isRead: false
      },
      {
        id: 'ALT-102',
        type: 'high_priority_prospect',
        severity: 'medium',
        projectId: 'APP-102',
        projectName: 'Islamic Coin Protocol',
        message: 'High market cap prospect ($350M) detected on CoinMarketCap without active Shariah audit.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        assignedTo: 'Marketing BD Lead',
        isRead: false
      },
      {
        id: 'ALT-103',
        type: 'whitepaper_changed',
        severity: 'info',
        projectId: 'APP-103',
        projectName: 'Halal Pay (HPAY)',
        message: 'Whitepaper GitHub commit updated. AI re-extraction recommended.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        assignedTo: 'Lead Technical Auditor',
        isRead: false
      }
    ];
  }
  return alerts;
}

export async function markAlertRead(alertId: string): Promise<void> {
  try {
    await setDoc(doc(db, 'systemAlerts', alertId), { isRead: true }, { merge: true });
  } catch (err) {
    console.error('Error marking alert read:', err);
  }
}



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
  QuestionLibraryItem
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


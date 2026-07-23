import {
  INITIAL_CERTIFIED_PROJECTS,
  INITIAL_LEADS,
  INITIAL_APPLICATIONS,
  INITIAL_REMOTE_EMPLOYEES,
  INITIAL_TALENT_APPLICATIONS,
  INITIAL_PROJECT_TEAM_ASSIGNMENTS,
  INITIAL_WORK_LOGS,
  INITIAL_MEMBER_EVALUATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_QUESTIONS_LIBRARY,
  INITIAL_AI_CONFIG,
  INITIAL_AI_LOGS
} from '../data/mockData';
import {
  PublicCertifiedProject,
  Lead,
  CertificationApplication,
  RemoteEmployee,
  TalentApplication,
  ProjectTeamAssignment,
  WorkLogEntry,
  MemberEvaluation,
  AuditLogEntry,
  QuestionLibraryItem,
  AiConfig,
  AiServiceLog
} from '../types';

function getStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`halalchain_${key}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length === 0) {
        return fallback;
      }
      return parsed;
    }
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
  }
  return fallback;
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`halalchain_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage for ${key}`, e);
  }
}

export async function safeFetch<T>(url: string, fallbackKey: string, initialValue: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data !== null && data !== undefined) {
          setStorage(fallbackKey, data);
          return data;
        }
      }
    }
  } catch (err) {
    console.info(`Server API ${url} unreachable, using client-side store for ${fallbackKey}`);
  }
  return getStorage(fallbackKey, initialValue);
}

export function getLocalApps(): CertificationApplication[] {
  return getStorage('apps', INITIAL_APPLICATIONS);
}

export function saveLocalApps(apps: CertificationApplication[]): void {
  setStorage('apps', apps);
}

export function getLocalCertifiedProjects(): PublicCertifiedProject[] {
  return getStorage('registry', INITIAL_CERTIFIED_PROJECTS);
}

export function getLocalLeads(): Lead[] {
  return getStorage('leads', INITIAL_LEADS);
}

export function getLocalAuditLogs(): AuditLogEntry[] {
  return getStorage('audit', INITIAL_AUDIT_LOGS);
}

export function getLocalEmployees(): RemoteEmployee[] {
  return getStorage('employees', INITIAL_REMOTE_EMPLOYEES);
}

export function getLocalTalentApps(): TalentApplication[] {
  return getStorage('talent_apps', INITIAL_TALENT_APPLICATIONS);
}

export function saveLocalTalentApps(apps: TalentApplication[]): void {
  setStorage('talent_apps', apps);
}

export function getLocalTeamAssignments(): ProjectTeamAssignment[] {
  return getStorage('team_assignments', INITIAL_PROJECT_TEAM_ASSIGNMENTS);
}

export function getLocalWorkLogs(): WorkLogEntry[] {
  return getStorage('work_logs', INITIAL_WORK_LOGS);
}

export function getLocalEvaluations(): MemberEvaluation[] {
  return getStorage('evaluations', INITIAL_MEMBER_EVALUATIONS);
}

export function getLocalAiConfig(): AiConfig {
  return getStorage('ai_config', INITIAL_AI_CONFIG);
}

export function saveLocalAiConfig(config: AiConfig): void {
  setStorage('ai_config', config);
}

export function getLocalAiLogs(): AiServiceLog[] {
  return getStorage('ai_logs', INITIAL_AI_LOGS);
}

export function getLocalQuestions(): QuestionLibraryItem[] {
  return getStorage('questions', INITIAL_QUESTIONS_LIBRARY);
}

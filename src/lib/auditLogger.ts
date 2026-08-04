import { addAuditLog } from './firebaseService';
import { AuthUser } from '../types';

export interface EnterpriseAuditEvent {
  id?: string;
  user?: string;
  userId?: string;
  userEmail?: string;
  role?: string;
  project?: string;
  projectId?: string;
  action: string;
  timestamp?: string;
  oldValue?: any;
  newValue?: any;
  browser?: string;
  device?: string;
  status?: 'SUCCESS' | 'WARNING' | 'DENIED' | 'FAILED';
  ip?: string;
  details?: string;
}

/**
 * Returns browser and device metadata.
 */
function getClientBrowserAndDevice(): { browser: string; device: string } {
  if (typeof window === 'undefined' || !navigator) {
    return { browser: 'Server Context', device: 'System Backend' };
  }
  const ua = navigator.userAgent || '';
  let browser = 'Unknown Browser';
  if (ua.includes('Chrome')) browser = 'Google Chrome';
  else if (ua.includes('Safari')) browser = 'Apple Safari';
  else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
  else if (ua.includes('Edg')) browser = 'Microsoft Edge';

  let device = 'Desktop Workstation';
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    device = 'Mobile Device';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    device = 'macOS Workstation';
  } else if (/Windows/i.test(ua)) {
    device = 'Windows PC';
  } else if (/Linux/i.test(ua)) {
    device = 'Linux Workstation';
  }

  return { browser, device };
}

/**
 * Enterprise Audit Logger for Immutable Event Logging
 */
export async function recordAuditEvent(
  user: AuthUser | null,
  action: string,
  details: {
    project?: string;
    projectId?: string;
    oldValue?: any;
    newValue?: any;
    status?: 'SUCCESS' | 'WARNING' | 'DENIED' | 'FAILED';
    ip?: string;
    notes?: string;
  }
): Promise<void> {
  const { browser, device } = getClientBrowserAndDevice();
  const timestamp = new Date().toISOString();

  const auditRecord: EnterpriseAuditEvent = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    user: user ? user.displayName || user.email : 'System Operational Bot',
    userId: user ? user.uid : 'system',
    userEmail: user ? user.email : 'system@halalchain.org',
    role: user ? user.role : 'system',
    project: details.project || 'Global Platform',
    projectId: details.projectId || 'N/A',
    action,
    timestamp,
    oldValue: details.oldValue ? (typeof details.oldValue === 'object' ? JSON.stringify(details.oldValue) : String(details.oldValue)) : null,
    newValue: details.newValue ? (typeof details.newValue === 'object' ? JSON.stringify(details.newValue) : String(details.newValue)) : null,
    browser,
    device,
    status: details.status || 'SUCCESS',
    ip: details.ip || '127.0.0.1 (Proxied Encrypted)',
    details: details.notes || `${action} executed by ${user?.email || 'System'}`
  };

  try {
    // Write to Firestore collection audit_logs
    await addAuditLog(auditRecord as any);

    // Also send to backend audit endpoint
    fetch('/api/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auditRecord)
    }).catch((e) => console.warn('Non-blocking server audit ping:', e));
  } catch (err) {
    console.error('Failed to log immutable audit event:', err);
  }
}

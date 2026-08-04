import { AuthUser, UserRole, CertificationApplication, MasterProject, RolePermissionsMap } from '../types';
import { SYSTEM_PERMISSIONS } from './rbacService';

// ==================== ENTERPRISE PERMISSION ENGINE ====================

export interface SystemUser {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

/**
 * Enterprise Permission Result
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  errorCode?: string;
}

/**
 * Core Permission Engine function for Role, Module, and Action permissions.
 */
export function checkUserPermission(
  userRole: UserRole,
  permissionKey: string,
  permissionsMatrix?: RolePermissionsMap
): PermissionCheckResult {
  // Super Admin & General Manager always have full override permission
  if (userRole === 'exec' || userRole === 'admin') {
    return { allowed: true };
  }

  // Anonymous public visitor restricted to public website
  if (userRole === 'anonymous') {
    if (permissionKey === 'platform:public_website') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Public visitors must sign in to access enterprise features.',
      errorCode: 'ERR_UNAUTHENTICATED'
    };
  }

  // Check custom permission matrix if provided
  if (permissionsMatrix && permissionsMatrix[userRole]) {
    const rolePerms = permissionsMatrix[userRole];
    if (typeof rolePerms[permissionKey] === 'boolean') {
      const isAllowed = rolePerms[permissionKey];
      return {
        allowed: isAllowed,
        reason: isAllowed
          ? undefined
          : `Role '${userRole}' lacks explicit authorization for '${permissionKey}'.`,
        errorCode: isAllowed ? undefined : 'ERR_PERMISSION_DENIED'
      };
    }
  }

  // Fallback check against known system permission taxonomy
  const permDef = SYSTEM_PERMISSIONS.find((p) => p.key === permissionKey);
  if (!permDef) {
    // If unknown key, restrict unless exec/admin
    return {
      allowed: false,
      reason: `Unknown permission key: '${permissionKey}'. Access denied.`,
      errorCode: 'ERR_INVALID_PERMISSION'
    };
  }

  return {
    allowed: false,
    reason: `Your role (${userRole}) does not possess the '${permDef.label}' permission.`,
    errorCode: 'ERR_PERMISSION_DENIED'
  };
}

// ==================== ASSIGNMENT-BASED ACCESS CONTROL ====================

export interface ProjectAssignmentContext {
  id: string;
  leadAuditorId?: string;
  shariaScholarId?: string;
  qaOfficerId?: string;
  projectManagerId?: string;
  businessAnalystId?: string;
  clientEmail?: string;
  customerUid?: string;
  assignedTeamMembers?: string[]; // Array of UIDs, emails, or role IDs
}

/**
 * Checks whether a user can access a specific project based on assignment records.
 */
export function isUserAssignedToProject(
  user: SystemUser | null,
  project: ProjectAssignmentContext
): boolean {
  if (!user) return false;

  // General Manager & Super Admin retain full visibility across all projects
  if (user.role === 'exec' || user.role === 'admin') {
    return true;
  }

  const uEmail = user.email.toLowerCase();
  const uUid = user.uid.toLowerCase();
  const uName = (user.displayName || '').toLowerCase();
  const uRole = user.role.toLowerCase();

  // Check client / customer ownership
  if (
    (project.clientEmail && project.clientEmail.toLowerCase() === uEmail) ||
    (project.customerUid && project.customerUid.toLowerCase() === uUid)
  ) {
    return true;
  }

  // Check specific role assignments on project
  if (
    (project.leadAuditorId && matchesUserIdentifier(project.leadAuditorId, user)) ||
    (project.shariaScholarId && matchesUserIdentifier(project.shariaScholarId, user)) ||
    (project.qaOfficerId && matchesUserIdentifier(project.qaOfficerId, user)) ||
    (project.projectManagerId && matchesUserIdentifier(project.projectManagerId, user)) ||
    (project.businessAnalystId && matchesUserIdentifier(project.businessAnalystId, user))
  ) {
    return true;
  }

  // Check team members array
  if (Array.isArray(project.assignedTeamMembers)) {
    const isMember = project.assignedTeamMembers.some((memberId) =>
      matchesUserIdentifier(memberId, user)
    );
    if (isMember) return true;
  }

  // Role-based operational scope fallbacks for unassigned list views
  // (e.g. Sales seeing pipeline leads, Finance seeing payment gate)
  if (uRole === 'sales' || uRole === 'marketing') {
    return true;
  }

  return false;
}

function matchesUserIdentifier(assignedVal: string, user: SystemUser): boolean {
  if (!assignedVal) return false;
  const val = assignedVal.toLowerCase();
  return (
    val === user.uid.toLowerCase() ||
    val === user.email.toLowerCase() ||
    val === (user.displayName || '').toLowerCase() ||
    val === user.role.toLowerCase() ||
    val.includes(user.role.toLowerCase())
  );
}

/**
 * Filters list of projects for the current user according to Assignment-Based Access.
 */
export function filterAssignedProjects<T extends ProjectAssignmentContext>(
  user: SystemUser | null,
  projects: T[]
): T[] {
  if (!user) return [];
  if (user.role === 'exec' || user.role === 'admin') {
    return projects;
  }
  return projects.filter((proj) => isUserAssignedToProject(user, proj));
}

/**
 * Filter assigned notifications for current user.
 */
export function filterAssignedNotifications<T extends { targetUserId?: string; targetRole?: string; targetEmail?: string }>(
  user: SystemUser | AuthUser | null,
  notifications: T[]
): T[] {
  if (!user) return [];
  if (user.role === 'exec' || user.role === 'admin') {
    return notifications;
  }

  const uEmail = user.email.toLowerCase();
  const uUid = user.uid.toLowerCase();
  const uRole = user.role.toLowerCase();

  return notifications.filter((n) => {
    if (!n.targetUserId && !n.targetRole && !n.targetEmail) return true; // Global notification
    if (n.targetUserId && n.targetUserId.toLowerCase() === uUid) return true;
    if (n.targetEmail && n.targetEmail.toLowerCase() === uEmail) return true;
    if (n.targetRole && (n.targetRole.toLowerCase() === uRole || n.targetRole === 'all')) return true;
    return false;
  });
}

// ==================== ENTERPRISE ERROR SANITIZER ====================

export function formatEnterpriseError(error: any): { title: string; message: string; code: string } {
  const rawMsg = typeof error === 'string' ? error : error?.message || 'An unexpected operational error occurred.';
  
  if (rawMsg.includes('permission') || rawMsg.includes('Permission') || rawMsg.includes('403')) {
    return {
      title: 'Access Restricted',
      message: 'You do not have required authorization to execute this operational action.',
      code: 'ERR_PERMISSION_DENIED'
    };
  }

  if (rawMsg.includes('not found') || rawMsg.includes('404')) {
    return {
      title: 'Resource Unavailable',
      message: 'The requested record or document could not be located in the registry.',
      code: 'ERR_NOT_FOUND'
    };
  }

  return {
    title: 'Enterprise Security Alert',
    message: rawMsg.replace(/FirebaseError:|Firestore:|Error:/gi, '').trim(),
    code: 'ERR_OPERATIONAL_FAILURE'
  };
}

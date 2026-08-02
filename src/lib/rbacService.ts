import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebaseService';
import {
  RoleDefinition,
  PermissionDefinition,
  RolePermissionsMap,
  UserRole,
  PlatformView
} from '../types';

// ==================== SYSTEM PERMISSIONS TAXONOMY ====================

export const SYSTEM_PERMISSIONS: PermissionDefinition[] = [
  // Platform Access
  {
    key: 'platform:public_website',
    label: 'Public Registry & Website',
    category: 'Platform Views',
    description: 'Access public certified project directory, methodology, and public verification tools.'
  },
  {
    key: 'platform:customer_portal',
    label: 'Customer Portal',
    category: 'Platform Views',
    description: 'Access client portal for tracking certification applications, payments, and messaging.'
  },
  {
    key: 'platform:ops_platform',
    label: 'Operations Workspace',
    category: 'Platform Views',
    description: 'Access employee operations workspace for audits, CRM, project management, and reviews.'
  },
  {
    key: 'platform:exec_platform',
    label: 'Executive Platform',
    category: 'Platform Views',
    description: 'Access C-suite dashboard, financial BI, P&L wallet, AI config, workforce, and RBAC admin.'
  },

  // Executive Platform Modules
  {
    key: 'exec:bi',
    label: 'Financial BI & Analytics',
    category: 'Executive Modules',
    description: 'View executive revenue, conversion funnel, risk distribution, and financial projections.'
  },
  {
    key: 'exec:company_wallet',
    label: 'Company Treasury & P&L Wallet',
    category: 'Executive Modules',
    description: 'View treasury balances, revenue allocations, payroll escrows, and fee distributions.'
  },
  {
    key: 'exec:ai_config',
    label: 'Enterprise AI Control Engine',
    category: 'Executive Modules',
    description: 'Configure active LLM models, task routing, token caps, and inspect API usage logs.'
  },
  {
    key: 'exec:workforce',
    label: 'Workforce & Talent Management',
    category: 'Executive Modules',
    description: 'Manage remote auditor network, candidate evaluation, ratings, and global workforce.'
  },
  {
    key: 'exec:sys_admin',
    label: 'System Operating Mode',
    category: 'Executive Modules',
    description: 'Toggle platform operating mode between Demo Mode and Live Production Mode.'
  },
  {
    key: 'exec:rbac_admin',
    label: 'RBAC & Permission Control Console',
    category: 'Executive Modules',
    description: 'Create custom roles, edit permission matrices, toggle permissions, and assign user roles.'
  },

  // Operations Workspace Modules
  {
    key: 'ops:my_work',
    label: 'My Task Queue & Work Items',
    category: 'Operations Workspace',
    description: 'View personal assigned workflow tasks, pending audits, and immediate action items.'
  },
  {
    key: 'ops:master_registry',
    label: 'Master Project Registry',
    category: 'Operations Workspace',
    description: 'Access the global master registry of all Web3 projects and lifecycle statuses.'
  },
  {
    key: 'ops:command_center',
    label: 'Operations Command Center',
    category: 'Operations Workspace',
    description: 'View real-time operational overview, SLA tracking, and system health.'
  },
  {
    key: 'ops:marketing_crm',
    label: 'Smart Marketing CRM',
    category: 'Operations Workspace',
    description: 'Manage lead generation, marketing prospects, CoinMarketCap discovery, and campaigns.'
  },
  {
    key: 'ops:crm',
    label: 'CRM & Sales Pipeline',
    category: 'Operations Workspace',
    description: 'View and manage Web3 lead conversion, client contacts, and proposal generation.'
  },
  {
    key: 'ops:pm',
    label: 'Project Management Hub',
    category: 'Operations Workspace',
    description: 'View master project directory, team assignments, task SLA tracking, and reassignments.'
  },
  {
    key: 'ops:ai_engine',
    label: 'AI Code & Contract Assessment',
    category: 'Operations Workspace',
    description: 'Run automated AI whitepaper extractions, bytecode scans, and smart contract analysis.'
  },
  {
    key: 'ops:intelligence_dashboard',
    label: 'Project Intelligence Dashboard',
    category: 'Operations Workspace',
    description: 'Inspect AI assessment scores, tokenomics evaluations, and project risk ratings.'
  },
  {
    key: 'ops:knowledge_repository',
    label: 'Knowledge & Audit Repository',
    category: 'Operations Workspace',
    description: 'Search Sharia audit findings, AAOIFI standards compliance, and technical benchmarks.'
  },
  {
    key: 'ops:enterprise_reports',
    label: 'Enterprise Reports',
    category: 'Operations Workspace',
    description: 'Generate compliance reports, audit metrics, and executive operational exports.'
  },
  {
    key: 'ops:auditor',
    label: 'Audit & Review Workspace',
    category: 'Operations Workspace',
    description: 'Perform technical smart contract, business tokenomics, or Sharia compliance reviews.'
  },
  {
    key: 'ops:finance',
    label: 'Finance Release Gate',
    category: 'Operations Workspace',
    description: 'Verify deposit and final payments, unlock certificates, and generate invoices.'
  },
  {
    key: 'ops:wallet',
    label: 'Employee Payroll & Escrow Wallet',
    category: 'Operations Workspace',
    description: 'View personal audit earnings, logged hours, escrow claims, and payment releases.'
  },
  {
    key: 'ops:audit_log',
    label: 'Digital Audit Trail & Hashes',
    category: 'Operations Workspace',
    description: 'Inspect cryptographic digital signatures, immutable event logs, and IP footprints.'
  },

  // Customer Portal Modules
  {
    key: 'customer:dashboard',
    label: 'Client Certification Tracker',
    category: 'Customer Portal',
    description: 'View real-time certification application stage, review status, and target dates.'
  },
  {
    key: 'customer:deposit',
    label: 'Submit Application Deposit',
    category: 'Customer Portal',
    description: 'Pay 50% deposit to initiate technical and Sharia audit workflows.'
  },
  {
    key: 'customer:final_payment',
    label: 'Submit Final Certificate Fee',
    category: 'Customer Portal',
    description: 'Settle remaining balance to trigger final certificate issuance and registry publishing.'
  },
  {
    key: 'customer:messages',
    label: 'Sharia Clarifications Channel',
    category: 'Customer Portal',
    description: 'Communicate directly with Sharia scholars and auditors for audit clarifications.'
  },

  // System Actions
  {
    key: 'action:gm_create_role',
    label: 'Create Custom System Roles',
    category: 'System Actions',
    description: 'Define new enterprise roles with customized permission configurations.'
  },
  {
    key: 'action:gm_edit_permissions',
    label: 'Edit & Toggle Role Permissions',
    category: 'System Actions',
    description: 'Modify permission toggles for existing or new system roles.'
  },
  {
    key: 'action:gm_assign_role',
    label: 'Assign System Roles to Employees',
    category: 'System Actions',
    description: 'Reassign user roles and authorization levels across the workforce.'
  },
  {
    key: 'action:sales_create_lead',
    label: 'Create & Import CRM Leads',
    category: 'System Actions',
    description: 'Add new Web3 lead prospects to the sales pipeline.'
  },
  {
    key: 'action:sales_generate_proposal',
    label: 'Generate Sales Proposals & Invoices',
    category: 'System Actions',
    description: 'Create commercial proposals and issue initial fee quotes.'
  },
  {
    key: 'action:pm_create_project',
    label: 'Create New Certification Projects',
    category: 'System Actions',
    description: 'Initiate and register new Web3 certification projects in the platform.'
  },
  {
    key: 'action:pm_assign_team',
    label: 'Assign & Reassign Project Teams',
    category: 'System Actions',
    description: 'Assign auditors, Sharia scholars, and QA officers to active certification projects.'
  },
  {
    key: 'action:pm_release_payroll',
    label: 'Approve & Release Remote Payroll',
    category: 'System Actions',
    description: 'Authorize payroll disbursements to remote employee wallets upon task completion.'
  },
  {
    key: 'action:tech_approve_audit',
    label: 'Approve Technical Code Audit',
    category: 'System Actions',
    description: 'Submit smart contract security findings and transition workflow to Business Review.'
  },
  {
    key: 'action:biz_approve_audit',
    label: 'Approve Business & Tokenomics Review',
    category: 'System Actions',
    description: 'Submit tokenomics evaluation and transition workflow to Scholar Review.'
  },
  {
    key: 'action:scholar_sign_fatwa',
    label: 'Issue Sharia Fatwa & Sign Certificate',
    category: 'System Actions',
    description: 'Sign official Sharia compliance ruling with digital signature and seal.'
  },
  {
    key: 'action:qa_signoff',
    label: 'Execute QA Audit Sign-off',
    category: 'System Actions',
    description: 'Verify audit completeness and advance project to Payment Lock.'
  },
  {
    key: 'action:finance_verify_payment',
    label: 'Verify Fee Payment & Unlock Certificate',
    category: 'System Actions',
    description: 'Confirm fee receipt and release final certificate to public registry.'
  }
];

// ==================== DEFAULT SYSTEM ROLES ====================

export const DEFAULT_SYSTEM_ROLES: RoleDefinition[] = [
  {
    id: 'exec',
    name: 'General Manager (Exec)',
    description: 'Full executive command over company BI, P&L, AI engines, workforce, and RBAC control.',
    category: 'Executive',
    isSystemRole: true
  },
  {
    id: 'admin',
    name: 'System Administrator',
    description: 'Technical system administration, infrastructure management, and full system access.',
    category: 'Executive',
    isSystemRole: true
  },
  {
    id: 'sales',
    name: 'Sales Manager',
    description: 'CRM lead conversion, proposal generation, pricing quotes, and deposit requests.',
    category: 'Operations',
    isSystemRole: true
  },
  {
    id: 'pm',
    name: 'Project Manager',
    description: 'Project assignment, workflow stage transitions, SLA tracking, and payroll authorization.',
    category: 'Operations',
    isSystemRole: true
  },
  {
    id: 'tech_auditor',
    name: 'Technical Reviewer',
    description: 'Smart contract bytecode auditing, vulnerability detection, and AI draft review.',
    category: 'Operations',
    isSystemRole: true
  },
  {
    id: 'business_analyst',
    name: 'Business Reviewer',
    description: 'Tokenomics evaluation, revenue model validation, and governance risk scoring.',
    category: 'Operations',
    isSystemRole: true
  },
  {
    id: 'scholar',
    name: 'Sharia Scholar',
    description: 'AAOIFI standard evaluation, Sharia ruling issuance, fatwa digital signatures, and certificate authorization.',
    category: 'Operations',
    isSystemRole: true
  },
  {
    id: 'qa',
    name: 'Quality Assurance',
    description: 'Final audit verification, findings consistency check, and pre-issuance quality sign-off.',
    category: 'Operations',
    isSystemRole: true
  },
  {
    id: 'finance',
    name: 'Finance Officer',
    description: 'Deposit & final payment verification, invoice generation, and certificate payment locks.',
    category: 'Operations',
    isSystemRole: true
  },
  {
    id: 'marketing',
    name: 'Marketing Specialist',
    description: 'Lead discovery, campaign management, public registry promotion, and community outreach.',
    category: 'Operations',
    isSystemRole: true
  },
  {
    id: 'customer',
    name: 'Customer / Applicant',
    description: 'Web3 project founder or representative applying for Sharia compliance certification.',
    category: 'External Client',
    isSystemRole: true
  },
  {
    id: 'anonymous',
    name: 'Public Visitor',
    description: 'Unauthenticated public visitor exploring the certified registry and public pages.',
    category: 'External Client',
    isSystemRole: true
  }
];

// Helper to generate full permission set (true or false)
const ALL_KEYS = SYSTEM_PERMISSIONS.map((p) => p.key);

function createPermissionsSet(enabledKeys: string[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  ALL_KEYS.forEach((k) => {
    map[k] = enabledKeys.includes(k);
  });
  return map;
}

// ==================== DEFAULT ROLE PERMISSION MATRIX ====================

export const INITIAL_ROLE_PERMISSIONS: RolePermissionsMap = {
  // General Manager & System Admin: FULL ACCESS TO EVERYTHING
  exec: createPermissionsSet(ALL_KEYS),
  admin: createPermissionsSet(ALL_KEYS),

  // Sales Manager
  sales: createPermissionsSet([
    'platform:public_website',
    'platform:ops_platform',
    'ops:my_work',
    'ops:crm',
    'ops:marketing_crm',
    'ops:wallet',
    'action:sales_create_lead',
    'action:sales_generate_proposal'
  ]),

  // Marketing Specialist
  marketing: createPermissionsSet([
    'platform:public_website',
    'platform:ops_platform',
    'ops:my_work',
    'ops:marketing_crm',
    'ops:crm',
    'ops:wallet',
    'action:sales_create_lead'
  ]),

  // Project Manager
  pm: createPermissionsSet([
    'platform:public_website',
    'platform:ops_platform',
    'ops:my_work',
    'ops:master_registry',
    'ops:command_center',
    'ops:pm',
    'ops:crm',
    'ops:ai_engine',
    'ops:intelligence_dashboard',
    'ops:knowledge_repository',
    'ops:enterprise_reports',
    'ops:auditor',
    'ops:audit_log',
    'ops:wallet',
    'action:pm_create_project',
    'action:pm_assign_team',
    'action:pm_release_payroll'
  ]),

  // Technical Reviewer / Smart Contract Auditor
  tech_auditor: createPermissionsSet([
    'platform:public_website',
    'platform:ops_platform',
    'ops:my_work',
    'ops:auditor',
    'ops:ai_engine',
    'ops:knowledge_repository',
    'ops:wallet',
    'action:tech_approve_audit'
  ]),

  // Business Reviewer / Tokenomics Analyst
  business_analyst: createPermissionsSet([
    'platform:public_website',
    'platform:ops_platform',
    'ops:my_work',
    'ops:auditor',
    'ops:knowledge_repository',
    'ops:wallet',
    'action:biz_approve_audit'
  ]),

  // Sharia Scholar
  scholar: createPermissionsSet([
    'platform:public_website',
    'platform:ops_platform',
    'ops:my_work',
    'ops:auditor',
    'ops:knowledge_repository',
    'ops:wallet',
    'action:scholar_sign_fatwa'
  ]),

  // Quality Assurance Officer
  qa: createPermissionsSet([
    'platform:public_website',
    'platform:ops_platform',
    'ops:my_work',
    'ops:auditor',
    'ops:knowledge_repository',
    'ops:wallet',
    'action:qa_signoff'
  ]),

  // Finance Officer
  finance: createPermissionsSet([
    'platform:public_website',
    'platform:ops_platform',
    'ops:my_work',
    'ops:finance',
    'ops:enterprise_reports',
    'ops:wallet',
    'ops:audit_log',
    'action:finance_verify_payment'
  ]),

  // Customer / Web3 Client
  customer: createPermissionsSet([
    'platform:public_website',
    'platform:customer_portal',
    'customer:dashboard',
    'customer:deposit',
    'customer:final_payment',
    'customer:messages',
    'action:customer_submit_app',
    'action:customer_make_deposit',
    'action:customer_make_final_payment',
    'action:customer_send_clarification'
  ]),

  // Anonymous Public Visitor
  anonymous: createPermissionsSet([
    'platform:public_website'
  ])
};

// ==================== FIRESTORE INTEGRATION FUNCTIONS ====================

export interface RbacFirestoreData {
  roles: RoleDefinition[];
  permissions: RolePermissionsMap;
  updatedAt?: string;
  updatedBy?: string;
}

export async function getRbacConfigFromFirestore(): Promise<RbacFirestoreData> {
  try {
    const docRef = doc(db, 'systemConfig', 'rbac');
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as RbacFirestoreData;
      // Merge defaults if new permissions/roles were added
      const mergedRoles = [...DEFAULT_SYSTEM_ROLES];
      (data.roles || []).forEach((r) => {
        if (!mergedRoles.some((existing) => existing.id === r.id)) {
          mergedRoles.push(r);
        }
      });

      const mergedPerms: RolePermissionsMap = { ...INITIAL_ROLE_PERMISSIONS, ...(data.permissions || {}) };
      return {
        roles: mergedRoles,
        permissions: mergedPerms,
        updatedAt: data.updatedAt
      };
    } else {
      const initialData: RbacFirestoreData = {
        roles: DEFAULT_SYSTEM_ROLES,
        permissions: INITIAL_ROLE_PERMISSIONS,
        updatedAt: new Date().toISOString(),
        updatedBy: 'System Init'
      };
      await setDoc(docRef, initialData);
      return initialData;
    }
  } catch (err) {
    console.warn('Unable to read RBAC config from Firestore, falling back to initial matrix:', err);
    return {
      roles: DEFAULT_SYSTEM_ROLES,
      permissions: INITIAL_ROLE_PERMISSIONS
    };
  }
}

export async function saveRbacPermissionsToFirestore(
  permissions: RolePermissionsMap,
  updatedBy: string = 'General Manager'
): Promise<void> {
  try {
    const docRef = doc(db, 'systemConfig', 'rbac');
    await setDoc(
      docRef,
      {
        permissions,
        updatedAt: new Date().toISOString(),
        updatedBy
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error saving RBAC permissions to Firestore:', err);
    throw err;
  }
}

export async function saveRbacRolesToFirestore(
  roles: RoleDefinition[],
  updatedBy: string = 'General Manager'
): Promise<void> {
  try {
    const docRef = doc(db, 'systemConfig', 'rbac');
    await setDoc(
      docRef,
      {
        roles,
        updatedAt: new Date().toISOString(),
        updatedBy
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error saving RBAC roles to Firestore:', err);
    throw err;
  }
}

export async function createCustomRoleInFirestore(
  newRole: RoleDefinition,
  initialPermissions: Record<string, boolean>,
  currentConfig: RbacFirestoreData
): Promise<RbacFirestoreData> {
  const updatedRoles = [...currentConfig.roles, newRole];
  const updatedPermissions = {
    ...currentConfig.permissions,
    [newRole.id]: initialPermissions
  };

  const docRef = doc(db, 'systemConfig', 'rbac');
  await setDoc(
    docRef,
    {
      roles: updatedRoles,
      permissions: updatedPermissions,
      updatedAt: new Date().toISOString(),
      updatedBy: 'General Manager'
    },
    { merge: true }
  );

  return {
    roles: updatedRoles,
    permissions: updatedPermissions,
    updatedAt: new Date().toISOString()
  };
}

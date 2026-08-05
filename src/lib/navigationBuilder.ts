import { UserRole, PlatformTab } from '../types';

export interface NavItem {
  id: string;
  path: string;
  label: string;
  labelKey?: string;
  iconName?: string;
  category?: string;
  permissionKey?: string;
  parentModule: 'public' | 'customer' | 'ops' | 'exec';
  active?: boolean;
  badge?: string | number;
}

export interface PlatformNavItem {
  id: PlatformTab;
  path: string;
  labelKey: string;
  defaultLabel: string;
  iconName: string;
  permissionKey: string;
  parentModule?: string;
  active?: boolean;
}

export interface GeneratedNavigation {
  role: UserRole;
  currentPath: string;
  platformTabs: PlatformNavItem[];
  opsTabs: NavItem[];
  execTabs: NavItem[];
  customerTabs: NavItem[];
  publicTabs: NavItem[];
  activeItem?: NavItem | PlatformNavItem;
}

/**
 * NAVIGATION BUILDER SERVICE
 *
 * Workflow:
 * User Login -> Role -> Permission Service -> Navigation Builder -> Generate Navigation (with full routing metadata) -> Render Navigation & Router
 *
 * Rules:
 * - The Navigation Builder is the ONLY source of navigation.
 * - Every menu item includes: route path, route name/label, icon, required permission, active state, and parent module.
 * - No menu item may exist unless explicitly authorized by the Permission Service.
 * - Navigation preserves existing application routes.
 */
export class NavigationBuilderService {
  /**
   * Generates the entire navigation structure for a given role based on resolved permissions and current URL path.
   */
  public static generateNavigation(
    role: UserRole,
    checkPermission: (key: string) => boolean,
    currentPath: string = typeof window !== 'undefined' ? window.location.pathname : '/'
  ): GeneratedNavigation {
    const platformTabs = this.generatePlatformTabs(role, checkPermission, currentPath);
    const opsTabs = this.generateOpsTabs(role, checkPermission, currentPath);
    const execTabs = this.generateExecTabs(role, checkPermission, currentPath);
    const customerTabs = this.generateCustomerTabs(role, checkPermission, currentPath);
    const publicTabs = this.generatePublicTabs(currentPath);

    return {
      role,
      currentPath,
      platformTabs,
      opsTabs,
      execTabs,
      customerTabs,
      publicTabs
    };
  }

  private static isItemActive(itemPath: string, currentPath: string): boolean {
    if (!currentPath) return false;
    if (currentPath === itemPath) return true;
    // Handle fallback defaults
    if (itemPath === '/public/home' && (currentPath === '/' || currentPath === '/public')) return true;
    if (itemPath === '/ops/my_work' && currentPath === '/ops') return true;
    if (itemPath === '/exec/bi' && currentPath === '/exec') return true;
    if (itemPath === '/customer/overview' && currentPath === '/customer') return true;
    return false;
  }

  private static isPlatformActive(platformId: PlatformTab, currentPath: string): boolean {
    if (!currentPath) return false;
    if (platformId === 'public' && (currentPath.startsWith('/public') || currentPath === '/')) return true;
    if (platformId === 'ops' && currentPath.startsWith('/ops')) return true;
    if (platformId === 'exec' && currentPath.startsWith('/exec')) return true;
    if (platformId === 'customer' && currentPath.startsWith('/customer')) return true;
    return false;
  }

  /**
   * Dynamically generate top-level platform tabs.
   */
  private static generatePlatformTabs(
    role: UserRole,
    checkPermission: (key: string) => boolean,
    currentPath: string
  ): PlatformNavItem[] {
    const candidatePlatforms: PlatformNavItem[] = [
      {
        id: 'public',
        path: '/public',
        labelKey: 'nav.public',
        defaultLabel: 'Public Portal',
        iconName: 'Globe',
        permissionKey: 'platform:public_website',
        parentModule: 'public',
        active: this.isPlatformActive('public', currentPath)
      },
      {
        id: 'customer',
        path: '/customer',
        labelKey: 'nav.customer',
        defaultLabel: 'Customer Portal',
        iconName: 'User',
        permissionKey: 'platform:customer_portal',
        parentModule: 'customer',
        active: this.isPlatformActive('customer', currentPath)
      },
      {
        id: 'ops',
        path: '/ops',
        labelKey: 'nav.ops',
        defaultLabel: 'Operations Workspace',
        iconName: 'Briefcase',
        permissionKey: 'platform:ops_platform',
        parentModule: 'ops',
        active: this.isPlatformActive('ops', currentPath)
      },
      {
        id: 'exec',
        path: '/exec',
        labelKey: 'nav.exec',
        defaultLabel: 'Executive Platform',
        iconName: 'BarChart3',
        permissionKey: 'platform:exec_platform',
        parentModule: 'exec',
        active: this.isPlatformActive('exec', currentPath)
      }
    ];

    return candidatePlatforms.filter((platform) => checkPermission(platform.permissionKey));
  }

  /**
   * Dynamically generate Operations Workspace tabs specifically for the user's role.
   */
  private static generateOpsTabs(
    role: UserRole,
    checkPermission: (key: string) => boolean,
    currentPath: string
  ): NavItem[] {
    const createItem = (
      id: string,
      label: string,
      iconName: string,
      permissionKey: string,
      labelKey?: string
    ): NavItem => {
      const path = `/ops/${id}`;
      return {
        id,
        path,
        label,
        labelKey,
        iconName,
        permissionKey,
        parentModule: 'ops',
        active: this.isItemActive(path, currentPath)
      };
    };

    switch (role) {
      case 'tech_auditor': {
        const items: NavItem[] = [
          createItem('my_work', 'Dashboard', 'LayoutDashboard', 'ops:my_work'),
          createItem('assigned_projects', 'Assigned Projects', 'Briefcase', 'ops:my_work'),
          createItem('tech_assessments', 'Technical Assessments', 'Code', 'ops:ai_engine'),
          createItem('evidence', 'Evidence', 'FileText', 'ops:auditor'),
          createItem('findings', 'Findings', 'AlertTriangle', 'ops:auditor'),
          createItem('smart_contract_analysis', 'Smart Contract Analysis', 'Cpu', 'ops:ai_engine'),
          createItem('whitepaper_analysis', 'Whitepaper Analysis', 'FileText', 'ops:ai_engine'),
          createItem('my_tasks', 'My Tasks', 'CheckCircle2', 'ops:my_work'),
          createItem('notifications', 'Notifications', 'Bell', 'ops:my_work'),
          createItem('wallet', 'Wallet', 'Coins', 'ops:wallet'),
          createItem('payroll', 'Payroll', 'CreditCard', 'ops:wallet'),
          createItem('profile', 'Profile', 'User', 'ops:my_work')
        ];
        return items.filter((item) => checkPermission(item.permissionKey!));
      }

      case 'scholar': {
        const items: NavItem[] = [
          createItem('my_work', 'Dashboard', 'LayoutDashboard', 'ops:my_work'),
          createItem('assigned_projects', 'Assigned Projects', 'Briefcase', 'ops:my_work'),
          createItem('sharia_assessments', 'Sharia Assessments', 'ShieldCheck', 'ops:auditor'),
          createItem('aaoifi_compliance', 'AAOIFI Standards', 'Award', 'ops:knowledge_repository'),
          createItem('evidence', 'Evidence', 'FileText', 'ops:auditor'),
          createItem('findings', 'Sharia Rulings & Findings', 'FileText', 'ops:auditor'),
          createItem('fatwa_endorsements', 'Fatwa Endorsements', 'Sparkles', 'action:scholar_sign_fatwa'),
          createItem('my_tasks', 'My Tasks', 'CheckCircle2', 'ops:my_work'),
          createItem('notifications', 'Notifications', 'Bell', 'ops:my_work'),
          createItem('wallet', 'Wallet', 'Coins', 'ops:wallet'),
          createItem('payroll', 'Payroll', 'CreditCard', 'ops:wallet'),
          createItem('profile', 'Profile', 'User', 'ops:my_work')
        ];
        return items.filter((item) => checkPermission(item.permissionKey!));
      }

      case 'business_analyst': {
        const items: NavItem[] = [
          createItem('my_work', 'Dashboard', 'LayoutDashboard', 'ops:my_work'),
          createItem('assigned_projects', 'Assigned Projects', 'Briefcase', 'ops:my_work'),
          createItem('biz_assessments', 'Business Assessments', 'BarChart3', 'ops:auditor'),
          createItem('tokenomics_review', 'Tokenomics Review', 'Coins', 'ops:auditor'),
          createItem('evidence', 'Evidence', 'FileText', 'ops:auditor'),
          createItem('findings', 'Findings', 'AlertTriangle', 'ops:auditor'),
          createItem('my_tasks', 'My Tasks', 'CheckCircle2', 'ops:my_work'),
          createItem('notifications', 'Notifications', 'Bell', 'ops:my_work'),
          createItem('wallet', 'Wallet', 'Coins', 'ops:wallet'),
          createItem('payroll', 'Payroll', 'CreditCard', 'ops:wallet'),
          createItem('profile', 'Profile', 'User', 'ops:my_work')
        ];
        return items.filter((item) => checkPermission(item.permissionKey!));
      }

      case 'sales': {
        const items: NavItem[] = [
          createItem('my_work', 'Dashboard', 'LayoutDashboard', 'ops:my_work'),
          createItem('customer_success', 'Customer Success & Automation', 'HeartPulse', 'ops:crm'),
          createItem('crm', 'CRM & Sales Pipeline', 'Users', 'ops:crm'),
          createItem('marketing_crm', 'Smart Marketing CRM', 'Sparkles', 'ops:marketing_crm'),
          createItem('proposals', 'Proposals & Quotes', 'FileText', 'action:sales_generate_proposal'),
          createItem('contacts', 'Client Contacts', 'Users', 'ops:crm'),
          createItem('my_tasks', 'My Tasks', 'CheckCircle2', 'ops:my_work'),
          createItem('notifications', 'Notifications', 'Bell', 'ops:my_work'),
          createItem('wallet', 'Wallet', 'Coins', 'ops:wallet'),
          createItem('payroll', 'Payroll', 'CreditCard', 'ops:wallet'),
          createItem('profile', 'Profile', 'User', 'ops:my_work')
        ];
        return items.filter((item) => checkPermission(item.permissionKey!));
      }

      case 'marketing': {
        const items: NavItem[] = [
          createItem('my_work', 'Dashboard', 'LayoutDashboard', 'ops:my_work'),
          createItem('customer_success', 'Customer Success & Automation', 'HeartPulse', 'ops:marketing_crm'),
          createItem('marketing_crm', 'Smart Marketing CRM', 'Sparkles', 'ops:marketing_crm'),
          createItem('crm', 'Lead Discovery & CRM', 'Users', 'ops:crm'),
          createItem('my_tasks', 'My Tasks', 'CheckCircle2', 'ops:my_work'),
          createItem('notifications', 'Notifications', 'Bell', 'ops:my_work'),
          createItem('wallet', 'Wallet', 'Coins', 'ops:wallet'),
          createItem('payroll', 'Payroll', 'CreditCard', 'ops:wallet'),
          createItem('profile', 'Profile', 'User', 'ops:my_work')
        ];
        return items.filter((item) => checkPermission(item.permissionKey!));
      }

      case 'pm': {
        const items: NavItem[] = [
          createItem('my_work', 'Dashboard', 'LayoutDashboard', 'ops:my_work'),
          createItem('customer_success', 'Customer Success & Automation', 'HeartPulse', 'ops:pm'),
          createItem('master_registry', 'Master Registry', 'Database', 'ops:master_registry'),
          createItem('command_center', 'Operations Command Center', 'Activity', 'ops:command_center'),
          createItem('pm', 'Project Management Hub', 'Briefcase', 'ops:pm'),
          createItem('intelligence_dashboard', 'Project Intelligence', 'BarChart3', 'ops:intelligence_dashboard'),
          createItem('ai_engine', 'AI Code & Contract Assessment', 'Code', 'ops:ai_engine'),
          createItem('knowledge_repository', 'Knowledge Repository', 'FileText', 'ops:knowledge_repository'),
          createItem('enterprise_reports', 'Enterprise Reports', 'FileText', 'ops:enterprise_reports'),
          createItem('audit_log', 'Digital Audit Logs', 'Lock', 'ops:audit_log'),
          createItem('my_tasks', 'My Tasks', 'CheckCircle2', 'ops:my_work'),
          createItem('notifications', 'Notifications', 'Bell', 'ops:my_work'),
          createItem('wallet', 'Wallet', 'Coins', 'ops:wallet'),
          createItem('payroll', 'Payroll', 'CreditCard', 'ops:wallet'),
          createItem('profile', 'Profile', 'User', 'ops:my_work')
        ];
        return items.filter((item) => checkPermission(item.permissionKey!));
      }

      case 'finance': {
        const items: NavItem[] = [
          createItem('my_work', 'Dashboard', 'LayoutDashboard', 'ops:my_work'),
          createItem('commercial_ops', 'Commercial & Financial Ops', 'DollarSign', 'ops:finance'),
          createItem('finance', 'Financial Escrow & Deposit Gate', 'CreditCard', 'ops:finance'),
          createItem('enterprise_reports', 'Enterprise Reports', 'FileText', 'ops:enterprise_reports'),
          createItem('audit_log', 'Audit Trail Logs', 'Lock', 'ops:audit_log'),
          createItem('my_tasks', 'My Tasks', 'CheckCircle2', 'ops:my_work'),
          createItem('notifications', 'Notifications', 'Bell', 'ops:my_work'),
          createItem('wallet', 'Wallet', 'Coins', 'ops:wallet'),
          createItem('payroll', 'Payroll', 'CreditCard', 'ops:wallet'),
          createItem('profile', 'Profile', 'User', 'ops:my_work')
        ];
        return items.filter((item) => checkPermission(item.permissionKey!));
      }

      case 'qa': {
        const items: NavItem[] = [
          createItem('my_work', 'Dashboard', 'LayoutDashboard', 'ops:my_work'),
          createItem('assigned_projects', 'Assigned Projects', 'Briefcase', 'ops:my_work'),
          createItem('auditor', 'QA Verification Workspace', 'CheckCircle2', 'ops:auditor'),
          createItem('evidence', 'Evidence Review', 'FileText', 'ops:auditor'),
          createItem('findings', 'Findings Sign-off', 'AlertTriangle', 'ops:auditor'),
          createItem('my_tasks', 'My Tasks', 'CheckCircle2', 'ops:my_work'),
          createItem('notifications', 'Notifications', 'Bell', 'ops:my_work'),
          createItem('wallet', 'Wallet', 'Coins', 'ops:wallet'),
          createItem('payroll', 'Payroll', 'CreditCard', 'ops:wallet'),
          createItem('profile', 'Profile', 'User', 'ops:my_work')
        ];
        return items.filter((item) => checkPermission(item.permissionKey!));
      }

      default: {
        const candidateItems: NavItem[] = [
          createItem('my_work', 'Dashboard', 'LayoutDashboard', 'ops:my_work'),
          createItem('commercial_ops', 'Commercial & Financial Ops', 'DollarSign', 'ops:finance'),
          createItem('customer_success', 'Customer Success & Automation', 'HeartPulse', 'ops:crm'),
          createItem('master_registry', 'Master Registry', 'Database', 'ops:master_registry'),
          createItem('command_center', 'Operations Command Center', 'Activity', 'ops:command_center'),
          createItem('marketing_crm', 'Smart Marketing CRM', 'Sparkles', 'ops:marketing_crm'),
          createItem('crm', 'CRM & Sales Pipeline', 'Users', 'ops:crm'),
          createItem('pm', 'Project Management Hub', 'Briefcase', 'ops:pm'),
          createItem('ai_engine', 'AI Code & Contract Assessment', 'Code', 'ops:ai_engine'),
          createItem('intelligence_dashboard', 'Project Intelligence Dashboard', 'BarChart3', 'ops:intelligence_dashboard'),
          createItem('knowledge_repository', 'Knowledge & Audit Repository', 'FileText', 'ops:knowledge_repository'),
          createItem('enterprise_reports', 'Enterprise Reports', 'FileText', 'ops:enterprise_reports'),
          createItem('auditor', 'Audit & Review Workspace', 'CheckCircle2', 'ops:auditor'),
          createItem('finance', 'Finance Release Gate', 'CreditCard', 'ops:finance'),
          createItem('wallet', 'Employee Payroll & Escrow Wallet', 'Coins', 'ops:wallet'),
          createItem('audit_log', 'Digital Audit Trail & Hashes', 'Lock', 'ops:audit_log')
        ];
        return candidateItems.filter((item) => checkPermission(item.permissionKey!));
      }
    }
  }

  /**
   * Dynamically generate Executive Platform tabs.
   */
  private static generateExecTabs(
    role: UserRole,
    checkPermission: (key: string) => boolean,
    currentPath: string
  ): NavItem[] {
    const candidateItems: NavItem[] = [
      { id: 'executive_intelligence', path: '/exec/executive_intelligence', label: 'Executive Intelligence & Ops Excellence', iconName: 'Activity', permissionKey: 'exec:bi', parentModule: 'exec', active: this.isItemActive('/exec/executive_intelligence', currentPath) },
      { id: 'bi', path: '/exec/bi', label: 'Financial BI & Analytics', iconName: 'BarChart3', permissionKey: 'exec:bi', parentModule: 'exec', active: this.isItemActive('/exec/bi', currentPath) },
      { id: 'commercial_ops_exec', path: '/exec/commercial_ops_exec', label: 'Commercial Operations Console', iconName: 'DollarSign', permissionKey: 'exec:bi', parentModule: 'exec', active: this.isItemActive('/exec/commercial_ops_exec', currentPath) },
      { id: 'customer_success_exec', path: '/exec/customer_success_exec', label: 'Executive Customer Success', iconName: 'HeartPulse', permissionKey: 'exec:bi', parentModule: 'exec', active: this.isItemActive('/exec/customer_success_exec', currentPath) },
      { id: 'company_wallet', path: '/exec/company_wallet', label: 'Company Treasury & P&L Wallet', iconName: 'Coins', permissionKey: 'exec:company_wallet', parentModule: 'exec', active: this.isItemActive('/exec/company_wallet', currentPath) },
      { id: 'ai_config', path: '/exec/ai_config', label: 'Enterprise AI Control Engine', iconName: 'Cpu', permissionKey: 'exec:ai_config', parentModule: 'exec', active: this.isItemActive('/exec/ai_config', currentPath) },
      { id: 'workforce', path: '/exec/workforce', label: 'Workforce & Talent Management', iconName: 'Users', permissionKey: 'exec:workforce', parentModule: 'exec', active: this.isItemActive('/exec/workforce', currentPath) },
      { id: 'sys_admin', path: '/exec/sys_admin', label: 'System Operating Mode', iconName: 'Settings', permissionKey: 'exec:sys_admin', parentModule: 'exec', active: this.isItemActive('/exec/sys_admin', currentPath) },
      { id: 'rbac_admin', path: '/exec/rbac_admin', label: 'RBAC & Permission Control Console', iconName: 'ShieldCheck', permissionKey: 'exec:rbac_admin', parentModule: 'exec', active: this.isItemActive('/exec/rbac_admin', currentPath) },
      { id: 'security_dashboard', path: '/exec/security_dashboard', label: 'Security & Hardening Dashboard', iconName: 'ShieldAlert', permissionKey: 'exec:rbac_admin', parentModule: 'exec', active: this.isItemActive('/exec/security_dashboard', currentPath) },
      { id: 'enterprise_release', path: '/exec/enterprise_release', label: 'Enterprise Release Candidate Console', iconName: 'ShieldCheck', permissionKey: 'exec:rbac_admin', parentModule: 'exec', active: this.isItemActive('/exec/enterprise_release', currentPath) },
      { id: 'multilingual', path: '/exec/multilingual', label: 'Multilingual Collaboration Console', iconName: 'Globe', permissionKey: 'exec:bi', parentModule: 'exec', active: this.isItemActive('/exec/multilingual', currentPath) }
    ];

    return candidateItems.filter((item) => checkPermission(item.permissionKey!));
  }

  /**
   * Dynamically generate Customer Portal tabs.
   */
  private static generateCustomerTabs(
    role: UserRole,
    checkPermission: (key: string) => boolean,
    currentPath: string
  ): NavItem[] {
    const candidateItems: NavItem[] = [
      { id: 'dashboard', path: '/customer/dashboard', label: 'Customer Dashboard', iconName: 'LayoutDashboard', permissionKey: 'customer:dashboard', parentModule: 'customer', active: this.isItemActive('/customer/dashboard', currentPath) },
      { id: 'c360', path: '/customer/c360', label: 'Customer 360 Profile', iconName: 'UserCheck', permissionKey: 'customer:dashboard', parentModule: 'customer', active: this.isItemActive('/customer/c360', currentPath) },
      { id: 'overview', path: '/customer/overview', label: 'Assessment Tracker', iconName: 'Clock', permissionKey: 'customer:dashboard', parentModule: 'customer', active: this.isItemActive('/customer/overview', currentPath) },
      { id: 'timeline', path: '/customer/timeline', label: 'Activity Timeline', iconName: 'Activity', permissionKey: 'customer:dashboard', parentModule: 'customer', active: this.isItemActive('/customer/timeline', currentPath) },
      { id: 'communication', path: '/customer/communication', label: 'Communication Center', iconName: 'MessageSquare', permissionKey: 'customer:messages', parentModule: 'customer', active: this.isItemActive('/customer/communication', currentPath) },
      { id: 'payments', path: '/customer/payments', label: 'Invoices & Payments', iconName: 'CreditCard', permissionKey: 'customer:final_payment', parentModule: 'customer', active: this.isItemActive('/customer/payments', currentPath) },
      { id: 'documents', path: '/customer/documents', label: 'Document Exchange', iconName: 'FileText', permissionKey: 'customer:dashboard', parentModule: 'customer', active: this.isItemActive('/customer/documents', currentPath) },
      { id: 'certificate', path: '/customer/certificate', label: 'Certificate & Seal', iconName: 'Award', permissionKey: 'customer:dashboard', parentModule: 'customer', active: this.isItemActive('/customer/certificate', currentPath) }
    ];

    return candidateItems.filter((item) => checkPermission(item.permissionKey!));
  }

  /**
   * Dynamically generate Public Portal tabs.
   */
  private static generatePublicTabs(currentPath: string): NavItem[] {
    const candidateItems: NavItem[] = [
      { id: 'home', path: '/public/home', label: 'Home', labelKey: 'public.home', iconName: 'Globe', parentModule: 'public', active: this.isItemActive('/public/home', currentPath) },
      { id: 'services', path: '/public/services', label: 'Services', labelKey: 'public.services', iconName: 'Briefcase', parentModule: 'public', active: this.isItemActive('/public/services', currentPath) },
      { id: 'methodology', path: '/public/methodology', label: 'Methodology', labelKey: 'public.methodology', iconName: 'ShieldCheck', parentModule: 'public', active: this.isItemActive('/public/methodology', currentPath) },
      { id: 'pricing', path: '/public/pricing', label: 'Pricing', labelKey: 'public.pricing', iconName: 'Coins', parentModule: 'public', active: this.isItemActive('/public/pricing', currentPath) },
      { id: 'registry', path: '/public/registry', label: 'Certified Registry', labelKey: 'public.registry', iconName: 'Database', parentModule: 'public', active: this.isItemActive('/public/registry', currentPath) },
      { id: 'verify', path: '/public/verify', label: 'Verify Certificate', labelKey: 'public.verify', iconName: 'CheckCircle2', parentModule: 'public', active: this.isItemActive('/public/verify', currentPath) },
      { id: 'whitepaper_repository', path: '/public/whitepaper_repository', label: 'Whitepaper Repository', labelKey: 'Whitepaper Repository', iconName: 'FileText', parentModule: 'public', active: this.isItemActive('/public/whitepaper_repository', currentPath) },
      { id: 'resources', path: '/public/resources', label: 'Resources', labelKey: 'public.resources', iconName: 'FileText', parentModule: 'public', active: this.isItemActive('/public/resources', currentPath) },
      { id: 'apply', path: '/public/apply', label: 'Apply for Certification', labelKey: 'public.apply', iconName: 'Sparkles', parentModule: 'public', active: this.isItemActive('/public/apply', currentPath) },
      { id: 'join_team', path: '/public/join_team', label: 'Join Auditor Network', labelKey: 'public.joinTeam', iconName: 'Users', parentModule: 'public', active: this.isItemActive('/public/join_team', currentPath) }
    ];

    return candidateItems;
  }
}

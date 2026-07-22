import { Language } from '../types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    'app.title': 'HalalChain™',
    'app.tagline': 'Where Blockchain Meets Sharia',
    'nav.public': 'Public Website',
    'nav.customer': 'Customer Portal',
    'nav.ops': 'Operations Platform',
    'nav.exec': 'Executive Platform',
    'lang.en': 'English',
    'lang.ar': 'العربية',

    // Public Pages Nav
    'public.home': 'Home',
    'public.services': 'Services',
    'public.methodology': 'Methodology',
    'public.pricing': 'Pricing',
    'public.registry': 'Halal Registry',
    'public.verify': 'Verify Certificate',
    'public.resources': 'Research & Blog',
    'public.apply': 'Apply Now',

    // Hero Section
    'hero.badge': 'Global Independent Sharia Certification Authority for Web3',
    'hero.headline': 'Bringing Absolute Sharia Transparency to Blockchain & Cryptocurrencies',
    'hero.subtext': 'HalalChain provides independent technical, business, AI-assisted and scholar-approved Sharia certification for crypto projects, smart contracts, and Web3 protocols worldwide.',
    'hero.btn.apply': 'Apply for Certification',
    'hero.btn.verify': 'Verify Certificate',
    'hero.btn.registry': 'Browse Certified Web3 Registry',

    // Key Stats
    'stats.projects': 'Certified Web3 Projects',
    'stats.tvl': 'Total Value Screened',
    'stats.scholars': 'Senior Sharia Scholars',
    'stats.countries': 'Global Jurisdictions',

    // Services
    'services.title': 'Enterprise Sharia & Technical Services',
    'services.subtitle': 'Comprehensive end-to-end evaluation designed for crypto ecosystems, tokens, and Web3 protocols.',

    // Registry
    'registry.title': 'Public Halal Web3 Registry',
    'registry.subtitle': 'Transparent, searchable directory of Sharia-certified cryptocurrencies and smart contract protocols.',
    'registry.searchPlaceholder': 'Search by token name, symbol, blockchain or certificate number...',
    'registry.filterCategory': 'All Categories',
    'registry.filterStatus': 'All Statuses',

    // Verification
    'verify.title': 'Certificate Verification Portal',
    'verify.subtitle': 'Enter a certificate number or hash to instantly check authenticity on the HalalChain blockchain ledger.',
    'verify.placeholder': 'e.g. HC-CERT-2026-8801',
    'verify.button': 'Verify Authenticity',

    // Customer Portal
    'cust.welcome': 'Customer Certification Portal',
    'cust.myApps': 'My Certification Projects',
    'cust.newApp': 'Submit New Application',
    'cust.stage': 'Current Stage',
    'cust.eta': 'Target Completion',
    'cust.invoices': 'Invoices & Payments',
    'cust.clarifications': 'Clarification Requests',
    'cust.downloadCert': 'Download Certificate (PDF)',
    'cust.payDeposit': 'Pay Deposit Invoice',
    'cust.payFinal': 'Pay Final Invoice',

    // Operations Platform
    'ops.title': 'HalalChain Operations Operating System',
    'ops.roleSelector': 'Switch Employee Role:',
    'ops.crm': 'CRM & Sales Pipeline',
    'ops.pm': 'Project Manager Hub',
    'ops.aiEngine': 'AI Automated Assessment',
    'ops.auditor': 'Auditor Workspace',
    'ops.scholar': 'Scholar Review Panel',
    'ops.qa': 'Quality Assurance',
    'ops.finance': 'Finance & Invoicing',
    'ops.auditLog': 'Permanent Audit Trail',

    // Executive Platform
    'exec.title': 'Executive Management & BI Platform',
    'exec.revenue': 'Monthly Revenue',
    'exec.profit': 'Gross Profit Margin',
    'exec.sla': 'SLA Compliance Rate',
    'exec.csat': 'Customer Satisfaction (CSAT)',
    'exec.aiService': 'Centralized AI Infrastructure Layer',
    'exec.workforce': 'Global Remote Workforce',
    'exec.sysAdmin': 'System Administration & Configuration',

    // Sharia Statement
    'sharia.disclaimer': 'HalalChain provides technical and Sharia compliance assessments based on documented evidence. HalalChain does not issue fatwas.'
  },
  ar: {
    // Brand & Header
    'app.title': 'حلال تشين™',
    'app.tagline': 'حيث يلتقي البلوكشين بالشريعة',
    'nav.public': 'الموقع الإلكتروني',
    'nav.customer': 'بوابة العملاء',
    'nav.ops': 'منصة العمليات',
    'nav.exec': 'المنصة التنفيذية',
    'lang.en': 'English',
    'lang.ar': 'العربية',

    // Public Pages Nav
    'public.home': 'الرئيسية',
    'public.services': 'الخدمات',
    'public.methodology': 'المنهجية',
    'public.pricing': 'الأسعار',
    'public.registry': 'السجل الشرعي',
    'public.verify': 'التحقق من الشهادة',
    'public.resources': 'الأبحاث والمدونة',
    'public.apply': 'تقديم طلب',

    // Hero Section
    'hero.badge': 'الهيئة العالمية المستقلة لشهادات الشريعة للويب 3',
    'hero.headline': 'إرساء الشفافية الشرعية المطلقة لتقنيات البلوكشين والعملات المشفرة',
    'hero.subtext': 'تقدم حلال تشين تقييماً فنياً وتجارياً ومساعداً بالذكاء الاصطناعي معتمدًا من علماء الشريعة لمشاريع العملات الرقمية والعقود الذكية وبروتوكولات الويب 3 حول العالم.',
    'hero.btn.apply': 'قدم طلب اعتماد الآن',
    'hero.btn.verify': 'التحقق من شهادة',
    'hero.btn.registry': 'تصفح السجل الشرعي المعتمد',

    // Key Stats
    'stats.projects': 'مشروع ويب 3 معتمد',
    'stats.tvl': 'قيمة الأصول المفحوصة',
    'stats.scholars': 'كبار علماء الشريعة',
    'stats.countries': 'دول ونطاقات عالمية',

    // Services
    'services.title': 'الخدمات الشرعية والفنية للمؤسسات',
    'services.subtitle': 'تقييم شامل ومتكامل مصمم خصيصاً لأنظمة العملات الرقمية والرموز وبروتوكولات الويب 3.',

    // Registry
    'registry.title': 'السجل العام للمشاريع المعتمدة شرعياً',
    'registry.subtitle': 'دليل شفاف وقابل للبحث للعملات الرقمية وبروتوكولات العقود الذكية المعتمدة شرعياً.',
    'registry.searchPlaceholder': 'ابحث باسم الرمز، الشعار، البلوكشين أو رقم الشهادة...',
    'registry.filterCategory': 'جميع التصنيفات',
    'registry.filterStatus': 'جميع الحالات',

    // Verification
    'verify.title': 'بوابة التحقق من صحة الشهادات',
    'verify.subtitle': 'أدخل رقم الشهادة أو التوقيع الرقمي للتحقق الفوري من صحتها على دفتر حلال تشين.',
    'verify.placeholder': 'مثال: HC-CERT-2026-8801',
    'verify.button': 'تحقق من الموثوقية',

    // Customer Portal
    'cust.welcome': 'بوابة اعتماد العملاء',
    'cust.myApps': 'مشاريع الاعتماد الخاصة بي',
    'cust.newApp': 'تقديم طلب جديد',
    'cust.stage': 'المرحلة الحالية',
    'cust.eta': 'التاريخ المتوقع للإنجاز',
    'cust.invoices': 'الفواتير والمدفوعات',
    'cust.clarifications': 'طلبات الاستيضاح',
    'cust.downloadCert': 'تحميل الشهادة (PDF)',
    'cust.payDeposit': 'دفع فاتورة العربون',
    'cust.payFinal': 'دفع الفاتورة النهائية',

    // Operations Platform
    'ops.title': 'نظام إدارة عمليات حلال تشين',
    'ops.roleSelector': 'تغيير دور الموظف:',
    'ops.crm': 'إدارة العلاقات والمبيعات',
    'ops.pm': 'مركز إدارة المشاريع',
    'ops.aiEngine': 'التقييم الآلي بالذكاء الاصطناعي',
    'ops.auditor': 'مساحة عمل المدقق الفني',
    'ops.scholar': 'لوحة مراجعة المستشار الشرعي',
    'ops.qa': 'ضمان الجودة والرقابة',
    'ops.finance': 'المالية والفواتير',
    'ops.auditLog': 'سجل التدقيق الدائم',

    // Executive Platform
    'exec.title': 'المنصة التنفيذية وذكاء الأعمال',
    'exec.revenue': 'الإيرادات الشهرية',
    'exec.profit': 'هامش الربح الإجمالي',
    'exec.sla': 'معدل الالتزام باتفاقية الخدمة',
    'exec.csat': 'معدل رضا العملاء',
    'exec.aiService': 'طبقة البنية التحتية للذكاء الاصطناعي المركزي',
    'exec.workforce': 'القوى العاملة العالمية عن بُعد',
    'exec.sysAdmin': 'إدارة النظام والتهيئات',

    // Sharia Statement
    'sharia.disclaimer': 'تقدم حلال تشين تقييمات الامتثال الفني والشرعي بناءً على الأدلة الموثقة. ولا تصدر حلال تشين فتاوى شرعية.'
  }
};

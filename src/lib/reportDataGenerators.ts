import { ReportExportOptions, ReportSection } from './reportEngine';

export interface ReportDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
}

export const ENTERPRISE_REPORT_DEFINITIONS: ReportDefinition[] = [
  {
    id: 'executive_summary',
    title: 'Executive Summary Report',
    category: 'Executive & Board',
    description: 'High-level executive overview across project status, total revenue, assessment SLAs, team performance, certificate metrics, and pending risk factors.'
  },
  {
    id: 'project_operations',
    title: 'Project Operations Report',
    category: 'Operations',
    description: 'Operational tracking of active, completed, and delayed projects, reviewer team assignments, workflow bottlenecks, and estimated SLA completion dates.'
  },
  {
    id: 'marketing_performance',
    title: 'Marketing Performance Report',
    category: 'Marketing & Outreach',
    description: 'Outreach campaign yields, email delivery & response rates, lead acquisition channels, CoinMarketCap targeting, and regional market analysis.'
  },
  {
    id: 'sales_pipeline',
    title: 'Sales Pipeline Report',
    category: 'Sales & BD',
    description: 'Pipeline opportunities, prospect qualification, proposal conversion rates, quarterly revenue forecasts, and scheduled follow-up activities.'
  },
  {
    id: 'finance',
    title: 'Finance & Treasury Report',
    category: 'Financials',
    description: 'Revenue collections, auditor payroll disbursals, treasury escrow wallet activity, recurring subscription income, and outstanding payment aging.'
  },
  {
    id: 'technical_assessment',
    title: 'Technical Assessment Report',
    category: 'Audit & Tech',
    description: 'Smart contract bytecode reviews, whitepaper technical verification, AI confidence scores, critical CVE vulnerabilities, and security risks.'
  },
  {
    id: 'business_assessment',
    title: 'Business Assessment Report',
    category: 'Audit & Biz',
    description: 'Tokenomics supply mechanics, governance multi-sig controls, business model findings, and public transparency audit metrics.'
  },
  {
    id: 'sharia_assessment',
    title: 'Sharia Assessment Report',
    category: 'Sharia Governance',
    description: 'Scholar board fatwa rulings, AAOIFI standard references, asset compliance classification, open clarification logs, and final scholar opinions.'
  },
  {
    id: 'qa_report',
    title: 'Quality Assurance (QA) Report',
    category: 'Quality Assurance',
    description: 'QA review queues, approved audit reports, returned revision cases, defect root-cause breakdown, and reviewer consistency metrics.'
  },
  {
    id: 'certificate_registry',
    title: 'Certificate Registry Report',
    category: 'Registry & Legal',
    description: 'Active issued certificates, annual renewal forecasts, expiring watchlists, on-chain hash verifications, and registry health statistics.'
  },
  {
    id: 'crm_report',
    title: 'CRM & Customer Intelligence Report',
    category: 'CRM & Accounts',
    description: 'Customer directory, lead stages, contact completion metrics, executive meeting logs, and complete customer communication history.'
  }
];

export interface ReportKPI {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  badge?: string;
  badgeColor?: string;
}

export interface ReportTableColumn {
  header: string;
  key: string;
  width?: string;
}

export interface ReportTable {
  title: string;
  columns: ReportTableColumn[];
  rows: Array<Record<string, any>>;
}

export interface ReportChartData {
  title: string;
  type: 'bar' | 'pie' | 'funnel' | 'progress';
  items: Array<{ label: string; value: number; color?: string; total?: number }>;
}

export interface DedicatedReportData {
  id: string;
  reportTitle: string;
  reportSubtitle: string;
  reportNumber: string;
  period: string;
  generatedBy: string;
  kpis: ReportKPI[];
  charts: ReportChartData[];
  tables: ReportTable[];
  recommendations: string[];
  summaryMetrics: Array<{ label: string; value: string | number }>;
  exportOptions: ReportExportOptions;
}

export function generateDedicatedReportData(
  reportId: string,
  period: string = 'Q3 2026',
  searchTerm: string = ''
): DedicatedReportData {
  const reportNo = `HC-RPT-${reportId.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toISOString().split('T')[0];

  switch (reportId) {
    // ----------------------------------------------------
    // 1. EXECUTIVE SUMMARY REPORT
    // ----------------------------------------------------
    case 'executive_summary': {
      const kpis: ReportKPI[] = [
        { label: 'Total Audited Projects', value: '142', change: '+18%', trend: 'up', badge: 'Active Pipeline', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Active In-Progress', value: '28', change: '2.1d Avg SLA', trend: 'neutral', badge: 'On Track', badgeColor: 'bg-blue-100 text-blue-800' },
        { label: 'Certified Compliant', value: '98', change: '96.5% Pass Rate', trend: 'up', badge: 'Registry Active', badgeColor: 'bg-indigo-100 text-indigo-800' },
        { label: 'Total Gross Revenue', value: '$1,840,000', change: '+24% YoY', trend: 'up', badge: 'Target Met', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'CSAT Rating', value: '98.4%', change: 'Top Tier', trend: 'up', badge: 'Excellence', badgeColor: 'bg-amber-100 text-amber-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'Projects by Workflow Status',
          type: 'bar',
          items: [
            { label: 'Published Registry', value: 98, color: '#059669' },
            { label: 'Quality Assurance (QA)', value: 12, color: '#3B82F6' },
            { label: 'Technical Review', value: 10, color: '#6366F1' },
            { label: 'Sharia Board Audit', value: 6, color: '#D97706' },
            { label: 'Application Intake', value: 16, color: '#64748B' }
          ]
        },
        {
          title: 'Revenue Stream Distribution',
          type: 'pie',
          items: [
            { label: 'Initial Certification Fees', value: 1200000, color: '#059669' },
            { label: 'Annual Re-Audit Renewals', value: 340000, color: '#3B82F6' },
            { label: 'Sharia Advisory Services', value: 300000, color: '#D97706' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'Executive Portfolio Summary',
          columns: [
            { header: 'Project / Entity', key: 'project' },
            { header: 'Asset Type', key: 'type' },
            { header: 'Workflow Stage', key: 'stage' },
            { header: 'Revenue (USD)', key: 'revenue' },
            { header: 'Evidence Findings Status', key: 'risk' },
            { header: 'Target Completion', key: 'target' }
          ],
          rows: [
            { project: 'Islamic Coin (ISLM)', type: 'L1 Blockchain', stage: 'Certified', revenue: '$85,000', risk: '0 Critical Findings (Resolved)', target: 'Completed' },
            { project: 'HAQQ Network', type: 'Proof of Stake Network', stage: 'Certified', revenue: '$120,000', risk: '0 Critical Findings (Resolved)', target: 'Completed' },
            { project: 'Gold Sukuk Token', type: 'RWA Tokenized Gold', stage: 'Sharia Board Audit', revenue: '$65,000', risk: '1 Medium Finding (In Review)', target: '2026-08-15' },
            { project: 'Takaful DeFi Liquidity', type: 'DeFi Insurance', stage: 'Technical Review', revenue: '$45,000', risk: '0 Critical Findings (In Review)', target: '2026-08-20' },
            { project: 'HalalPay Remittance', type: 'Stablecoin Payment', stage: 'QA Review', revenue: '$55,000', risk: '0 Critical Findings (In Verification)', target: '2026-08-10' }
          ]
        }
      ];

      const recommendations = [
        'Maintain aggressive 3.5-day average SLA threshold across Sharia Board reviews.',
        'Expand marketing outreach in Southeast Asia (Malaysia & Indonesia) to capture surging RWA tokenization demand.',
        'Enforce mandatory automated bytecode verification prior to scholar panel scheduling.'
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. Executive Performance Metrics',
          keyValuePairs: [
            { label: 'Reporting Period', value: period },
            { label: 'Total Audited Portfolio', value: '142 Projects' },
            { label: 'Total Revenue YTD', value: '$1,840,000' },
            { label: 'Client Retention CSAT', value: '98.4%' }
          ]
        },
        {
          title: '2. Portfolio Breakdown Table',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: reportId,
        reportTitle: 'EXECUTIVE SUMMARY REPORT',
        reportSubtitle: 'Executive Board & Management Performance Intelligence Audit',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain Executive AI Analytics Engine',
        kpis,
        charts,
        tables,
        recommendations,
        summaryMetrics: [
          { label: 'Audited Projects', value: 142 },
          { label: 'Gross Revenue', value: '$1.84M' },
          { label: 'Overall Pass Rate', value: '96.5%' }
        ],
        exportOptions: {
          reportTitle: 'EXECUTIVE SUMMARY REPORT',
          reportSubtitle: 'Executive Board & Management Performance Intelligence Audit',
          reportNumber: reportNo,
          generatedBy: 'HalalChain Executive AI Analytics Engine',
          format: 'PDF',
          sections: exportSections
        }
      };
    }

    // ----------------------------------------------------
    // 2. PROJECT OPERATIONS REPORT
    // ----------------------------------------------------
    case 'project_operations': {
      const kpis: ReportKPI[] = [
        { label: 'Active Projects', value: '28', change: 'Operational', trend: 'neutral', badge: 'In Flight', badgeColor: 'bg-blue-100 text-blue-800' },
        { label: 'Completed This Month', value: '14', change: '+25%', trend: 'up', badge: 'SLA Exceeded', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Delayed / At-Risk', value: '3', change: '-40%', trend: 'down', badge: 'Requires Action', badgeColor: 'bg-rose-100 text-rose-800' },
        { label: 'Avg Turnaround SLA', value: '3.8 Days', change: 'Target < 5d', trend: 'up', badge: 'Fast Track', badgeColor: 'bg-indigo-100 text-indigo-800' },
        { label: 'Reviewers Assigned', value: '18', change: '85% Capacity', trend: 'neutral', badge: 'Balanced', badgeColor: 'bg-slate-100 text-slate-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'Workflow SLA Bottleneck Analysis (Days)',
          type: 'bar',
          items: [
            { label: 'Technical Review', value: 1.8, color: '#3B82F6' },
            { label: 'Sharia Board Review', value: 2.1, color: '#D97706' },
            { label: 'QA Verification', value: 0.9, color: '#059669' },
            { label: 'Certificate Minting', value: 0.3, color: '#8B5CF6' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'Active Operations & Team Assignments',
          columns: [
            { header: 'Project ID', key: 'id' },
            { header: 'Company / Project', key: 'name' },
            { header: 'Workflow Stage', key: 'stage' },
            { header: 'Assigned Reviewer', key: 'reviewer' },
            { header: 'Days in Stage', key: 'days' },
            { header: 'Estimated Completion', key: 'eta' }
          ],
          rows: [
            { id: 'HC-2026-081', name: 'Gold Sukuk Token', stage: 'Sharia Board Audit', reviewer: 'Sheikh Ahmad Al-Ghamdi', days: '2.1 Days', eta: '2026-08-08' },
            { id: 'HC-2026-084', name: 'Takaful DeFi Liquidity', stage: 'Technical Review', reviewer: 'Dr. Tariq Al-Hashimi', days: '1.4 Days', eta: '2026-08-10' },
            { id: 'HC-2026-089', name: 'HalalPay Remittance', stage: 'QA Review', reviewer: 'Mustafa Chen', days: '0.8 Days', eta: '2026-08-05' },
            { id: 'HC-2026-092', name: 'Baraka Yield Token', stage: 'Application Intake', reviewer: 'Fatima Al-Zahra', days: '0.2 Days', eta: '2026-08-14' },
            { id: 'HC-2026-078', name: 'Zakat Protocol DAO', stage: 'Sharia Board Audit', reviewer: 'Dr. Bilal Philips', days: '4.5 Days (Delayed)', eta: '2026-08-06' }
          ]
        }
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. Operations Overview',
          keyValuePairs: [
            { label: 'Active Projects', value: 28 },
            { label: 'Completed Projects', value: 14 },
            { label: 'Delayed Projects', value: 3 },
            { label: 'Average SLA Turnaround', value: '3.8 Days' }
          ]
        },
        {
          title: '2. Active Operations Roster',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: reportId,
        reportTitle: 'PROJECT OPERATIONS REPORT',
        reportSubtitle: 'Operational Capacity, SLA Turnaround & Reviewer Workload',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain Operations Control Unit',
        kpis,
        charts,
        tables,
        recommendations: [
          'Reallocate delayed Zakat Protocol DAO files to secondary Sharia scholar to unblock bottleneck.',
          'Automate smart contract compiler version checks during initial intake.'
        ],
        summaryMetrics: [
          { label: 'Active Projects', value: 28 },
          { label: 'Avg SLA Speed', value: '3.8 Days' },
          { label: 'Reviewer Capacity', value: '85%' }
        ],
        exportOptions: {
          reportTitle: 'PROJECT OPERATIONS REPORT',
          reportSubtitle: 'Operational Capacity, SLA Turnaround & Reviewer Workload',
          reportNumber: reportNo,
          generatedBy: 'HalalChain Operations Control Unit',
          format: 'PDF',
          sections: exportSections
        }
      };
    }

    // ----------------------------------------------------
    // 3. MARKETING PERFORMANCE REPORT
    // ----------------------------------------------------
    case 'marketing_performance': {
      const kpis: ReportKPI[] = [
        { label: 'Target Prospects', value: '342', change: '+42 this month', trend: 'up', badge: 'High Priority', badgeColor: 'bg-indigo-100 text-indigo-800' },
        { label: 'Email Open Rate', value: '68.4%', change: '+12.1% vs avg', trend: 'up', badge: 'Top Performance', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Outreach Response Rate', value: '34.2%', change: '+8.5%', trend: 'up', badge: 'High Engagement', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Customer Conversion', value: '42 Projects', change: '35.6% Yield', trend: 'up', badge: 'Closed Won', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'CMC Outreach Qualified', value: '118', change: 'Top 500 Market Cap', trend: 'neutral', badge: 'Verified BD', badgeColor: 'bg-amber-100 text-amber-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'Outreach Channel Conversion Yield',
          type: 'bar',
          items: [
            { label: 'CoinMarketCap BD Outreach', value: 48, color: '#3B82F6' },
            { label: 'Direct Referral & Inbound', value: 32, color: '#059669' },
            { label: 'Islamic Fintech Summits', value: 14, color: '#D97706' },
            { label: 'X (Twitter) Organic BD', value: 6, color: '#8B5CF6' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'Campaign Results & Email Outreach Statistics',
          columns: [
            { header: 'Campaign Name', key: 'campaign' },
            { header: 'Target Segment', key: 'segment' },
            { header: 'Sent Count', key: 'sent' },
            { header: 'Open Rate', key: 'open' },
            { header: 'Response Rate', key: 'response' },
            { header: 'Conversions', key: 'conversions' }
          ],
          rows: [
            { campaign: 'Q3 CMC Top 500 Outreach', segment: 'CoinMarketCap Listed Tokens', sent: '180', open: '72.1%', response: '38.4%', conversions: '24' },
            { campaign: 'RWA & Sukuk Tokenization Summit', segment: 'Tokenized Asset Issuers', sent: '65', open: '81.5%', response: '46.2%', conversions: '12' },
            { campaign: 'DeFi & Staking Protocol Invitation', segment: 'Liquidity & Yield Platforms', sent: '95', open: '58.9%', response: '22.1%', conversions: '6' }
          ]
        }
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. Marketing Outreach Performance',
          keyValuePairs: [
            { label: 'Total Prospects', value: 342 },
            { label: 'Email Open Rate', value: '68.4%' },
            { label: 'Response Rate', value: '34.2%' },
            { label: 'Acquired Customers', value: 42 }
          ]
        },
        {
          title: '2. Campaign Analytics Table',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: reportId,
        reportTitle: 'MARKETING PERFORMANCE REPORT',
        reportSubtitle: 'Outreach Campaign Yields, Email Analytics & Prospect Acquisition',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain Marketing Intelligence Unit',
        kpis,
        charts,
        tables,
        recommendations: [
          'Scale up automated 7-day follow-up outreach for CMC Top 500 prospects.',
          'Add localized Arabic email templates for Gulf cooperation council prospects.'
        ],
        summaryMetrics: [
          { label: 'Total Prospects', value: 342 },
          { label: 'Open Rate', value: '68.4%' },
          { label: 'Acquired Clients', value: 42 }
        ],
        exportOptions: {
          reportTitle: 'MARKETING PERFORMANCE REPORT',
          reportSubtitle: 'Outreach Campaign Yields, Email Analytics & Prospect Acquisition',
          reportNumber: reportNo,
          generatedBy: 'HalalChain Marketing Intelligence Unit',
          format: 'PDF',
          sections: exportSections
        }
      };
    }

    // ----------------------------------------------------
    // 4. SALES PIPELINE REPORT
    // ----------------------------------------------------
    case 'sales_pipeline': {
      const kpis: ReportKPI[] = [
        { label: 'Pipeline Opportunity Value', value: '$3,420,000', change: '+32% QoQ', trend: 'up', badge: 'High Value', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Qualified Prospects', value: '86', change: '+14', trend: 'up', badge: 'Vetted', badgeColor: 'bg-blue-100 text-blue-800' },
        { label: 'Proposals Outstanding', value: '24', change: '$780k Value', trend: 'neutral', badge: 'Closing Soon', badgeColor: 'bg-amber-100 text-amber-800' },
        { label: 'Lead Conversion Rate', value: '38.5%', change: 'Industry Top', trend: 'up', badge: 'Strong Yield', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Avg Deal Size', value: '$28,500', change: 'Enterprise Tier', trend: 'up', badge: 'Premium', badgeColor: 'bg-indigo-100 text-indigo-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'Sales Conversion Funnel (Prospects)',
          type: 'funnel',
          items: [
            { label: 'Identified Leads', value: 342, color: '#64748B' },
            { label: 'Qualified Opportunities', value: 142, color: '#3B82F6' },
            { label: 'Proposal Sent', value: 68, color: '#D97706' },
            { label: 'Closed Won Certified', value: 42, color: '#059669' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'Active Deal Pipeline & Forecast',
          columns: [
            { header: 'Opportunity Name', key: 'name' },
            { header: 'Package Tier', key: 'tier' },
            { header: 'Deal Value', key: 'val' },
            { header: 'Stage', key: 'stage' },
            { header: 'Win Probability', key: 'probability' },
            { header: 'Assigned Sales Rep', key: 'rep' }
          ],
          rows: [
            { name: 'RWA Oasis Sukuk', tier: 'Enterprise', val: '$85,000', stage: 'Proposal Sent', probability: '85%', rep: 'Youssef Al-Mansoor' },
            { name: 'Crescent Pay L2', tier: 'Professional', val: '$35,000', stage: 'Negotiation', probability: '75%', rep: 'Amira Hassan' },
            { name: 'Baraka Staking Vaults', tier: 'Professional', val: '$28,000', stage: 'Initial Meeting', probability: '50%', rep: 'Omar Farooq' },
            { name: 'Halal DEX Protocol', tier: 'Enterprise', val: '$65,000', stage: 'Audit Agreed', probability: '90%', rep: 'Youssef Al-Mansoor' }
          ]
        }
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. Pipeline Overview',
          keyValuePairs: [
            { label: 'Total Value', value: '$3,420,000' },
            { label: 'Qualified Opportunities', value: 86 },
            { label: 'Conversion Rate', value: '38.5%' }
          ]
        },
        {
          title: '2. Deal Pipeline Register',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: reportId,
        reportTitle: 'SALES PIPELINE REPORT',
        reportSubtitle: 'Opportunity Forecast, Proposal Conversions & Revenue Yield',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain Business Development Unit',
        kpis,
        charts,
        tables,
        recommendations: [
          'Prioritize closing the $85,000 Enterprise RWA Sukuk lead before quarter end.',
          'Offer fast-track audit options for high-market-cap DEX candidates.'
        ],
        summaryMetrics: [
          { label: 'Pipeline Value', value: '$3.42M' },
          { label: 'Active Opportunities', value: 86 },
          { label: 'Conversion Speed', value: '12 Days' }
        ],
        exportOptions: {
          reportTitle: 'SALES PIPELINE REPORT',
          reportSubtitle: 'Opportunity Forecast, Proposal Conversions & Revenue Yield',
          reportNumber: reportNo,
          generatedBy: 'HalalChain Business Development Unit',
          format: 'PDF',
          sections: exportSections
        }
      };
    }

    // ----------------------------------------------------
    // 5. FINANCE REPORT
    // ----------------------------------------------------
    case 'finance': {
      const kpis: ReportKPI[] = [
        { label: 'Gross Revenue YTD', value: '$2,450,000', change: '+28% YoY', trend: 'up', badge: 'Audited', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Operating Expenses', value: '$820,000', change: '33.4% Cost Ratio', trend: 'neutral', badge: 'Controlled', badgeColor: 'bg-slate-100 text-slate-800' },
        { label: 'Net Operating Profit', value: '$1,630,000', change: '66.5% Margin', trend: 'up', badge: 'High Profit', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Treasury Escrow Reserve', value: '$450,000', change: 'USDT / USDC', trend: 'up', badge: 'On-Chain Vault', badgeColor: 'bg-indigo-100 text-indigo-800' },
        { label: 'Outstanding Receivables', value: '$145,000', change: '< 15d Aging', trend: 'down', badge: 'Low Risk', badgeColor: 'bg-blue-100 text-blue-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'Monthly Revenue vs Expenses ($)',
          type: 'bar',
          items: [
            { label: 'May 2026 Revenue', value: 380000, color: '#059669' },
            { label: 'May 2026 Expenses', value: 120000, color: '#E11D48' },
            { label: 'Jun 2026 Revenue', value: 420000, color: '#059669' },
            { label: 'Jun 2026 Expenses', value: 135000, color: '#E11D48' },
            { label: 'Jul 2026 Revenue', value: 490000, color: '#059669' },
            { label: 'Jul 2026 Expenses', value: 140000, color: '#E11D48' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'Treasury Wallet Activity & Disbursal Ledger',
          columns: [
            { header: 'Tx Hash / Ref', key: 'tx' },
            { header: 'Category', key: 'category' },
            { header: 'Party / Client', key: 'party' },
            { header: 'Amount (USD)', key: 'amount' },
            { header: 'Payment Method', key: 'method' },
            { header: 'Status', key: 'status' }
          ],
          rows: [
            { tx: 'TX-0x9a8b1c', category: 'Audit Deposit Fee', party: 'HAQQ Network', amount: '+$60,000', method: 'USDT (ERC-20)', status: 'Settled' },
            { tx: 'TX-0x8f7e6d', category: 'Auditor Disbursal', party: 'Dr. Tariq Al-Hashimi', amount: '-$12,500', method: 'Bank Transfer', status: 'Settled' },
            { tx: 'TX-0x5c4b3a', category: 'Renewal Subscription', party: 'Islamic Coin', amount: '+$35,000', method: 'USDC (Native)', status: 'Settled' },
            { tx: 'TX-0x2d1e0f', category: 'Scholar Honorarium', party: 'Sharia Board Panel', amount: '-$18,000', method: 'Wire Transfer', status: 'Settled' }
          ]
        }
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. Financial Summary',
          keyValuePairs: [
            { label: 'Gross Revenue YTD', value: '$2,450,000' },
            { label: 'Operating Expenses', value: '$820,000' },
            { label: 'Net Profit', value: '$1,630,000' },
            { label: 'Escrow Reserve', value: '$450,000' }
          ]
        },
        {
          title: '2. Wallet Ledger Transactions',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: reportId,
        reportTitle: 'FINANCE & TREASURY REPORT',
        reportSubtitle: 'Revenue Collections, Auditor Disbursals & Escrow Wallet Audit',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain Treasury Operations',
        kpis,
        charts,
        tables,
        recommendations: [
          'Maintain 20% liquid USDT reserve in multi-sig vault for scholar payouts.',
          'Automate instant receipt issuing upon smart contract deposit confirmation.'
        ],
        summaryMetrics: [
          { label: 'YTD Revenue', value: '$2.45M' },
          { label: 'Net Margin', value: '66.5%' },
          { label: 'Escrow Vault', value: '$450k' }
        ],
        exportOptions: {
          reportTitle: 'FINANCE & TREASURY REPORT',
          reportSubtitle: 'Revenue Collections, Auditor Disbursals & Escrow Wallet Audit',
          reportNumber: reportNo,
          generatedBy: 'HalalChain Treasury Operations',
          format: 'PDF',
          sections: exportSections
        }
      };
    }

    // ----------------------------------------------------
    // 6. TECHNICAL ASSESSMENT REPORT
    // ----------------------------------------------------
    case 'technical_assessment': {
      const kpis: ReportKPI[] = [
        { label: 'Smart Contracts Audited', value: '114', change: '100% Bytecode Verified', trend: 'up', badge: 'Verified', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Critical CVE Identified', value: '18', change: '100% Remediated', trend: 'down', badge: 'Zero Unpatched', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Whitepaper Tech Score', value: '94.2%', change: '+3.1%', trend: 'up', badge: 'High Quality', badgeColor: 'bg-indigo-100 text-indigo-800' },
        { label: 'AI Extraction Confidence', value: '96.8%', change: 'Gemini Flash AI', trend: 'up', badge: 'High Precision', badgeColor: 'bg-blue-100 text-blue-800' },
        { label: 'Security Risk Level', value: 'LOW RISK', change: 'Verified', trend: 'neutral', badge: 'Secure', badgeColor: 'bg-emerald-100 text-emerald-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'Vulnerability Severity Distribution',
          type: 'pie',
          items: [
            { label: 'Low Severity Findings', value: 68, color: '#059669' },
            { label: 'Medium Risk Warnings', value: 24, color: '#D97706' },
            { label: 'Critical Remediated Vulnerabilities', value: 18, color: '#E11D48' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'Smart Contract Reviews & Security Findings',
          columns: [
            { header: 'Project / Token', key: 'project' },
            { header: 'Contract Address', key: 'address' },
            { header: 'Lines of Code', key: 'loc' },
            { header: 'Reentrancy Check', key: 'reentrancy' },
            { header: 'Access Control', key: 'access' },
            { header: 'Audit Status', key: 'status' }
          ],
          rows: [
            { project: 'ISLM Token', address: '0x1234...5678', loc: '1,420 LOC', reentrancy: 'PASSED', access: 'Multi-Sig DAO', status: 'CLEAN PASS' },
            { project: 'HAQQ Staking', address: '0x8765...4321', loc: '3,850 LOC', reentrancy: 'PASSED', access: 'Time-locked Owner', status: 'CLEAN PASS' },
            { project: 'Gold Sukuk RWA', address: '0x9988...1122', loc: '2,100 LOC', reentrancy: 'FIXED (ReentrancyGuard)', access: 'Role Based Access', status: 'REMEDIATED' }
          ]
        }
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. Technical Audit Summary',
          keyValuePairs: [
            { label: 'Contracts Audited', value: 114 },
            { label: 'Critical Vulnerabilities', value: '18 (All Remediated)' },
            { label: 'AI Extraction Confidence', value: '96.8%' }
          ]
        },
        {
          title: '2. Smart Contract Verification Register',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: reportId,
        reportTitle: 'TECHNICAL ASSESSMENT REPORT',
        reportSubtitle: 'Smart Contract Security, Bytecode Audit & AI Fact Verification',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain Technical Security Service',
        kpis,
        charts,
        tables,
        recommendations: [
          'Require ReentrancyGuard on all staking deposit function calls.',
          'Enforce OpenZeppelin v5.0 access control standard across contract updates.'
        ],
        summaryMetrics: [
          { label: 'Contracts Audited', value: 114 },
          { label: 'Critical CVEs Fixed', value: 18 },
          { label: 'AI Precision', value: '96.8%' }
        ],
        exportOptions: {
          reportTitle: 'TECHNICAL ASSESSMENT REPORT',
          reportSubtitle: 'Smart Contract Security, Bytecode Audit & AI Fact Verification',
          reportNumber: reportNo,
          generatedBy: 'HalalChain Technical Security Service',
          format: 'PDF',
          sections: exportSections
        }
      };
    }

    // ----------------------------------------------------
    // 7. BUSINESS ASSESSMENT REPORT
    // ----------------------------------------------------
    case 'business_assessment': {
      const kpis: ReportKPI[] = [
        { label: 'Business Reviews', value: '128', change: '100% Completed', trend: 'up', badge: 'Audited', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Tokenomics Score', value: '92.5%', change: 'Fair Distribution', trend: 'up', badge: 'Balanced', badgeColor: 'bg-blue-100 text-blue-800' },
        { label: 'Governance Pass Rate', value: '96.0%', change: 'Multi-sig Required', trend: 'up', badge: 'DAO Compliant', badgeColor: 'bg-indigo-100 text-indigo-800' },
        { label: 'Utility Function Score', value: '91.8%', change: 'Real Usage', trend: 'neutral', badge: 'Substantive', badgeColor: 'bg-slate-100 text-slate-800' },
        { label: 'Legal Entity Verified', value: '98.4%', change: 'KYB Complete', trend: 'up', badge: 'Verified KYB', badgeColor: 'bg-emerald-100 text-emerald-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'Token Supply Allocation Quality Breakdown',
          type: 'pie',
          items: [
            { label: 'Public & Ecosystem Reserves (50%+)', value: 82, color: '#059669' },
            { label: 'Team Vesting > 24 Months', value: 38, color: '#3B82F6' },
            { label: 'Private Sale Lockups', value: 8, color: '#D97706' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'Tokenomics & Governance Audit Findings',
          columns: [
            { header: 'Project Name', key: 'project' },
            { header: 'Supply Mechanics', key: 'supply' },
            { header: 'Team Lockup', key: 'lockup' },
            { header: 'Governance Structure', key: 'gov' },
            { header: 'Revenue Transparency', key: 'transparency' }
          ],
          rows: [
            { project: 'Islamic Coin', supply: 'Fixed 100B Capped', lockup: '36 Months Linear', gov: 'DAO Community Governance', transparency: 'Full On-Chain Audit' },
            { project: 'HAQQ Network', supply: 'PoS Mint Schedule', lockup: '24 Months Cliff', gov: 'Validator Consortium', transparency: 'Full On-Chain Audit' },
            { project: 'Gold Sukuk', supply: 'Asset Backed Mint/Burn', lockup: 'N/A (RWA Collateralized)', gov: 'Trustee Board + Multi-sig', transparency: 'Audited Monthly Vault Reports' }
          ]
        }
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. Business Evaluation Metrics',
          keyValuePairs: [
            { label: 'Evaluated Projects', value: 128 },
            { label: 'Tokenomics Score', value: '92.5%' },
            { label: 'Governance Rating', value: '96.0%' }
          ]
        },
        {
          title: '2. Tokenomics & Governance Audit Ledger',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: reportId,
        reportTitle: 'BUSINESS ASSESSMENT REPORT',
        reportSubtitle: 'Tokenomics Mechanics, Governance Controls & Business Integrity',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain Business Research Desk',
        kpis,
        charts,
        tables,
        recommendations: [
          'Enforce minimum 12-month team vesting cliff for all token listing candidates.',
          'Verify underlying legal entity registration in recognized jurisdiction.'
        ],
        summaryMetrics: [
          { label: 'Evaluated Projects', value: 128 },
          { label: 'Tokenomics Score', value: '92.5%' },
          { label: 'KYB Verification', value: '98.4%' }
        ],
        exportOptions: {
          reportTitle: 'BUSINESS ASSESSMENT REPORT',
          reportSubtitle: 'Tokenomics Mechanics, Governance Controls & Business Integrity',
          reportNumber: reportNo,
          generatedBy: 'HalalChain Business Research Desk',
          format: 'PDF',
          sections: exportSections
        }
      };
    }

    // ----------------------------------------------------
    // 8. SHARIA ASSESSMENT REPORT
    // ----------------------------------------------------
    case 'sharia_assessment': {
      const kpis: ReportKPI[] = [
        { label: 'Fatwas Issued & Signed', value: '108', change: 'By Qualified Scholars', trend: 'up', badge: 'Official Fatwa', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'AAOIFI Standards Mapped', value: '24', change: 'Standard No. 21 & 59', trend: 'up', badge: 'AAOIFI Compliant', badgeColor: 'bg-amber-100 text-amber-800' },
        { label: 'Fully Certified Sharia', value: '98', change: 'Zero Fixed Yield', trend: 'up', badge: 'Halal Certified', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Conditional Approvals', value: '8', change: 'Awaiting Action', trend: 'neutral', badge: 'Pending Items', badgeColor: 'bg-blue-100 text-blue-800' },
        { label: 'Non-Compliant Rejected', value: '2', change: 'Fixed Interest / Gharar', trend: 'down', badge: 'Rejected', badgeColor: 'bg-rose-100 text-rose-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'Sharia Compliance Breakdown by Asset Class',
          type: 'pie',
          items: [
            { label: 'Proof-of-Stake L1 & L2 Protocols', value: 52, color: '#059669' },
            { label: 'RWA Sukuk & Asset Backed Tokens', value: 28, color: '#D97706' },
            { label: 'Utility Tokens & Payment Networks', value: 18, color: '#3B82F6' },
            { label: 'DeFi Takaful & Profit-Loss Sharing', value: 10, color: '#8B5CF6' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'Sharia Scholar Board Audit Findings & Rulings',
          columns: [
            { header: 'Project / Asset', key: 'project' },
            { header: 'Lead Scholar', key: 'scholar' },
            { header: 'AAOIFI Reference', key: 'aaoifi' },
            { header: 'Interest (Riba) Check', key: 'riba' },
            { header: 'Speculation (Gharar) Check', key: 'gharar' },
            { header: 'Sharia Verdict', key: 'verdict' }
          ],
          rows: [
            { project: 'Islamic Coin (ISLM)', scholar: 'Dr. Nizam Yaquby', aaoifi: 'Standard No. 21 (Financial Papers)', riba: 'PASSED (Zero Riba)', gharar: 'PASSED (Clear Utility)', verdict: 'SHARIA COMPLIANT' },
            { project: 'HAQQ Network', scholar: 'Sheikh Dr. Mohamed Elgari', aaoifi: 'Standard No. 59 (Sale of Debt)', riba: 'PASSED (Halal Staking Yield)', gharar: 'PASSED', verdict: 'SHARIA COMPLIANT' },
            { project: 'Gold Sukuk Token', scholar: 'Dr. Imran Usmani', aaoifi: 'Standard No. 8 (Murabaha / Sukuk)', riba: 'PASSED (Physical Gold Backing)', gharar: 'PASSED', verdict: 'SHARIA COMPLIANT' }
          ]
        }
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. Sharia Board Audit Summary',
          keyValuePairs: [
            { label: 'Fatwas Issued', value: 108 },
            { label: 'AAOIFI Standards Referenced', value: 24 },
            { label: 'Certified Compliant Projects', value: 98 },
            { label: 'Rejections (Non-Compliant)', value: 2 }
          ]
        },
        {
          title: '2. Sharia Ruling Ledger',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: reportId,
        reportTitle: 'SHARIA ASSESSMENT REPORT',
        reportSubtitle: 'Scholar Board Rulings, AAOIFI Standards Alignment & Fatwa Register',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain Sharia Board Research Unit',
        kpis,
        charts,
        tables,
        recommendations: [
          'Ensure explicit physical vault custody audits for all RWA asset-backed token applications.',
          'Disallow fixed-rate staking yield mechanisms across all DeFi applications.'
        ],
        summaryMetrics: [
          { label: 'Fatwas Signed', value: 108 },
          { label: 'AAOIFI Standard Align', value: '100%' },
          { label: 'Certified Compliant', value: 98 }
        ],
        exportOptions: {
          reportTitle: 'SHARIA ASSESSMENT REPORT',
          reportSubtitle: 'Scholar Board Rulings, AAOIFI Standards Alignment & Fatwa Register',
          reportNumber: reportNo,
          generatedBy: 'HalalChain Sharia Board Research Unit',
          format: 'PDF',
          sections: exportSections
        }
      };
    }

    // ----------------------------------------------------
    // 9. QA REPORT
    // ----------------------------------------------------
    case 'qa_report': {
      const kpis: ReportKPI[] = [
        { label: 'Reports QA Reviewed', value: '142', change: '100% Inspected', trend: 'up', badge: 'Audited', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'First-Pass Approval', value: '88.5%', change: 'Target > 85%', trend: 'up', badge: 'High Quality', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Returned for Revision', value: '11.5%', change: '16 Reports', trend: 'neutral', badge: 'Corrected', badgeColor: 'bg-amber-100 text-amber-800' },
        { label: 'Avg QA Cycle Time', value: '0.6 Days', change: '14 Hours SLA', trend: 'up', badge: 'Fast Speed', badgeColor: 'bg-blue-100 text-blue-800' },
        { label: 'Quality Precision Score', value: '99.2%', change: 'Zero Errors Released', trend: 'up', badge: 'Pristine', badgeColor: 'bg-indigo-100 text-indigo-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'QA Review Outcome Breakdown',
          type: 'pie',
          items: [
            { label: 'Approved First Pass', value: 126, color: '#059669' },
            { label: 'Returned for Technical Clarification', value: 11, color: '#D97706' },
            { label: 'Returned for Citation Formatting', value: 5, color: '#3B82F6' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'Quality Assurance Review Log',
          columns: [
            { header: 'Dossier ID', key: 'id' },
            { header: 'Project Name', key: 'name' },
            { header: 'QA Inspector', key: 'inspector' },
            { header: 'Defect Category', key: 'defect' },
            { header: 'Resolution Status', key: 'status' }
          ],
          rows: [
            { id: 'QA-2026-042', name: 'Baraka Staking', inspector: 'Mustafa Chen', defect: 'Missing AAOIFI Citation Link', status: 'RESOLVED & APPROVED' },
            { id: 'QA-2026-038', name: 'Crescent Pay', inspector: 'Aisha Al-Maktoum', defect: 'Contract Compiler Mismatch', status: 'RESOLVED & APPROVED' },
            { id: 'QA-2026-031', name: 'Zakat DAO', inspector: 'Mustafa Chen', defect: 'Clarification on Multi-sig Quorum', status: 'PENDING AUDITOR RESPONSE' }
          ]
        }
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. Quality Assurance Metrics',
          keyValuePairs: [
            { label: 'QA Inspections Completed', value: 142 },
            { label: 'First Pass Approval Rate', value: '88.5%' },
            { label: 'Average QA Speed', value: '0.6 Days' }
          ]
        },
        {
          title: '2. Quality Assurance Audit Log',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: reportId,
        reportTitle: 'QUALITY ASSURANCE (QA) REPORT',
        reportSubtitle: 'Dossier Quality Control, Revision Cycles & Reviewer Consistency',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain Quality Control Office',
        kpis,
        charts,
        tables,
        recommendations: [
          'Enforce automated AAOIFI standard citation validator before final QA submission.',
          'Conduct weekly reviewer calibration meetings to maintain 99%+ quality precision.'
        ],
        summaryMetrics: [
          { label: 'Inspected Reports', value: 142 },
          { label: 'First Pass Approval', value: '88.5%' },
          { label: 'Quality Precision', value: '99.2%' }
        ],
        exportOptions: {
          reportTitle: 'QUALITY ASSURANCE (QA) REPORT',
          reportSubtitle: 'Dossier Quality Control, Revision Cycles & Reviewer Consistency',
          reportNumber: reportNo,
          generatedBy: 'HalalChain Quality Control Office',
          format: 'PDF',
          sections: exportSections
        }
      };
    }

    // ----------------------------------------------------
    // 10. CERTIFICATE REGISTRY REPORT
    // ----------------------------------------------------
    case 'certificate_registry': {
      const kpis: ReportKPI[] = [
        { label: 'Active Issued Certificates', value: '98', change: 'On-Chain Verified', trend: 'up', badge: 'Active Registry', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Annual Renewals Completed', value: '24', change: '100% Renewal Rate', trend: 'up', badge: 'Renewed', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Expiring in 30 Days', value: '6', change: 'Reminders Sent', trend: 'neutral', badge: 'Renewal Due', badgeColor: 'bg-amber-100 text-amber-800' },
        { label: 'Revoked or Suspended', value: '0', change: 'Zero Non-Compliance', trend: 'up', badge: 'Pristine Record', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'On-Chain Hash Verified', value: '100%', change: 'Cryptographic Proof', trend: 'up', badge: 'Immutable Proof', badgeColor: 'bg-indigo-100 text-indigo-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'Certificate Expiry Timeline (Next 12 Months)',
          type: 'bar',
          items: [
            { label: 'Q3 2026 Renewals Due', value: 6, color: '#D97706' },
            { label: 'Q4 2026 Renewals Due', value: 18, color: '#3B82F6' },
            { label: 'Q1 2027 Renewals Due', value: 32, color: '#059669' },
            { label: 'Q2 2027 Renewals Due', value: 42, color: '#6366F1' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'Master Certificate Public Registry',
          columns: [
            { header: 'Certificate ID', key: 'certId' },
            { header: 'Company / Project', key: 'name' },
            { header: 'Token Symbol', key: 'symbol' },
            { header: 'Issue Date', key: 'issue' },
            { header: 'Expiry Date', key: 'expiry' },
            { header: 'On-Chain Verification Hash', key: 'hash' }
          ],
          rows: [
            { certId: 'HC-CERT-2025-001', name: 'Islamic Coin', symbol: 'ISLM', issue: '2025-08-10', expiry: '2026-08-10', hash: '0x8f2a91203910b891a293' },
            { certId: 'HC-CERT-2025-004', name: 'HAQQ Network', symbol: 'HAQQ', issue: '2025-09-01', expiry: '2026-09-01', hash: '0x3102931209381a8f2a91' },
            { certId: 'HC-CERT-2026-012', name: 'Gold Sukuk Token', symbol: 'GSDK', issue: '2026-01-15', expiry: '2027-01-15', hash: '0x71289301293810293810' }
          ]
        }
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. Certificate Registry Statistics',
          keyValuePairs: [
            { label: 'Active Issued Certificates', value: 98 },
            { label: 'Annual Renewals Completed', value: 24 },
            { label: 'Expiring in 30 Days', value: 6 },
            { label: 'On-Chain Hash Verification', value: '100%' }
          ]
        },
        {
          title: '2. Public Registry Master Index',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: reportId,
        reportTitle: 'CERTIFICATE REGISTRY REPORT',
        reportSubtitle: 'Master Sharia Public Registry, Renewal Watchlist & Cryptographic Verification',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain Public Registry Authority',
        kpis,
        charts,
        tables,
        recommendations: [
          'Dispatch automated 30-day renewal notices to Gold Sukuk and Crescent Pay teams.',
          'Verify on-chain smart contract bytecode hash integrity against stored audit records.'
        ],
        summaryMetrics: [
          { label: 'Active Certificates', value: 98 },
          { label: 'Expiring Soon', value: 6 },
          { label: 'On-Chain Integrity', value: '100%' }
        ],
        exportOptions: {
          reportTitle: 'CERTIFICATE REGISTRY REPORT',
          reportSubtitle: 'Master Sharia Public Registry, Renewal Watchlist & Cryptographic Verification',
          reportNumber: reportNo,
          generatedBy: 'HalalChain Public Registry Authority',
          format: 'PDF',
          sections: exportSections
        }
      };
    }

    // ----------------------------------------------------
    // 11. CRM REPORT
    // ----------------------------------------------------
    case 'crm_report':
    default: {
      const kpis: ReportKPI[] = [
        { label: 'Total Registered Accounts', value: '186', change: '+15 this month', trend: 'up', badge: 'Active CRM', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Active Pipeline Leads', value: '64', change: 'High Engagement', trend: 'up', badge: 'In Funnel', badgeColor: 'bg-blue-100 text-blue-800' },
        { label: 'Proposals Outstanding', value: '18', change: '$520k Value', trend: 'neutral', badge: 'Pending Decision', badgeColor: 'bg-amber-100 text-amber-800' },
        { label: 'Closed Won Customers', value: '98', change: '52.6% Lifetime Yield', trend: 'up', badge: 'Certified Clients', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Executive Meetings Logged', value: '12', change: 'This Week', trend: 'up', badge: 'BD Active', badgeColor: 'bg-indigo-100 text-indigo-800' }
      ];

      const charts: ReportChartData[] = [
        {
          title: 'Customer Contact Status Breakdown',
          type: 'pie',
          items: [
            { label: 'Certified Existing Customers', value: 98, color: '#059669' },
            { label: 'Proposal Sent / Negotiating', value: 18, color: '#D97706' },
            { label: 'Contacted / Waiting Response', value: 46, color: '#3B82F6' },
            { label: 'Fresh Prospect Lead', value: 24, color: '#64748B' }
          ]
        }
      ];

      const tables: ReportTable[] = [
        {
          title: 'CRM Customer Directory & Lead History',
          columns: [
            { header: 'Master ID', key: 'id' },
            { header: 'Company Name', key: 'name' },
            { header: 'Country', key: 'country' },
            { header: 'Primary BD Email', key: 'email' },
            { header: 'Lead Stage', key: 'stage' },
            { header: 'Last Contact Date', key: 'lastContact' }
          ],
          rows: [
            { id: 'MST-2026-001', name: 'Islamic Coin', country: 'United Arab Emirates', email: 'bd@islamiccoin.net', stage: 'Certified Client', lastContact: '2026-08-01' },
            { id: 'MST-2026-004', name: 'HAQQ Network', country: 'United Arab Emirates', email: 'partnership@haqq.network', stage: 'Certified Client', lastContact: '2026-07-28' },
            { id: 'MST-2026-012', name: 'Gold Sukuk RWA', country: 'Saudi Arabia', email: 'info@goldsukuk.sa', stage: 'Proposal Sent', lastContact: '2026-08-02' },
            { id: 'MST-2026-018', name: 'Crescent Pay', country: 'Malaysia', email: 'bd@crescentpay.my', stage: 'Contacted', lastContact: '2026-07-25' }
          ]
        }
      ];

      const exportSections: ReportSection[] = [
        {
          title: '1. CRM Customer Overview',
          keyValuePairs: [
            { label: 'Total Registered Accounts', value: 186 },
            { label: 'Active Pipeline Leads', value: 64 },
            { label: 'Closed Certified Customers', value: 98 }
          ]
        },
        {
          title: '2. Customer Roster Directory',
          columns: tables[0].columns.map(c => ({ header: c.header, key: c.key, width: 20 })),
          rows: tables[0].rows
        }
      ];

      return {
        id: 'crm_report',
        reportTitle: 'CRM & CUSTOMER INTELLIGENCE REPORT',
        reportSubtitle: 'Customer Accounts, Lead Pipeline & Executive Interactions',
        reportNumber: reportNo,
        period,
        generatedBy: 'HalalChain CRM Operations Engine',
        kpis,
        charts,
        tables,
        recommendations: [
          'Schedule direct follow-up call with Crescent Pay BD team (7+ days since last contact).',
          'Enforce full BD email logging inside CRM timeline for all executive meetings.'
        ],
        summaryMetrics: [
          { label: 'Registered Accounts', value: 186 },
          { label: 'Certified Clients', value: 98 },
          { label: 'Active Funnel', value: 64 }
        ],
        exportOptions: {
          reportTitle: 'CRM & CUSTOMER INTELLIGENCE REPORT',
          reportSubtitle: 'Customer Accounts, Lead Pipeline & Executive Interactions',
          reportNumber: reportNo,
          generatedBy: 'HalalChain CRM Operations Engine',
          format: 'PDF',
          sections: exportSections
        }
      };
    }
  }
}

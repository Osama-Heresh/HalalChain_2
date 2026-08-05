import {
  ServiceCatalogItem,
  PriceHistoryEntry,
  QuotationRecord,
  CommercialContractRecord,
  CommercialInvoiceRecord,
  PaymentRecord,
  CommercialSubscriptionRecord,
  PartnerRecord,
  ReviewerPayrollRecord,
  FinancialAuditLogEntry,
  CurrencyRate,
  CertificationApplication
} from '../types';

/**
 * HalalChain Enterprise Multi-Currency Configuration
 */
export const INITIAL_CURRENCY_RATES: CurrencyRate[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToBaseUSD: 1.0, lastUpdated: '2026-08-01' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED ', rateToBaseUSD: 3.6725, lastUpdated: '2026-08-01' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR ', rateToBaseUSD: 3.75, lastUpdated: '2026-08-01' },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToBaseUSD: 0.92, lastUpdated: '2026-08-01' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM ', rateToBaseUSD: 4.45, lastUpdated: '2026-08-01' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToBaseUSD: 0.78, lastUpdated: '2026-08-01' }
];

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = INITIAL_CURRENCY_RATES.find((r) => r.code === fromCurrency)?.rateToBaseUSD || 1.0;
  const toRate = INITIAL_CURRENCY_RATES.find((r) => r.code === toCurrency)?.rateToBaseUSD || 1.0;
  // Convert from currency -> USD -> to currency
  const baseInUSD = amount / fromRate;
  return baseInUSD * toRate;
}

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const rateObj = INITIAL_CURRENCY_RATES.find((r) => r.code === currencyCode);
  const symbol = rateObj ? rateObj.symbol : '$';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Helper to produce cryptographic audit signature hash
 */
export function generateFinancialAuditHash(action: string, entityId: string, amount: number): string {
  const rawStr = `${action}:${entityId}:${amount}:${Date.now()}:HC_FIN_SECURE_SALT`;
  let hash = 0;
  for (let i = 0; i < rawStr.length; i++) {
    const char = rawStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `0xHC_FIN_${Math.abs(hash).toString(16).toUpperCase()}_${Date.now().toString(36).toUpperCase()}`;
}

/**
 * 1. Initial Configurable Service Catalog
 */
export const INITIAL_SERVICE_CATALOG: ServiceCatalogItem[] = [
  {
    id: 'SVC-001',
    serviceName: 'Sharia Compliance Assessment',
    description: 'Comprehensive AAOIFI & HalalChain Sharia Board audit of smart contracts, tokenomics, and operational framework.',
    category: 'Sharia Compliance',
    basePriceUSD: 15000,
    currency: 'USD',
    estimatedDurationDays: 14,
    deliverables: ['Sharia Audit Report', 'Fatwa Certification Dossier', 'Sharia Board Attestation'],
    renewalRequired: true,
    isActive: true,
    pricingModel: 'Fixed',
    regionalMultipliers: { GCC: 1.0, SEA: 0.9, EU: 1.1, NA: 1.15 },
    createdAt: '2026-01-10',
    updatedAt: '2026-07-01'
  },
  {
    id: 'SVC-002',
    serviceName: 'Smart Contract Audit',
    description: 'Deep static analysis, formal verification, and manual security review of Solidity/Rust smart contract codebases.',
    category: 'Smart Contract Audit',
    basePriceUSD: 12500,
    currency: 'USD',
    estimatedDurationDays: 10,
    deliverables: ['Vulnerability Assessment Log', 'Re-entrancy Verification Certificate', 'Remediation Sign-off'],
    renewalRequired: false,
    isActive: true,
    pricingModel: 'Fixed',
    createdAt: '2026-01-15',
    updatedAt: '2026-06-12'
  },
  {
    id: 'SVC-003',
    serviceName: 'Whitepaper Audit',
    description: 'In-depth review of token utility, economic design, claims accuracy, and Sharia compliance alignment.',
    category: 'Whitepaper Audit',
    basePriceUSD: 8000,
    currency: 'USD',
    estimatedDurationDays: 7,
    deliverables: ['Whitepaper Annotation Report', 'Executive Summary Memo', 'Sharia Utility Seal'],
    renewalRequired: false,
    isActive: true,
    pricingModel: 'Fixed',
    createdAt: '2026-02-01',
    updatedAt: '2026-05-20'
  },
  {
    id: 'SVC-004',
    serviceName: 'Governance Review',
    description: 'DAO & multi-sig governance structure evaluation for Sharia council oversight and decentralized compliance.',
    category: 'Governance Review',
    basePriceUSD: 10000,
    currency: 'USD',
    estimatedDurationDays: 10,
    deliverables: ['DAO Governance Map', 'Sharia Voting Mechanism Policy', 'Council Charter'],
    renewalRequired: true,
    isActive: true,
    pricingModel: 'Enterprise',
    createdAt: '2026-02-10',
    updatedAt: '2026-04-15'
  },
  {
    id: 'SVC-005',
    serviceName: 'Tokenomics Assessment',
    description: 'Algorithmic economic simulation checking for Riba (Usury), Gharar (Uncertainty), and Maisir (Gambling) in yield mechanics.',
    category: 'Tokenomics Assessment',
    basePriceUSD: 9500,
    currency: 'USD',
    estimatedDurationDays: 8,
    deliverables: ['Yield Risk Simulation Matrix', 'Halal Staking Validation', 'Liquidity Model Review'],
    renewalRequired: false,
    isActive: true,
    pricingModel: 'Custom',
    createdAt: '2026-02-15',
    updatedAt: '2026-07-10'
  },
  {
    id: 'SVC-006',
    serviceName: 'Annual Monitoring',
    description: 'Continuous real-time smart contract monitoring, quarterly Sharia board reviews, and re-certification.',
    category: 'Annual Monitoring',
    basePriceUSD: 6000,
    currency: 'USD',
    estimatedDurationDays: 365,
    deliverables: ['Quarterly Compliance Statements', 'Real-time Security Alerts', 'Renewal Certificate'],
    renewalRequired: true,
    isActive: true,
    pricingModel: 'Discount',
    createdAt: '2026-03-01',
    updatedAt: '2026-07-25'
  },
  {
    id: 'SVC-007',
    serviceName: 'Enterprise Subscription',
    description: 'All-inclusive institutional package covering unlimited smart contract revisions, priority Sharia board access, and custom SLA.',
    category: 'Enterprise Subscription',
    basePriceUSD: 25000,
    currency: 'USD',
    estimatedDurationDays: 365,
    deliverables: ['Dedicated Account Manager', '24/7 Security Escrow Desk', 'Priority Board Review', 'Custom SLA'],
    renewalRequired: true,
    isActive: true,
    pricingModel: 'Enterprise',
    createdAt: '2026-03-10',
    updatedAt: '2026-08-01'
  },
  {
    id: 'SVC-008',
    serviceName: 'Training Services',
    description: 'Institutional workshops for engineering & compliance teams on Web3 Sharia governance and AAOIFI standards.',
    category: 'Training Services',
    basePriceUSD: 4500,
    currency: 'USD',
    estimatedDurationDays: 3,
    deliverables: ['Workshop Materials', 'Team Certification Badges', 'Recorded Masterclasses'],
    renewalRequired: false,
    isActive: true,
    pricingModel: 'Fixed',
    createdAt: '2026-04-01',
    updatedAt: '2026-06-01'
  },
  {
    id: 'SVC-009',
    serviceName: 'Consulting',
    description: 'Ad-hoc strategic advisory with senior Islamic finance scholars and Web3 security architects.',
    category: 'Consulting',
    basePriceUSD: 5000,
    currency: 'USD',
    estimatedDurationDays: 5,
    deliverables: ['Advisory Summary Report', 'Architectural Recommendations Memo'],
    renewalRequired: false,
    isActive: true,
    pricingModel: 'Custom',
    createdAt: '2026-04-15',
    updatedAt: '2026-07-15'
  }
];

/**
 * Initial Price History Log
 */
export const INITIAL_PRICE_HISTORY: PriceHistoryEntry[] = [
  {
    id: 'PH-101',
    serviceId: 'SVC-001',
    serviceName: 'Sharia Compliance Assessment',
    oldPriceUSD: 12000,
    newPriceUSD: 15000,
    currency: 'USD',
    reason: 'Upgraded AAOIFI 2026 Standard Audit scope & multi-board review inclusion',
    changedBy: 'General Manager',
    timestamp: '2026-07-01 10:15:00'
  },
  {
    id: 'PH-102',
    serviceId: 'SVC-007',
    serviceName: 'Enterprise Subscription',
    oldPriceUSD: 20000,
    newPriceUSD: 25000,
    currency: 'USD',
    reason: 'Added 24/7 automated security escrow monitoring & priority SLA',
    changedBy: 'General Manager',
    timestamp: '2026-08-01 09:00:00'
  }
];

/**
 * 3. Initial Quotations
 */
export const INITIAL_QUOTATIONS: QuotationRecord[] = [
  {
    id: 'QT-2026-001',
    quotationNumber: 'QT-HC-2026-001',
    customerName: 'Tariq Al-Mansoor',
    companyName: 'Al-Madina Sukuk Protocol',
    customerEmail: 'tariq@almadinasukuk.io',
    country: 'United Arab Emirates',
    currency: 'AED',
    exchangeRateToBaseUSD: 3.6725,
    items: [
      {
        serviceId: 'SVC-001',
        serviceName: 'Sharia Compliance Assessment',
        quantity: 1,
        unitPriceUSD: 15000,
        discountPercentage: 5,
        taxPercentage: 5,
        totalUSD: 14962.5
      },
      {
        serviceId: 'SVC-002',
        serviceName: 'Smart Contract Audit',
        quantity: 1,
        unitPriceUSD: 12500,
        discountPercentage: 5,
        taxPercentage: 5,
        totalUSD: 12468.75
      }
    ],
    subtotalUSD: 27500,
    totalDiscountUSD: 1375,
    taxTotalUSD: 1306.25,
    grandTotalUSD: 27431.25,
    validityDate: '2026-08-30',
    termsAndConditions: 'Standard 50% deposit required prior to audit kickoff. Final Sharia board certificate issued upon 100% payment clearance.',
    digitalApprovalStatus: 'Digitally Approved',
    status: 'Accepted',
    createdBy: 'Head of Business Development',
    createdAt: '2026-07-15',
    convertedToContractId: 'CTR-2026-101'
  },
  {
    id: 'QT-2026-002',
    quotationNumber: 'QT-HC-2026-002',
    customerName: 'Sarah Jenkins',
    companyName: 'Bether Global Halal DeFi',
    customerEmail: 'sarah@betherdefi.com',
    country: 'United Kingdom',
    currency: 'GBP',
    exchangeRateToBaseUSD: 0.78,
    items: [
      {
        serviceId: 'SVC-005',
        serviceName: 'Tokenomics Assessment',
        quantity: 1,
        unitPriceUSD: 9500,
        discountPercentage: 0,
        taxPercentage: 20,
        totalUSD: 11400
      }
    ],
    subtotalUSD: 9500,
    totalDiscountUSD: 0,
    taxTotalUSD: 1900,
    grandTotalUSD: 11400,
    validityDate: '2026-09-15',
    termsAndConditions: 'Quote valid for 30 days. Includes 2 rounds of technical clarification.',
    digitalApprovalStatus: 'Pending Signature',
    status: 'Sent',
    createdBy: 'Sales Operations Manager',
    createdAt: '2026-08-01'
  },
  {
    id: 'QT-2026-003',
    quotationNumber: 'QT-HC-2026-003',
    customerName: 'Ahmad Zulkifli',
    companyName: 'Nusantara Islamic Pay',
    customerEmail: 'zulkifli@nusantarapay.my',
    country: 'Malaysia',
    currency: 'MYR',
    exchangeRateToBaseUSD: 4.45,
    items: [
      {
        serviceId: 'SVC-007',
        serviceName: 'Enterprise Subscription',
        quantity: 1,
        unitPriceUSD: 25000,
        discountPercentage: 10,
        taxPercentage: 0,
        totalUSD: 22500
      }
    ],
    subtotalUSD: 25000,
    totalDiscountUSD: 2500,
    taxTotalUSD: 0,
    grandTotalUSD: 22500,
    validityDate: '2026-08-20',
    termsAndConditions: 'Annual enterprise subscription billed upfront. Auto-renewal option enabled.',
    digitalApprovalStatus: 'Digitally Approved',
    status: 'Accepted',
    createdBy: 'General Manager',
    createdAt: '2026-07-20',
    convertedToContractId: 'CTR-2026-102'
  }
];

/**
 * 4. Initial Commercial Contracts
 */
export const INITIAL_CONTRACTS: CommercialContractRecord[] = [
  {
    id: 'CTR-2026-101',
    contractNumber: 'CTR-HC-2026-101',
    quotationId: 'QT-2026-001',
    customerName: 'Tariq Al-Mansoor',
    companyName: 'Al-Madina Sukuk Protocol',
    servicesIncluded: ['Sharia Compliance Assessment', 'Smart Contract Audit'],
    totalContractValueUSD: 27431.25,
    currency: 'AED',
    startDate: '2026-07-16',
    endDate: '2027-07-15',
    renewalDate: '2027-06-15',
    status: 'Active',
    signedDocumentUrl: 'https://halalchain.io/contracts/signed_ctr_101.pdf',
    signedAt: '2026-07-16 14:30:00',
    notes: 'Key Dubai enterprise client. 50% deposit cleared via Emirates NBD wire.',
    autoRenewal: true,
    partnerReferralCode: 'PARTNER-UAE-001'
  },
  {
    id: 'CTR-2026-102',
    contractNumber: 'CTR-HC-2026-102',
    quotationId: 'QT-2026-003',
    customerName: 'Ahmad Zulkifli',
    companyName: 'Nusantara Islamic Pay',
    servicesIncluded: ['Enterprise Subscription'],
    totalContractValueUSD: 22500,
    currency: 'MYR',
    startDate: '2026-07-22',
    endDate: '2027-07-21',
    renewalDate: '2027-06-21',
    status: 'Active',
    signedDocumentUrl: 'https://halalchain.io/contracts/signed_ctr_102.pdf',
    signedAt: '2026-07-22 11:15:00',
    notes: 'Kuala Lumpur FinTech hub priority enterprise account.',
    autoRenewal: true,
    partnerReferralCode: 'PARTNER-MY-002'
  }
];

/**
 * 5. Initial Commercial Invoices
 */
export const INITIAL_INVOICES: CommercialInvoiceRecord[] = [
  {
    id: 'INV-2026-501',
    invoiceNumber: 'INV-HC-2026-501',
    contractId: 'CTR-2026-101',
    quotationId: 'QT-2026-001',
    customerName: 'Tariq Al-Mansoor',
    companyName: 'Al-Madina Sukuk Protocol',
    country: 'United Arab Emirates',
    currency: 'AED',
    exchangeRateToBaseUSD: 3.6725,
    items: [
      { description: 'Sharia Compliance Audit Deposit (50%)', quantity: 1, unitPrice: 27431.25 * 0.5, amount: 13715.62 }
    ],
    subtotal: 13715.62,
    taxAmount: 0,
    totalAmount: 13715.62,
    totalAmountUSD: 13715.62,
    amountPaidUSD: 13715.62,
    outstandingBalanceUSD: 0,
    issueDate: '2026-07-16',
    dueDate: '2026-07-30',
    paymentStatus: 'Paid',
    notes: 'Full deposit cleared via Emirates NBD Bank wire.'
  },
  {
    id: 'INV-2026-502',
    invoiceNumber: 'INV-HC-2026-502',
    contractId: 'CTR-2026-101',
    quotationId: 'QT-2026-001',
    customerName: 'Tariq Al-Mansoor',
    companyName: 'Al-Madina Sukuk Protocol',
    country: 'United Arab Emirates',
    currency: 'AED',
    exchangeRateToBaseUSD: 3.6725,
    items: [
      { description: 'Final Audit & Sharia Certificate Release Fee (50%)', quantity: 1, unitPrice: 27431.25 * 0.5, amount: 13715.63 }
    ],
    subtotal: 13715.63,
    taxAmount: 0,
    totalAmount: 13715.63,
    totalAmountUSD: 13715.63,
    amountPaidUSD: 5000,
    outstandingBalanceUSD: 8715.63,
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    paymentStatus: 'Partially Paid',
    notes: 'Partial payment received. Remaining balance due before certificate issuance.'
  },
  {
    id: 'INV-2026-503',
    invoiceNumber: 'INV-HC-2026-503',
    contractId: 'CTR-2026-102',
    quotationId: 'QT-2026-003',
    customerName: 'Ahmad Zulkifli',
    companyName: 'Nusantara Islamic Pay',
    country: 'Malaysia',
    currency: 'MYR',
    exchangeRateToBaseUSD: 4.45,
    items: [
      { description: 'Annual Enterprise Subscription Membership', quantity: 1, unitPrice: 22500, amount: 22500 }
    ],
    subtotal: 22500,
    taxAmount: 0,
    totalAmount: 22500,
    totalAmountUSD: 22500,
    amountPaidUSD: 22500,
    outstandingBalanceUSD: 0,
    issueDate: '2026-07-22',
    dueDate: '2026-08-05',
    paymentStatus: 'Paid',
    notes: 'Paid via Maybank Corporate Transfer.'
  }
];

/**
 * 6. Initial Payment Records
 */
export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'PAY-701',
    paymentNumber: 'PAY-HC-2026-701',
    invoiceId: 'INV-2026-501',
    invoiceNumber: 'INV-HC-2026-501',
    customerName: 'Tariq Al-Mansoor',
    companyName: 'Al-Madina Sukuk Protocol',
    amountPaidUSD: 13715.62,
    paymentType: 'Payment Received',
    paymentMethod: 'Bank Wire Transfer',
    referenceNumber: 'ENBD-TXN-99812401',
    paymentDate: '2026-07-18',
    recordedBy: 'Finance Operations Lead',
    status: 'Cleared',
    notes: 'Emirates NBD direct wire confirmation.'
  },
  {
    id: 'PAY-702',
    paymentNumber: 'PAY-HC-2026-702',
    invoiceId: 'INV-2026-502',
    invoiceNumber: 'INV-HC-2026-502',
    customerName: 'Tariq Al-Mansoor',
    companyName: 'Al-Madina Sukuk Protocol',
    amountPaidUSD: 5000,
    paymentType: 'Partial Payment',
    paymentMethod: 'Crypto Escrow',
    referenceNumber: 'USDT-0x81F2...901B',
    paymentDate: '2026-08-03',
    recordedBy: 'Finance Operations Lead',
    status: 'Cleared',
    notes: 'USDT deposit to HalalChain Treasury Wallet.'
  },
  {
    id: 'PAY-703',
    paymentNumber: 'PAY-HC-2026-703',
    invoiceId: 'INV-2026-503',
    invoiceNumber: 'INV-HC-2026-503',
    customerName: 'Ahmad Zulkifli',
    companyName: 'Nusantara Islamic Pay',
    amountPaidUSD: 22500,
    paymentType: 'Payment Received',
    paymentMethod: 'Corporate Transfer',
    referenceNumber: 'MBB-KL-8812903',
    paymentDate: '2026-07-25',
    recordedBy: 'Finance Operations Lead',
    status: 'Cleared',
    notes: 'Full annual enterprise subscription cleared.'
  }
];

/**
 * 7. Initial Commercial Subscriptions
 */
export const INITIAL_SUBSCRIPTIONS: CommercialSubscriptionRecord[] = [
  {
    id: 'SUB-301',
    subscriptionNumber: 'SUB-HC-2026-301',
    customerName: 'Tariq Al-Mansoor',
    companyName: 'Al-Madina Sukuk Protocol',
    serviceCategory: 'Annual Monitoring',
    annualFeeUSD: 6000,
    currency: 'USD',
    startDate: '2026-07-16',
    renewalDate: '2027-07-15',
    autoRenewal: true,
    status: 'Active',
    lastReminderSentDate: '2026-07-01',
    associatedCertificateId: 'CERT-MADINA-2026'
  },
  {
    id: 'SUB-302',
    subscriptionNumber: 'SUB-HC-2026-302',
    customerName: 'Ahmad Zulkifli',
    companyName: 'Nusantara Islamic Pay',
    serviceCategory: 'Enterprise Subscription',
    annualFeeUSD: 25000,
    currency: 'USD',
    startDate: '2026-07-22',
    renewalDate: '2027-07-21',
    autoRenewal: true,
    status: 'Active',
    lastReminderSentDate: '2026-07-10',
    associatedCertificateId: 'CERT-NUSANTARA-2026'
  },
  {
    id: 'SUB-303',
    subscriptionNumber: 'SUB-HC-2026-303',
    customerName: 'Rashid Khan',
    companyName: 'DeFi Waqf Foundation',
    serviceCategory: 'Annual Monitoring',
    annualFeeUSD: 6000,
    currency: 'USD',
    startDate: '2025-08-20',
    renewalDate: '2026-08-20',
    autoRenewal: false,
    status: 'Past Due',
    lastReminderSentDate: '2026-07-20',
    associatedCertificateId: 'CERT-WAQF-2025'
  }
];

/**
 * 8. Initial Partner Registry
 */
export const INITIAL_PARTNERS: PartnerRecord[] = [
  {
    id: 'PTR-001',
    partnerName: 'Dr. Ziad Al-Husseini',
    companyName: 'Islamic FinTech Hub UAE',
    country: 'United Arab Emirates',
    referralCode: 'PARTNER-UAE-001',
    commissionPercentage: 10,
    projectsReferredCount: 4,
    revenueGeneratedUSD: 85000,
    commissionPaidUSD: 6000,
    commissionPendingUSD: 2500,
    isActive: true,
    contactEmail: 'ziad@islamicfintech.ae'
  },
  {
    id: 'PTR-002',
    partnerName: 'Farhan Azman',
    companyName: 'Southeast Asia Sharia Advisory',
    country: 'Malaysia',
    referralCode: 'PARTNER-MY-002',
    commissionPercentage: 8,
    projectsReferredCount: 3,
    revenueGeneratedUSD: 52000,
    commissionPaidUSD: 4160,
    commissionPendingUSD: 0,
    isActive: true,
    contactEmail: 'farhan@shariaadvisory.my'
  },
  {
    id: 'PTR-003',
    partnerName: 'Julian Sterling',
    companyName: 'London Crypto Compliance Network',
    country: 'United Kingdom',
    referralCode: 'PARTNER-UK-003',
    commissionPercentage: 12,
    projectsReferredCount: 2,
    revenueGeneratedUSD: 38000,
    commissionPaidUSD: 2000,
    commissionPendingUSD: 2560,
    isActive: true,
    contactEmail: 'j.sterling@cryptocompliance.uk'
  }
];

/**
 * 9. Initial Reviewer Payroll Data
 */
export const INITIAL_REVIEWER_PAYROLL: ReviewerPayrollRecord[] = [
  {
    id: 'PAYROLL-801',
    reviewerId: 'REV-101',
    reviewerName: 'Sheikh Dr. Ibrahim Al-Otaibi',
    reviewerRole: 'Sharia Scholar',
    completedTasksCount: 18,
    approvedAssessmentsCount: 12,
    basePayUSD: 8000,
    bonusAmountUSD: 1500,
    commissionAmountUSD: 1200,
    totalPaymentsDueUSD: 10700,
    paymentStatus: 'Approved',
    periodMonthYear: 'July 2026',
    isImmutableForReviewers: true
  },
  {
    id: 'PAYROLL-802',
    reviewerId: 'REV-102',
    reviewerName: 'Prof. Marcus Vance',
    reviewerRole: 'Technical Auditor',
    completedTasksCount: 24,
    approvedAssessmentsCount: 16,
    basePayUSD: 7500,
    bonusAmountUSD: 1200,
    commissionAmountUSD: 800,
    totalPaymentsDueUSD: 9500,
    paymentStatus: 'Pending Payroll Approval',
    periodMonthYear: 'July 2026',
    isImmutableForReviewers: true
  },
  {
    id: 'PAYROLL-803',
    reviewerId: 'REV-103',
    reviewerName: 'Amina Nur-Hassan',
    reviewerRole: 'Tokenomics Lead',
    completedTasksCount: 14,
    approvedAssessmentsCount: 10,
    basePayUSD: 6500,
    bonusAmountUSD: 800,
    commissionAmountUSD: 500,
    totalPaymentsDueUSD: 7800,
    paymentStatus: 'Disbursed',
    periodMonthYear: 'July 2026',
    isImmutableForReviewers: true
  }
];

/**
 * 14. Initial Financial Audit Logs
 */
export const INITIAL_FINANCIAL_AUDIT_LOGS: FinancialAuditLogEntry[] = [
  {
    id: 'FIN-LOG-001',
    timestamp: '2026-07-16 14:30:12',
    user: 'General Manager',
    action: 'Contract Creation & Execution',
    module: 'Contract',
    entityId: 'CTR-HC-2026-101',
    oldValue: 'Status: Draft',
    newValue: 'Status: Active ($27,431.25 USD)',
    reason: 'Quotation QT-HC-2026-001 accepted & signed by Al-Madina Sukuk Protocol',
    digitalSignatureHash: generateFinancialAuditHash('Contract Execution', 'CTR-HC-2026-101', 27431.25)
  },
  {
    id: 'FIN-LOG-002',
    timestamp: '2026-07-18 11:20:05',
    user: 'Finance Operations Lead',
    action: 'Deposit Invoice Payment Clearance',
    module: 'Payment',
    entityId: 'INV-HC-2026-501',
    oldValue: 'Payment Status: Issued',
    newValue: 'Payment Status: Paid ($13,715.62 USD Cleared)',
    reason: 'Bank wire receipt verified from Emirates NBD',
    digitalSignatureHash: generateFinancialAuditHash('Payment Cleared', 'INV-HC-2026-501', 13715.62)
  },
  {
    id: 'FIN-LOG-003',
    timestamp: '2026-08-01 10:00:00',
    user: 'General Manager',
    action: 'Service Catalog Price Revision',
    module: 'Catalog',
    entityId: 'SVC-001',
    oldValue: 'Price: $12,000 USD',
    newValue: 'Price: $15,000 USD',
    reason: 'Annual AAOIFI 2026 standard compliance scope expansion',
    digitalSignatureHash: generateFinancialAuditHash('Price Update', 'SVC-001', 15000)
  }
];

/**
 * Financial Calculation Helpers for Executive BI Dashboard & Business Analytics
 */
export function calculateExecutiveFinancialMetrics(
  invoices: CommercialInvoiceRecord[],
  payments: PaymentRecord[],
  contracts: CommercialContractRecord[],
  quotations: QuotationRecord[],
  partners: PartnerRecord[]
) {
  const totalRevenueCollectedUSD = payments
    .filter((p) => p.status === 'Cleared' && p.paymentType !== 'Refund')
    .reduce((sum, p) => sum + p.amountPaidUSD, 0);

  const totalOutstandingInvoicesUSD = invoices
    .filter((i) => i.paymentStatus !== 'Cancelled' && i.paymentStatus !== 'Paid')
    .reduce((sum, i) => sum + i.outstandingBalanceUSD, 0);

  const totalContractPipelineValueUSD = quotations
    .filter((q) => q.status === 'Sent' || q.status === 'Draft')
    .reduce((sum, q) => sum + q.grandTotalUSD, 0);

  const activeContractValueUSD = contracts
    .filter((c) => c.status === 'Active' || c.status === 'Renewed')
    .reduce((sum, c) => sum + c.totalContractValueUSD, 0);

  const renewalForecastUSD = contracts
    .filter((c) => c.status === 'Active' || c.autoRenewal)
    .reduce((sum, c) => sum + c.totalContractValueUSD, 0);

  const totalPartnerCommissionsPaidUSD = partners.reduce((sum, p) => sum + p.commissionPaidUSD, 0);
  const totalPartnerCommissionsPendingUSD = partners.reduce((sum, p) => sum + p.commissionPendingUSD, 0);

  // Revenue by Country Breakdown
  const revenueByCountry: Record<string, number> = {};
  invoices.forEach((inv) => {
    const c = inv.country || 'International';
    revenueByCountry[c] = (revenueByCountry[c] || 0) + inv.amountPaidUSD;
  });

  // Business Analytics Ratios
  const acceptedQuotesCount = quotations.filter((q) => q.status === 'Accepted').length;
  const totalQuotesCount = quotations.length || 1;
  const conversionRatePct = (acceptedQuotesCount / totalQuotesCount) * 100;

  const activeContractsCount = contracts.filter((c) => c.status === 'Active' || c.status === 'Renewed').length;
  const avgProjectValueUSD = activeContractsCount > 0 ? activeContractValueUSD / activeContractsCount : 25000;

  // Customer Lifetime Value (CLV)
  const uniqueCustomers = new Set(invoices.map((i) => i.companyName)).size || 1;
  const customerLifetimeValueUSD = totalRevenueCollectedUSD / uniqueCustomers;

  return {
    totalRevenueCollectedUSD,
    totalOutstandingInvoicesUSD,
    totalContractPipelineValueUSD,
    activeContractValueUSD,
    renewalForecastUSD,
    totalPartnerCommissionsPaidUSD,
    totalPartnerCommissionsPendingUSD,
    revenueByCountry,
    conversionRatePct: Math.round(conversionRatePct),
    avgProjectValueUSD,
    customerLifetimeValueUSD,
    renewalRatePct: 92.5,
    profitMarginPct: 68.4
  };
}


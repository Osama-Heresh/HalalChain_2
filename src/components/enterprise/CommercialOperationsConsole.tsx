import React, { useState } from 'react';
import {
  DollarSign,
  Briefcase,
  FileText,
  FileCheck,
  CreditCard,
  RefreshCw,
  Users,
  Award,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Globe,
  Lock,
  PieChart,
  Percent,
  Coins,
  Send,
  Building,
  UserCheck,
  Sparkles,
  Eye,
  Check,
  X
} from 'lucide-react';
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
  CertificationApplication,
  UserRole
} from '../../types';
import {
  INITIAL_SERVICE_CATALOG,
  INITIAL_PRICE_HISTORY,
  INITIAL_QUOTATIONS,
  INITIAL_CONTRACTS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_PARTNERS,
  INITIAL_REVIEWER_PAYROLL,
  INITIAL_FINANCIAL_AUDIT_LOGS,
  INITIAL_CURRENCY_RATES,
  calculateExecutiveFinancialMetrics,
  convertCurrency,
  formatCurrency,
  generateFinancialAuditHash
} from '../../lib/commercialOpsEngine';
import { exportReport } from '../../lib/reportEngine';
import {
  buildCommercialQuotationReportOptions,
  buildCommercialInvoiceReportOptions
} from '../../lib/reportGenerators';

interface CommercialOperationsConsoleProps {
  applications?: CertificationApplication[];
  currentUserRole?: UserRole;
  currentUserName?: string;
  onRefreshData?: () => void;
}

export const CommercialOperationsConsole: React.FC<CommercialOperationsConsoleProps> = ({
  applications = [],
  currentUserRole = 'exec',
  currentUserName = 'General Manager',
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'catalog' | 'quotations' | 'contracts' | 'invoices' | 'partners' | 'payroll' | 'currency_audit'
  >('overview');

  // State
  const [services, setServices] = useState<ServiceCatalogItem[]>(INITIAL_SERVICE_CATALOG);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>(INITIAL_PRICE_HISTORY);
  const [quotations, setQuotations] = useState<QuotationRecord[]>(INITIAL_QUOTATIONS);
  const [contracts, setContracts] = useState<CommercialContractRecord[]>(INITIAL_CONTRACTS);
  const [invoices, setInvoices] = useState<CommercialInvoiceRecord[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [subscriptions, setSubscriptions] = useState<CommercialSubscriptionRecord[]>(INITIAL_SUBSCRIPTIONS);
  const [partners, setPartners] = useState<PartnerRecord[]>(INITIAL_PARTNERS);
  const [payroll, setPayroll] = useState<ReviewerPayrollRecord[]>(INITIAL_REVIEWER_PAYROLL);
  const [auditLogs, setAuditLogs] = useState<FinancialAuditLogEntry[]>(INITIAL_FINANCIAL_AUDIT_LOGS);

  // Selected Currency State
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'AED' | 'SAR' | 'EUR' | 'MYR' | 'GBP'>('USD');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal States
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showCreateQuoteModal, setShowCreateQuoteModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<CommercialInvoiceRecord | null>(null);

  // Form State for New Service
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<ServiceCatalogItem['category']>('Sharia Compliance');
  const [newServicePrice, setNewServicePrice] = useState('15000');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Form State for New Quote
  const [quoteCustomerName, setQuoteCustomerName] = useState('');
  const [quoteCompanyName, setQuoteCompanyName] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteCountry, setQuoteCountry] = useState('United Arab Emirates');
  const [selectedServiceId, setSelectedServiceId] = useState('SVC-001');

  // Form State for Payment
  const [paymentAmountUSD, setPaymentAmountUSD] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['paymentMethod']>('Bank Wire Transfer');
  const [paymentRefNo, setPaymentRefNo] = useState('');

  // Notification Toast
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Executive Financial Metrics Calculation
  const execMetrics = calculateExecutiveFinancialMetrics(invoices, payments, contracts, quotations, partners);

  // Action: Add New Service
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;

    const newSvc: ServiceCatalogItem = {
      id: `SVC-${Math.floor(100 + Math.random() * 900)}`,
      serviceName: newServiceName,
      description: newServiceDesc || 'Standard HalalChain commercial service.',
      category: newServiceCategory,
      basePriceUSD: parseFloat(newServicePrice) || 10000,
      currency: 'USD',
      estimatedDurationDays: 14,
      deliverables: ['Audit Report', 'Certification Attestation'],
      renewalRequired: newServiceCategory === 'Annual Monitoring' || newServiceCategory === 'Enterprise Subscription',
      isActive: true,
      pricingModel: 'Fixed',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setServices([newSvc, ...services]);
    setShowAddServiceModal(false);
    setNewServiceName('');
    setNewServiceDesc('');

    // Audit log
    const audit: FinancialAuditLogEntry = {
      id: `FIN-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUserName,
      action: 'Create Service Catalog Item',
      module: 'Catalog',
      entityId: newSvc.id,
      oldValue: 'N/A',
      newValue: `${newSvc.serviceName} ($${newSvc.basePriceUSD} USD)`,
      reason: 'New commercial service catalog item published',
      digitalSignatureHash: generateFinancialAuditHash('Create Service', newSvc.id, newSvc.basePriceUSD)
    };
    setAuditLogs([audit, ...auditLogs]);
    showToast(`Service "${newSvc.serviceName}" published to catalog successfully!`);
  };

  // Action: Create New Quotation
  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteCustomerName || !quoteCompanyName) return;

    const targetSvc = services.find((s) => s.id === selectedServiceId) || services[0];
    const unitPrice = targetSvc.basePriceUSD;
    const total = unitPrice;

    const newQuote: QuotationRecord = {
      id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      quotationNumber: `QT-HC-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: quoteCustomerName,
      companyName: quoteCompanyName,
      customerEmail: quoteEmail || 'contact@client.com',
      country: quoteCountry,
      currency: selectedCurrency,
      exchangeRateToBaseUSD: INITIAL_CURRENCY_RATES.find((r) => r.code === selectedCurrency)?.rateToBaseUSD || 1.0,
      items: [
        {
          serviceId: targetSvc.id,
          serviceName: targetSvc.serviceName,
          quantity: 1,
          unitPriceUSD: unitPrice,
          discountPercentage: 0,
          taxPercentage: 0,
          totalUSD: total
        }
      ],
      subtotalUSD: unitPrice,
      totalDiscountUSD: 0,
      taxTotalUSD: 0,
      grandTotalUSD: total,
      validityDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      termsAndConditions: 'Standard 50% deposit required prior to audit kickoff. Balance due upon certificate issuance.',
      digitalApprovalStatus: 'Pending Signature',
      status: 'Sent',
      createdBy: currentUserName,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setQuotations([newQuote, ...quotations]);
    setShowCreateQuoteModal(false);
    setQuoteCustomerName('');
    setQuoteCompanyName('');
    setQuoteEmail('');

    // Audit Log
    const audit: FinancialAuditLogEntry = {
      id: `FIN-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUserName,
      action: 'Generate Official Quotation',
      module: 'Quotation',
      entityId: newQuote.quotationNumber,
      oldValue: 'Draft',
      newValue: `Sent to ${newQuote.companyName} ($${newQuote.grandTotalUSD.toLocaleString()} USD)`,
      reason: 'Official commercial proposal generated & dispatched',
      digitalSignatureHash: generateFinancialAuditHash('Create Quote', newQuote.quotationNumber, newQuote.grandTotalUSD)
    };
    setAuditLogs([audit, ...auditLogs]);
    showToast(`Commercial Quotation ${newQuote.quotationNumber} issued to ${newQuote.companyName}!`);
  };

  // Action: Convert Quotation to Active Contract & Invoice
  const handleConvertQuotationToProjectAndContract = (quote: QuotationRecord) => {
    // 1. Update quote status
    const updatedQuotes = quotations.map((q) =>
      q.id === quote.id ? { ...q, status: 'Accepted' as const, digitalApprovalStatus: 'Digitally Approved' as const } : q
    );
    setQuotations(updatedQuotes);

    // 2. Create Commercial Contract
    const newContract: CommercialContractRecord = {
      id: `CTR-2026-${Math.floor(100 + Math.random() * 900)}`,
      contractNumber: `CTR-HC-2026-${Math.floor(100 + Math.random() * 900)}`,
      quotationId: quote.id,
      customerName: quote.customerName,
      companyName: quote.companyName,
      servicesIncluded: quote.items.map((i) => i.serviceName),
      totalContractValueUSD: quote.grandTotalUSD,
      currency: quote.currency,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 330 * 86400000).toISOString().split('T')[0],
      status: 'Active',
      signedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: 'Converted automatically from accepted commercial quotation.',
      autoRenewal: true
    };
    setContracts([newContract, ...contracts]);

    // 3. Create Initial Deposit Invoice (50%)
    const depositAmt = quote.grandTotalUSD * 0.5;
    const newInvoice: CommercialInvoiceRecord = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      invoiceNumber: `INV-HC-2026-${Math.floor(100 + Math.random() * 900)}`,
      contractId: newContract.id,
      quotationId: quote.id,
      customerName: quote.customerName,
      companyName: quote.companyName,
      country: quote.country,
      currency: quote.currency,
      exchangeRateToBaseUSD: quote.exchangeRateToBaseUSD,
      items: [
        {
          description: `Deposit Invoice (50%) for ${quote.items.map((i) => i.serviceName).join(', ')}`,
          quantity: 1,
          unitPrice: depositAmt,
          amount: depositAmt
        }
      ],
      subtotal: depositAmt,
      taxAmount: 0,
      totalAmount: depositAmt,
      totalAmountUSD: depositAmt,
      amountPaidUSD: 0,
      outstandingBalanceUSD: depositAmt,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paymentStatus: 'Issued',
      notes: 'Initial deposit invoice generated automatically upon contract acceptance.'
    };
    setInvoices([newInvoice, ...invoices]);

    // Audit Log
    const audit: FinancialAuditLogEntry = {
      id: `FIN-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUserName,
      action: 'Quotation Conversion to Contract & Invoice',
      module: 'Contract',
      entityId: newContract.contractNumber,
      oldValue: `Quotation: ${quote.quotationNumber} (Sent)`,
      newValue: `Contract: ${newContract.contractNumber} (Active), Deposit Invoice: ${newInvoice.invoiceNumber}`,
      reason: 'Digital approval triggered contract generation & initial billing',
      digitalSignatureHash: generateFinancialAuditHash('Convert Quote', newContract.contractNumber, quote.grandTotalUSD)
    };
    setAuditLogs([audit, ...auditLogs]);
    showToast(`Quotation ${quote.quotationNumber} accepted & converted into Contract ${newContract.contractNumber} + Invoice ${newInvoice.invoiceNumber}!`);
  };

  // Action: Record Payment
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    const paidAmt = parseFloat(paymentAmountUSD) || selectedInvoiceForPayment.outstandingBalanceUSD;

    const newPayment: PaymentRecord = {
      id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
      paymentNumber: `PAY-HC-2026-${Math.floor(100 + Math.random() * 900)}`,
      invoiceId: selectedInvoiceForPayment.id,
      invoiceNumber: selectedInvoiceForPayment.invoiceNumber,
      customerName: selectedInvoiceForPayment.customerName,
      companyName: selectedInvoiceForPayment.companyName,
      amountPaidUSD: paidAmt,
      paymentType: paidAmt >= selectedInvoiceForPayment.outstandingBalanceUSD ? 'Payment Received' : 'Partial Payment',
      paymentMethod,
      referenceNumber: paymentRefNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDate: new Date().toISOString().split('T')[0],
      recordedBy: currentUserName,
      status: 'Cleared',
      notes: 'Recorded via Commercial Operations Console'
    };

    setPayments([newPayment, ...payments]);

    // Update Invoice Status & Outstanding Balance
    const newTotalPaid = selectedInvoiceForPayment.amountPaidUSD + paidAmt;
    const newOutstanding = Math.max(0, selectedInvoiceForPayment.totalAmountUSD - newTotalPaid);
    const newStatus: CommercialInvoiceRecord['paymentStatus'] =
      newOutstanding === 0 ? 'Paid' : newTotalPaid > 0 ? 'Partially Paid' : 'Issued';

    const updatedInvoices = invoices.map((i) =>
      i.id === selectedInvoiceForPayment.id
        ? {
            ...i,
            amountPaidUSD: newTotalPaid,
            outstandingBalanceUSD: newOutstanding,
            paymentStatus: newStatus
          }
        : i
    );
    setInvoices(updatedInvoices);

    setShowRecordPaymentModal(false);
    setSelectedInvoiceForPayment(null);
    setPaymentAmountUSD('');
    setPaymentRefNo('');

    // Audit Log
    const audit: FinancialAuditLogEntry = {
      id: `FIN-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUserName,
      action: 'Payment Receipt & Invoice Balance Reconciliation',
      module: 'Payment',
      entityId: newPayment.paymentNumber,
      oldValue: `Outstanding: $${selectedInvoiceForPayment.outstandingBalanceUSD}`,
      newValue: `Paid: $${paidAmt} USD, Remaining Outstanding: $${newOutstanding} USD`,
      reason: `Payment receipt recorded via ${paymentMethod}`,
      digitalSignatureHash: generateFinancialAuditHash('Payment Clearance', newPayment.paymentNumber, paidAmt)
    };
    setAuditLogs([audit, ...auditLogs]);
    showToast(`Payment of $${paidAmt.toLocaleString()} USD recorded for ${selectedInvoiceForPayment.invoiceNumber}! Invoice status updated to ${newStatus}.`);
  };

  // Export Document Handlers
  const handleExportQuotePDF = (quote: QuotationRecord) => {
    const opts = buildCommercialQuotationReportOptions(quote, currentUserName);
    exportReport(opts);
  };

  const handleExportInvoicePDF = (inv: CommercialInvoiceRecord) => {
    const opts = buildCommercialInvoiceReportOptions(inv, currentUserName);
    exportReport(opts);
  };

  const handleExportFinancialDossier = () => {
    exportReport({
      reportTitle: 'EXECUTIVE COMMERCIAL & FINANCIAL OPERATIONS DOSSIER',
      reportSubtitle: 'High-Level Financial Performance, Service Revenues & Multi-Currency Audits',
      reportNumber: `HC-FIN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      generatedBy: currentUserName,
      format: 'PDF',
      summaryMetrics: [
        { label: 'Total Revenue Collected', value: formatCurrency(execMetrics.totalRevenueCollectedUSD, selectedCurrency) },
        { label: 'Outstanding Invoices', value: formatCurrency(execMetrics.totalOutstandingInvoicesUSD, selectedCurrency) },
        { label: 'Pipeline Value', value: formatCurrency(execMetrics.totalContractPipelineValueUSD, selectedCurrency) },
        { label: 'Active Contracts Value', value: formatCurrency(execMetrics.activeContractValueUSD, selectedCurrency) },
        { label: 'Quote Conversion Rate', value: `${execMetrics.conversionRatePct}%` }
      ],
      sections: [
        {
          title: 'Commercial Invoices & Payment Ledger',
          columns: [
            { header: 'Invoice #', key: 'num', width: 20 },
            { header: 'Company Name', key: 'company', width: 25 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Total (USD)', key: 'total', width: 15 },
            { header: 'Paid (USD)', key: 'paid', width: 15 },
            { header: 'Outstanding', key: 'due', width: 15 }
          ],
          rows: invoices.map((i) => ({
            num: i.invoiceNumber,
            company: i.companyName,
            status: i.paymentStatus,
            total: `$${i.totalAmountUSD.toLocaleString()}`,
            paid: `$${i.amountPaidUSD.toLocaleString()}`,
            due: `$${i.outstandingBalanceUSD.toLocaleString()}`
          }))
        },
        {
          title: 'Active Commercial Contracts & Renewals',
          columns: [
            { header: 'Contract #', key: 'num', width: 20 },
            { header: 'Company', key: 'company', width: 25 },
            { header: 'Services', key: 'svcs', width: 25 },
            { header: 'Total Value', key: 'val', width: 15 },
            { header: 'Renewal Date', key: 'renewal', width: 15 }
          ],
          rows: contracts.map((c) => ({
            num: c.contractNumber,
            company: c.companyName,
            svcs: c.servicesIncluded.join(', '),
            val: `$${c.totalContractValueUSD.toLocaleString()}`,
            renewal: c.renewalDate
          }))
        }
      ]
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-[9999] px-5 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border transition-all animate-bounce ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-500'
              : 'bg-rose-900 text-rose-100 border-rose-500'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          {notification.message}
        </div>
      )}

      {/* Hero Banner with Executive BI Summary */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Enterprise Financial & Commercial Ops
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-amber-500/30">
                AAOIFI Compliance Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Commercial Operations & Financial Management
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              End-to-end commercial suite: service catalog, pricing tiers, quotations, contracts, subscriptions, multi-currency invoicing, reviewer payroll, partner commissions, and real-time financial audit trails.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Currency Selector */}
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as any)}
              className="bg-slate-800 text-white text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {INITIAL_CURRENCY_RATES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol.trim()})
                </option>
              ))}
            </select>

            <button
              onClick={handleExportFinancialDossier}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export Financial Dossier
            </button>
          </div>
        </div>

        {/* Executive BI Financial Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Revenue Collected</div>
            <div className="text-lg font-black text-emerald-400 mt-0.5">
              {formatCurrency(execMetrics.totalRevenueCollectedUSD, selectedCurrency)}
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Outstanding Invoices</div>
            <div className="text-lg font-black text-amber-400 mt-0.5">
              {formatCurrency(execMetrics.totalOutstandingInvoicesUSD, selectedCurrency)}
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Pipeline Quotes Value</div>
            <div className="text-lg font-black text-indigo-300 mt-0.5">
              {formatCurrency(execMetrics.totalContractPipelineValueUSD, selectedCurrency)}
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Active Contracts Value</div>
            <div className="text-lg font-black text-blue-300 mt-0.5">
              {formatCurrency(execMetrics.activeContractValueUSD, selectedCurrency)}
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Conversion Rate</div>
            <div className="text-lg font-black text-teal-300 mt-0.5">{execMetrics.conversionRatePct}%</div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Customer Lifetime Val</div>
            <div className="text-lg font-black text-purple-300 mt-0.5">
              {formatCurrency(execMetrics.customerLifetimeValueUSD, selectedCurrency)}
            </div>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Financial BI & Analytics', icon: BarChart3 },
          { id: 'catalog', label: 'Service Catalog & Pricing', icon: Briefcase },
          { id: 'quotations', label: 'Quotations & Proposals', icon: FileText },
          { id: 'contracts', label: 'Contracts & Subscriptions', icon: FileCheck },
          { id: 'invoices', label: 'Invoices & Payments', icon: CreditCard },
          { id: 'partners', label: 'Partners & Commissions', icon: Users },
          { id: 'payroll', label: 'Reviewer Payroll', icon: Award },
          { id: 'currency_audit', label: 'Multi-Currency & Audit Log', icon: Globe }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE FINANCIAL BI & ANALYTICS OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue & Profit Breakdown Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Revenue Performance & Profitability Analysis
                </h3>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-lg">
                  {execMetrics.profitMarginPct}% Net Margin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <div className="text-xs text-slate-500">Average Project Value</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {formatCurrency(execMetrics.avgProjectValueUSD, selectedCurrency)}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <div className="text-xs text-slate-500">Annual Renewal Forecast</div>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {formatCurrency(execMetrics.renewalForecastUSD, selectedCurrency)}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <div className="text-xs text-slate-500">Subscription Renewal Rate</div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {execMetrics.renewalRatePct}%
                  </div>
                </div>
              </div>

              {/* Geographic Revenue Distribution */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Revenue Distribution by Geographical Market
                </div>
                <div className="space-y-2">
                  {Object.entries(execMetrics.revenueByCountry).map(([country, amt]) => {
                    const pct = Math.round((amt / (execMetrics.totalRevenueCollectedUSD || 1)) * 100);
                    return (
                      <div key={country} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-800 dark:text-slate-200">{country}</span>
                          <span className="text-slate-500">
                            {formatCurrency(amt, selectedCurrency)} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.max(pct, 12)}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Cash Flow & Partner Payout Status */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                Treasury & Partner Payout Metrics
              </h3>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="text-xs text-slate-500">Commissions Paid to Partners</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(execMetrics.totalPartnerCommissionsPaidUSD, selectedCurrency)}
                </div>
                <div className="text-[11px] text-slate-500">
                  Pending Payouts: {formatCurrency(execMetrics.totalPartnerCommissionsPendingUSD, selectedCurrency)}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="text-xs text-slate-500">Active Service Offerings</div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {services.filter((s) => s.isActive).length} Active Services
                </div>
                <div className="text-[11px] text-slate-500">Categories: Sharia, Smart Contract, Tokenomics</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="text-xs text-slate-500">Total Unpaid Reviews Payroll</div>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {formatCurrency(
                    payroll.reduce((s, p) => (p.paymentStatus !== 'Disbursed' ? s + p.totalPaymentsDueUSD : s), 0),
                    selectedCurrency
                  )}
                </div>
                <div className="text-[11px] text-slate-500">Immutable Reviewer Task Compensation</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICE CATALOG & PRICE MANAGEMENT */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configurable Service Catalog</h2>
              <p className="text-xs text-slate-500">Define base pricing, deliverables, currencies, and regional multiplier tiers.</p>
            </div>

            <button
              onClick={() => setShowAddServiceModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add New Service
            </button>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((s) => (
              <div
                key={s.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {s.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(s.basePriceUSD, selectedCurrency)}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{s.serviceName}</h3>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">{s.description}</p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="font-medium">{s.estimatedDurationDays} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pricing Model:</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">{s.pricingModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Annual Renewal:</span>
                      <span className="font-medium">{s.renewalRequired ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-bold text-slate-400 mb-1">Deliverables:</div>
                    <div className="flex flex-wrap gap-1">
                      {s.deliverables.map((d, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">{s.id}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Historical Price Revisions Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Service Price Adjustment Audit History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Service</th>
                    <th className="p-3">Old Price</th>
                    <th className="p-3">New Price</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Adjusted By</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {priceHistory.map((ph) => (
                    <tr key={ph.id}>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{ph.serviceName}</td>
                      <td className="p-3 text-slate-400 line-through">${ph.oldPriceUSD.toLocaleString()} USD</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">${ph.newPriceUSD.toLocaleString()} USD</td>
                      <td className="p-3 text-slate-500">{ph.reason}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{ph.changedBy}</td>
                      <td className="p-3 text-slate-400 font-mono text-[10px]">{ph.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUOTATION MANAGEMENT */}
      {activeTab === 'quotations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Commercial Quotation Management</h2>
              <p className="text-xs text-slate-500">Draft, issue, and convert approved quotations into active contracts & project applications.</p>
            </div>

            <button
              onClick={() => setShowCreateQuoteModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Issue New Quotation
            </button>
          </div>

          {/* Quotation List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3.5">Quote #</th>
                    <th className="p-3.5">Customer & Company</th>
                    <th className="p-3.5">Services</th>
                    <th className="p-3.5">Grand Total</th>
                    <th className="p-3.5">Validity Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {quotations.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{q.quotationNumber}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{q.companyName}</div>
                        <div className="text-[11px] text-slate-500">{q.customerName} ({q.country})</div>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {q.items.map((i) => i.serviceName).join(', ')}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(q.grandTotalUSD, selectedCurrency)}
                      </td>
                      <td className="p-3.5 text-slate-500">{q.validityDate}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            q.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : q.status === 'Sent'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleExportQuotePDF(q)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          Export PDF
                        </button>

                        {q.status !== 'Accepted' && (
                          <button
                            onClick={() => handleConvertQuotationToProjectAndContract(q)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] cursor-pointer shadow"
                          >
                            Accept & Convert
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONTRACTS & SUBSCRIPTIONS */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Commercial Contracts */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Active Commercial Agreements
              </h3>

              <div className="space-y-3">
                {contracts.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">{c.contractNumber}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded text-[10px] uppercase">
                        {c.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 dark:text-white text-sm">{c.companyName}</div>
                    <div className="text-xs text-slate-500">Included: {c.servicesIncluded.join(', ')}</div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700/60">
                      <span className="text-slate-400">Total Value: <strong className="text-slate-900 dark:text-white">{formatCurrency(c.totalContractValueUSD, selectedCurrency)}</strong></span>
                      <span className="text-slate-400">Renewal Date: <strong className="text-indigo-600 dark:text-indigo-400">{c.renewalDate}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recurring Commercial Subscriptions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-500" />
                Recurring Subscriptions & Annual Monitoring
              </h3>

              <div className="space-y-3">
                {subscriptions.map((s) => (
                  <div key={s.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{s.subscriptionNumber}</span>
                      <span
                        className={`px-2 py-0.5 font-bold rounded text-[10px] uppercase ${
                          s.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 dark:text-white text-sm">{s.companyName}</div>
                    <div className="text-xs text-slate-500">Category: {s.serviceCategory}</div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700/60">
                      <span className="text-slate-400">Annual Fee: <strong className="text-slate-900 dark:text-white">{formatCurrency(s.annualFeeUSD, selectedCurrency)}</strong></span>
                      <span className="text-slate-400">Next Renewal: <strong className="text-amber-600 dark:text-amber-400">{s.renewalDate}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INVOICE MANAGEMENT & PAYMENT PROCESSING */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Commercial Invoices & Payment Ledger</h2>
              <p className="text-xs text-slate-500">Issue invoices, record client payments, and track outstanding balances.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Customer / Company</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Paid</th>
                    <th className="p-3.5">Outstanding Balance</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5">Payment Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{inv.invoiceNumber}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{inv.companyName}</div>
                        <div className="text-[11px] text-slate-500">{inv.customerName}</div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(inv.totalAmountUSD, selectedCurrency)}
                      </td>
                      <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        {formatCurrency(inv.amountPaidUSD, selectedCurrency)}
                      </td>
                      <td className="p-3.5 text-amber-600 dark:text-amber-400 font-bold">
                        {formatCurrency(inv.outstandingBalanceUSD, selectedCurrency)}
                      </td>
                      <td className="p-3.5 text-slate-500">{inv.dueDate}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            inv.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : inv.paymentStatus === 'Partially Paid'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleExportInvoicePDF(inv)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          PDF
                        </button>

                        {inv.paymentStatus !== 'Paid' && (
                          <button
                            onClick={() => {
                              setSelectedInvoiceForPayment(inv);
                              setPaymentAmountUSD(inv.outstandingBalanceUSD.toString());
                              setShowRecordPaymentModal(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] cursor-pointer shadow"
                          >
                            Record Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PARTNER REGISTRY & COMMISSIONS */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Partner Program Registry & Commission Ledger</h2>
              <p className="text-xs text-slate-500">Track regional referral partners, projects brought in, generated revenue, and commission payouts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partners.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full">
                    {p.referralCode}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{p.commissionPercentage}% Commission</span>
                </div>

                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-base">{p.companyName}</div>
                  <div className="text-xs text-slate-500">{p.partnerName} ({p.country})</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Referred Projects:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{p.projectsReferredCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Revenue Generated:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(p.revenueGeneratedUSD, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Commission Paid:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(p.commissionPaidUSD, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Commission Pending:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{formatCurrency(p.commissionPendingUSD, selectedCurrency)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: REVIEWER PAYROLL INTEGRATION */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                Reviewer Task & Payroll Compensation Integration
              </h2>
              <p className="text-xs text-slate-500">
                Automatic calculation connecting completed reviewer work, approved assessments, and bonuses to payroll. (Immutable values for reviewers).
              </p>
            </div>
            <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Reviewers Cannot Alter Payroll Values
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3.5">Reviewer Name</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Tasks Completed</th>
                    <th className="p-3.5">Approved Audits</th>
                    <th className="p-3.5">Base Pay</th>
                    <th className="p-3.5">Bonus & Comm.</th>
                    <th className="p-3.5">Total Payment Due</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {payroll.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{p.reviewerName}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">{p.reviewerRole}</td>
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{p.completedTasksCount}</td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">{p.approvedAssessmentsCount}</td>
                      <td className="p-3.5 font-mono">{formatCurrency(p.basePayUSD, selectedCurrency)}</td>
                      <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(p.bonusAmountUSD + p.commissionAmountUSD, selectedCurrency)}
                      </td>
                      <td className="p-3.5 font-mono font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(p.totalPaymentsDueUSD, selectedCurrency)}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            p.paymentStatus === 'Disbursed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: MULTI-CURRENCY & IMMUTABLE AUDIT LOGS */}
      {activeTab === 'currency_audit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Exchange Rate Board */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                Base Currency Conversion Table (USD)
              </h3>

              <div className="space-y-2">
                {INITIAL_CURRENCY_RATES.map((cr) => (
                  <div key={cr.code} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{cr.name} ({cr.code})</div>
                      <div className="text-[10px] text-slate-400">Symbol: {cr.symbol}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      1 USD = {cr.rateToBaseUSD} {cr.code}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Financial Audit Trail */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Immutable Financial Action Audit Log Stream
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">SHA-256 Verified</span>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{log.action} ({log.module})</span>
                      <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                    </div>

                    <div className="text-slate-500">By: {log.user} • Target: {log.entityId}</div>
                    <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px] bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                      {log.oldValue} ➔ <span className="text-emerald-600 dark:text-emerald-400 font-bold">{log.newValue}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>Reason: {log.reason}</span>
                      <span className="text-emerald-500 font-bold">{log.digitalSignatureHash}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW SERVICE */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-[999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Service to Catalog</h3>
              <button onClick={() => setShowAddServiceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Service Name</label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. AAOIFI Sharia Governance Review"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Category</label>
                <select
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="Sharia Compliance">Sharia Compliance</option>
                  <option value="Smart Contract Audit">Smart Contract Audit</option>
                  <option value="Whitepaper Audit">Whitepaper Audit</option>
                  <option value="Governance Review">Governance Review</option>
                  <option value="Tokenomics Assessment">Tokenomics Assessment</option>
                  <option value="Annual Monitoring">Annual Monitoring</option>
                  <option value="Enterprise Subscription">Enterprise Subscription</option>
                  <option value="Training Services">Training Services</option>
                  <option value="Consulting">Consulting</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Base Price (USD)</label>
                <input
                  type="number"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  placeholder="15000"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Brief service deliverables and scope..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ISSUE NEW QUOTATION */}
      {showCreateQuoteModal && (
        <div className="fixed inset-0 z-[999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Issue Commercial Quotation</h3>
              <button onClick={() => setShowCreateQuoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Customer Contact Name</label>
                  <input
                    type="text"
                    value={quoteCustomerName}
                    onChange={(e) => setQuoteCustomerName(e.target.value)}
                    placeholder="e.g. Sheikh Ahmed Al-Mansoor"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Company / Institution Name</label>
                  <input
                    type="text"
                    value={quoteCompanyName}
                    onChange={(e) => setQuoteCompanyName(e.target.value)}
                    placeholder="e.g. Gulf Halal Sukuk Protocol"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    placeholder="client@gulfsukuk.io"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Country</label>
                  <input
                    type="text"
                    value={quoteCountry}
                    onChange={(e) => setQuoteCountry(e.target.value)}
                    placeholder="United Arab Emirates"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Select Primary Service</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.serviceName} (${s.basePriceUSD.toLocaleString()} USD)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateQuoteModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow"
                >
                  Issue Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RECORD PAYMENT */}
      {showRecordPaymentModal && selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-[999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Record Payment Receipt</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  {selectedInvoiceForPayment.invoiceNumber} • {selectedInvoiceForPayment.companyName}
                </p>
              </div>
              <button onClick={() => setShowRecordPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                  Payment Amount (USD) — Max Outstanding: ${selectedInvoiceForPayment.outstandingBalanceUSD.toLocaleString()}
                </label>
                <input
                  type="number"
                  value={paymentAmountUSD}
                  onChange={(e) => setPaymentAmountUSD(e.target.value)}
                  placeholder={selectedInvoiceForPayment.outstandingBalanceUSD.toString()}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                  <option value="Crypto Escrow">Crypto Escrow (USDT/USDC/ETH)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Corporate Transfer">Corporate Transfer</option>
                  <option value="Letter of Credit">Letter of Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Bank / Blockchain Reference #</label>
                <input
                  type="text"
                  value={paymentRefNo}
                  onChange={(e) => setPaymentRefNo(e.target.value)}
                  placeholder="e.g. ENBD-TXN-99812401 or 0x81F2..."
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecordPaymentModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow"
                >
                  Clear Payment & Reconcile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

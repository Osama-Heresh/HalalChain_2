import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CertificationApplication, WorkLogEntry, AiServiceLog, WalletTransaction } from '../../types';
import {
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Download,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { getLocalApps, getLocalWorkLogs, getLocalAiLogs } from '../../lib/api';

export const CompanyWalletView: React.FC = () => {
  const { lang } = useLanguage();
  const [apps] = useState<CertificationApplication[]>(() => getLocalApps());
  const [workLogs] = useState<WorkLogEntry[]>(() => getLocalWorkLogs());
  const [aiLogs] = useState<AiServiceLog[]>(() => getLocalAiLogs());

  const [filterType, setFilterType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Calculate Financial Breakdown from actual applications & work logs
  const customerPaymentsUsd = apps.reduce((acc, app) => {
    let amt = 0;
    if (app.depositPaid) amt += app.depositAmount;
    if (app.finalPaid) amt += app.remainingAmount;
    return acc + amt;
  }, 0);

  const totalPackageSubscriptionsUsd = apps.length * 12500; // Package revenue

  const payrollPaymentsUsd = workLogs
    .filter((w) => w.paymentStatus === 'Paid' || w.paymentStatus === 'Approved for Release')
    .reduce((acc, curr) => acc + curr.totalPayUsd, 0);

  const aiComputeExpensesUsd = aiLogs.reduce((acc, curr) => acc + curr.estimatedCostUsd, 0) + 1240; // baseline AI GPU cluster
  const operatingExpensesUsd = 18500; // Cloud hosting, security audits, legal compliance
  const refundsUsd = 2500; // Contingency refunds

  const totalIncomeUsd = customerPaymentsUsd + totalPackageSubscriptionsUsd;
  const totalExpensesUsd = payrollPaymentsUsd + aiComputeExpensesUsd + operatingExpensesUsd + refundsUsd;
  const currentBalanceUsd = totalIncomeUsd - totalExpensesUsd;

  // Monthly summary
  const monthlySummary = [
    { month: 'Mar 2026', income: 45000, expenses: 14200, netProfit: 30800 },
    { month: 'Apr 2026', income: 68000, expenses: 18500, netProfit: 49500 },
    { month: 'May 2026', income: 82000, expenses: 22100, netProfit: 59900 },
    { month: 'Jun 2026', income: 95000, expenses: 24800, netProfit: 70200 },
    { month: 'Jul 2026', income: totalIncomeUsd, expenses: totalExpensesUsd, netProfit: currentBalanceUsd }
  ];

  // Derive transaction history from applications, work logs, AI costs
  const transactions: WalletTransaction[] = [
    ...apps.map((app) => ({
      id: `TX-DEP-${app.id}`,
      date: app.submittedAt.split('T')[0] || '2026-07-20',
      title: `Deposit Payment - ${app.companyName}`,
      category: 'Customer Deposit' as const,
      type: 'credit' as const,
      amountUsd: app.depositAmount,
      status: app.depositPaid ? ('Completed' as const) : ('Pending' as const),
      relatedProject: app.companyName,
      description: `Starter 50% deposit for ${app.packageType} Sharia Audit`
    })),
    ...workLogs.map((w) => ({
      id: `TX-PAY-${w.id}`,
      date: w.dateLogged,
      title: `Auditor Payroll Release - ${w.employeeName}`,
      category: 'Payroll' as const,
      type: 'debit' as const,
      amountUsd: w.totalPayUsd,
      status: w.paymentStatus === 'Paid' ? ('Completed' as const) : ('Pending' as const),
      relatedProject: w.projectName,
      description: `${w.role.toUpperCase()} task compensation (${w.hoursWorked} hrs @ $${w.hourlyRateUsd}/hr)`
    })),
    {
      id: 'TX-AI-GPU-01',
      date: '2026-07-22',
      title: 'Google Gemini Pro 1.5 & AI Node Cluster',
      category: 'AI Operating Expense' as const,
      type: 'debit' as const,
      amountUsd: 1240,
      status: 'Completed' as const,
      relatedProject: 'HalalChain AI Assessment Engine',
      description: 'Automated Whitepaper extraction & Smart Contract static vulnerability scan tokens'
    },
    {
      id: 'TX-SUB-CLOUD',
      date: '2026-07-01',
      title: 'Enterprise Multi-Cloud Infrastructure & HSM',
      category: 'Subscription' as const,
      type: 'debit' as const,
      amountUsd: 4800,
      status: 'Completed' as const,
      relatedProject: 'HalalChain Core Platform',
      description: 'Cloud Run, Firestore DB, Key Vault, and Global CDN hosting'
    }
  ];

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType !== 'All' && tx.category !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        tx.title.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        (tx.relatedProject && tx.relatedProject.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] rounded-2xl p-6 text-white border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
              {lang === 'ar' ? 'محفظة الشركة والإدارة المالية' : 'General Manager Company Wallet'}
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400 text-slate-950">
              EXECUTIVE VIEW ONLY
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans max-w-xl">
            {lang === 'ar'
              ? 'المرصد المالي الشامل لمؤسسة حلال تشين: تتبع الإيرادات، المدفوعات، الرواتب، وتكاليف الذكاء الاصطناعي والبنية التحتية.'
              : 'Complete organizational financial dashboard tracking customer deposits, audit package subscriptions, auditor payroll, and AI cluster operating costs.'}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-right">
            <div className="text-[10px] font-mono text-amber-300 uppercase">
              {lang === 'ar' ? 'احتياطي الخزينة الحالية' : 'Net Treasury Reserve'}
            </div>
            <div className="text-2xl font-black font-serif text-emerald-400 tracking-tight">
              ${currentBalanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'إجمالي الإيرادات' : 'Gross Income'}</span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-600">
            ${totalIncomeUsd.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Customer Deposits & Final Fees</span>
            <span className="font-mono text-emerald-700 font-bold">+28% YoY</span>
          </div>
        </div>

        {/* Card 2: Operating Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}</span>
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-rose-600">
            ${totalExpensesUsd.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Payroll, AI Compute & Hosting</span>
            <span className="font-mono text-rose-700 font-bold">Safe SLA Budget</span>
          </div>
        </div>

        {/* Card 3: Auditor Payroll Liabilities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'مدفوعات رواتب الموظفين' : 'Auditor Payroll Paid'}</span>
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            ${payrollPaymentsUsd.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            Distributed to <strong className="text-slate-800">12 Expert Reviewers</strong>
          </div>
        </div>

        {/* Card 4: AI Compute & Ops */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'تكاليف الذكاء الاصطناعي والبنية' : 'AI & Operating Costs'}</span>
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            ${(aiComputeExpensesUsd + operatingExpensesUsd).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            Gemini Flash 1.5 & Cloud Node Cluster
          </div>
        </div>
      </div>

      {/* Financial Bar Chart & Monthly Net Profit Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="font-bold font-serif text-slate-900 text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              {lang === 'ar' ? 'ملخص الأداء المالي الشهري' : 'Monthly Financial Performance Summary'}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {lang === 'ar' ? 'مقارنة الأرباح الصافية والإيرادات عبر الأشهر الماضية' : 'Comparison of gross revenue, operational expenses, and net profit margins.'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-700 border border-slate-200">
            2026 Fiscal Quarter Breakdown
          </span>
        </div>

        {/* Visual Monthly Performance Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {monthlySummary.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-600 text-center border-b border-slate-200 pb-2">
                {item.month}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-emerald-700">
                  <span>In:</span>
                  <span className="font-mono font-bold">${item.income.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-rose-700">
                  <span>Out:</span>
                  <span className="font-mono font-bold">${item.expenses.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-900 pt-2 border-t border-slate-200 font-bold">
                  <span>Net:</span>
                  <span className="font-mono text-emerald-800">${item.netProfit.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress bar visualizer */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${Math.min(100, (item.netProfit / item.income) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Transaction History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold font-serif text-slate-900 text-base">
              {lang === 'ar' ? 'سجل التدفقات المالية للشركة' : 'Company Financial Transaction History'}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {lang === 'ar' ? 'جميع التحويلات والمدفوعات المسجلة في قاعدة البيانات' : 'Official organization ledger entries detailing incoming client payments and outgoing operational costs.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث بالاسم أو البيان...' : 'Search transactions...'}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">{lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
              <option value="Customer Deposit">{lang === 'ar' ? 'إيداعات العملاء' : 'Customer Deposits'}</option>
              <option value="Payroll">{lang === 'ar' ? 'رواتب المدققين' : 'Auditor Payroll'}</option>
              <option value="AI Operating Expense">{lang === 'ar' ? 'مصاريف الذكاء الاصطناعي' : 'AI Operating Costs'}</option>
              <option value="Subscription">{lang === 'ar' ? 'الاشتراكات والبنية' : 'Subscriptions'}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <p className="text-sm font-semibold text-slate-700">No company transactions match the filter criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">{lang === 'ar' ? 'المعاملة' : 'Transaction Entry'}</th>
                  <th className="py-3.5 px-4 font-bold">{lang === 'ar' ? 'المشروع / الجهة' : 'Entity / Project'}</th>
                  <th className="py-3.5 px-4 font-bold">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="py-3.5 px-4 font-bold">{lang === 'ar' ? 'التصنيف' : 'Category'}</th>
                  <th className="py-3.5 px-4 font-bold text-right">{lang === 'ar' ? 'المبلغ' : 'Amount ($ USD)'}</th>
                  <th className="py-3.5 px-4 font-bold text-center">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            tx.type === 'credit'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {tx.type === 'credit' ? (
                            <ArrowDownRight className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 font-sans">{tx.title}</p>
                          <p className="text-[11px] text-slate-500 font-mono max-w-xs truncate">{tx.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {tx.relatedProject || 'Organization Core'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {tx.date}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sm whitespace-nowrap">
                      <span className={tx.type === 'credit' ? 'text-emerald-700' : 'text-rose-700'}>
                        {tx.type === 'credit' ? '+' : '-'}${tx.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs font-mono text-slate-500 flex items-center justify-between flex-wrap gap-2">
          <span>HalalChain™ Corporate Finance & Governance Module</span>
          <span className="text-slate-700 font-bold">100% Sharia Non-Usurious Accounting Standard</span>
        </div>
      </div>
    </div>
  );
};

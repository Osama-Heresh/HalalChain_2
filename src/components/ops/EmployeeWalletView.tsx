import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole, RemoteEmployee, WorkLogEntry, WalletTransaction } from '../../types';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Building,
  Briefcase,
  Users,
  Coins
} from 'lucide-react';
import { getLocalEmployees, getLocalWorkLogs } from '../../lib/api';

interface EmployeeWalletViewProps {
  currentUserRole: UserRole;
}

export const EmployeeWalletView: React.FC<EmployeeWalletViewProps> = ({ currentUserRole }) => {
  const { lang } = useLanguage();
  const [employees] = useState<RemoteEmployee[]>(() => getLocalEmployees());
  const [workLogs] = useState<WorkLogEntry[]>(() => getLocalWorkLogs());

  // Current selected employee (defaults to first matching role or first employee)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(() => {
    const match = employees.find((e) => e.role === currentUserRole);
    return match ? match.id : employees[0]?.id || 'EMP-001';
  });

  const [currency, setCurrency] = useState<'USD' | 'HLC'>('USD');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  // Calculate employee specific payroll & work logs
  const employeeWorkLogs = workLogs.filter((w) => w.employeeId === selectedEmployee.id);

  const pendingPayrollUsd = employeeWorkLogs
    .filter((w) => w.paymentStatus === 'Pending Approval' || w.paymentStatus === 'Approved for Release')
    .reduce((acc, curr) => acc + curr.totalPayUsd, 0);

  const totalPaidUsd = employeeWorkLogs
    .filter((w) => w.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.totalPayUsd, 0);

  const currentBalanceUsd = (selectedEmployee.completedProjects * 850) + pendingPayrollUsd;
  const bonusesUsd = Math.round(selectedEmployee.qualityScore >= 95 ? 450 : 200);
  const deductionsUsd = Math.round(selectedEmployee.qualityScore < 90 ? 150 : 0);

  // Convert USD to HLC (1 USD = 2.5 HLC)
  const formatAmount = (usdVal: number) => {
    if (currency === 'HLC') {
      const hlc = usdVal * 2.5;
      return `${hlc.toLocaleString('en-US', { maximumFractionDigits: 0 })} HLC`;
    }
    return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Build wallet transactions from work logs & bonuses
  const transactions: WalletTransaction[] = [
    ...employeeWorkLogs.map((w) => ({
      id: `TX-${w.id}`,
      date: w.dateLogged,
      title: `${w.projectName} Audit Deliverable`,
      category: 'Payroll' as const,
      type: 'credit' as const,
      amountUsd: w.totalPayUsd,
      status: w.paymentStatus === 'Paid' ? ('Completed' as const) : ('Pending' as const),
      relatedProject: w.projectName,
      description: w.taskDescription
    })),
    {
      id: `TX-BONUS-${selectedEmployee.id}`,
      date: '2026-07-20',
      title: 'Q2 SLA Excellence Performance Bonus',
      category: 'Bonus' as const,
      type: 'credit' as const,
      amountUsd: bonusesUsd,
      status: 'Completed' as const,
      relatedProject: 'HalalChain SLA Governance',
      description: `Quality score achieved: ${selectedEmployee.qualityScore}%`
    }
  ];

  if (deductionsUsd > 0) {
    transactions.push({
      id: `TX-DED-${selectedEmployee.id}`,
      date: '2026-07-15',
      title: 'SLA Adherence Adjustment',
      category: 'Deduction' as const,
      type: 'debit' as const,
      amountUsd: deductionsUsd,
      status: 'Completed' as const,
      relatedProject: 'Quality Review',
      description: 'Adjustment for delayed task sign-off.'
    });
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (filterCategory !== 'All' && tx.category !== filterCategory) return false;
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      return (
        tx.title.toLowerCase().includes(query) ||
        tx.description.toLowerCase().includes(query) ||
        (tx.relatedProject && tx.relatedProject.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Employee Selection Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-serif text-slate-900">
              {lang === 'ar' ? 'محفظة الموظف والمكافآت' : 'Employee Operational Wallet'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {selectedEmployee.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            {lang === 'ar'
              ? 'سجل المستحقات المالية، الرواتب المعلّقة، البونصات والتحويلات المكتملة'
              : 'Informational breakdown of accrued pay, pending payroll releases, bonuses, and transaction history.'}
          </p>
        </div>

        {/* Currency & Employee Selector Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Employee Selector for PMs/Admins */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
            <Users className="w-4 h-4 text-slate-400 ml-1" />
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Currency Toggle Button */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-slate-900 text-amber-400 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('HLC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                currency === 'HLC'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HLC (Tokens)
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Accrued Balance */}
        <div className="bg-gradient-to-br from-[#0B132B] to-[#1C2541] text-white p-5 rounded-2xl border border-amber-500/30 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-amber-400 text-xs font-mono mb-2">
            <span>{lang === 'ar' ? 'الرصيد المتاح' : 'Available Balance'}</span>
            <Wallet className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold font-serif text-white tracking-tight">
            {formatAmount(currentBalanceUsd)}
          </div>
          <div className="mt-2 text-[11px] text-slate-300 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">+100%</span>
            <span>{lang === 'ar' ? 'جاهز للسحب عند الموافقة' : 'Ready for payroll distribution'}</span>
          </div>
        </div>

        {/* Card 2: Pending Payroll */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'المستحقات المعلقة' : 'Pending Payroll'}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {formatAmount(pendingPayrollUsd)}
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            {employeeWorkLogs.filter((w) => w.paymentStatus !== 'Paid').length} {lang === 'ar' ? 'ساعات بانتظار الاعتماد' : 'unpaid work log entries'}
          </div>
        </div>

        {/* Card 3: Bonuses Earned */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'البونص والمكافآت' : 'Bonuses & Rewards'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-600">
            +{formatAmount(bonusesUsd)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            SLA Rating: <strong className="text-slate-800">{selectedEmployee.qualityScore}%</strong>
          </div>
        </div>

        {/* Card 4: Total Lifetime Earned */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>{lang === 'ar' ? 'إجمالي الأرباح المكتملة' : 'Lifetime Paid'}</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {formatAmount(totalPaidUsd + currentBalanceUsd)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {selectedEmployee.completedProjects} {lang === 'ar' ? 'مشاريع منفذة بنجاح' : 'completed project audits'}
          </div>
        </div>
      </div>

      {/* Wallet Transactions Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold font-serif text-slate-900 text-base">
              {lang === 'ar' ? 'سجل العمليات المالية' : 'Wallet Transaction Ledger'}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {lang === 'ar'
                ? `بيانات الأجور والمكافآت الخاصة بالموظف ${selectedEmployee.name}`
                : `Verified payout log entries and SLA bonuses for ${selectedEmployee.name}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث بالاسم أو المشروع...' : 'Search transactions...'}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500 w-48 sm:w-60"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">{lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
              <option value="Payroll">{lang === 'ar' ? 'رواتب المهام' : 'Payroll'}</option>
              <option value="Bonus">{lang === 'ar' ? 'المكافآت' : 'Bonuses'}</option>
              <option value="Deduction">{lang === 'ar' ? 'الخصومات' : 'Deductions'}</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Coins className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {lang === 'ar' ? 'لا توجد عمليات مالية مطابقة' : 'No wallet transactions found'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'ar' ? 'جرب تغيير عبارة البحث أو الفلتر لعرض المزيد' : 'Try adjusting search query or category filters to view entries.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">{lang === 'ar' ? 'المعاملة' : 'Transaction'}</th>
                  <th className="py-3.5 px-4 font-bold">{lang === 'ar' ? 'المشروع' : 'Project'}</th>
                  <th className="py-3.5 px-4 font-bold">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="py-3.5 px-4 font-bold">{lang === 'ar' ? 'التصنيف' : 'Category'}</th>
                  <th className="py-3.5 px-4 font-bold text-right">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
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
                          <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs">{tx.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {tx.relatedProject || 'General Workforce'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {tx.date}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          tx.category === 'Payroll'
                            ? 'bg-blue-100 text-blue-800'
                            : tx.category === 'Bonus'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sm whitespace-nowrap">
                      <span className={tx.type === 'credit' ? 'text-emerald-700' : 'text-rose-700'}>
                        {tx.type === 'credit' ? '+' : '-'}{formatAmount(tx.amountUsd)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 ${
                          tx.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {tx.status === 'Completed' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                        )}
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs font-mono text-slate-500 flex items-center justify-between flex-wrap gap-2">
          <span>HalalChain™ Enterprise SLA Compensation Engine • Informational Record Only</span>
          <span className="text-slate-700 font-bold">1 USD = 2.5 HLC Governance Tokens</span>
        </div>
      </div>
    </div>
  );
};

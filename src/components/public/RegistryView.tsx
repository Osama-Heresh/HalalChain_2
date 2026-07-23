import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PublicCertifiedProject } from '../../types';
import { Search, Filter, Lock, ExternalLink, ShieldCheck, CheckCircle2, Award, FileText } from 'lucide-react';
import { ShariaCertificateModal } from '../ShariaCertificateModal';

interface RegistryViewProps {
  certifiedProjects: PublicCertifiedProject[];
  onSelectVerify: (certNumber: string) => void;
}

export const RegistryView: React.FC<RegistryViewProps> = ({
  certifiedProjects,
  onSelectVerify
}) => {
  const { t, dir, lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCertProject, setSelectedCertProject] = useState<PublicCertifiedProject | null>(null);

  const categoriesEn = ['All', 'L1 Blockchain Ecosystem', 'Real World Assets (RWA Gold)', 'DeFi / Mudarabah Liquidity', 'Payments & Settlement', 'Philanthropy & Endowment'];
  const categoriesAr = [
    { label: 'جميع التصنيفات', value: 'All' },
    { label: 'منظومة بلوكشين الطبقة 1', value: 'L1 Blockchain Ecosystem' },
    { label: 'الأصول الحقيقية (الذهب الرقمي)', value: 'Real World Assets (RWA Gold)' },
    { label: 'التمويل اللامركزي / سيولة المضاربة', value: 'DeFi / Mudarabah Liquidity' },
    { label: 'المدفوعات والتسويات', value: 'Payments & Settlement' },
    { label: 'الأوقاف والعمل الخيري', value: 'Philanthropy & Endowment' }
  ];

  const statuses = ['All', 'valid', 'under_review', 'suspended', 'revoked'];

  const filteredProjects = certifiedProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.blockchain.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.certificateStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-mono font-medium border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'ar' ? 'السجل العام للمشاريع المعتمدة شرعياً' : 'Public Halal Web3 Registry'}</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-slate-900">{t('registry.title')}</h1>
        <p className="text-sm text-slate-600">{t('registry.subtitle')}</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:right-3.5 rtl:left-auto" />
          <input
            type="text"
            placeholder={t('registry.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono bg-white"
          >
            {lang === 'ar'
              ? categoriesAr.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))
              : categoriesEn.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono bg-white"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'All'
                  ? (lang === 'ar' ? 'جميع الحالات' : 'All Statuses')
                  : s === 'valid'
                  ? (lang === 'ar' ? 'صالحة ومفعلة' : 'VALID')
                  : s === 'under_review'
                  ? (lang === 'ar' ? 'قيد المراجعة' : 'UNDER REVIEW')
                  : s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                <th className="p-4">{lang === 'ar' ? 'المشروع' : 'Project'}</th>
                <th className="p-4">{lang === 'ar' ? 'البلوكشين' : 'Blockchain'}</th>
                <th className="p-4">{lang === 'ar' ? 'التصنيف' : 'Category'}</th>
                <th className="p-4">{lang === 'ar' ? 'نوع الشهادة' : 'Certificate Type'}</th>
                <th className="p-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="p-4">{lang === 'ar' ? 'درجة المخاطر' : 'Risk Rating'}</th>
                <th className="p-4 text-right rtl:text-left">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-mono">
                    {lang === 'ar' ? 'لا توجد مشاريع معتمدة تطابق معايير البحث الحالية.' : 'No certified projects match your search criteria.'}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.logoUrl}
                          alt={project.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{project.name}</div>
                          <span className="text-[10px] text-slate-500 font-mono">{project.symbol} • {project.certificateNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-700">{project.blockchain}</td>
                    <td className="p-4 text-slate-600">{project.category}</td>
                    <td className="p-4 text-slate-700 font-medium">{project.certificateType}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          project.certificateStatus === 'valid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {project.certificateStatus === 'valid' && lang === 'ar' ? 'صالحة' : project.certificateStatus}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-semibold text-amber-700">{project.riskRating}</td>
                    <td className="p-4 text-right rtl:text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCertProject(project)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'عرض الشهادة' : 'View Certificate'}</span>
                        </button>
                        <button
                          onClick={() => onSelectVerify(project.certificateNumber)}
                          className="px-3 py-1.5 rounded-lg bg-[#0B132B] text-amber-300 font-semibold text-xs hover:bg-[#1C2541] transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Lock className="w-3 h-3 text-emerald-400" />
                          <span>{lang === 'ar' ? 'تحقق' : 'Verify'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      <ShariaCertificateModal
        isOpen={!!selectedCertProject}
        onClose={() => setSelectedCertProject(null)}
        project={selectedCertProject}
      />
    </div>
  );
};

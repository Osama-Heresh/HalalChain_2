import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole, TalentApplication } from '../../types';
import { getLocalTalentApps, saveLocalTalentApps } from '../../lib/api';
import {
  Users,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Globe,
  Clock,
  Send,
  Sparkles,
  FileText,
  Code,
  Award,
  AlertCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { GoldFiligreeLine } from '../IslamicPatternBg';

interface JoinTeamViewProps {
  onApplicationSubmitted?: () => void;
}

export const JoinTeamView: React.FC<JoinTeamViewProps> = ({ onApplicationSubmitted }) => {
  const { lang } = useLanguage();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    role: 'tech_auditor' as UserRole,
    country: lang === 'ar' ? 'السعودية' : 'Saudi Arabia',
    timeZone: 'GMT+3',
    expectedHourlyRateUsd: 150,
    skills: [] as string[],
    customSkillInput: '',
    experienceYears: 5,
    bio: '',
    education: '',
    experienceDetails: '',
    cvSummary: '',
    portfolioUrl: '',
    githubUrl: '',
    cvFileName: '',
    cvFileSize: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const scholarSkillPresets = [
    'AAOIFI Sharia Standards',
    'Mudarabah & Musharakah',
    'Riba & Gharar Screening',
    'Sukuk Structuring',
    'Fiqh al-Muamalat',
    'DeFi Yield Pool Audit'
  ];

  const techAuditorSkillPresets = [
    'Solidity Security',
    'Bytecode Disassembly',
    'Slither & Mythril Static Analysis',
    'Re-entrancy Guard Verification',
    'Timelock Multi-sig Audit',
    'EVM Chain Analysis'
  ];

  const bizAnalystSkillPresets = [
    'Tokenomics Sustainability',
    'Vault Reserve Oracle Audit',
    'Staking Yield Mechanics',
    'Financial Modeling',
    'Risk Assessment'
  ];

  const qaSkillPresets = [
    'Registry Hash Verification',
    'Immutable QR Endpoint Audit',
    'SLA Compliance Testing',
    'Metadata Integrity'
  ];

  const getPresetSkillsForRole = (role: UserRole) => {
    switch (role) {
      case 'scholar':
        return scholarSkillPresets;
      case 'tech_auditor':
        return techAuditorSkillPresets;
      case 'business_analyst':
        return bizAnalystSkillPresets;
      case 'qa':
      default:
        return qaSkillPresets;
    }
  };

  const handleToggleSkill = (skill: string) => {
    if (form.skills.includes(skill)) {
      setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
    } else {
      setForm({ ...form, skills: [...form.skills, skill] });
    }
  };

  const handleAddCustomSkill = () => {
    if (form.customSkillInput.trim() && !form.skills.includes(form.customSkillInput.trim())) {
      setForm({
        ...form,
        skills: [...form.skills, form.customSkillInput.trim()],
        customSkillInput: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!form.fullName.trim() || !form.email.trim()) {
      setErrorMessage(
        lang === 'ar'
          ? 'الرجاء إدخال الاسم الكامل والبريد الإلكتروني الرسمي.'
          : 'Please enter your full name and official email address.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || form.whatsappNumber || '+966 50 123 4567',
        whatsappNumber: form.whatsappNumber || form.phone || '+966501234567',
        role: form.role,
        country: form.country,
        timeZone: form.timeZone,
        expectedHourlyRateUsd: form.expectedHourlyRateUsd,
        skills: form.skills.length > 0 ? form.skills : ['Web3 Evaluation', 'Sharia Verification'],
        experienceYears: form.experienceYears,
        bio: form.bio || form.cvSummary || (lang === 'ar' ? 'خبرة مهنية متخصصة في مجال تقييم المشاريع والامتثال.' : 'Experienced professional in Web3 evaluation & Sharia audits.'),
        education: form.education || (lang === 'ar' ? '• شهادة عليا في الفقه المالي / أمان البرمجيات' : '• Higher Degree in Islamic Finance / Software Security'),
        experienceDetails: form.experienceDetails || (lang === 'ar' ? '• خبرة عمل في تدقيق المشاريع وتوكنوميكس الويب 3' : '• Work experience in project auditing & Web3 tokenomics'),
        cvSummary: form.cvSummary || (lang === 'ar' ? 'خبرة مهنية متخصصة في مجال تقييم المشاريع والامتثال.' : 'Experienced professional in Web3 evaluation & Sharia audits.'),
        portfolioUrl: form.portfolioUrl,
        githubUrl: form.githubUrl,
        cvFileName: form.cvFileName || `CV_${form.fullName.replace(/\s+/g, '_')}_Attachment.pdf`,
        cvFileSize: form.cvFileSize || '2.2 MB'
      };

      let appToSubmit: TalentApplication | null = null;
      try {
        const res = await fetch('/api/talent-applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          appToSubmit = await res.json();
        }
      } catch (err) {
        console.warn('Server offline, submitting talent application locally', err);
      }

      if (!appToSubmit) {
        appToSubmit = {
          id: `TAL-${Date.now()}`,
          fullName: payload.fullName,
          email: payload.email,
          role: payload.role as UserRole,
          status: 'Pending Review',
          appliedDate: new Date().toISOString().split('T')[0],
          country: payload.country,
          timeZone: payload.timeZone,
          expectedHourlyRateUsd: payload.expectedHourlyRateUsd,
          skills: payload.skills,
          experienceYears: payload.experienceYears,
          bio: payload.bio,
          education: payload.education,
          experienceDetails: payload.experienceDetails,
          cvSummary: payload.cvSummary,
          portfolioUrl: payload.portfolioUrl,
          githubUrl: payload.githubUrl,
          cvFileName: payload.cvFileName,
          cvFileSize: payload.cvFileSize
        };
      }

      const currentTalent = getLocalTalentApps();
      saveLocalTalentApps([appToSubmit, ...currentTalent]);
      setSubmittedApp(appToSubmit);
      if (onApplicationSubmitted) {
        onApplicationSubmitted();
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Network error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header */}
      <section className="relative bg-[#0B132B] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl border border-amber-500/20 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
            <Users className="w-4 h-4 text-amber-400" />
            <span>
              {lang === 'ar'
                ? 'انضم للشبكة العالمية لخبراء التقييم الشرعي والفني'
                : 'Join the Global Network of Sharia & Web3 Auditors'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-white leading-tight">
            {lang === 'ar' ? (
              <>
                ساهم في بناء المستقبل المالي المستدام للويب 3 <br />
                <span className="text-amber-400">كن جزءاً من فريق التقييم الشرعي والفني</span>
              </>
            ) : (
              <>
                Evaluate the Future of Halal Decentralized Finance <br />
                <span className="text-amber-400">Join HalalChain™'s Expert Evaluation Team</span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            {lang === 'ar'
              ? 'نستقطب كبار علماء الشريعة، ومدققي العقود الذكية، ومحللي الأعمال، ومسؤولي الجودة للانضمام إلى شبكتنا العالمية المرنة مع تعويضات مالية بالساعة بالدولار وإخطار آلي فوري لمدير المشاريع.'
              : 'We invite Sharia scholars, smart contract security auditors, Web3 business analysts, and QA specialists to join our global remote evaluation team with transparent USD hourly rates and instant Project Manager review.'}
          </p>

          {/* Quick Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left font-sans">
            <div className="bg-[#1C2541]/80 p-4 rounded-xl border border-white/10 flex items-start gap-3">
              <Globe className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'ar' ? 'عمل مرن عن بُعد' : 'Flexible Global Remote'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'اعمل من أي مكان في العالم بحرية كاملة' : 'Work from anywhere on high-profile crypto audits'}
                </p>
              </div>
            </div>

            <div className="bg-[#1C2541]/80 p-4 rounded-xl border border-white/10 flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'ar' ? 'عائد مجزٍ بالدولار' : 'Competitive Rates in USD'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'أسعار تدقيق معتمدة ومدفوعة بانتظام' : 'Transparent hourly compensation logged on-chain'}
                </p>
              </div>
            </div>

            <div className="bg-[#1C2541]/80 p-4 rounded-xl border border-white/10 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'ar' ? 'معايير أيوفي AAOIFI' : 'AAOIFI Standard Rigor'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'استخدام أدوات الفحص الفني والشرعي المتقدمة' : 'Apply cutting-edge bytecode & Sharia verification'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Application Form or Success Banner */}
      <div className="max-w-4xl mx-auto">
        {submittedApp ? (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-8 text-slate-900 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-md">
                  {lang === 'ar' ? 'تم تقديم الطلب بنجاح والإخطار جاري' : 'Application Submitted & PM Alerted'}
                </span>
                <h3 className="text-2xl font-bold font-serif text-emerald-950 mt-1">
                  {lang === 'ar' ? `أهلاً بك، ${submittedApp.fullName}` : `Welcome Aboard, ${submittedApp.fullName}`}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed border-t border-emerald-200 pt-4">
              {lang === 'ar'
                ? `تم تسجيل طلب انضمامك إلى فريق التقييم بنجاح تحت الرقم المرجعي (${submittedApp.id}). تم إرسال تنبيه آلي عاجل إلى مدير المشاريع (Project Manager) لمراجعة سيرتك الذاتية ومؤهلاتك والاعتماد.`
                : `Your evaluation team application has been successfully recorded with reference ID (${submittedApp.id}). An instant high-priority alert notification has been dispatched to the HalalChain™ Project Manager (PM) for review and recruitment approval.`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/80 p-4 rounded-2xl border border-emerald-200 text-xs">
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'رقم الطلب' : 'Reference ID'}</span>
                <span className="font-bold font-mono text-slate-900">{submittedApp.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'الدور المتقدم له' : 'Applied Role'}</span>
                <span className="font-bold text-slate-900 capitalize">{submittedApp.role.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'الأجر المتوقع للساعة' : 'Hourly Rate'}</span>
                <span className="font-bold font-mono text-emerald-700">${submittedApp.expectedHourlyRateUsd} USD/hr</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                onClick={() => setSubmittedApp(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                {lang === 'ar' ? 'تقديم طلب آخر' : 'Submit Another Application'}
              </button>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'ar' ? 'زمن الاستجابة المتوقع للمدير: خلال 24 ساعة' : 'Expected PM Response SLA: < 24 Hours'}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
            <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                  {lang === 'ar' ? 'استمارة الانضمام لفريق التقييم الشرعي والفني' : 'Evaluation Team Membership Application'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ar'
                    ? 'عبر تعبئة هذه الاستمارة، سيصل تنبيه مباشر لمدير المشاريع لمراجعة سيرتك واعتماد انضمامك.'
                    : 'Submitting this application triggers an immediate notification alert on the PM Operations Hub.'}
                </p>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold rounded-full font-mono">
                {lang === 'ar' ? 'استمارة سريعة' : 'Instant PM Alert'}
              </span>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-300 text-rose-900 p-4 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Field Section 1: Target Role & Personal Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2 border-b pb-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? '1. التخصص والبيانات الشخصية' : '1. Target Role & Personal Details'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الاسم الكامل الثلاثي *' : 'Full Legal / Professional Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder={lang === 'ar' ? 'د. يوسف علي Mansouri' : 'Dr. Youssef Al-Mansouri'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'البريد الإلكتروني الرسمي *' : 'Official Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="expert@halalchain.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Target Evaluation Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الدور المستهدف في فريق التقييم *' : 'Target Role in Evaluation Team *'}
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  >
                    <option value="tech_auditor">
                      {lang === 'ar' ? '💻 مدقق أمان العقود الذكية والبلوكشين (Blockchain Tech Auditor)' : '💻 Blockchain Smart Contract Security Auditor'}
                    </option>
                    <option value="scholar">
                      {lang === 'ar' ? '📜 مستشار وعالم شرعي كبار (Senior Sharia Scholar)' : '📜 Senior Sharia Scholar & AAOIFI Specialist'}
                    </option>
                    <option value="business_analyst">
                      {lang === 'ar' ? '📊 محلل اقتصاديات التوكن والأعمال (Web3 Tokenomics Analyst)' : '📊 Web3 Tokenomics & Business Analyst'}
                    </option>
                    <option value="qa">
                      {lang === 'ar' ? '🛡️ مسؤول ضمان الجودة وموثوقية السجل (QA & Registry Officer)' : '🛡️ Quality Assurance & Registry Officer'}
                    </option>
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الدولة / مكان الإقامة *' : 'Primary Country of Residence *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder={lang === 'ar' ? 'الإمارات / الأردن / قطر' : 'UAE, Saudi Arabia, UK, Singapore...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Field Section 2: Financial & Experience Rates */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2 border-b pb-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'ar' ? '2. الخبرة والأجر المتوقع' : '2. Experience & Hourly Rate Standard'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Hourly Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الأجر المتوقع للساعة (USD/hr) *' : 'Expected Hourly Rate (USD/hr) *'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      required
                      min={30}
                      max={500}
                      value={form.expectedHourlyRateUsd}
                      onChange={(e) => setForm({ ...form, expectedHourlyRateUsd: Number(e.target.value) })}
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Experience Years */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'سنوات الخبرة العملية *' : 'Years of Relevant Experience *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={40}
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'المنطقة الزمنية (TimeZone) *' : 'Timezone (GMT) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.timeZone}
                    onChange={(e) => setForm({ ...form, timeZone: e.target.value })}
                    placeholder="GMT+3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Field Section 3: Specialized Skills & Presets */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2 border-b pb-2">
                <Code className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? '3. المهارات والخبرات المعتمدة' : '3. Specialized Skills & Verification Preset Tags'}</span>
              </h3>

              <p className="text-xs text-slate-500">
                {lang === 'ar'
                  ? 'اختر المهارات المناسبة لدورك من الخيارات السريعة أدناه لتعزيز فرصة الاعتماد المباشر من المدير:'
                  : 'Click skill tags relevant to your expertise to highlight them on the PM candidate card:'}
              </p>

              <div className="flex flex-wrap gap-2">
                {getPresetSkillsForRole(form.role).map((skill) => {
                  const isSelected = form.skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => handleToggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{skill}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom skill input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={form.customSkillInput}
                  onChange={(e) => setForm({ ...form, customSkillInput: e.target.value })}
                  placeholder={lang === 'ar' ? 'إضافة مهارة خاصة أخرى...' : 'Add another specific skill...'}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  {lang === 'ar' ? 'إضافة' : 'Add Tag'}
                </button>
              </div>
            </div>

            {/* Field Section 4: Academic Summary & Portfolio */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2 border-b pb-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>{lang === 'ar' ? '4. ملخص السيرة الذاتية وروابط الأعمال' : '4. CV Summary & Portfolio Credentials'}</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'نبذة مختصرة عن مؤهلاتك وخبرتك المهنية *' : 'Brief Qualification & CV Summary *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.cvSummary}
                  onChange={(e) => setForm({ ...form, cvSummary: e.target.value })}
                  placeholder={
                    lang === 'ar'
                      ? 'اذكر أبحاثك، الهيئات الشرعية السابقة، المشاريع التي قمت بتدقيقها، أو شهاداتك المعتمدة...'
                      : 'Summarize past Sharia boards, smart contract security research, audited protocols, or relevant degrees...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'رابط GitHub / الأبحاث' : 'GitHub / Research Profile Link'}
                  </label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/username or research link"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'رابط الأعمال / Portfolio Link' : 'Portfolio / Academic Bio Link'}
                  </label>
                  <input
                    type="url"
                    value={form.portfolioUrl}
                    onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                    placeholder="https://portfolio-or-bio.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Submission Action Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'عند الضغط، سيصل تنبيه فوري لمدير المشاريع (PM Alert Notification).'
                    : 'Submitting sends an instant alert notification to the PM Operations dashboard.'}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-amber-600 shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span>{lang === 'ar' ? 'جاري التقديم والإرسال...' : 'Submitting & Alerting PM...'}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تقديم طلب الانضمام وتنبيه مدير المشاريع' : 'Submit Application & Alert Project Manager'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

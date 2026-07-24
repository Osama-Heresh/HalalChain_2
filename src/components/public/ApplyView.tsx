import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CertificationApplication } from '../../types';
import { getLocalApps, saveLocalApps } from '../../lib/api';
import { ShieldCheck, CheckCircle2, ArrowRight, Upload, Building2, Globe, FileText, Code, Check } from 'lucide-react';

interface ApplyViewProps {
  selectedPackage?: string;
  onApplicationCreated: (app: CertificationApplication) => void;
}

export const ApplyView: React.FC<ApplyViewProps> = ({
  selectedPackage = 'Professional',
  onApplicationCreated
}) => {
  const { t, lang } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [successApp, setSuccessApp] = useState<CertificationApplication | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    legalCountry: lang === 'ar' ? 'الإمارات العربية المتحدة' : 'United Arab Emirates',
    representativeName: '',
    officialEmail: '',
    phone: '',
    telegram: '',
    websiteUrl: '',
    whitepaperUrl: '',
    contractAddress: '',
    blockchain: 'Ethereum Mainnet',
    cmcUrl: '',
    projectDescription: '',
    packageType: selectedPackage,
    termsAccepted: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.officialEmail || !formData.termsAccepted) return;

    setSubmitting(true);
    try {
      let createdApp: CertificationApplication | null = null;
      try {
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          createdApp = await res.json();
        }
      } catch (err) {
        console.warn('Network or server error during application submission, creating client-side application.', err);
      }

      if (!createdApp) {
        const appId = `HC-2026-${Math.floor(100 + Math.random() * 900)}`;
        const price = formData.packageType === 'Enterprise' ? 24500 : formData.packageType === 'Startup / DeFi' ? 8500 : 14500;
        createdApp = {
          id: appId,
          applicationNumber: `HC-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          companyName: formData.companyName,
          legalCountry: formData.legalCountry,
          representativeName: formData.representativeName,
          officialEmail: formData.officialEmail,
          phone: formData.phone,
          telegram: formData.telegram,
          githubUrl: formData.githubUrl,
          cmcUrl: formData.cmcUrl,
          websiteUrl: formData.websiteUrl,
          whitepaperUrl: formData.whitepaperUrl,
          contractAddress: '0x0000000000000000000000000000000000000000',
          blockchain: 'Ethereum / Web3',
          projectDescription: formData.projectDescription,
          packageType: formData.packageType === 'Enterprise' ? 'Enterprise' : formData.packageType === 'Startup / DeFi' ? 'Starter' : 'Professional',
          stage: 'project_created',
          submittedAt: new Date().toISOString(),
          targetCompletionDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          depositPaid: false,
          finalPaid: false,
          totalFee: price,
          depositAmount: Math.round(price * 0.5),
          remainingAmount: Math.round(price * 0.5)
        };
      }

      const existingApps = getLocalApps();
      saveLocalApps([createdApp, ...existingApps]);
      setSuccessApp(createdApp);
      onApplicationCreated(createdApp);
    } finally {
      setSubmitting(false);
    }
  };

  if (successApp) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-serif text-slate-900">
            {lang === 'ar' ? 'تم تقديم الطلب بنجاح!' : 'Application Submitted Successfully!'}
          </h2>
          <p className="text-xs text-slate-600 font-mono">
            {lang === 'ar' ? 'رقم مرجع الطلب:' : 'Application Reference Number:'}{' '}
            <span className="text-amber-700 font-bold">{successApp.applicationNumber}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left rtl:text-right space-y-3 text-xs font-mono">
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">{lang === 'ar' ? 'اسم المشروع:' : 'Project Name:'}</span>
            <span className="font-bold text-slate-900">{successApp.companyName}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">{lang === 'ar' ? 'الباقة المحددة:' : 'Package Tier:'}</span>
            <span className="font-bold text-amber-700">{successApp.packageType}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">{lang === 'ar' ? 'العربون المستحق:' : 'Initial Deposit Due:'}</span>
            <span className="font-bold text-emerald-700">${successApp.depositAmount.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{lang === 'ar' ? 'التاريخ المتوقع للإنجاز:' : 'Target Completion Date:'}</span>
            <span className="font-bold text-slate-900">{successApp.targetCompletionDate}</span>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 text-left rtl:text-right leading-relaxed">
          <span className="font-semibold block mb-1">
            {lang === 'ar' ? 'الخطوة التالية في مسار العمل:' : 'Next Step in Workflow:'}
          </span>
          {lang === 'ar'
            ? 'يرجى الانتقال إلى تبويب بوابة العملاء في الشريط العلوي لإتمام دفع العربون ومتابعة تقدم استخراج البيانات بالذكاء الاصطناعي في الوقت الفعلي.'
            : 'Please switch to the Customer Portal tab in the top header bar to complete your initial deposit payment and track the real-time AI Information Extraction progress.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-mono font-medium border border-amber-500/20">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>{lang === 'ar' ? 'طلب الاعتماد الإلكتروني - حلال تشين™' : 'HalalChain™ Online Application'}</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-slate-900">
          {lang === 'ar' ? 'التقدم بطلب للحصول على الاعتماد الشرعي' : 'Apply for Sharia Certification'}
        </h1>
        <p className="text-sm text-slate-600">
          {lang === 'ar'
            ? 'أدخل تفاصيل مشروعك للبدء في جمع البيانات الآلي بالذكاء الاصطناعي ومسار التدقيق الشرعي.'
            : 'Submit your project details to initiate the automated AI collection and Sharia audit workflow.'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        {/* Package Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-slate-700 uppercase">
            {lang === 'ar' ? 'اختر باقة الاعتماد' : 'Select Package Tier'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Starter', 'Professional', 'Enterprise'].map((pkg) => (
              <button
                type="button"
                key={pkg}
                onClick={() => setFormData({ ...formData, packageType: pkg as any })}
                className={`py-3 px-4 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${
                  formData.packageType === pkg
                    ? 'bg-[#0B132B] text-amber-400 border-amber-500 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {pkg === 'Starter'
                  ? (lang === 'ar' ? 'باقة المبتدئين' : 'Starter Tier')
                  : pkg === 'Professional'
                  ? (lang === 'ar' ? 'الباقة الاحترافية' : 'Professional Tier')
                  : (lang === 'ar' ? 'باقة المؤسسات' : 'Enterprise Tier')}
              </button>
            ))}
          </div>
        </div>

        {/* Company & Representative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">
              {lang === 'ar' ? 'اسم الشركة / المشروع *' : 'Company / Project Name *'}
            </label>
            <input
              type="text"
              required
              placeholder={lang === 'ar' ? 'مثال: سلسلة صكوك السيادة' : 'e.g. Sovereign Sukuk Chain'}
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">
              {lang === 'ar' ? 'الدولة / النطاق القانوني' : 'Legal Country / Jurisdiction'}
            </label>
            <input
              type="text"
              placeholder={lang === 'ar' ? 'مثال: الإمارات العربية المتحدة' : 'e.g. United Arab Emirates'}
              value={formData.legalCountry}
              onChange={(e) => setFormData({ ...formData, legalCountry: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">
              {lang === 'ar' ? 'اسم الممثل الرسمي *' : 'Representative Name *'}
            </label>
            <input
              type="text"
              required
              placeholder={lang === 'ar' ? 'مثال: أحمد الرزاق' : 'e.g. Ahmad Razak'}
              value={formData.representativeName}
              onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">
              {lang === 'ar' ? 'البريد الإلكتروني الرسمي *' : 'Official Email Address *'}
            </label>
            <input
              type="email"
              required
              placeholder="e.g. founder@project.io"
              value={formData.officialEmail}
              onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">
              {lang === 'ar' ? 'رابط الموقع الرسمي *' : 'Official Website URL *'}
            </label>
            <input
              type="url"
              required
              placeholder="https://project.io"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">
              {lang === 'ar' ? 'رابط الورقة البيضاء *' : 'Whitepaper URL *'}
            </label>
            <input
              type="url"
              required
              placeholder="https://project.io/whitepaper.pdf"
              value={formData.whitepaperUrl}
              onChange={(e) => setFormData({ ...formData, whitepaperUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">
              {lang === 'ar' ? 'عنوان العقد الذكي' : 'Smart Contract Address'}
            </label>
            <input
              type="text"
              placeholder="0x0000000000000000000000000000000000000000"
              value={formData.contractAddress}
              onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">
              {lang === 'ar' ? 'شبكة البلوكشين' : 'Blockchain Network'}
            </label>
            <select
              value={formData.blockchain}
              onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:border-amber-500"
            >
              <option value="Ethereum Mainnet">Ethereum Mainnet</option>
              <option value="HAQQ Chain">HAQQ Chain</option>
              <option value="Polygon POS">Polygon POS</option>
              <option value="Arbitrum One">Arbitrum One</option>
              <option value="Cosmos SDK">Cosmos SDK</option>
              <option value="Solana">Solana</option>
            </select>
          </div>
        </div>

        {/* Project Description */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-700 font-semibold">
            {lang === 'ar' ? 'ملخص المشروع ونموذج الأعمال' : 'Project Overview & Business Model Summary'}
          </label>
          <textarea
            rows={3}
            placeholder={lang === 'ar' ? 'اشرح منفعة الرمز، مصادر الإيرادات، ونموذج اقتصاد الرمز...' : 'Describe the utility, revenue sources, and tokenomics model...'}
            value={formData.projectDescription}
            onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Terms Acceptance */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <input
            type="checkbox"
            id="terms"
            checked={formData.termsAccepted}
            onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed">
            {lang === 'ar'
              ? 'أؤكد أنني ممثل مخول للمشروع وأوافق على شروط وأحكام تقييم حلال تشين™. لن يتم إصدار الشهادات إلا بعد تأكيد القسم المالي لدفع المبالغ المستحقة.'
              : 'I confirm that I am an authorized representative of the project and agree to the HalalChain™ Assessment Terms & Conditions. Certificates will only be released following Finance confirmation of full payment.'}
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting || !formData.termsAccepted}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {submitting
            ? (lang === 'ar' ? 'جاري تقديم الطلب...' : 'Submitting Application...')
            : (lang === 'ar' ? 'تقديم طلب الاعتماد' : 'Submit Certification Application')}
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </form>
    </div>
  );
};

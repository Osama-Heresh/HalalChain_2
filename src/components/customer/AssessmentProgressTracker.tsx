import React from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  AlertCircle,
  Users,
  Calendar,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { CertificationApplication } from '../../types';

interface AssessmentProgressTrackerProps {
  project: CertificationApplication;
  lang?: 'en' | 'ar' | 'side-by-side';
}

export interface WorkflowStageStep {
  key: string;
  number: number;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
  responsibleTeam: string;
  requiredActionEn: string;
  requiredActionAr: string;
}

export const AssessmentProgressTracker: React.FC<AssessmentProgressTrackerProps> = ({
  project,
  lang = 'en'
}) => {
  const isRtl = lang === 'ar';
  const isDual = lang === 'side-by-side';

  const workflowStages: WorkflowStageStep[] = [
    {
      key: 'waiting_deposit',
      number: 1,
      labelEn: 'Project Registered',
      labelAr: 'تسجيل المشروع والعربون',
      descriptionEn: 'Initial application submitted and deposit invoice generated.',
      descriptionAr: 'تم تقديم الطلب وإصدار فاتورة العربون الأولي.',
      responsibleTeam: 'Customer & Finance Team',
      requiredActionEn: project.depositPaid ? 'Deposit confirmed ✓' : 'Pay 50% deposit fee to initiate reviews',
      requiredActionAr: project.depositPaid ? 'تم تأكيد العربون ✓' : 'دفع عربون 50% لبدء عملية التدقيق'
    },
    {
      key: 'project_created',
      number: 2,
      labelEn: 'Information Retrieved',
      labelAr: 'استرجاع البيانات الذكية',
      descriptionEn: 'CoinMarketCap metrics, tokenomics, and whitepaper PDF extracted.',
      descriptionAr: 'استخراج بيانات كوين ماركت كاب والاقتصاد الرمزي من الورقة البيضاء.',
      responsibleTeam: 'AI Scraper & Ingestion Bot',
      requiredActionEn: 'No customer action needed',
      requiredActionAr: 'لا يتطلب إجراء من العميل'
    },
    {
      key: 'ai_assessment',
      number: 3,
      labelEn: 'AI Knowledge Extraction',
      labelAr: 'التقييم المستند للذكاء الاصطناعي',
      descriptionEn: 'Automated Sharia risk vector scanning and bytecode parsing.',
      descriptionAr: 'مسح مخاطر الشريعة تلقائياً وتحليل الأكواد البرمجية.',
      responsibleTeam: 'HalalChain™ AI Engine',
      requiredActionEn: 'No customer action needed',
      requiredActionAr: 'لا يتطلب إجراء من العميل'
    },
    {
      key: 'technical_review',
      number: 4,
      labelEn: 'Technical Review',
      labelAr: 'التدقيق الفني والأمني',
      descriptionEn: 'Smart contract vulnerability audit, reentrancy check, and mint privileges.',
      descriptionAr: 'تدقيق ثغرات العقود الذكية وفحص صلاحيات السك والسيطرة.',
      responsibleTeam: 'Technical Auditor (Dr. Ziyad Al-Hassan)',
      requiredActionEn: 'Provide GitHub access if repository is private',
      requiredActionAr: 'توفير صلاحية الوصول للجراب البرمجي إن كان خاصاً'
    },
    {
      key: 'business_review',
      number: 5,
      labelEn: 'Business & Tokenomics Review',
      labelAr: 'مراجعة نموذج العمل والاقتصاد',
      descriptionEn: 'Evaluation of revenue sharing, liquidity pool structures, and Riba avoidance.',
      descriptionAr: 'تقييم توزيع الأرباح وهياكل السيولة وخلوها من الربا.',
      responsibleTeam: 'Business Analyst (Tariq Al-Mansoor)',
      requiredActionEn: 'Clarify utility token lockup schedules if requested',
      requiredActionAr: 'توضيح جداول حظر الرموز إن طلب ذلك'
    },
    {
      key: 'scholar_review',
      number: 6,
      labelEn: 'Scholar Review',
      labelAr: 'مراجعة هيئة الرقابة الشرعية',
      descriptionEn: 'Theological assessment by accredited AAOIFI Sharia scholars.',
      descriptionAr: 'التقييم الفقهي من علماء هيئة الرقابة الشرعية المعتمدين.',
      responsibleTeam: 'Sharia Board (Sheikh Dr. Ibrahim Al-Kuwaiti)',
      requiredActionEn: 'Respond to Sharia clarification board questions',
      requiredActionAr: 'الإجابة على الاستفسارات الفقهية للعلماء'
    },
    {
      key: 'quality_assurance',
      number: 7,
      labelEn: 'QA Sign-Off',
      labelAr: 'مراجعة ضمان الجودة والتنسيق',
      descriptionEn: 'Cross-auditor contradiction check and formatting sign-off.',
      descriptionAr: 'التأكد من عدم وجود تناقضات وتدقيق الصياغة النهائية.',
      responsibleTeam: 'QA Officer (Elena Rostova)',
      requiredActionEn: 'No customer action needed',
      requiredActionAr: 'لا يتطلب إجراء من العميل'
    },
    {
      key: 'waiting_final_payment',
      number: 8,
      labelEn: 'Executive Approval',
      labelAr: 'الموافقة التنفيذية النهائية',
      descriptionEn: 'General Manager final sign-off and final fee settlement.',
      descriptionAr: 'اعتماد المدير العام وتسوية الفاتورة النهائية.',
      responsibleTeam: 'General Manager & Finance',
      requiredActionEn: project.finalPaid ? 'Final payment confirmed ✓' : 'Pay remaining 50% final balance',
      requiredActionAr: project.finalPaid ? 'تم دفع المتبقي ✓' : 'سداد الـ 50% المتبقية لإصدار الشهادة'
    },
    {
      key: 'certificate_generation',
      number: 9,
      labelEn: 'Certificate Generation',
      labelAr: 'إصدار الشهادة وختم الاعتماد',
      descriptionEn: 'Generation of official Sharia Compliance Certificate with QR verification.',
      descriptionAr: 'إنشاء شهادة التوافق الشرعي الرسمية مع الرمز الشريطي للتحقق.',
      responsibleTeam: 'Certificate Engine',
      requiredActionEn: 'Download official certificate PDF',
      requiredActionAr: 'تحميل ملف الشهادة الرسمية'
    },
    {
      key: 'published_registry',
      number: 10,
      labelEn: 'Registry Publication',
      labelAr: 'النشر في السجل العام العالمي',
      descriptionEn: 'Public registry activation and annual renewal monitoring loop.',
      descriptionAr: 'تفعيل السجل العام وجدولة التجديد السنوي.',
      responsibleTeam: 'Master Registry Engine',
      requiredActionEn: 'Embed verification badge on official website',
      requiredActionAr: 'تثبيت شارة التوثيق في الموقع الرسمي'
    }
  ];

  // Calculate stage progress index
  const currentStageIndex = workflowStages.findIndex((stg) => stg.key === project.stage);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 1;
  const currentStageObj = workflowStages[activeIndex] || workflowStages[1];
  const nextStageObj = workflowStages[activeIndex + 1] || workflowStages[workflowStages.length - 1];

  const progressPct = Math.round(((activeIndex + 1) / workflowStages.length) * 100);

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Top Banner Overview */}
      <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Real-Time Certification Workflow Engine</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-amber-300 mt-2">
              {project.companyName} Assessment Stage Progress
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Ref: {project.applicationNumber || project.id} • SLA Target: <span className="text-amber-400 font-bold">{project.targetCompletionDate}</span>
            </p>
          </div>

          <div className="bg-[#1C2541] p-4 rounded-2xl border border-amber-500/20 text-center min-w-[200px]">
            <span className="text-[10px] text-amber-400 font-mono uppercase block font-bold">Overall Progress</span>
            <div className="text-3xl font-black text-amber-300 font-mono mt-1">{progressPct}%</div>
            <span className="text-[11px] text-slate-300 font-mono">Stage {activeIndex + 1} of {workflowStages.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-amber-500/20">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Submitted: {project.submittedAt || 'Initial Request'}</span>
            <span>Est. Completion: {project.targetCompletionDate}</span>
          </div>
        </div>
      </div>

      {/* Prominent Current & Next Stage Box (Requirement 9) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-indigo-500/40 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CURRENT STAGE */}
        <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold uppercase text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 px-2.5 py-1 rounded-md">
              Current Stage ({activeIndex + 1}/10)
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 animate-spin" /> In Active Review
            </span>
          </div>

          <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
            {isRtl ? currentStageObj.labelAr : currentStageObj.labelEn}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
            {isRtl ? currentStageObj.descriptionAr : currentStageObj.descriptionEn}
          </p>

          <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Responsible Team:</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentStageObj.responsibleTeam}</span>
            </div>

            <div>
              <span className="text-amber-700 dark:text-amber-400 text-[10px] uppercase font-bold block">Required Customer Action:</span>
              <span className="font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-lg block border border-amber-200 dark:border-amber-800 mt-0.5">
                {isRtl ? currentStageObj.requiredActionAr : currentStageObj.requiredActionEn}
              </span>
            </div>
          </div>
        </div>

        {/* NEXT STAGE */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold uppercase text-slate-500 bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-md">
              Next Upcoming Stage ({activeIndex + 2}/10)
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>

          <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-slate-200">
            {isRtl ? nextStageObj.labelAr : nextStageObj.labelEn}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {isRtl ? nextStageObj.descriptionAr : nextStageObj.descriptionEn}
          </p>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Next Responsible Team:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{nextStageObj.responsibleTeam}</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Expected Completion:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{project.targetCompletionDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Workflow Steps Vertical Cards */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Detailed 10-Stage Sharia Audit Lifecycle
        </h3>

        <div className="space-y-3">
          {workflowStages.map((stg, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isRemaining = idx > activeIndex;

            return (
              <div
                key={stg.key}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-[#0B132B] text-white border-amber-500 shadow-md'
                    : isCompleted
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-slate-900 dark:text-slate-100'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stg.number}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold font-serif ${isCurrent ? 'text-amber-300' : 'text-slate-900 dark:text-white'}`}>
                        {isRtl || isDual ? stg.labelAr : stg.labelEn}
                        {isDual && <span className="text-xs font-sans text-slate-400 ml-2">({stg.labelEn})</span>}
                      </h4>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                          : isCurrent
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Remaining'}
                      </span>
                    </div>

                    <p className={`text-xs mt-1 font-mono ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                      {isRtl ? stg.descriptionAr : stg.descriptionEn}
                    </p>

                    <div className="mt-2 text-[11px] font-mono flex flex-wrap gap-x-4 gap-y-1">
                      <span>Team: <strong className={isCurrent ? 'text-amber-200' : 'text-slate-700 dark:text-slate-300'}>{stg.responsibleTeam}</strong></span>
                      <span>Action: <strong className={isCurrent ? 'text-amber-300 underline' : 'text-slate-600 dark:text-slate-400'}>{isRtl ? stg.requiredActionAr : stg.requiredActionEn}</strong></span>
                    </div>
                  </div>
                </div>

                {isCurrent && (
                  <div className="shrink-0 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Active Stage</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

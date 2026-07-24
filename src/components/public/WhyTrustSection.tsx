import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Layers,
  ShieldCheck,
  CheckSquare,
  Eye,
  Award,
  RefreshCw,
  FileText
} from 'lucide-react';

export const WhyTrustSection: React.FC = () => {
  const { lang } = useLanguage();

  const trustCardsEn = [
    {
      icon: Layers,
      title: 'Structured Methodology',
      text: 'HalalChain™ applies a structured assessment methodology combining blockchain technical analysis, business model assessment, documented evidence review and Sharia compliance evaluation. Every project follows the same transparent process.'
    },
    {
      icon: ShieldCheck,
      title: 'Independent Multi-Level Review',
      text: 'Every assessment is reviewed through independent technical, business, quality assurance and Sharia review stages. Findings are documented throughout the workflow.'
    },
    {
      icon: CheckSquare,
      title: 'Evidence-Based Assessment',
      text: 'Every finding is linked to supporting evidence collected from project documentation, whitepapers, public sources and reviewer observations, ensuring transparency and traceability.'
    },
    {
      icon: Eye,
      title: 'Transparent Workflow',
      text: 'Customers can monitor their project throughout the assessment process and receive structured reports describing the review stages and assessment outcome.'
    },
    {
      icon: Award,
      title: 'Digital Certificate Verification',
      text: 'Every issued certificate contains a unique certificate number and online verification page through the HalalChain™ Public Registry.'
    },
    {
      icon: RefreshCw,
      title: 'Continuous Improvement',
      text: 'HalalChain™ is committed to continuously improving its methodology through collaboration with qualified scholars and blockchain specialists while maintaining a transparent and documented review process.'
    }
  ];

  const trustCardsAr = [
    {
      icon: Layers,
      title: 'منهجية هيكلية منظمة',
      text: 'تطبق حلال تشين™ منهجية تقييم هيكلية تجمع بين التحليل الفني للبلوكشين، وتقييم نموذج الأعمال، ومراجعة الأدلة الموثقة، وتقييم الامتثال للشريعة الإسلامية. يتبع كل مشروع نفس العملية الشفافة.'
    },
    {
      icon: ShieldCheck,
      title: 'مراجعة مستقلة متعددة المستويات',
      text: 'تتم مراجعة كل تقييم من خلال مراحل مستقلة تشمل المراجعة الفنية، ومراجعة الأعمال، وضمان الجودة، والمراجعة الشرعية. وتوثّق جميع النتائج عبر مراحل سير العمل.'
    },
    {
      icon: CheckSquare,
      title: 'تقييم قائم على الأدلة الموثقة',
      text: 'ترتبط كل نتيجة بأدلة داعمة تم جمعها من وثائق المشروع، والأوراق البيضاء، والمصادر العامة، وملاحظات المراجعين، مما يضمن الشفافية وإمكانية التتبع.'
    },
    {
      icon: Eye,
      title: 'مسار عمل شفاف ومتابع',
      text: 'يمكن للعملاء متابعة مشاريعهم طوال عملية التقييم واستلام تقارير هيكلية تفصيلية تشرح مراحل المراجعة ونتيجة التقييم النهائي.'
    },
    {
      icon: Award,
      title: 'التحقق الرقمي من الشهادات',
      text: 'تحتوي كل شهادة صادرة على رقم شهادة فريد وصفحة تحقق فورية عبر الإنترنت من خلال السجل العام لشركة حلال تشين™.'
    },
    {
      icon: RefreshCw,
      title: 'التطوير والتحسين المستمر',
      text: 'تلتزم حلال تشين™ بالتحسين المستمر لمنهجيتها من خلال التعاون مع علماء متخصصين وخبراء تقنية البلوكشين مع الحفاظ على عملية مراجعة شفافة وموثقة.'
    }
  ];

  const trustCards = lang === 'ar' ? trustCardsAr : trustCardsEn;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-mono font-medium border border-amber-500/20">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>{lang === 'ar' ? 'الثقة والشفافية المؤسسية' : 'Institutional Trust & Governance'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900">
          {lang === 'ar' ? 'لماذا تثق في حلال تشين™؟' : 'Why Trust HalalChain™?'}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {lang === 'ar'
            ? 'بُنيت إطار حلال تشين™ على الأدلة الرقمية الموثقة، والمراجعة المستقلة متعددة الطبقات، وحوكمة العلماء الشرعيين لضمان الشفافية المطلقة.'
            : 'HalalChain™ is built on verifiable digital evidence, independent multi-tier evaluation, and scholar governance to deliver uncompromised Web3 clarity.'}
        </p>
      </div>

      {/* Grid of Six Trust Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trustCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all hover:border-amber-400/50 flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug">
                  {card.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {card.text}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>HalalChain™ Standard</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Protocol
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

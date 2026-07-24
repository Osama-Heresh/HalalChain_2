import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle2, ShieldAlert } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { lang } = useLanguage();
  // Open first two items by default
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const faqsEn = [
    {
      question: 'Who developed the HalalChain™ methodology?',
      answer:
        'HalalChain™ uses a structured methodology combining blockchain technical analysis, business assessment, documented evidence review and Sharia compliance evaluation. The methodology is continuously refined through collaboration with qualified scholars and technical specialists.'
    },
    {
      question: 'Who reviews my project?',
      answer:
        'Every project passes through multiple independent review stages including technical assessment, business assessment, quality assurance and Sharia review before a certification decision is finalized.'
    },
    {
      question: 'How are decisions documented?',
      answer:
        'All findings, reviewer comments and supporting evidence are permanently recorded inside the HalalChain™ platform, creating a transparent audit trail for every certification.'
    },
    {
      question: 'Can anyone verify my certificate?',
      answer:
        'Yes. Every issued certificate includes a unique certificate number and can be verified through the HalalChain™ Public Registry.'
    },
    {
      question: 'Does HalalChain™ guarantee investment performance?',
      answer:
        'No. HalalChain™ evaluates projects according to its published assessment methodology. Certification does not constitute investment advice, financial endorsement or a guarantee of future performance.'
    }
  ];

  const faqsAr = [
    {
      question: 'من الذي طور منهجية حلال تشين™؟',
      answer:
        'تستخدم حلال تشين™ منهجية هيكلية تجمع بين التحليل الفني للبلوكشين، وتقييم الأعمال، ومراجعة الأدلة الموثقة، وتقييم الامتثال للشريعة الإسلامية. ويتم تطوير المنهجية باستمرار بالتعاون مع علماء شرعيين وخبراء تقنيين.'
    },
    {
      question: 'من الذي يقوم بمراجعة مشروعي؟',
      answer:
        'يمر كل مشروع بمراحل مراجعة مستقلة متعددة تشمل التقييم الفني، وتقييم الأعمال، وضمان الجودة، والمراجعة الشرعية قبل اتخاذ قرار الاعتماد النهائي.'
    },
    {
      question: 'كيف يتم توثيق قرارات الاعتماد؟',
      answer:
        'يتم تسجيل جميع النتائج وملاحظات المراجعين والأدلة الداعمة بشكل دائم داخل منصة حلال تشين™، مما ينشئ مسار تدقيق شفاف لكل شهادة.'
    },
    {
      question: 'هل يمكن لأي شخص التحقق من صحة شهادتي؟',
      answer:
        'نعم. تتضمن كل شهادة صادرة رقم شهادة فريدًا ويمكن التحقق منها فورًا من خلال السجل العام المفتوح لـ حلال تشين™.'
    },
    {
      question: 'هل تضمن حلال تشين™ الأداء الاستثماري أو الأرباح؟',
      answer:
        'لا. تقيم حلال تشين™ المشاريع وفقًا لمنهجيتها الشرعية والفنية المنشورة. ولا يشكل الاعتماد نصيحة استثمارية أو تأييدًا ماليًا أو ضمانًا للأداء المستقبلي.'
    }
  ];

  const faqs = lang === 'ar' ? faqsAr : faqsEn;

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 text-xs font-mono font-medium border border-blue-500/20">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>{lang === 'ar' ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
          {lang === 'ar' ? 'إجابات شفافة ومباشرة على استفساراتك' : 'Frequently Asked Questions'}
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          {lang === 'ar'
            ? 'تعرف على كيفية عمل منهجية التقييم، وفريق المراجعين المستقلين، وإجراءات توثيق القرارات والتحقق من الشهادات.'
            : 'Clear answers about our structured evaluation framework, reviewer stages, evidence documentation, and registry verification.'}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-white border-amber-500/50 shadow-md'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full text-left rtl:text-right p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    Q{idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base font-serif">
                    {faq.question}
                  </h3>
                </div>
                <div className="text-slate-400 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed font-sans border-t border-slate-100 bg-slate-50/50">
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 text-slate-700">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

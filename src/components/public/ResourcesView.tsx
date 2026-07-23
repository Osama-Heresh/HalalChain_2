import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FileText, BookOpen, Download, ExternalLink, ShieldCheck, Scale } from 'lucide-react';
import { FaqSection } from './FaqSection';
import { WhyTrustSection } from './WhyTrustSection';

export const ResourcesView: React.FC = () => {
  const { t, lang } = useLanguage();

  const articlesEn = [
    {
      title: 'Sharia Screening Criteria for Crypto Assets & Tokens (Standard v2.1)',
      date: 'July 2026',
      author: 'HalalChain Research Council',
      category: 'Standards & Governance',
      summary: 'A detailed breakdown of HalalChain Standard v2.1 governing revenue sources, zero-usury staking, liquidity pool Mudarabah structures, and administrative privilege risk scoring.'
    },
    {
      title: 'Real-World Assets (RWA) Tokenization & Sharia Sarf Exchange Rules',
      date: 'June 2026',
      author: 'Sheikh Dr. Ali Al-Quradaghi',
      category: 'Research Paper',
      summary: 'Analyzing physical vault backing, proof-of-reserve oracles, and immediate physical possession requirements (Qabd) in gold and sukuk tokenization.'
    },
    {
      title: 'DeFi Liquidity Pools: Replacing Usury Interest with Mudarabah Profit Sharing',
      date: 'May 2026',
      author: 'Dr. Nizam Yaquby',
      category: 'Sharia Fiqh Analysis',
      summary: 'Evaluating automated market maker (AMM) smart contracts to eliminate flash loan interest arbitrage and ensure compliant risk-sharing pool dynamics.'
    }
  ];

  const articlesAr = [
    {
      title: 'معايير الفحص الشرعي للأصول الرقمية والرموز (معيار v2.1)',
      date: 'يوليو 2026',
      author: 'مجلس أبحاث حلال تشين',
      category: 'المعايير والحوكمة',
      summary: 'شرح تفصيلي لمعيار حلال تشين v2.1 الذي يحكم مصادر الإيرادات، والتحصيص الخالي من الربا، وهياكل المضاربة في مجمعات السيولة، وتقييم مخاطر الصلاحيات الإدارية.'
    },
    {
      title: 'ترميز الأصول الحقيقية (RWA) وقواعد الصرف الشرعي',
      date: 'يونيو 2026',
      author: 'الشيخ د. علي القرة داغي',
      category: 'ورقة بحثية',
      summary: 'تحليل التغطية بالخزائن الفعلية، وأور Cheap التقاط الأدلة، وشروط القبض الفوري في ترميز الذهب والصكوك.'
    },
    {
      title: 'مجمعات سيولة التمويل اللامركزي: استبدال فائدة الربا بالمضاربة والمشاركة',
      date: 'مايو 2026',
      author: 'د. نظام يعقوبي',
      category: 'دراسة فقهية شرعية',
      summary: 'تقييم صانعي السوق الآليين لاستبعاد مرابحات القروض الفورية وضمان ديناميكيات مشاركة الأرباح والمخاطر.'
    }
  ];

  const articles = lang === 'ar' ? articlesAr : articlesEn;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl font-bold font-serif text-slate-900">
          {lang === 'ar' ? 'مركز الأبحاث والأطر الشرعية' : 'Research Center & Sharia Frameworks'}
        </h1>
        <p className="text-sm text-slate-600">
          {lang === 'ar'
            ? 'الإصدارات الرسمية، المعايير الشرعية المتوافقة مع أيوفي، الأوراق البيضاء، والأبحاث العلمية في امتثال الويب 3.'
            : 'Official publications, AAOIFI-aligned Sharia standards, whitepapers, and scholarly research on Web3 compliance.'}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((art, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md font-semibold border border-amber-200">{art.category}</span>
                <span>{art.date}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif leading-snug">{art.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{art.summary}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-slate-500">{art.author}</span>
              <button className="text-amber-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                <span>{lang === 'ar' ? 'تحميل PDF' : 'Download PDF'}</span>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 space-y-12 border-t border-slate-200">
        <WhyTrustSection />
        <FaqSection />
      </div>
    </div>
  );
};

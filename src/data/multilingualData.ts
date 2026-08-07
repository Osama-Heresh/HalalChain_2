import { AaoifiStandardReference, DomainTermGlossaryItem, MultilingualTextRecord } from '../types';

/**
 * HalalChain™ Domain Glossary - Islamic, Financial, Blockchain & Technical Terminology Protection
 * AI Translation engine MUST preserve these canonical terms across Arabic and English.
 */
export const DOMAIN_TERMINOLOGY_GLOSSARY: DomainTermGlossaryItem[] = [
  {
    term: 'Riba',
    category: 'Islamic / Sharia',
    en: 'Interest / Usury (Riba)',
    ar: 'الربا الزيادة المحرمة شرعاً',
    definitionEn: 'Unlawful gain or interest added upon loan/debt repayment prohibited in Sharia.',
    definitionAr: 'الزيادة المشروطة في القرض أو الدين الخالية من العوض القابل للتقويم.',
    canonicalUsage: 'Preserve "(Riba)" tag when referencing interest rates or fixed guaranteed yields.'
  },
  {
    term: 'Gharar',
    category: 'Islamic / Sharia',
    en: 'Excessive Uncertainty / Ambiguity (Gharar)',
    ar: 'الغرر الفاحش والجهالة في العقد',
    definitionEn: 'Deceptive uncertainty or risk in contractual terms, deliverables, or underlying assets.',
    definitionAr: 'ما كان مستور العاقبة أو الخطر المجهول الوجود أو الحصول.',
    canonicalUsage: 'Used for options, blind derivatives, and unverified smart contract algorithms.'
  },
  {
    term: 'Maysir',
    category: 'Islamic / Sharia',
    en: 'Gambling / Speculation (Maysir / Qimar)',
    ar: 'الميسر والمراهنات والمقامرة',
    definitionEn: 'Games of chance or speculative transactions relying purely on luck or blind risk.',
    definitionAr: 'كل معاملة يتردد فيها المتعاقدان بين الغُرم والغُنم بناءً على الصدفة.',
    canonicalUsage: 'Applied to prediction markets, algorithmic leverage, and casino dApps.'
  },
  {
    term: 'Sukuk',
    category: 'Islamic / Sharia',
    en: 'Sharia-Compliant Investment Certificates (Sukuk)',
    ar: 'صكوك الاستثمار الشرعية',
    definitionEn: 'Financial certificates representing undivided fractional ownership in tangible assets or services.',
    definitionAr: 'وثائق متساوية القيمة تمثل حصصاً شائعة في ملكية أعيان أو منافع أو خدمات.',
    canonicalUsage: 'Must be translated as Sukuk (صكوك), never mislabeled as conventional corporate bonds.'
  },
  {
    term: 'Fatwa',
    category: 'Islamic / Sharia',
    en: 'Authoritative Sharia Legal Ruling (Fatwa)',
    ar: 'فتوى شرعية معتمدة',
    definitionEn: 'Formal legal opinion or decision given by a qualified Islamic Sharia Scholar or Board.',
    definitionAr: 'حكم شرعي صادق عن هيئة شرعية أو عالم مجتهد معتمد.',
    canonicalUsage: 'Preserve formal Sharia term Fatwa (فتوى).'
  },
  {
    term: 'Mudarabah',
    category: 'Islamic / Sharia',
    en: 'Mudarabah Profit-Sharing Partnership',
    ar: 'عقد المضاربة شركاء المال والعمل',
    definitionEn: 'Partnership where one party provides capital (Rab al-Mal) and the other provides management (Mudarib).',
    definitionAr: 'عقد شركة بين رب المال ومدير العمل يقتسمان الربح بحسب الاتفاق.',
    canonicalUsage: 'Used for Web3 liquid staking vaults and decentralized fund management.'
  },
  {
    term: 'Musharakah',
    category: 'Islamic / Sharia',
    en: 'Musharakah Joint Enterprise',
    ar: 'عقد المشاركة والشركة في رأس المال',
    definitionEn: 'Joint enterprise where all partners contribute capital and share profits and losses proportionally.',
    definitionAr: 'شركة يساهم فيها طرفان أو أكثر بمال أو عمل ويقتسمون الأرباح والربح بحسب الحصص.',
    canonicalUsage: 'Standard structure for decentralized node consortiums and governance treasuries.'
  },
  {
    term: 'Smart Contract',
    category: 'Blockchain / Web3',
    en: 'Smart Contract (Self-Executing Blockchain Code)',
    ar: 'العقد الذكي البرمجي الموزع',
    definitionEn: 'Self-executing digital agreement coded directly on a decentralized ledger.',
    definitionAr: 'برنامج حاسوبي خوارزمي ينفذ بنود الاتفاق آلياً على سلسلة الكتل.',
    canonicalUsage: 'Translated as العقد الذكي (Smart Contract).'
  },
  {
    term: 'Tokenomics',
    category: 'Blockchain / Web3',
    en: 'Tokenomics (Crypto Economic Architecture)',
    ar: 'علم اقتصاد الرموز المشفرة (Tokenomics)',
    definitionEn: 'The supply, emission rate, allocation, utility, and economic incentives governing a token.',
    definitionAr: 'الدراسة الاقتصادية لهيكلية وتوزيع وإصدار الرموز المشفرة.',
    canonicalUsage: 'Translated as اقتصاد الرموز المشفرة (Tokenomics).'
  },
  {
    term: 'DAO',
    category: 'Blockchain / Web3',
    en: 'Decentralized Autonomous Organization (DAO)',
    ar: 'المنظمة اللامركزية المستقلة (DAO)',
    definitionEn: 'Organization governed by smart contract rules and token holder voting consensus.',
    definitionAr: 'كيان إداري مستقيمي يدار بواسطة عقود ذكية وتصويت الأعضاء.',
    canonicalUsage: 'Preserve DAO abbreviation and translate as المنظمة اللامركزية المستقلة.'
  },
  {
    term: 'Governance',
    category: 'Blockchain / Web3',
    en: 'Sharia & Protocol Governance',
    ar: 'الحوكمة الشرعية والبروتوكولية',
    definitionEn: 'The rules, processes, and voting voting systems governing protocol upgrades and treasury control.',
    definitionAr: 'الآليات والضوابط التي تسير القرارات الفنية والشرعية في المنظومة.',
    canonicalUsage: 'Translated as الحوكمة الشرعية والتقنية.'
  },
  {
    term: 'Staking',
    category: 'Blockchain / Web3',
    en: 'Staking & Validator Participation',
    ar: 'التخزين والرهن التشاركي (Staking)',
    definitionEn: 'Locking tokens to secure proof-of-stake networks in exchange for service reward distributions.',
    definitionAr: 'حجز الرموز البرمجية لتأمين الشبكة واقتسام المكافآت مقابل الخدمات.',
    canonicalUsage: 'Translated as التخزين والمشاركة (Staking).'
  },
  {
    term: 'Yield Farming',
    category: 'Blockchain / Web3',
    en: 'Liquidity Yield Farming',
    ar: 'زراعة العائد وتوفير السيولة (Yield Farming)',
    definitionEn: 'Lending or staking tokens into liquidity pools to generate variable algorithmic rewards.',
    definitionAr: 'تزويد أجمعات السيولة بالرموز للحصول على مكافآت دورية من الرسوم.',
    canonicalUsage: 'Translated as زراعة العائد وتوفير السيولة (Yield Farming).'
  }
];

/**
 * Official AAOIFI Sharia Standards Reference Library
 */
export const AAOIFI_STANDARDS_CATALOG: AaoifiStandardReference[] = [
  {
    id: 'AAOIFI-21',
    standardNumber: 'AAOIFI Sharia Standard No. 21 (Financial Sukuk)',
    sectionCode: 'Para 3/2 - Ownership & Real Risk Transfer',
    titleEn: 'Ownership and Real Risk Transfer in Asset Sukuk',
    titleAr: 'الملكية والانتقال الحقيقي للمخاطر في الصكوك الاستثمارية',
    arabicText: 'يجب أن تمثل الصكوك ملكية حقيقية شائعة في أصول أو منافع أو خدمات معلومة، ولا يجوز ضمان المصدِر لرأس مال الصكوك إطلاقاً، بل يتحمل حملة الصكوك مخاطر الهلاك الكلي أو التلف غير الناشئ عن التعدي أو التفريط.',
    officialEnglishText: 'Sukuk must represent an undivided real ownership in tangible assets, usufructs, or services. The issuer shall not guarantee the principal capital of the Sukuk under any circumstances; Sukuk holders must bear total loss or destruction risks not arising from negligence or misconduct.',
    internalExplanationEn: 'The protocol treasury cannot guarantee a fixed USD return or principal protection without breaching AAOIFI No. 21. Capital must remain subject to genuine asset market fluctuations.',
    internalExplanationAr: 'لا يجوز لخزينة البروتوكول ضمان رأس المال أو تقديم عائد ثابت مقوم بالدولار، بل يجب أن يخضع استرداد المال لمخاطر السوق الحقيقية للأصول.',
    aiSummaryEn: 'AAOIFI 21 mandates genuine asset ownership and bans principal guarantees by the issuing entity.',
    aiSummaryAr: 'يوجب المعيار 21 ملكية الأصول الحقيقية ويحرم ضمان رأس المال من المصدِر.',
    category: 'Sukuk'
  },
  {
    id: 'AAOIFI-08',
    standardNumber: 'AAOIFI Sharia Standard No. 8 (Murabaha)',
    sectionCode: 'Para 2/1 - Asset Possession Before Resale',
    titleEn: 'Constructive Possession and Spot Asset Delivery in Murabaha',
    titleAr: 'القبض الحكمي والتسليم الفوري للمبيع في المرابحة',
    arabicText: 'يشترط لصحّة بيع المرابحة ملك البائع للسلعة وحيازتها حيازة حقيقية أو حكمية قبل بيعها للآمر بالشراء، ولا يجوز بيع ما لا يملك.',
    officialEnglishText: 'For a Murabaha sale to be valid, the seller must own the commodity and take physical or constructive possession thereof prior to executing the resale to the ordering customer. Selling unpossessed commodities is strictly void.',
    internalExplanationEn: 'In Web3 smart contract execution, tokenized commodities must be locked in the contract vault before executing the buyer resale transaction.',
    internalExplanationAr: 'في العقود الذكية، يجب نقل ملكية الرموز المشفرة للأصول إلى خزينة العقد الذكي أولاً قبل تنفيذ عملية اعادة البيع للمشتري.',
    aiSummaryEn: 'Requires full possession of underlying assets prior to executing resale agreements.',
    aiSummaryAr: 'يشترط حيازة السلعة حيازة كاملة قبل إعادة بيعها.',
    category: 'Profit Sharing & Mudarabah'
  },
  {
    id: 'AAOIFI-31',
    standardNumber: 'AAOIFI Sharia Standard No. 31 (Gharar & Options)',
    sectionCode: 'Para 4/1 - Prohibition of Pure Financial Options',
    titleEn: 'Prohibition of Pure Financial Options & Unbacked Swaps',
    titleAr: 'تحريم خيارات التحوط المالية الخالية من الأصول والتداول الأعمى',
    arabicText: 'الخيارات المالية المتعارف عليها في الأسواق العالمية المعاصرة ليست أعياناً ولا منافع ولا حقوقاً مالية تنفصل عن محلها، فلا يجوز بيعها ولا شراؤها ولا تداولها.',
    officialEnglishText: 'Conventional financial options traded on global financial exchanges do not represent tangible assets, usufructs, or separable financial rights; hence buying, selling, or trading pure financial option contracts is impermissible.',
    internalExplanationEn: 'DeFi synthetic derivatives based on perpetual synthetic leverage or naked binary option pricing violate AAOIFI No. 31 due to excessive Gharar (uncertainty).',
    internalExplanationAr: 'المشتقات الاصطناعية المالية القائمة على الرافعة المالية العارية خالية من الأصول الحقيقية وتعتبر مبنية على الغرر الفاحش.',
    aiSummaryEn: 'Pure financial options without underlying physical deliverable assets are void due to Gharar.',
    aiSummaryAr: 'تحريم الخيارات المالية والربط الاصطناعي الخالي من الأصول المادية.',
    category: 'Gharar & Derivatives'
  },
  {
    id: 'AAOIFI-46',
    standardNumber: 'AAOIFI Sharia Standard No. 46 (Islamic Investment Funds)',
    sectionCode: 'Para 5/3 - Governance & Independent Sharia Board',
    titleEn: 'Independent Sharia Supervisory Board Audit Controls',
    titleAr: 'رقابة واستقلالية الهيئة الشرعية في الصناديق والمنصات',
    arabicText: 'تجب المراجعة والتدقيق الدائم من قبل هيئة رقابة شرعية مستقلة تعينها الجمعية العمومية وتكون قراراتها ملزمة لإدارة الصندوق أو المنصة الرقمية.',
    officialEnglishText: 'Continuous oversight and auditing must be conducted by an independent Sharia Supervisory Board appointed by the general assembly, and its rulings shall be binding upon protocol management.',
    internalExplanationEn: 'Web3 DAOs must mandate that smart contract upgrade proposals touching Sharia-sensitive logic pass through Sharia Supervisory Board multi-sig authorization.',
    internalExplanationAr: 'يجب أن تتطلب ترقيات العقود الذكية المؤثرة في الأحكام الشرعية موافقة الهيئة الشرعية عبر توقيع متعدد.',
    aiSummaryEn: 'Mandates binding independent Sharia board oversight for all digital investment platforms.',
    aiSummaryAr: 'يلزم بالرقابة الشرعية المستقلة المباشرة على كافة الترقيات.',
    category: 'Governance'
  }
];

/**
 * Initial Multilingual Text Records across all platform fields
 * Demonstrates original text preservation, instant AI translations, status tracking, and verification attributes.
 */
export const INITIAL_MULTILINGUAL_RECORDS: MultilingualTextRecord[] = [
  {
    id: 'MLR-101',
    fieldKey: 'scholar_opinion',
    entityId: 'APP-2026-001',
    entityName: 'Islamic Coin (ISLM)',
    originalLanguage: 'ar',
    originalText: 'بعد دراسة بنية شبكة HAQQ والعقود الذكية المصاحبة لرمز ISLM، تبين أن توزيع المكافآت يتم بناءً على آلية التخزين والمشاركة (Staking) القائمة على تقديم خدمات التأمين للشبكة عبر عقد المضاربة الشرعي. لا يوجد أي ضمان لرأس المال أو سعر محدد صراحة، وبالتالي فإن آلية حوافز الشبكة متوافقة تماماً مع معايير AAOIFI رقم 21 و46.',
    translations: {
      en: 'After examining the HAQQ Network architecture and the smart contracts accompanying the ISLM token, it was determined that reward distribution is conducted through a Staking and Validator mechanism built on an authentic Mudarabah profit-sharing framework. There is no principal guarantee or fixed returns; therefore, the network incentive structure is fully compliant with AAOIFI Standards No. 21 and No. 46.',
      ar: 'بعد دراسة بنية شبكة HAQQ والعقود الذكية المصاحبة لرمز ISLM، تبين أن توزيع المكافآت يتم بناءً على آلية التخزين والمشاركة (Staking) القائمة على تقديم خدمات التأمين للشبكة عبر عقد المضاربة الشرعي. لا يوجد أي ضمان لرأس المال أو سعر محدد صراحة، وبالتالي فإن آلية حوافز الشبكة متوافقة تماماً مع معايير AAOIFI رقم 21 و46.'
    },
    translationStatus: 'Verified',
    translationConfidence: 0.99,
    translationGeneratedDate: '2026-07-28',
    generatedBy: 'HalalChain Executive AI Analytics Engine',
    verifiedBy: 'Dr. Ahmad Al-Mansoor (Senior Sharia Board Scholar)',
    verificationDate: '2026-07-29',
    reviewerNotes: 'Official Sharia opinion verified with zero terminology loss.',
    aaoifiReferences: ['AAOIFI-21', 'AAOIFI-46']
  },
  {
    id: 'MLR-102',
    fieldKey: 'technical_finding',
    entityId: 'APP-2026-001',
    entityName: 'Islamic Coin (ISLM)',
    originalLanguage: 'en',
    originalText: 'The token contract employs an ERC-20 proxy pattern with transparent upgradeability managed via a 4-of-7 Gnosis Safe multi-sig wallet. Automated bytecode scans confirmed zero reentrancy vulnerabilities, zero unbacked mint functions, and 100% liquidity lockup in the treasury vault.',
    translations: {
      ar: 'يستخدم عقد الرمز المشفر نمط وكالة ERC-20 قابل للترقية بشفافية تدار عبر محفظة متعددة التوقيعات 4-من-7. وأكدت الفحوصات الآلية للشفيرة البرمجية خلو العقد تماماً من ثغرات إعادة الدخول (Reentrancy)، وخلوه من وظائف السك بدون أصول مادية، مع حجز السيولة بنسبة 100% في الخزينة.',
      en: 'The token contract employs an ERC-20 proxy pattern with transparent upgradeability managed via a 4-of-7 Gnosis Safe multi-sig wallet. Automated bytecode scans confirmed zero reentrancy vulnerabilities, zero unbacked mint functions, and 100% liquidity lockup in the treasury vault.'
    },
    translationStatus: 'AI Generated',
    translationConfidence: 0.96,
    translationGeneratedDate: '2026-08-01',
    generatedBy: 'HalalChain AI Multilingual Engine',
    reviewerNotes: 'Awaiting Lead Technical Auditor signoff.',
    aaoifiReferences: ['AAOIFI-08']
  },
  {
    id: 'MLR-103',
    fieldKey: 'executive_summary',
    entityId: 'APP-2026-002',
    entityName: 'Sovereign Sukuk Chain',
    originalLanguage: 'ar',
    originalText: 'مشروع صكوك السيادة هو منصة ترميز رقمية حقيقية للأصول الحكومية، تعتمد على ربط الصكوك الاستثمارية بحيازة مادية مباشرة للسلع الأساسية. تم التأكد من نقل المخاطر المادية بالكامل إلى حملة الصكوك وفق الشريعة الإسلامية.',
    translations: {
      en: 'The Sovereign Sukuk project is an authentic digital asset tokenization platform for government assets, relying on linking investment Sukuk directly to physical commodity holdings. Complete real physical risk transfer to Sukuk holders has been confirmed in accordance with Islamic Sharia principles.',
      ar: 'مشروع صكوك السيادة هو منصة ترميز رقمية حقيقية للأصول الحكومية، تعتمد على ربط الصكوك الاستثمارية بحيازة مادية مباشرة للسلع الأساسية. تم التأكد من نقل المخاطر المادية بالكامل إلى حملة الصكوك وفق الشريعة الإسلامية.'
    },
    translationStatus: 'Verified',
    translationConfidence: 0.98,
    translationGeneratedDate: '2026-08-02',
    generatedBy: 'HalalChain Executive AI Analytics Engine',
    verifiedBy: 'Sheikh Youssef Al-Qasimi',
    verificationDate: '2026-08-03'
  },
  {
    id: 'MLR-104',
    fieldKey: 'recommendation',
    entityId: 'APP-2026-003',
    entityName: 'Halal DEX Protocol',
    originalLanguage: 'en',
    originalText: 'It is strongly recommended that the protocol remove the automated liquid leverage pool before final certificate issuance. Liquidity pool reward mechanisms must be restricted exclusively to verified spot trading pairs without synthetic margin loans.',
    translations: {
      ar: 'يُوصى بشدة بنزع أجمعات الرافعة المالية الآلية قبل إصدار شهادة التوافق النهائية. يجب اقتصار آليات مكافآت التزويد بالسيولة حصرياً على أزواج التداول الفوري المعتمدة دون قروض هامشية اصطناعية (Gharar).',
      en: 'It is strongly recommended that the protocol remove the automated liquid leverage pool before final certificate issuance. Liquidity pool reward mechanisms must be restricted exclusively to verified spot trading pairs without synthetic margin loans.'
    },
    translationStatus: 'Awaiting Verification',
    translationConfidence: 0.94,
    translationGeneratedDate: '2026-08-04',
    generatedBy: 'HalalChain AI Multilingual Engine',
    aaoifiReferences: ['AAOIFI-31']
  },
  {
    id: 'MLR-105',
    fieldKey: 'certificate_remarks',
    entityId: 'APP-2026-001',
    entityName: 'Islamic Coin (ISLM)',
    originalLanguage: 'ar',
    originalText: 'تمنح هذه الشهادة وفقاً لمنهجية التقييم الشرعي المعتمدة لدى HALALCHAIN™ وعمليات المراجعة والاعتماد المقررة. يخضع هذا الاعتماد للمراجعة السنوية الدورية ولأي تغييرات تطرأ على الشفيرة البرمجية.',
    translations: {
      en: 'This Certificate is issued following completion of the applicable HALALCHAIN™ Sharia assessment methodology and the required review and approval process. This accreditation is subject to mandatory annual renewal and continuous software code monitoring.',
      ar: 'تمنح هذه الشهادة وفقاً لمنهجية التقييم الشرعي المعتمدة لدى HALALCHAIN™ وعمليات المراجعة والاعتماد المقررة. يخضع هذا الاعتماد للمراجعة السنوية الدورية ولأي تغييرات تطرأ على الشفيرة البرمجية.'
    },
    translationStatus: 'Verified',
    translationConfidence: 1.0,
    translationGeneratedDate: '2026-08-04',
    generatedBy: 'Sharia Supervisory Board Secretariat',
    verifiedBy: 'Dr. Ahmad Al-Mansoor',
    verificationDate: '2026-08-04'
  }
];

import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Edit,
  Save,
  ShieldCheck,
  Languages,
  Plus,
  RefreshCw,
  FileText
} from 'lucide-react';
import { MultilingualTextRecord, TranslationStatus, AaoifiStandardReference } from '../../types';
import { translateContent, getAaoifiStandardsCatalog } from '../../lib/multilingualService';

interface MultilingualTextEditorProps {
  fieldKey: string;
  fieldLabel: string;
  entityId?: string;
  entityName?: string;
  initialRecord?: MultilingualTextRecord;
  onSaveRecord?: (record: MultilingualTextRecord) => void;
  authorRole?: string;
}

export const MultilingualTextEditor: React.FC<MultilingualTextEditorProps> = ({
  fieldKey,
  fieldLabel,
  entityId = 'APP-2026-001',
  entityName = 'HalalChain Enterprise Project',
  initialRecord,
  onSaveRecord,
  authorRole = 'scholar'
}) => {
  const isScholar = authorRole === 'scholar';

  const [origLang, setOrigLang] = useState<'en' | 'ar'>(
    initialRecord ? (initialRecord.originalLanguage as 'en' | 'ar') : isScholar ? 'ar' : 'en'
  );
  const [origText, setOrigText] = useState<string>(initialRecord?.originalText || '');
  const [translatedEn, setTranslatedEn] = useState<string>(initialRecord?.translations.en || '');
  const [translatedAr, setTranslatedAr] = useState<string>(initialRecord?.translations.ar || '');
  const [status, setStatus] = useState<TranslationStatus>(initialRecord?.translationStatus || 'AI Generated');
  const [confidence, setConfidence] = useState<number>(initialRecord?.translationConfidence || 0.98);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showAaoifiPicker, setShowAaoifiPicker] = useState<boolean>(false);
  const [selectedAaoifiRefs, setSelectedAaoifiRefs] = useState<string[]>(initialRecord?.aaoifiReferences || []);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const aaoifiCatalog = getAaoifiStandardsCatalog();

  // Auto-translate on button click or blur
  const handleTranslate = async () => {
    if (!origText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await translateContent(origText, origLang, fieldKey);
      setTranslatedEn(res.translations.en || origText);
      setTranslatedAr(res.translations.ar || origText);
      setConfidence(res.confidence);
      setStatus('AI Generated');
    } catch (e) {
      console.error('Translation error:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Attach AAOIFI Standard Paragraph
  const handleAttachAaoifi = (std: AaoifiStandardReference) => {
    if (!selectedAaoifiRefs.includes(std.id)) {
      setSelectedAaoifiRefs([...selectedAaoifiRefs, std.id]);
    }

    // Append standard citation to text
    const citationEn = `\n[Reference: ${std.standardNumber} (${std.sectionCode}) - ${std.officialEnglishText}]`;
    const citationAr = `\n[مرجع شرعي: ${std.standardNumber} (${std.sectionCode}) - ${std.arabicText}]`;

    if (origLang === 'ar') {
      setOrigText((prev) => prev + citationAr);
      setTranslatedEn((prev) => prev + citationEn);
    } else {
      setOrigText((prev) => prev + citationEn);
      setTranslatedAr((prev) => prev + citationAr);
    }

    setShowAaoifiPicker(false);
  };

  // Save Record
  const handleSave = () => {
    const record: MultilingualTextRecord = {
      id: initialRecord?.id || `MLR-${Date.now().toString().slice(-6)}`,
      fieldKey,
      entityId,
      entityName,
      originalLanguage: origLang,
      originalText: origText,
      translations: {
        en: origLang === 'en' ? origText : translatedEn,
        ar: origLang === 'ar' ? origText : translatedAr
      },
      translationStatus: status,
      translationConfidence: confidence,
      translationGeneratedDate: new Date().toISOString().split('T')[0],
      generatedBy: isScholar ? 'Scholar Dr. Ahmad Al-Mansoor' : 'HalalChain Enterprise Auditor',
      verifiedBy: status === 'Verified' ? 'Sharia Board Reviewer' : undefined,
      verificationDate: status === 'Verified' ? new Date().toISOString().split('T')[0] : undefined,
      aaoifiReferences: selectedAaoifiRefs
    };

    if (onSaveRecord) {
      onSaveRecord(record);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-md space-y-4">
      
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              {fieldKey.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Original Language Preserved • {origLang === 'ar' ? 'العربية (Arabic Author)' : 'English (Auditor)'}
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
            {fieldLabel}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAaoifiPicker(!showAaoifiPicker)}
            className="py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>+ AAOIFI Ref</span>
          </button>

          <button
            type="button"
            onClick={handleTranslate}
            disabled={isTranslating}
            className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTranslating ? 'Translating...' : 'AI Translate'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-1.5 px-3.5 bg-slate-900 hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Entry</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500 text-slate-950 p-3 rounded-2xl font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Multilingual text entry saved & synchronized in database!</span>
        </div>
      )}

      {/* AAOIFI STANDARDS PICKER MODAL */}
      {showAaoifiPicker && (
        <div className="bg-emerald-50 dark:bg-emerald-950/80 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3 text-xs">
          <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200 uppercase font-mono">
            <span>AAOIFI Sharia Standards Reference Library</span>
            <button onClick={() => setShowAaoifiPicker(false)} className="text-emerald-700 dark:text-emerald-400">✕</button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {aaoifiCatalog.map((std) => (
              <div
                key={std.id}
                onClick={() => handleAttachAaoifi(std)}
                className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 cursor-pointer space-y-1"
              >
                <div className="flex justify-between font-extrabold text-emerald-900 dark:text-emerald-200">
                  <span>{std.standardNumber}</span>
                  <span className="font-mono text-[10px] text-emerald-600">{std.category}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 font-bold">{std.sectionCode}</div>
                <div className="text-[11px] text-slate-700 dark:text-slate-200 truncate">{std.officialEnglishText}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DUAL AUTHORING CANVAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Author Original Text Area (Preserved Language) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Author Original Text ({origLang === 'ar' ? 'العربية' : 'English'})</span>
            </label>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setOrigLang('ar')}
                className={`px-2 py-0.5 rounded ${origLang === 'ar' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
              >
                العربية (RTL)
              </button>
              <button
                type="button"
                onClick={() => setOrigLang('en')}
                className={`px-2 py-0.5 rounded ${origLang === 'en' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
              >
                English (LTR)
              </button>
            </div>
          </div>

          <textarea
            rows={5}
            value={origText}
            onChange={(e) => setOrigText(e.target.value)}
            dir={origLang === 'ar' ? 'rtl' : 'ltr'}
            placeholder={origLang === 'ar' ? 'اكتب رأي العالِم أو الفتوى الشرعية هنا باللغة العربية...' : 'Enter technical auditor or business analyst findings in English...'}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
          />
        </div>

        {/* AI Translation & Synchronized Output Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Synchronized AI Translation ({origLang === 'ar' ? 'English' : 'العربية'})</span>
            </label>
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              Confidence: {Math.round(confidence * 100)}%
            </span>
          </div>

          {origLang === 'ar' ? (
            <textarea
              rows={5}
              value={translatedEn}
              onChange={(e) => setTranslatedEn(e.target.value)}
              dir="ltr"
              placeholder="AI English translation will appear here automatically..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          ) : (
            <textarea
              rows={5}
              value={translatedAr}
              onChange={(e) => setTranslatedAr(e.target.value)}
              dir="rtl"
              placeholder="ستظهر الترجمة العربية الشرعية الآلية هنا تلقائياً..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          )}
        </div>

      </div>

      {/* STATUS & ATTACHED REFERENCES SUMMARY */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400 font-bold uppercase">Translation Status:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TranslationStatus)}
            className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="AI Generated">AI Generated</option>
            <option value="Awaiting Verification">Awaiting Verification</option>
            <option value="Verified">Verified</option>
            <option value="Modified">Modified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {selectedAaoifiRefs.length > 0 && (
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="text-slate-400">AAOIFI Standards Attached:</span>
            {selectedAaoifiRefs.map((ref) => (
              <span key={ref} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded font-bold">
                {ref}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

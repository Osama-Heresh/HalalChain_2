import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Award,
  Globe,
  Database,
  Search,
  Calendar,
  User,
  PlusCircle,
  Filter,
  Sparkles,
  Send,
  AlertCircle
} from 'lucide-react';
import { CertificationApplication } from '../../types';

export interface TimelineEvent {
  id: string;
  eventType:
    | 'Lead Created'
    | 'Project Imported'
    | 'CoinMarketCap Data Retrieved'
    | 'Whitepaper Retrieved'
    | 'Assessment Started'
    | 'Business Review Completed'
    | 'Technical Review Completed'
    | 'Scholar Review Completed'
    | 'QA Approved'
    | 'Certificate Issued'
    | 'Registry Published'
    | 'Renewal Reminder'
    | 'Custom Note';
  date: string;
  time: string;
  userName: string;
  userRole: string;
  description: string;
  category: 'CRM & Onboarding' | 'Data Acquisition' | 'Audit & Review' | 'Certificates & Registry' | 'Lifecycle';
}

interface CustomerActivityTimelineProps {
  project: CertificationApplication;
  lang?: 'en' | 'ar' | 'side-by-side';
}

export const CustomerActivityTimeline: React.FC<CustomerActivityTimelineProps> = ({
  project,
  lang = 'en'
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newNoteInput, setNewNoteInput] = useState<string>('');
  const [customEvents, setCustomEvents] = useState<TimelineEvent[]>([]);

  const isRtl = lang === 'ar';

  // Build automatic timeline events from project data
  const baseDate = new Date(project.submittedAt || Date.now() - 14 * 86400000);

  const formatSubDate = (daysAgo: number) => {
    const d = new Date(baseDate.getTime() + daysAgo * 86400000);
    return d.toISOString().split('T')[0];
  };

  const autoEvents: TimelineEvent[] = [
    {
      id: 'EVT-001',
      eventType: 'Lead Created',
      date: formatSubDate(0),
      time: '09:15 AM',
      userName: 'BD Automated Ingestion',
      userRole: 'Marketing BD System',
      description: `Prospect profile initialized for ${project.companyName} (${project.projectSymbol || 'TOKEN'}). Contact representative ${project.representativeName} recorded.`,
      category: 'CRM & Onboarding'
    },
    {
      id: 'EVT-002',
      eventType: 'Project Imported',
      date: formatSubDate(1),
      time: '11:30 AM',
      userName: 'Smart Project Wizard',
      userRole: 'System Intake',
      description: `Application ${project.applicationNumber || project.id} converted into active ${project.packageType} Sharia Certification project.`,
      category: 'CRM & Onboarding'
    },
    {
      id: 'EVT-003',
      eventType: 'CoinMarketCap Data Retrieved',
      date: formatSubDate(1),
      time: '02:45 PM',
      userName: 'CMC Scraper Engine',
      userRole: 'Data Collector',
      description: `Ingested official metrics from CoinMarketCap: Logo, symbol ${project.projectSymbol}, website ${project.websiteUrl}, and market capital details.`,
      category: 'Data Acquisition'
    },
    {
      id: 'EVT-004',
      eventType: 'Whitepaper Retrieved',
      date: formatSubDate(2),
      time: '10:05 AM',
      userName: 'Knowledge Repository Ingest',
      userRole: 'Document Indexer',
      description: `Whitepaper fetched and cryptographically hashed (SHA-256). Stored in Whitepaper Repository repository.`,
      category: 'Data Acquisition'
    },
    {
      id: 'EVT-005',
      eventType: 'Assessment Started',
      date: formatSubDate(3),
      time: '09:00 AM',
      userName: project.assignedReviewers?.pm || 'Project Manager',
      userRole: 'Project Manager',
      description: `Certification project unlocked. Assigned Lead Scholar (${project.assignedReviewers?.scholar || 'Sheikh Dr. Ibrahim'}), Tech Auditor (${project.assignedReviewers?.tech_auditor || 'Dr. Ziyad'}), Business Analyst, and QA Officer.`,
      category: 'Audit & Review'
    },
    {
      id: 'EVT-006',
      eventType: 'Business Review Completed',
      date: formatSubDate(5),
      time: '03:20 PM',
      userName: project.assignedReviewers?.business_analyst || 'Tariq Al-Mansoor',
      userRole: 'Senior Business Analyst',
      description: `Business model, revenue streams (no Riba interest), and tokenomics lockup schedules verified compliant with AAOIFI standards.`,
      category: 'Audit & Review'
    },
    {
      id: 'EVT-007',
      eventType: 'Technical Review Completed',
      date: formatSubDate(7),
      time: '04:50 PM',
      userName: project.assignedReviewers?.tech_auditor || 'Dr. Ziyad Al-Hassan',
      userRole: 'Lead Smart Contract Auditor',
      description: `Bytecode security scan completed for ${project.contractAddress}. Reentrancy, access control, and mint risks verified safe.`,
      category: 'Audit & Review'
    },
    {
      id: 'EVT-008',
      eventType: 'Scholar Review Completed',
      date: formatSubDate(9),
      time: '01:15 PM',
      userName: project.assignedReviewers?.scholar || 'Sheikh Dr. Ibrahim Al-Kuwaiti',
      userRole: 'Sharia Supervisory Board Member',
      description: `Sharia Theological Verdict rendered: Compliant under AAOIFI STD-21 and Mudarabah profit-sharing rules.`,
      category: 'Audit & Review'
    },
    {
      id: 'EVT-009',
      eventType: 'QA Approved',
      date: formatSubDate(10),
      time: '05:00 PM',
      userName: project.assignedReviewers?.qa || 'Elena Rostova',
      userRole: 'QA & Consistency Lead',
      description: `Cross-finding contradiction check passed. Dossier approved for final Executive sign-off.`,
      category: 'Audit & Review'
    }
  ];

  if (project.stage === 'published_registry' || project.stage === 'certificate_generation') {
    autoEvents.push({
      id: 'EVT-010',
      eventType: 'Certificate Issued',
      date: formatSubDate(12),
      time: '11:00 AM',
      userName: 'Executive General Manager',
      userRole: 'Executive Committee',
      description: `Official Sharia Compliance Certificate generated, signed with QR verification code and cryptographic hash.`,
      category: 'Certificates & Registry'
    });
  }

  if (project.stage === 'published_registry') {
    autoEvents.push({
      id: 'EVT-011',
      eventType: 'Registry Published',
      date: formatSubDate(13),
      time: '02:30 PM',
      userName: 'Master Registry Publisher',
      userRole: 'Public Registry',
      description: `Project published to public HalalChain Master Registry. Live verification link activated.`,
      category: 'Certificates & Registry'
    });

    autoEvents.push({
      id: 'EVT-012',
      eventType: 'Renewal Reminder',
      date: formatSubDate(350),
      time: '09:00 AM',
      userName: 'Compliance Automation Bot',
      userRole: 'System Reminder',
      description: `Annual re-audit reminder scheduled for annual Sharia governance review prior to certificate expiration.`,
      category: 'Lifecycle'
    });
  }

  const allEvents = [...autoEvents, ...customEvents].sort((a, b) => b.id.localeCompare(a.id));

  const filteredEvents = allEvents.filter((evt) => {
    const matchesCat = filterCategory === 'All' || evt.category === filterCategory;
    const matchesSearch =
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddNote = () => {
    if (!newNoteInput.trim()) return;
    const newEvt: TimelineEvent = {
      id: `EVT-CUST-${Date.now()}`,
      eventType: 'Custom Note',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userName: project.representativeName || 'Customer Representative',
      userRole: 'Customer',
      description: newNoteInput.trim(),
      category: 'CRM & Onboarding'
    };
    setCustomEvents((prev) => [newEvt, ...prev]);
    setNewNoteInput('');
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'Lead Created':
      case 'Project Imported':
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
      case 'CoinMarketCap Data Retrieved':
      case 'Whitepaper Retrieved':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800';
      case 'Assessment Started':
      case 'Business Review Completed':
      case 'Technical Review Completed':
      case 'Scholar Review Completed':
      case 'QA Approved':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
      case 'Certificate Issued':
      case 'Registry Published':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
      case 'Renewal Reminder':
        return 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Customer Activity & Certification Timeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Automated audit trail recording onboarding, document indexing, review milestones, and certificate issuance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
              {filteredEvents.length} Events Logged
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search timeline events, users, descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold py-2 px-3 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="CRM & Onboarding">CRM & Onboarding</option>
              <option value="Data Acquisition">Data Acquisition</option>
              <option value="Audit & Review">Audit & Review</option>
              <option value="Certificates & Registry">Certificates & Registry</option>
              <option value="Lifecycle">Lifecycle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Custom Note Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 rounded-2xl border border-indigo-500/30 text-white shadow-md flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
        <input
          type="text"
          placeholder="Add an event note or milestone comment to the timeline..."
          value={newNoteInput}
          onChange={(e) => setNewNoteInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
        />
        <button
          onClick={handleAddNote}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-mono">
            No timeline events match your query filter.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div key={evt.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 border-indigo-500 bg-indigo-600 text-white flex items-center justify-center text-[10px] shadow">
                <CheckCircle2 className="w-3 h-3" />
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold border uppercase ${getEventBadgeColor(evt.eventType)}`}>
                      {evt.eventType}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      {evt.category}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {evt.date} at {evt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-500" />
                      <strong>{evt.userName}</strong> ({evt.userRole})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

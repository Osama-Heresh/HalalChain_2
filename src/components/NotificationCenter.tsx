import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AppNotification, PlatformTab } from '../types';
import {
  Bell,
  X,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Award,
  MessageSquare,
  Briefcase,
  Trash2,
  ChevronRight
} from 'lucide-react';

interface NotificationCenterProps {
  onNavigateTab?: (tab: PlatformTab) => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-101',
    title: 'New Technical Audit Task Assigned',
    message: 'Sovereign Sukuk Chain (APP-2026-801) has entered technical review stage and requires EVM bytecode disassembly.',
    type: 'new_task',
    timestamp: '10 mins ago',
    isRead: false,
    linkTab: 'ops'
  },
  {
    id: 'NOTIF-102',
    title: 'Deposit Payment Received ($15,000)',
    message: 'Customer PACTG (GoldPact) confirmed deposit payment for Enterprise Sharia Certification.',
    type: 'payment',
    timestamp: '1 hour ago',
    isRead: false,
    linkTab: 'exec'
  },
  {
    id: 'NOTIF-103',
    title: 'Clarification Received from Customer',
    message: 'HAQQ Network uploaded missing Evergreen DAO whitepaper governance appendix.',
    type: 'clarification',
    timestamp: '2 hours ago',
    isRead: false,
    linkTab: 'ops'
  },
  {
    id: 'NOTIF-104',
    title: 'Sharia Certificate Issued (#8804)',
    message: 'HalalPay Global Gateway certificate generated and published to public registry.',
    type: 'certificate',
    timestamp: '5 hours ago',
    isRead: true,
    linkTab: 'public'
  },
  {
    id: 'NOTIF-105',
    title: 'SLA Deadline Approaching',
    message: 'Baraka DEX Engine (APP-2026-802) BA Mudarabah yield assessment is due in 4 hours.',
    type: 'deadline',
    timestamp: '1 day ago',
    isRead: false,
    linkTab: 'ops'
  },
  {
    id: 'NOTIF-106',
    title: 'Task Milestone Completed',
    message: 'Scholar Review completed for HAQQ Network with 3 digital Fatwa signatures affixed.',
    type: 'task_completed',
    timestamp: '2 days ago',
    isRead: true,
    linkTab: 'ops'
  }
];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNavigateTab }) => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('halalchain_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load notifications from localStorage', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('halalchain_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications', e);
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'new_task':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'clarification':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'deadline':
      case 'overdue':
        return <Clock className="w-4 h-4 text-rose-400" />;
      case 'message':
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-amber-500/30 bg-[#1C2541] text-amber-300 hover:text-white hover:border-amber-400 transition-all cursor-pointer flex items-center justify-center"
        title={lang === 'ar' ? 'الإشعارات' : 'Notification Center'}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0B132B] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Slide-over Drawer / Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed right-2 sm:right-6 top-18 z-50 w-full max-w-sm sm:max-w-md bg-[#0B132B] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1C2541]">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base text-white">
                  {lang === 'ar' ? 'مركز الإشعارات التفاعلي' : 'Unified Notification Center'}
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                    {unreadCount} {lang === 'ar' ? 'جديد' : 'New'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Bar & Quick Actions */}
            <div className="px-4 py-2 border-b border-white/10 bg-[#0B132B] flex items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-1 bg-[#1C2541] p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'الكل' : 'All'} ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filter === 'unread'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'غير مقروء' : 'Unread'} ({unreadCount})
                </button>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{lang === 'ar' ? 'قراءة الكل' : 'Mark all read'}</span>
                  </button>
                )}
                {notifications.some((n) => n.isRead) && (
                  <button
                    onClick={clearRead}
                    className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                    title="Clear read notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
                    <Bell className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    {lang === 'ar' ? 'لا توجد إشعارات حالياً' : 'No notifications in this filter'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar' ? 'جميع تنبيهات مهام وتحديثات المشروع ستظهر هنا' : 'All real-time tasks and system events will appear here.'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.linkTab && onNavigateTab) {
                        onNavigateTab(notif.linkTab);
                        setIsOpen(false);
                      }
                    }}
                    className={`p-3.5 hover:bg-white/5 transition-all cursor-pointer flex items-start gap-3 relative group ${
                      !notif.isRead ? 'bg-amber-500/5' : 'opacity-75'
                    }`}
                  >
                    {!notif.isRead && (
                      <span className="absolute top-4 left-2 w-2 h-2 rounded-full bg-amber-400" />
                    )}

                    <div className="p-2 rounded-xl bg-[#1C2541] border border-white/10 shrink-0 mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs font-semibold truncate ${!notif.isRead ? 'text-amber-300' : 'text-slate-200'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                        {notif.message}
                      </p>

                      {notif.linkTab && (
                        <div className="pt-1 flex items-center gap-1 text-[10px] font-mono text-amber-400 group-hover:underline">
                          <span>{lang === 'ar' ? 'الانتقال إلى الشاشة' : 'Open Workspace'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#1C2541] border-t border-white/10 text-center font-mono text-[10px] text-slate-400">
              HalalChain™ Real-Time Enterprise Event Bus • SLA Governance Active
            </div>
          </div>
        </>
      )}
    </div>
  );
};

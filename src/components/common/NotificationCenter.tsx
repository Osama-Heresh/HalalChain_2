import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  XCircle,
  Award,
  CreditCard,
  Clock,
  AlertTriangle,
  UserCheck,
  Check,
  Trash2,
  ExternalLink,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { filterAssignedNotifications } from '../../lib/permissionService';

export interface SystemNotification {
  id: string;
  type: 'ASSIGNMENT' | 'APPROVAL' | 'REJECTION' | 'CERTIFICATE_ISSUED' | 'PAYMENT_RECEIVED' | 'FOLLOW_UP' | 'DEADLINE_ALERT';
  title: string;
  message: string;
  projectId?: string;
  projectName?: string;
  targetUserId?: string;
  targetRole?: string;
  targetEmail?: string;
  timestamp: string;
  isRead: boolean;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  actionUrl?: string;
}

const DEMO_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    type: 'ASSIGNMENT',
    title: 'New Project Audit Assigned',
    message: 'You have been designated Lead Technical Auditor for Islamic Liquidity Smart Contract (ID: HC-2026-088).',
    projectId: 'HC-2026-088',
    projectName: 'Islamic Liquidity Vault',
    targetRole: 'tech_auditor',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    isRead: false,
    priority: 'HIGH'
  },
  {
    id: 'notif-2',
    type: 'APPROVAL',
    title: 'Sharia Fatwa Rulings Approved',
    message: 'Dr. Tariq Al-Mansoor signed the Sharia Fatwa certificate for Mudarabah Staking Protocol.',
    projectId: 'HC-2026-074',
    projectName: 'Mudarabah Staking Protocol',
    targetRole: 'scholar',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isRead: false,
    priority: 'HIGH'
  },
  {
    id: 'notif-3',
    type: 'CERTIFICATE_ISSUED',
    title: 'Certificate Issued & Registry Published',
    message: 'Official Sharia Compliance Certificate #SH-9012 has been published to the public ledger.',
    projectId: 'HC-2026-074',
    projectName: 'Mudarabah Staking Protocol',
    targetRole: 'all',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isRead: true,
    priority: 'MEDIUM'
  },
  {
    id: 'notif-4',
    type: 'PAYMENT_RECEIVED',
    title: '50% Initial Audit Deposit Confirmed',
    message: 'Payment Gate verified deposit receipt of $7,500 USDC for Halal Yield Token.',
    projectId: 'HC-2026-092',
    projectName: 'Halal Yield Token',
    targetRole: 'finance',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isRead: false,
    priority: 'MEDIUM'
  },
  {
    id: 'notif-5',
    type: 'DEADLINE_ALERT',
    title: 'Project SLA Deadline Approaching',
    message: 'Smart Contract Vulnerability Scan SLA window expires in 4 hours for Sukuk Decentralized Exchange.',
    projectId: 'HC-2026-061',
    projectName: 'Sukuk Decentralized Exchange',
    targetRole: 'pm',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    isRead: false,
    priority: 'HIGH'
  },
  {
    id: 'notif-6',
    type: 'FOLLOW_UP',
    title: 'Sharia Clarification Requested',
    message: 'Applicant submitted clarification documentation for Riba prohibition check on Fee Mechanism.',
    projectId: 'HC-2026-088',
    projectName: 'Islamic Liquidity Vault',
    targetRole: 'customer',
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    isRead: true,
    priority: 'LOW'
  }
];

export const NotificationCenter: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projId: string) => void;
}> = ({ isOpen, onClose, onSelectProject }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem('halalchain_system_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEMO_NOTIFICATIONS;
  });

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'ASSIGNMENT' | 'APPROVAL' | 'DEADLINE'>('ALL');

  useEffect(() => {
    localStorage.setItem('halalchain_system_notifications', JSON.stringify(notifications));
  }, [notifications]);

  if (!isOpen) return null;

  // Filter based on user assignments
  const userAssignedNotifs = filterAssignedNotifications<SystemNotification>(currentUser as any, notifications);

  const filteredNotifs = userAssignedNotifs.filter((n) => {
    if (activeFilter === 'UNREAD') return !n.isRead;
    if (activeFilter === 'ASSIGNMENT') return n.type === 'ASSIGNMENT';
    if (activeFilter === 'APPROVAL') return n.type === 'APPROVAL';
    if (activeFilter === 'DEADLINE') return n.type === 'DEADLINE_ALERT';
    return true;
  });

  const unreadCount = userAssignedNotifs.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotifIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'ASSIGNMENT':
        return <UserCheck className="w-4 h-4 text-indigo-400" />;
      case 'APPROVAL':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'REJECTION':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'CERTIFICATE_ISSUED':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'PAYMENT_RECEIVED':
        return <CreditCard className="w-4 h-4 text-cyan-400" />;
      case 'DEADLINE_ALERT':
        return <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />;
      case 'FOLLOW_UP':
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0B132B] border-l border-slate-800 text-slate-100 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Notification Center
                {unreadCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    {unreadCount} Unread
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">Assigned Workflow Alerts & System Signals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto">
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeFilter === 'ALL' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All ({userAssignedNotifs.length})
            </button>
            <button
              onClick={() => setActiveFilter('UNREAD')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeFilter === 'UNREAD' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setActiveFilter('ASSIGNMENT')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeFilter === 'ASSIGNMENT' ? 'bg-indigo-500 text-white font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Assigned
            </button>
            <button
              onClick={() => setActiveFilter('DEADLINE')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeFilter === 'DEADLINE' ? 'bg-rose-500 text-white font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              SLAs
            </button>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={clearAllNotifications}
              title="Clear all notifications"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 text-[11px] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                <Bell className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-sm text-slate-400 font-medium">No active notifications found.</p>
              <p className="text-xs text-slate-500">All workflow signals are up to date for your assigned scope.</p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markAsRead(n.id);
                  if (n.projectId && onSelectProject) onSelectProject(n.projectId);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative group ${
                  !n.isRead
                    ? 'bg-slate-900 border-amber-500/30 hover:border-amber-500/60 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {!n.isRead && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}

                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>
                  <div className="flex-1 pr-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{n.title}</span>
                      {n.priority === 'HIGH' && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{n.message}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                      <span>{n.projectName || n.projectId}</span>
                      <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            HALALCHAIN™ Real-time Assignment & Event Dispatcher
          </p>
        </div>
      </div>
    </div>
  );
};

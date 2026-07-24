import React, { useState } from 'react';
import { useRbac } from '../../context/RbacContext';
import { useAuth } from '../../context/AuthContext';
import { SYSTEM_PERMISSIONS, DEFAULT_SYSTEM_ROLES } from '../../lib/rbacService';
import { DEMO_ACCOUNTS, saveUserProfileToFirestore } from '../../lib/firebaseAuth';
import { RoleDefinition, UserRole } from '../../types';
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Lock,
  Layers,
  Database,
  Sliders,
  Sparkles,
  Save,
  ChevronRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { IslamicPatternBg } from '../IslamicPatternBg';

export const RbacAdminConsole: React.FC = () => {
  const {
    roles,
    permissions,
    hasActionPermission,
    updatePermissionToggle,
    toggleAllPermissionsForRole,
    resetRolePermissionsToDefault,
    addNewRole,
    refreshRbacConfig
  } = useRbac();

  const { currentUser, updateCurrentRole } = useAuth();

  const [activeConsoleTab, setActiveConsoleTab] = useState<'matrix' | 'create_role' | 'assign_users'>('matrix');

  // Selected role to edit in matrix
  const [selectedRoleId, setSelectedRoleId] = useState<string>('exec');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Status message
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // New Role Form State
  const [newRoleId, setNewRoleId] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleCat, setNewRoleCat] = useState<'Executive' | 'Operations' | 'External Client' | 'Custom'>('Operations');
  const [newRoleBase, setNewRoleBase] = useState<'exec' | 'sales' | 'pm' | 'tech_auditor' | 'scholar' | 'customer' | 'empty'>('pm');

  // Check if current user has permission to edit RBAC
  const canEditRbac = hasActionPermission('action:gm_edit_permissions') || currentUser?.role === 'exec';

  const categories = ['All', 'Platform Views', 'Executive Modules', 'Operations Workspace', 'Customer Portal', 'System Actions'];

  const filteredPermissions = SYSTEM_PERMISSIONS.filter((p) => {
    const matchesSearch = p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggle = async (roleId: string, permKey: string, currentVal: boolean) => {
    if (!canEditRbac) {
      setSaveStatus({ type: 'error', message: 'Unauthorized: Only General Manager can modify RBAC permissions.' });
      return;
    }

    try {
      setIsSaving(true);
      await updatePermissionToggle(roleId, permKey, !currentVal);
      setSaveStatus({ type: 'success', message: `Updated policy '${permKey}' for role '${roleId}' in Firebase.` });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message || 'Failed to save to Firestore.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnableAll = async (roleId: string) => {
    if (!canEditRbac) return;
    setIsSaving(true);
    await toggleAllPermissionsForRole(roleId, true);
    setSaveStatus({ type: 'success', message: `Enabled all permissions for role '${roleId}' in Firebase.` });
    setIsSaving(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleDisableAll = async (roleId: string) => {
    if (!canEditRbac) return;
    setIsSaving(true);
    await toggleAllPermissionsForRole(roleId, false);
    setSaveStatus({ type: 'success', message: `Disabled all permissions for role '${roleId}' in Firebase.` });
    setIsSaving(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleResetDefaults = async () => {
    if (!canEditRbac) return;
    if (window.confirm('Reset all roles and permission matrices to factory system defaults in Firestore?')) {
      setIsSaving(true);
      await resetRolePermissionsToDefault();
      setSaveStatus({ type: 'success', message: 'Restored all default RBAC matrices in Firebase Firestore.' });
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleCreateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleId || !newRoleName) {
      setSaveStatus({ type: 'error', message: 'Please provide both Role ID and Role Name.' });
      return;
    }

    const cleanId = newRoleId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

    if (roles.some((r) => r.id === cleanId)) {
      setSaveStatus({ type: 'error', message: `Role ID '${cleanId}' already exists.` });
      return;
    }

    const newRoleDef: RoleDefinition = {
      id: cleanId,
      name: newRoleName,
      description: newRoleDesc || 'Custom enterprise role created by General Manager.',
      category: newRoleCat,
      isSystemRole: false,
      createdAt: new Date().toISOString()
    };

    // Build base perms
    const basePerms: Record<string, boolean> = {};
    if (newRoleBase !== 'empty' && permissions[newRoleBase]) {
      Object.assign(basePerms, permissions[newRoleBase]);
    } else {
      SYSTEM_PERMISSIONS.forEach((p) => (basePerms[p.key] = false));
    }

    setIsSaving(true);
    try {
      await addNewRole(newRoleDef, basePerms);
      setSaveStatus({ type: 'success', message: `Created new custom role '${newRoleName}' in Firebase!` });
      setSelectedRoleId(cleanId);
      setActiveConsoleTab('matrix');
      setNewRoleId('');
      setNewRoleName('');
      setNewRoleDesc('');
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message || 'Failed to create role.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReassignUserRole = async (uid: string, email: string, displayName: string, newRole: UserRole) => {
    if (!canEditRbac) return;
    setIsSaving(true);

    const preset = DEMO_ACCOUNTS.find((a) => a.role === newRole);
    const updatedProfile = {
      uid,
      email,
      displayName,
      role: newRole,
      title: preset ? preset.title : `${newRole.toUpperCase()} Member`,
      targetPlatform: preset ? preset.targetPlatform : 'ops_platform',
      updatedAt: new Date().toISOString()
    };

    try {
      await saveUserProfileToFirestore(updatedProfile as any);
      if (currentUser && currentUser.uid === uid) {
        updateCurrentRole(newRole);
      }
      setSaveStatus({ type: 'success', message: `Updated user '${displayName}' role to '${newRole}' in Firestore.` });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: 'Failed to reassign user role.' });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedRoleObj = roles.find((r) => r.id === selectedRoleId) || roles[0];

  return (
    <div className="space-y-6 font-mono text-white">
      {/* Top Banner & Header */}
      <div className="relative bg-[#0B132B] p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden space-y-4">
        <IslamicPatternBg />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>General Manager Security Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Enterprise Role-Based Access Control (RBAC) Console
            </h2>
            <p className="text-xs text-slate-300">
              Manage permission matrices, create custom roles, and assign employee authorizations stored live in Firebase Firestore.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResetDefaults}
              disabled={isSaving}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset Matrix Defaults</span>
            </button>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="relative z-10 pt-2 flex items-center gap-2 border-t border-white/10 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveConsoleTab('matrix')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeConsoleTab === 'matrix'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-[#1C2541] text-slate-300 hover:text-white border border-amber-500/20'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>1. Permission Matrix Editor</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('create_role')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeConsoleTab === 'create_role'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-[#1C2541] text-slate-300 hover:text-white border border-amber-500/20'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>2. Create Custom Role</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('assign_users')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeConsoleTab === 'assign_users'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-[#1C2541] text-slate-300 hover:text-white border border-amber-500/20'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Assign User Roles</span>
          </button>
        </div>
      </div>

      {/* Save Status Notification Banner */}
      {saveStatus && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between gap-3 shadow-xl ${
            saveStatus.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-200 border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            {saveStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{saveStatus.message}</span>
          </div>
          <span className="text-[10px] text-slate-400">FIRESTORE SYNCED</span>
        </div>
      )}

      {/* TAB 1: PERMISSION MATRIX EDITOR */}
      {activeConsoleTab === 'matrix' && (
        <div className="space-y-6">
          {/* Role Selector Cards Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Select Target System Role to Configure Permissions:
              </span>
              <span className="text-slate-400">{roles.length} System & Custom Roles</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {roles.map((r) => {
                const isSelected = selectedRoleId === r.id;
                const rolePerms = permissions[r.id] || {};
                const activeCount = Object.values(rolePerms).filter(Boolean).length;

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoleId(r.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-xl scale-[1.02]'
                        : 'bg-[#1C2541] border-amber-500/20 hover:border-amber-400/50 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-bold text-amber-300 truncate">{r.category}</div>
                      <div className="font-bold text-xs truncate mt-0.5">{r.name}</div>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10 text-[10px]">
                      <span className="text-slate-400 font-mono"><code>{r.id}</code></span>
                      <span className="px-1.5 py-0.5 rounded bg-black/40 text-emerald-400 font-bold">
                        {activeCount}/{SYSTEM_PERMISSIONS.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role Control Toolbar */}
          {selectedRoleObj && (
            <div className="bg-[#1C2541] p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white font-serif">{selectedRoleObj.name}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/40">
                    ROLE SLUG: {selectedRoleObj.id}
                  </span>
                  {!selectedRoleObj.isSystemRole && (
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-500/40">
                      CUSTOM ROLE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">{selectedRoleObj.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEnableAll(selectedRoleId)}
                  disabled={isSaving}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-colors cursor-pointer"
                >
                  Enable All
                </button>
                <button
                  onClick={() => handleDisableAll(selectedRoleId)}
                  disabled={isSaving}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition-colors cursor-pointer"
                >
                  Disable All
                </button>
              </div>
            </div>
          )}

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1C2541] p-3 rounded-2xl border border-white/10 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search policy keys or features..."
                className="w-full bg-[#0B132B] text-white pl-9 pr-3 py-2 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-[#0B132B] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Permission Matrix Grid Table */}
          <div className="bg-[#1C2541] rounded-2xl border border-amber-500/20 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0B132B] border-b border-white/10 text-slate-300 font-mono">
                    <th className="p-4">Policy / Feature Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Policy Key</th>
                    <th className="p-4 text-center">Status Toggle for {selectedRoleObj?.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredPermissions.map((perm) => {
                    const isEnabled = !!(permissions[selectedRoleId] && permissions[selectedRoleId][perm.key]);

                    return (
                      <tr key={perm.key} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 space-y-0.5">
                          <div className="font-bold text-white text-sm">{perm.label}</div>
                          <div className="text-[11px] text-slate-400">{perm.description}</div>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded bg-black/40 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                            {perm.category}
                          </span>
                        </td>

                        <td className="p-4 whitespace-nowrap font-mono text-slate-300 text-[11px]">
                          <code className="text-cyan-300">{perm.key}</code>
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggle(selectedRoleId, perm.key, isEnabled)}
                            disabled={isSaving}
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                              isEnabled
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            {isEnabled ? (
                              <>
                                <ToggleRight className="w-5 h-5 text-emerald-400" />
                                <span>ENABLED</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-5 h-5 text-slate-500" />
                                <span>DISABLED</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CREATE CUSTOM ROLE FORM */}
      {activeConsoleTab === 'create_role' && (
        <div className="max-w-2xl mx-auto bg-[#1C2541] p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
          <div className="space-y-1 border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold font-serif text-amber-300 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              Define & Deploy New Custom Enterprise Role
            </h3>
            <p className="text-xs text-slate-300">
              Create a custom role with specific base permissions and save it directly to Firebase.
            </p>
          </div>

          <form onSubmit={handleCreateRoleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Role Title Name:</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => {
                    setNewRoleName(e.target.value);
                    if (!newRoleId) {
                      setNewRoleId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                    }
                  }}
                  placeholder="e.g. Lead Tokenomics Auditor"
                  className="w-full bg-[#0B132B] text-white p-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Role Identifier (Slug):</label>
                <input
                  type="text"
                  required
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(e.target.value)}
                  placeholder="e.g. custom_tokenomics_lead"
                  className="w-full bg-[#0B132B] text-cyan-300 p-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Role Category:</label>
                <select
                  value={newRoleCat}
                  onChange={(e) => setNewRoleCat(e.target.value as any)}
                  className="w-full bg-[#0B132B] text-amber-300 p-3 rounded-xl border border-amber-500/30 focus:outline-none"
                >
                  <option value="Operations">Operations</option>
                  <option value="Executive">Executive</option>
                  <option value="External Client">External Client</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Inherit Base Permissions From:</label>
                <select
                  value={newRoleBase}
                  onChange={(e) => setNewRoleBase(e.target.value as any)}
                  className="w-full bg-[#0B132B] text-amber-300 p-3 rounded-xl border border-amber-500/30 focus:outline-none"
                >
                  <option value="pm">Project Manager Base</option>
                  <option value="tech_auditor">Technical Reviewer Base</option>
                  <option value="scholar">Sharia Scholar Base</option>
                  <option value="sales">Sales Manager Base</option>
                  <option value="exec">Full Executive Base</option>
                  <option value="customer">Customer Portal Base</option>
                  <option value="empty">Blank (No Permissions Initially)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Role Description:</label>
              <textarea
                rows={3}
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                placeholder="Describe responsibilities and access scope..."
                className="w-full bg-[#0B132B] text-white p-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Create Role & Save to Firebase</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: ASSIGN USER ROLES */}
      {activeConsoleTab === 'assign_users' && (
        <div className="space-y-4">
          <div className="bg-[#1C2541] p-4 rounded-2xl border border-amber-500/20 text-xs flex items-center justify-between">
            <span className="text-amber-300 font-bold flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Enterprise User Role Assignments & Authorizations
            </span>
            <span className="text-slate-400">Syncs instantly with Firestore `users` collection</span>
          </div>

          <div className="bg-[#1C2541] rounded-2xl border border-amber-500/20 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0B132B] border-b border-white/10 text-slate-300 font-mono">
                  <th className="p-4">User Name & Title</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4 text-center">Reassign System Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {DEMO_ACCOUNTS.map((acc) => {
                  return (
                    <tr key={acc.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-9 h-9 rounded-full border border-amber-400 object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{acc.name}</div>
                          <div className="text-[10px] text-slate-300">{acc.title}</div>
                        </div>
                      </td>

                      <td className="p-4 text-cyan-300 font-mono">
                        <code>{acc.email}</code>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border uppercase ${acc.badgeColor}`}>
                          {acc.role}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <select
                          value={acc.role}
                          onChange={(e) => handleReassignUserRole(`demo-uid-${acc.id}`, acc.email, acc.name, e.target.value as UserRole)}
                          className="bg-[#0B132B] text-amber-300 border border-amber-500/30 p-2 rounded-xl text-xs focus:outline-none"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} ({r.id})
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

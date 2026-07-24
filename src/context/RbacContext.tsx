import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoleDefinition,
  PermissionDefinition,
  RolePermissionsMap,
  UserRole,
  PlatformView
} from '../types';
import {
  SYSTEM_PERMISSIONS,
  DEFAULT_SYSTEM_ROLES,
  INITIAL_ROLE_PERMISSIONS,
  getRbacConfigFromFirestore,
  saveRbacPermissionsToFirestore,
  saveRbacRolesToFirestore,
  createCustomRoleInFirestore
} from '../lib/rbacService';
import { useAuth } from './AuthContext';

interface RbacContextType {
  roles: RoleDefinition[];
  permissions: RolePermissionsMap;
  loading: boolean;
  hasPermission: (permissionKey: string, roleOverride?: UserRole) => boolean;
  hasPlatformAccess: (platform: PlatformView, roleOverride?: UserRole) => boolean;
  hasTabAccess: (platform: PlatformView, tab: string, roleOverride?: UserRole) => boolean;
  hasActionPermission: (actionKey: string, roleOverride?: UserRole) => boolean;
  updatePermissionToggle: (roleId: string, permKey: string, enabled: boolean) => Promise<void>;
  toggleAllPermissionsForRole: (roleId: string, enabled: boolean) => Promise<void>;
  resetRolePermissionsToDefault: () => Promise<void>;
  addNewRole: (newRole: RoleDefinition, initialPerms?: Record<string, boolean>) => Promise<void>;
  refreshRbacConfig: () => Promise<void>;
}

const RbacContext = createContext<RbacContextType | undefined>(undefined);

export const RbacProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const currentRole = currentUser?.role || 'customer';

  const [roles, setRoles] = useState<RoleDefinition[]>(DEFAULT_SYSTEM_ROLES);
  const [permissions, setPermissions] = useState<RolePermissionsMap>(INITIAL_ROLE_PERMISSIONS);
  const [loading, setLoading] = useState(true);

  const refreshRbacConfig = async () => {
    setLoading(true);
    const config = await getRbacConfigFromFirestore();
    setRoles(config.roles);
    setPermissions(config.permissions);
    setLoading(false);
  };

  useEffect(() => {
    refreshRbacConfig();
  }, []);

  // Permission resolution logic
  const checkPermission = (roleId: UserRole, key: string): boolean => {
    // If General Manager or Admin, allow all unless explicitly disabled or overridden
    const rolePerms = permissions[roleId];
    if (!rolePerms) {
      // Fall back to INITIAL_ROLE_PERMISSIONS or false
      const initialRolePerms = INITIAL_ROLE_PERMISSIONS[roleId];
      if (initialRolePerms && typeof initialRolePerms[key] === 'boolean') {
        return initialRolePerms[key];
      }
      return roleId === 'exec' || roleId === 'admin';
    }

    if (typeof rolePerms[key] === 'boolean') {
      return rolePerms[key];
    }

    return roleId === 'exec' || roleId === 'admin';
  };

  const hasPermission = (permissionKey: string, roleOverride?: UserRole): boolean => {
    const role = roleOverride || currentRole;
    return checkPermission(role, permissionKey);
  };

  const hasPlatformAccess = (platform: PlatformView, roleOverride?: UserRole): boolean => {
    const role = roleOverride || currentRole;
    const permKey = `platform:${platform}`;
    return checkPermission(role, permKey);
  };

  const hasTabAccess = (platform: PlatformView, tab: string, roleOverride?: UserRole): boolean => {
    const role = roleOverride || currentRole;
    let permKey = '';
    if (platform === 'exec_platform') {
      permKey = `exec:${tab}`;
    } else if (platform === 'ops_platform') {
      permKey = `ops:${tab}`;
    } else if (platform === 'customer_portal') {
      permKey = `customer:${tab}`;
    } else if (platform === 'public_website') {
      permKey = 'platform:public_website';
    }
    if (!permKey) return true;
    return checkPermission(role, permKey);
  };

  const hasActionPermission = (actionKey: string, roleOverride?: UserRole): boolean => {
    const role = roleOverride || currentRole;
    const permKey = actionKey.startsWith('action:') ? actionKey : `action:${actionKey}`;
    return checkPermission(role, permKey);
  };

  // Management actions
  const updatePermissionToggle = async (roleId: string, permKey: string, enabled: boolean) => {
    const updatedMatrix = {
      ...permissions,
      [roleId]: {
        ...(permissions[roleId] || {}),
        [permKey]: enabled
      }
    };
    setPermissions(updatedMatrix);
    await saveRbacPermissionsToFirestore(updatedMatrix, currentUser?.displayName || 'General Manager');
  };

  const toggleAllPermissionsForRole = async (roleId: string, enabled: boolean) => {
    const roleMap: Record<string, boolean> = {};
    SYSTEM_PERMISSIONS.forEach((p) => {
      roleMap[p.key] = enabled;
    });

    const updatedMatrix = {
      ...permissions,
      [roleId]: roleMap
    };
    setPermissions(updatedMatrix);
    await saveRbacPermissionsToFirestore(updatedMatrix, currentUser?.displayName || 'General Manager');
  };

  const resetRolePermissionsToDefault = async () => {
    setPermissions(INITIAL_ROLE_PERMISSIONS);
    setRoles(DEFAULT_SYSTEM_ROLES);
    await saveRbacPermissionsToFirestore(INITIAL_ROLE_PERMISSIONS, currentUser?.displayName || 'General Manager');
    await saveRbacRolesToFirestore(DEFAULT_SYSTEM_ROLES, currentUser?.displayName || 'General Manager');
  };

  const addNewRole = async (newRole: RoleDefinition, initialPerms?: Record<string, boolean>) => {
    const perms = initialPerms || {};
    SYSTEM_PERMISSIONS.forEach((p) => {
      if (typeof perms[p.key] !== 'boolean') {
        perms[p.key] = false;
      }
    });

    const updatedRoles = [...roles, newRole];
    const updatedMatrix = {
      ...permissions,
      [newRole.id]: perms
    };

    setRoles(updatedRoles);
    setPermissions(updatedMatrix);
    await createCustomRoleInFirestore(
      newRole,
      perms,
      { roles: updatedRoles, permissions: updatedMatrix }
    );
  };

  return (
    <RbacContext.Provider
      value={{
        roles,
        permissions,
        loading,
        hasPermission,
        hasPlatformAccess,
        hasTabAccess,
        hasActionPermission,
        updatePermissionToggle,
        toggleAllPermissionsForRole,
        resetRolePermissionsToDefault,
        addNewRole,
        refreshRbacConfig
      }}
    >
      {children}
    </RbacContext.Provider>
  );
};

export const useRbac = () => {
  const ctx = useContext(RbacContext);
  if (!ctx) {
    throw new Error('useRbac must be used within a RbacProvider');
  }
  return ctx;
};

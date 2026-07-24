import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  auth,
  AuthUser,
  DEMO_ACCOUNTS,
  getUserProfileFromFirestore,
  saveUserProfileToFirestore,
  signInUserWithEmail,
  registerUserWithEmail,
  signOutUser
} from '../lib/firebaseAuth';
import { UserRole, PlatformView } from '../types';

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  loginDemoPreset: (demoId: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  registerWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    role: UserRole,
    title: string,
    targetPlatform: PlatformView
  ) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  logout: () => Promise<void>;
  updateCurrentRole: (role: UserRole) => void;
}

const LOCAL_STORAGE_KEY = 'halalchain_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  onUserAuthChange?: (user: AuthUser | null) => void;
}> = ({ children, onUserAuthChange }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    // Default to GM preset so app opens smoothly
    const defaultGm = DEMO_ACCOUNTS.find((a) => a.id === 'gm');
    if (defaultGm) {
      return {
        uid: `demo-uid-gm`,
        email: defaultGm.email,
        displayName: defaultGm.name,
        role: defaultGm.role,
        title: defaultGm.title,
        targetPlatform: defaultGm.targetPlatform,
        avatarUrl: defaultGm.avatar,
        isDemoAccount: true,
        createdAt: new Date().toISOString()
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        let profile = await getUserProfileFromFirestore(fbUser.uid);
        if (!profile) {
          const matchedPreset = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === (fbUser.email || '').toLowerCase());
          profile = {
            uid: fbUser.uid,
            email: fbUser.email || 'user@halalchain.org',
            displayName: matchedPreset ? matchedPreset.name : (fbUser.displayName || 'Enterprise User'),
            role: matchedPreset ? matchedPreset.role : 'customer',
            title: matchedPreset ? matchedPreset.title : 'Enterprise Member',
            targetPlatform: matchedPreset ? matchedPreset.targetPlatform : 'customer_portal',
            avatarUrl: matchedPreset ? matchedPreset.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            isDemoAccount: !!matchedPreset
          };
          await saveUserProfileToFirestore(profile);
        }
        setCurrentUser(profile);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
        if (onUserAuthChange) onUserAuthChange(profile);
      } else {
        // If not signed in via firebase auth, check local storage or retain active session
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    const res = await signInUserWithEmail(email, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.user));
      if (onUserAuthChange) onUserAuthChange(res.user);
      closeAuthModal();
    }
    setLoading(false);
    return res;
  };

  const loginDemoPreset = async (demoId: string) => {
    const preset = DEMO_ACCOUNTS.find((a) => a.id === demoId || a.role === demoId);
    if (!preset) {
      return { success: false, error: 'Demo account preset not found' };
    }
    return await loginWithEmail(preset.email, preset.password);
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    role: UserRole,
    title: string,
    targetPlatform: PlatformView
  ) => {
    setLoading(true);
    const res = await registerUserWithEmail(email, pass, displayName, role, title, targetPlatform);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.user));
      if (onUserAuthChange) onUserAuthChange(res.user);
      closeAuthModal();
    }
    setLoading(false);
    return res;
  };

  const logout = async () => {
    setLoading(true);
    await signOutUser();
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    if (onUserAuthChange) onUserAuthChange(null);
    setLoading(false);
  };

  const updateCurrentRole = (role: UserRole) => {
    if (!currentUser) return;
    const preset = DEMO_ACCOUNTS.find((a) => a.role === role);
    const updated: AuthUser = {
      ...currentUser,
      role,
      title: preset ? preset.title : `${role.toUpperCase()} Member`,
      displayName: preset ? preset.name : currentUser.displayName,
      targetPlatform: preset ? preset.targetPlatform : currentUser.targetPlatform,
      avatarUrl: preset ? preset.avatar : currentUser.avatarUrl
    };
    setCurrentUser(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    saveUserProfileToFirestore(updated);
    if (onUserAuthChange) onUserAuthChange(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        loginDemoPreset,
        registerWithEmail,
        logout,
        updateCurrentRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

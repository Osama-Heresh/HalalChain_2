import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserRole, PlatformView } from '../types';

// Initialize Firebase App & Auth
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  title: string;
  targetPlatform: PlatformView;
  avatarUrl?: string;
  organization?: string;
  isDemoAccount?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface DemoUserPreset {
  id: string;
  name: string;
  title: string;
  role: UserRole;
  email: string;
  password: string;
  targetPlatform: PlatformView;
  badgeColor: string;
  avatar: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoUserPreset[] = [
  {
    id: 'gm',
    name: 'Tariq Al-Mansoor',
    title: 'General Manager & Executive Lead',
    role: 'exec',
    email: 'gm@halalchain.org',
    password: 'HalalChain2026!',
    targetPlatform: 'exec_platform',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Executive overview, company P&L wallet, centralized AI configuration, and workforce management.'
  },
  {
    id: 'sales',
    name: 'Khadija Al-Otaibi',
    title: 'Sales & Business Development Lead',
    role: 'sales',
    email: 'sales@halalchain.org',
    password: 'HalalChain2026!',
    targetPlatform: 'ops_platform',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    description: 'CRM lead conversion, proposal generation, commercial pricing, and deposit requests.'
  },
  {
    id: 'pm',
    name: 'Omar Khayyam',
    title: 'Project Manager & Operations Lead',
    role: 'pm',
    email: 'pm@halalchain.org',
    password: 'HalalChain2026!',
    targetPlatform: 'ops_platform',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    description: 'Project assignment, team reassignment, workflow stage transitions, and remote payroll release.'
  },
  {
    id: 'tech',
    name: 'Youssef Benali',
    title: 'Technical Reviewer & Smart Contract Auditor',
    role: 'tech_auditor',
    email: 'tech@halalchain.org',
    password: 'HalalChain2026!',
    targetPlatform: 'ops_platform',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    description: 'Bytecode scan analysis, smart contract security auditing, and AI draft findings review.'
  },
  {
    id: 'biz',
    name: 'Amina Al-Mansouri',
    title: 'Business Reviewer & Tokenomics Analyst',
    role: 'business_analyst',
    email: 'biz@halalchain.org',
    password: 'HalalChain2026!',
    targetPlatform: 'ops_platform',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    description: 'Tokenomics evaluation, revenue model validation, and governance risk scoring.'
  },
  {
    id: 'scholar',
    name: 'Sheikh Dr. Ali Al-Quradaghi',
    title: 'Sharia Scholar & Compliance Chair',
    role: 'scholar',
    email: 'scholar@halalchain.org',
    password: 'HalalChain2026!',
    targetPlatform: 'ops_platform',
    badgeColor: 'bg-emerald-600/20 text-emerald-200 border-emerald-500/40',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    description: 'Sharia ruling issuance, AAOIFI standard evaluation, fatwa signatures, and certificate authorization.'
  },
  {
    id: 'qa',
    name: 'Zainab Ibrahim',
    title: 'Quality Assurance Officer',
    role: 'qa',
    email: 'qa@halalchain.org',
    password: 'HalalChain2026!',
    targetPlatform: 'ops_platform',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Final audit verification, findings consistency check, and pre-issuance quality sign-off.'
  },
  {
    id: 'finance',
    name: 'Faisal Al-Zahrani',
    title: 'Finance & Payments Officer',
    role: 'finance',
    email: 'finance@halalchain.org',
    password: 'HalalChain2026!',
    targetPlatform: 'ops_platform',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    description: 'Deposit and final payment verification, invoice generation, and certificate payment locks.'
  },
  {
    id: 'customer',
    name: 'Sovereign Sukuk Lead',
    title: 'Client Founder / Representative',
    role: 'customer',
    email: 'customer@sovereign-sukuk.ae',
    password: 'HalalChain2026!',
    targetPlatform: 'customer_portal',
    badgeColor: 'bg-amber-400/20 text-amber-200 border-amber-400/40',
    avatar: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=150&auto=format&fit=crop&q=80',
    description: 'Certification application tracker, deposit/final payment submission, and message portal.'
  }
];

export async function getUserProfileFromFirestore(uid: string): Promise<AuthUser | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as AuthUser;
    }
  } catch (err) {
    console.warn('Unable to read user profile from Firestore:', err);
  }
  return null;
}

export async function saveUserProfileToFirestore(profile: AuthUser): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', profile.uid);
    await setDoc(userDocRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Unable to save user profile to Firestore:', err);
  }
}

export async function signInUserWithEmail(email: string, pass: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const matchedPreset = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === cleanEmail);
    
    let fbUser: FirebaseUser | null = null;
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      fbUser = res.user;
    } catch (authErr: any) {
      console.warn('Firebase signInWithEmailAndPassword warning/error:', authErr?.code, authErr?.message);
      
      // If user doesn't exist in Firebase Auth yet, automatically register them!
      if (
        authErr.code === 'auth/user-not-found' ||
        authErr.code === 'auth/invalid-credential' ||
        authErr.code === 'auth/user-mismatch'
      ) {
        try {
          const createRes = await createUserWithEmailAndPassword(auth, email.trim(), pass);
          fbUser = createRes.user;
          if (matchedPreset) {
            await updateProfile(fbUser, {
              displayName: matchedPreset.name,
              photoURL: matchedPreset.avatar
            });
          }
        } catch (createErr: any) {
          console.warn('Firebase createUserWithEmailAndPassword warning/error:', createErr?.code, createErr?.message);
          if (createErr.code === 'auth/email-already-in-use') {
            if (!matchedPreset) {
              return { success: false, error: 'Invalid password. Please check your credentials.' };
            }
          }
          // Fall back gracefully for preset/demo accounts if creation fails
        }
      } else if (
        authErr.code === 'auth/operation-not-allowed' ||
        authErr.code === 'auth/admin-restricted-operation' ||
        authErr.code === 'auth/configuration-not-found'
      ) {
        console.info('Firebase Auth Email/Password provider disabled in Console. Continuing with Firestore profile session.');
      } else if (!matchedPreset) {
        return { success: false, error: authErr.message || 'Authentication failed' };
      }
    }

    const uid = fbUser ? fbUser.uid : matchedPreset ? `demo-uid-${matchedPreset.id}` : `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    let existingProfile = await getUserProfileFromFirestore(uid);

    if (!existingProfile && matchedPreset) {
      existingProfile = await getUserProfileFromFirestore(`demo-uid-${matchedPreset.id}`);
    }

    if (!existingProfile) {
      existingProfile = {
        uid,
        email: email.trim(),
        displayName: matchedPreset ? matchedPreset.name : (fbUser?.displayName || email.split('@')[0]),
        role: matchedPreset ? matchedPreset.role : 'customer',
        title: matchedPreset ? matchedPreset.title : 'Enterprise Member',
        targetPlatform: matchedPreset ? matchedPreset.targetPlatform : 'customer_portal',
        avatarUrl: matchedPreset ? matchedPreset.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        isDemoAccount: !!matchedPreset,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
    } else {
      existingProfile.lastLoginAt = new Date().toISOString();
      if (matchedPreset) {
        existingProfile.role = matchedPreset.role;
        existingProfile.title = matchedPreset.title;
        existingProfile.targetPlatform = matchedPreset.targetPlatform;
        existingProfile.displayName = matchedPreset.name;
        existingProfile.avatarUrl = matchedPreset.avatar;
      }
    }

    await saveUserProfileToFirestore(existingProfile);
    return { success: true, user: existingProfile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Login failed' };
  }
}

export async function registerUserWithEmail(
  email: string,
  pass: string,
  displayName: string,
  role: UserRole,
  title: string,
  targetPlatform: PlatformView
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    let fbUser: FirebaseUser | null = null;
    try {
      const createRes = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      fbUser = createRes.user;
      await updateProfile(fbUser, { displayName });
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        try {
          const signInRes = await signInWithEmailAndPassword(auth, email.trim(), pass);
          fbUser = signInRes.user;
        } catch (signInErr: any) {
          return { success: false, error: 'Email already registered with a different password.' };
        }
      } else if (
        err.code === 'auth/operation-not-allowed' ||
        err.code === 'auth/admin-restricted-operation' ||
        err.code === 'auth/configuration-not-found'
      ) {
        console.info('Firebase Auth registration disabled in Console; proceeding with Firestore user creation.');
      } else {
        console.warn('Firebase Auth create error, falling back to profile record:', err);
      }
    }

    const uid = fbUser ? fbUser.uid : `custom-uid-${Date.now()}`;
    const newProfile: AuthUser = {
      uid,
      email: email.trim(),
      displayName,
      role,
      title,
      targetPlatform,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isDemoAccount: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    await saveUserProfileToFirestore(newProfile);
    return { success: true, user: newProfile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration failed' };
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Firebase signOut warn:', err);
  }
}

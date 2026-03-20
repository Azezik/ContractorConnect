import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const DEFAULT_USER_DOCUMENT = {
  fullName: '',
  username: '',
  email: '',
  city: '',
  postalCode: '',
  roles: [],
  primaryRole: null,
  onboardingComplete: false,
  onboardingState: {
    customerComplete: false,
    contractorComplete: false,
  },
  accountStatus: 'active',
  authProvider: 'password',
};

export function getUserRef(userId) {
  return doc(db, 'users', userId);
}

function omitUndefinedEntries(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

function buildUserDocument(profile = {}) {
  const normalizedProfile = omitUndefinedEntries(profile);

  return {
    ...DEFAULT_USER_DOCUMENT,
    ...normalizedProfile,
    onboardingState: {
      ...DEFAULT_USER_DOCUMENT.onboardingState,
      ...(normalizedProfile.onboardingState || {}),
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function createUserDocument(userId, profile) {
  const userRef = getUserRef(userId);
  await setDoc(userRef, buildUserDocument(profile), { merge: true });
}

export async function ensureUserDocument(user, profile = {}) {
  if (!user?.uid) {
    throw new Error('Cannot create a user document without an authenticated user.');
  }

  const email = profile.email ?? user.email ?? '';
  await createUserDocument(user.uid, {
    fullName: profile.fullName ?? user.displayName ?? '',
    username: profile.username ?? email.split('@')[0] ?? '',
    email,
    city: profile.city ?? '',
    postalCode: profile.postalCode ?? '',
    authProvider: profile.authProvider ?? user.providerData?.[0]?.providerId ?? 'password',
    roles: profile.roles,
    primaryRole: profile.primaryRole,
    onboardingComplete: profile.onboardingComplete,
    onboardingState: profile.onboardingState,
    accountStatus: profile.accountStatus,
  });
}

export async function getUserDocument(userId) {
  const snapshot = await getDoc(getUserRef(userId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export function subscribeToUserDocument(userId, callback, onError) {
  return onSnapshot(
    getUserRef(userId),
    (snapshot) => {
      callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    },
    onError,
  );
}

export async function updateUserRole(userId, role) {
  const userRef = getUserRef(userId);
  await setDoc(userRef, {
    roles: [role],
    primaryRole: role,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function markOnboardingComplete(userId, role) {
  const userRef = getUserRef(userId);
  const field = role === 'customer' ? 'onboardingState.customerComplete' : 'onboardingState.contractorComplete';

  await updateDoc(userRef, {
    [field]: true,
    onboardingComplete: true,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(userId, updates) {
  await updateDoc(getUserRef(userId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { ACCOUNT_ROLES } from '../constants/roles';

const DEFAULT_USER_DOCUMENT = {
  fullName: '',
  username: '',
  email: '',
  city: '',
  postalCode: '',
  roles: [],
  accountRole: null,
  primaryRole: null,
  onboardingComplete: false,
  onboardingState: {
    clientComplete: false,
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

export function normalizeUserDocumentShape(snapshotData = {}, userId = null) {
  const normalizedProfile = omitUndefinedEntries(snapshotData);
  const accountRole = normalizedProfile.accountRole ?? normalizedProfile.primaryRole ?? null;
  const isClient = accountRole === ACCOUNT_ROLES.CLIENT;
  const clientComplete = Boolean(
    normalizedProfile.onboardingState?.clientComplete ?? normalizedProfile.onboardingState?.customerComplete,
  );
  const contractorComplete = Boolean(normalizedProfile.onboardingState?.contractorComplete);

  return {
    ...DEFAULT_USER_DOCUMENT,
    ...normalizedProfile,
    ...(userId ? { id: userId } : {}),
    accountRole,
    primaryRole: accountRole,
    roles: normalizedProfile.roles?.length ? normalizedProfile.roles : accountRole ? [accountRole] : [],
    onboardingState: {
      ...DEFAULT_USER_DOCUMENT.onboardingState,
      ...(normalizedProfile.onboardingState || {}),
      clientComplete,
      customerComplete: clientComplete,
      contractorComplete,
    },
  };
}

function buildUserDocument(profile = {}) {
  const normalizedProfile = normalizeUserDocumentShape(profile);

  return {
    ...DEFAULT_USER_DOCUMENT,
    ...normalizedProfile,
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
    accountRole: profile.accountRole,
    primaryRole: profile.primaryRole,
    onboardingComplete: profile.onboardingComplete,
    onboardingState: profile.onboardingState,
    accountStatus: profile.accountStatus,
  });
}

export async function getUserDocument(userId) {
  const snapshot = await getDoc(getUserRef(userId));
  return snapshot.exists() ? normalizeUserDocumentShape(snapshot.data(), snapshot.id) : null;
}

export function subscribeToUserDocument(userId, callback, onError) {
  return onSnapshot(
    getUserRef(userId),
    (snapshot) => {
      callback(snapshot.exists() ? normalizeUserDocumentShape(snapshot.data(), snapshot.id) : null);
    },
    onError,
  );
}

export async function synchronizeUserDocumentShape(userId, userDoc) {
  if (!userId || !userDoc) return;

  const updates = {};
  const accountRole = userDoc.accountRole ?? userDoc.primaryRole ?? null;

  if (accountRole && userDoc.accountRole !== accountRole) {
    updates.accountRole = accountRole;
  }

  if (accountRole && userDoc.primaryRole !== accountRole) {
    updates.primaryRole = accountRole;
  }

  if (accountRole && (!Array.isArray(userDoc.roles) || !userDoc.roles.includes(accountRole))) {
    updates.roles = [accountRole];
  }

  const clientComplete = Boolean(userDoc.onboardingState?.clientComplete ?? userDoc.onboardingState?.customerComplete);

  if (userDoc.onboardingState?.clientComplete !== clientComplete) {
    updates['onboardingState.clientComplete'] = clientComplete;
  }

  if (userDoc.onboardingState?.customerComplete !== clientComplete) {
    updates['onboardingState.customerComplete'] = clientComplete;
  }

  if (!Object.keys(updates).length) return;

  await updateDoc(getUserRef(userId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserRole(userId, role) {
  const userRef = getUserRef(userId);
  await setDoc(
    userRef,
    {
      roles: [role],
      accountRole: role,
      primaryRole: role,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function markOnboardingComplete(userId, role) {
  const userRef = getUserRef(userId);
  const isClient = role === ACCOUNT_ROLES.CLIENT || role === 'customer';

  await updateDoc(userRef, {
    'onboardingState.clientComplete': isClient,
    'onboardingState.customerComplete': isClient,
    'onboardingState.contractorComplete': !isClient,
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

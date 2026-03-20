import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export function getUserRef(userId) {
  return doc(db, 'users', userId);
}

export async function createUserDocument(userId, profile) {
  const userRef = getUserRef(userId);
  await setDoc(userRef, {
    fullName: profile.fullName,
    username: profile.username,
    email: profile.email,
    city: profile.city,
    postalCode: profile.postalCode,
    roles: [],
    primaryRole: null,
    onboardingComplete: false,
    onboardingState: {
      customerComplete: false,
      contractorComplete: false,
    },
    accountStatus: 'active',
    authProvider: 'password',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
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
  await updateDoc(userRef, {
    roles: [role],
    primaryRole: role,
    updatedAt: serverTimestamp(),
  });
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

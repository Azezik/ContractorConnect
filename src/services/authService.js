import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { FIRESTORE_PROFILE_PERMISSION_MESSAGE, isFirestorePermissionError } from '../lib/firebase/firebaseErrorUtils';
import { createUserDocument } from './userService';

export async function signupWithEmail({ fullName, username, email, password, city, postalCode }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  try {
    await updateProfile(credential.user, { displayName: fullName });
    await createUserDocument(credential.user.uid, {
      fullName,
      username,
      email,
      city,
      postalCode,
    });
    return credential.user;
  } catch (error) {
    await deleteUser(credential.user).catch(() => signOut(auth));

    if (isFirestorePermissionError(error)) {
      throw new Error(FIRESTORE_PROFILE_PERMISSION_MESSAGE);
    }

    throw error;
  }
}

export async function loginWithEmail({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export function logoutUser() {
  return signOut(auth);
}

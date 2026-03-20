import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { createUserDocument } from './userService';

export async function signupWithEmail({ fullName, username, email, password, city, postalCode }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: fullName });
  await createUserDocument(credential.user.uid, {
    fullName,
    username,
    email,
    city,
    postalCode,
  });
  return credential.user;
}

export async function loginWithEmail({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export function logoutUser() {
  return signOut(auth);
}

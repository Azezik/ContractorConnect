import { createContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { FIRESTORE_PROFILE_PERMISSION_MESSAGE, isFirestorePermissionError } from '../../lib/firebase/firebaseErrorUtils';
import { subscribeToUserDocument } from '../../services/userService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [authIssue, setAuthIssue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthIssue('');

      if (!user) {
        unsubscribeUser();
        setUserDoc(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      unsubscribeUser = subscribeToUserDocument(
        user.uid,
        (docData) => {
          setUserDoc(docData);
          setAuthIssue('');
          setLoading(false);
        },
        (error) => {
          setUserDoc(null);
          setAuthIssue(
            isFirestorePermissionError(error)
              ? FIRESTORE_PROFILE_PERMISSION_MESSAGE
              : 'We signed you in, but your account profile could not be loaded right now.',
          );
          setLoading(false);
        },
      );
    });

    return () => {
      unsubscribeUser();
      unsubscribeAuth();
    };
  }, []);

  const value = useMemo(() => ({ authUser, userDoc, authIssue, loading }), [authIssue, authUser, userDoc, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

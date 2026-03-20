import { createContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { subscribeToUserDocument } from '../../services/userService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);

      if (!user) {
        unsubscribeUser();
        setUserDoc(null);
        setLoading(false);
        return;
      }

      unsubscribeUser = subscribeToUserDocument(user.uid, (docData) => {
        setUserDoc(docData);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeUser();
      unsubscribeAuth();
    };
  }, []);

  const value = useMemo(() => ({ authUser, userDoc, loading }), [authUser, userDoc, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

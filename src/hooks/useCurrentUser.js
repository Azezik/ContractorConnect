import { useAuth } from './useAuth';

export function useCurrentUser() {
  const { authUser, userDoc, loading } = useAuth();
  return {
    authUser,
    userDoc,
    loading,
    userId: authUser?.uid || null,
  };
}

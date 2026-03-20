import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AccountAccessNotice } from '../../components/account/AccountAccessNotice';
import { Spinner } from '../../components/ui/Spinner';
import { ROUTES } from '../../constants/routes';

export function ProtectedRoute({ children }) {
  const { authUser, authIssue, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner label="Loading your account…" />;
  }

  if (!authUser) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  if (authIssue) {
    return <AccountAccessNotice message={authIssue} />;
  }

  return children;
}

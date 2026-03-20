import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../../components/ui/Spinner';
import { ROUTES } from '../../constants/routes';

export function ProtectedRoute({ children }) {
  const { authUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner label="Loading your account…" />;
  }

  if (!authUser) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return children;
}

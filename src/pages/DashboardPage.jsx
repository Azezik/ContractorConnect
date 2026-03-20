import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';
import { getDefaultAuthedRoute } from '../lib/guards/onboardingHelpers';

export function DashboardPage() {
  const { userDoc, loading } = useAuth();

  if (loading) return <Spinner label="Preparing your workspace…" />;

  return <Navigate to={getDefaultAuthedRoute(userDoc)} replace />;
}

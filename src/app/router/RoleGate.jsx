import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { hasRole } from '../../lib/guards/roleHelpers';
import { getDefaultAuthedRoute } from '../../lib/guards/onboardingHelpers';

export function RoleGate({ allowedRoles, children }) {
  const { userDoc, loading } = useAuth();

  if (loading) return null;
  if (!hasRole(userDoc, allowedRoles)) {
    return <Navigate to={getDefaultAuthedRoute(userDoc)} replace />;
  }

  return children;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../../components/ui/Spinner';
import { getAccountRole } from '../../lib/auth/accountRole';
import { getDefaultAuthedRoute, getHomeRouteForRole, isOnboardingCompleteForRole } from '../../lib/guards/onboardingHelpers';

export function RoleGate({
  allowedRoles,
  requireOnboarding = false,
  redirectIfOnboardingComplete = false,
  children,
}) {
  const { userDoc, loading } = useAuth();
  const accountRole = getAccountRole(userDoc);
  const isAllowed = Boolean(accountRole && allowedRoles?.includes(accountRole));
  const isOnboarded = isOnboardingCompleteForRole(userDoc, accountRole);

  if (loading) return <Spinner label="Checking account access…" />;

  if (!isAllowed) {
    return <Navigate to={getDefaultAuthedRoute(userDoc)} replace />;
  }

  if (requireOnboarding && !isOnboarded) {
    return <Navigate to={getDefaultAuthedRoute(userDoc)} replace />;
  }

  if (redirectIfOnboardingComplete && isOnboarded) {
    return <Navigate to={getHomeRouteForRole(accountRole)} replace />;
  }

  return children || <Outlet />;
}

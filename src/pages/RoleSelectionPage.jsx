import { Navigate, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { RoleSelectionCard } from '../components/auth/RoleSelectionCard';
import { ROUTES } from '../constants/routes';
import { ACCOUNT_ROLES } from '../constants/roles';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getAccountRole } from '../lib/auth/accountRole';
import { getDefaultAuthedRoute, getOnboardingRouteForRole } from '../lib/guards/onboardingHelpers';
import { updateUserRole } from '../services/userService';

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const { userId, userDoc } = useCurrentUser();
  const accountRole = getAccountRole(userDoc);

  if (accountRole) {
    return <Navigate to={getDefaultAuthedRoute(userDoc)} replace />;
  }

  async function handleSelect(role) {
    await updateUserRole(userId, role);
    navigate(getOnboardingRouteForRole(role));
  }

  return (
    <PageContainer>
      <section className="page-hero">
        <span className="eyebrow">Choose your account type</span>
        <h1>Pick the Contractor Connect experience that matches your account.</h1>
        <p>
          Client and contractor workspaces are now treated as separate product areas. Choose the account role you want this account to use, then finish the matching onboarding flow.
        </p>
      </section>
      <div className="role-chooser">
        <RoleSelectionCard
          title="I need work done"
          description="Create a client account, complete onboarding, and publish your first job post without entering contractor tools."
          onSelect={() => handleSelect(ACCOUNT_ROLES.CLIENT)}
        />
        <RoleSelectionCard
          title="I’m a contractor"
          description="Create a contractor profile, browse matched local jobs, and stay inside the contractor workspace."
          onSelect={() => handleSelect(ACCOUNT_ROLES.CONTRACTOR)}
        />
      </div>
    </PageContainer>
  );
}

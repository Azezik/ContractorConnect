import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { RoleSelectionCard } from '../components/auth/RoleSelectionCard';
import { ROUTES } from '../constants/routes';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { updateUserRole } from '../services/userService';

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();

  async function handleSelect(role) {
    await updateUserRole(userId, role);
    navigate(role === 'customer' ? ROUTES.CUSTOMER_ONBOARDING : ROUTES.CONTRACTOR_ONBOARDING);
  }

  return (
    <PageContainer>
      <section className="page-hero">
        <span className="eyebrow">Choose your path</span>
        <h1>How do you want to use Contractor Connect?</h1>
        <p>
          Pick the experience that matches what you want to do today. You can finish setup in a few steps and start using the platform right away.
        </p>
      </section>
      <div className="role-chooser">
        <RoleSelectionCard
          title="I need work done"
          description="Create a customer account path, complete onboarding, and publish your first job post."
          onSelect={() => handleSelect('customer')}
        />
        <RoleSelectionCard
          title="I’m a contractor"
          description="Create a contractor profile, browse active local jobs, and start messaging customers in-platform."
          onSelect={() => handleSelect('contractor')}
        />
      </div>
    </PageContainer>
  );
}

import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { RoleSelectionCard } from '../components/auth/RoleSelectionCard';
import { updateUserRole } from '../services/userService';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { ROUTES } from '../constants/routes';

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
          Public-facing copy keeps the wording friendly, while the account model stores roles in a future-safe way for later expansion.
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

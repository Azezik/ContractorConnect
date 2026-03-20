import { PageContainer } from '../../components/layout/PageContainer';
import { CustomerOnboardingFlow } from '../../components/onboarding/customer/CustomerOnboardingFlow';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export function CustomerOnboardingPage() {
  const { userId, userDoc } = useCurrentUser();

  return (
    <PageContainer>
      <CustomerOnboardingFlow userId={userId} userDoc={userDoc} isInitialOnboarding />
    </PageContainer>
  );
}

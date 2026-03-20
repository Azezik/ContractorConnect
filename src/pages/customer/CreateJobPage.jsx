import { PageContainer } from '../../components/layout/PageContainer';
import { CustomerOnboardingFlow } from '../../components/onboarding/customer/CustomerOnboardingFlow';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export function CreateJobPage() {
  const { userId, userDoc } = useCurrentUser();

  return (
    <PageContainer>
      <CustomerOnboardingFlow userId={userId} userDoc={userDoc} isInitialOnboarding={false} />
    </PageContainer>
  );
}

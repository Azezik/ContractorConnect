import { PageContainer } from '../../components/layout/PageContainer';
import { ContractorOnboardingFlow } from '../../components/onboarding/contractor/ContractorOnboardingFlow';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export function ContractorOnboardingPage() {
  const { userId, userDoc } = useCurrentUser();

  return (
    <PageContainer>
      <ContractorOnboardingFlow userId={userId} userDoc={userDoc} />
    </PageContainer>
  );
}

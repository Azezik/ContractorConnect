import { PageContainer } from '../components/layout/PageContainer';
import { HeroSection } from '../components/landing/HeroSection';
import { RoleChooser } from '../components/landing/RoleChooser';
import { InfoSection } from '../components/landing/InfoSection';
import { LandingCTA } from '../components/landing/LandingCTA';

export function LandingPage() {
  return (
    <PageContainer className="landing-page">
      <HeroSection />
      <RoleChooser />
      <InfoSection />
      <LandingCTA />
    </PageContainer>
  );
}

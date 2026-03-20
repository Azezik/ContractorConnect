import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ROUTES } from '../../constants/routes';

export function ContractorHomePage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Contractor dashboard"
        title="Your marketplace workspace"
        description="Use the feed to find active jobs, keep your profile updated, and manage conversations through the in-platform inbox."
        action={<Link to={ROUTES.FEED}><Button>Open job feed</Button></Link>}
      />
      <div className="stats-grid">
        <Card><strong>Browse local demand</strong><span>Use tags, city, and category filters in the feed.</span></Card>
        <Card><strong>Message inside the app</strong><span>Start conversations without exposing your email.</span></Card>
        <Card><strong>Trust architecture ready</strong><span>Reviews, reports, and moderation collections are already in place.</span></Card>
      </div>
    </PageContainer>
  );
}

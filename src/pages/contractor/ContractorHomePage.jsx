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
        title="Your contractor workspace"
        description="This area stays focused on contractor workflows only: matched jobs, your profile, and client conversations tied to your outreach."
        action={<Link to={ROUTES.CONTRACTOR_FEED}><Button>Open job feed</Button></Link>}
      />
      <div className="stats-grid">
        <Card><strong>Browse local demand</strong><span>Use the matched feed to find active work that fits your services and coverage.</span></Card>
        <Card><strong>Message inside the app</strong><span>Reach clients from job details without entering client job-management screens.</span></Card>
        <Card><strong>Build credibility</strong><span>Your contractor profile stays separate from client job-posting tools.</span></Card>
      </div>
    </PageContainer>
  );
}

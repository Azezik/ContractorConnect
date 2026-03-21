import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useContractorProfile } from '../../hooks/useContractorProfile';

export function ContractorHomePage() {
  const { authUser, userDoc } = useAuth();
  const { profile } = useContractorProfile(authUser?.uid);
  const firstName = userDoc?.fullName?.split(' ')[0] || 'there';

  return (
    <PageContainer>
      <SectionHeader
        eyebrow={<>Contractor dashboard <Badge>Contractor</Badge></>}
        title={`Welcome back, ${firstName}`}
        description="Find matched jobs, manage your profile, and connect with clients."
        action={
          <Link to={ROUTES.CONTRACTOR_FEED}>
            <Button>Browse job feed</Button>
          </Link>
        }
      />
      <div className="stats-grid">
        <Link to={ROUTES.CONTRACTOR_FEED} style={{ textDecoration: 'none' }}>
          <Card style={{ height: '100%' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Job feed</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
              Browse active jobs matched to your services and service area.
            </p>
          </Card>
        </Link>
        <Link to={ROUTES.CONTRACTOR_INBOX} style={{ textDecoration: 'none' }}>
          <Card style={{ height: '100%' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Messages</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
              View and respond to conversations with clients about their projects.
            </p>
          </Card>
        </Link>
        <Link to={ROUTES.CONTRACTOR_PROFILE} style={{ textDecoration: 'none' }}>
          <Card style={{ height: '100%' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Your profile</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
              {profile?.businessName
                ? `Manage your ${profile.businessName} profile and public details.`
                : 'Build your public contractor profile and showcase your work.'}
            </p>
          </Card>
        </Link>
      </div>
      {profile && (
        <Card style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: '0 0 0.25rem' }}>{profile.businessName}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
                {profile.categories?.join(', ') || 'General contractor'}
                {profile.postalCode ? ` · ${profile.postalCode}` : ''}
              </p>
            </div>
            <Badge variant="success">{profile.availabilityStatus || 'Available'}</Badge>
          </div>
        </Card>
      )}
    </PageContainer>
  );
}

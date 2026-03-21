import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useContractorProfile } from '../../hooks/useContractorProfile';
import { AVAILABILITY_LABELS } from '../../constants/availability';

export function ContractorHomePage() {
  const { authUser, userDoc } = useAuth();
  const { profile } = useContractorProfile(authUser?.uid);
  const firstName = userDoc?.fullName?.split(' ')[0] || 'there';

  const availabilityLabel = profile?.availabilityStatus
    ? AVAILABILITY_LABELS[profile.availabilityStatus] || profile.availabilityStatus
    : 'Available for work';

  return (
    <PageContainer>
      <SectionHeader
        eyebrow={<>Dashboard <Badge>Contractor</Badge></>}
        title={`Welcome back, ${firstName}`}
        description="Find matched jobs, manage your profile, and connect with clients."
        action={
          <Link to={ROUTES.CONTRACTOR_FEED}>
            <Button>Browse job feed</Button>
          </Link>
        }
      />

      {profile && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: '0 0 0.25rem' }}>{profile.businessName}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
                {profile.categories?.join(', ') || 'General contractor'}
                {profile.postalCode ? ` · ${profile.postalCode}` : ''}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Badge variant="success">{availabilityLabel}</Badge>
              <Link to={ROUTES.CONTRACTOR_PROFILE}>
                <Button variant="secondary" style={{ fontSize: '0.85rem' }}>View profile</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

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
            <h3 style={{ margin: '0 0 0.5rem' }}>Inbox</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
              View and respond to conversations with clients about their projects.
            </p>
          </Card>
        </Link>
        <Link to={ROUTES.CONTRACTOR_SETTINGS} style={{ textDecoration: 'none' }}>
          <Card style={{ height: '100%' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Settings</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
              Update your account details and preferences.
            </p>
          </Card>
        </Link>
      </div>
    </PageContainer>
  );
}

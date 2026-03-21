import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useContractorProfile } from '../../hooks/useContractorProfile';
import { subscribeToContractorReviews } from '../../services/reviewService';
import { formatDate } from '../../lib/formatters/dates';
import { ROUTES } from '../../constants/routes';
import { AVAILABILITY_LABELS } from '../../constants/availability';

function formatWorkRadius(workRadiusKm) {
  if (!workRadiusKm) return null;
  return Number(workRadiusKm) === 500 ? '500+ km' : `${workRadiusKm} km`;
}

function StarRating({ rating }) {
  const filled = Math.round(rating);
  return (
    <span style={{ fontSize: '1.1rem', letterSpacing: '0.1em' }}>
      {'★'.repeat(filled)}{'☆'.repeat(5 - filled)}
    </span>
  );
}

export function ContractorProfilePage() {
  const { userId } = useCurrentUser();
  const { profile, loading } = useContractorProfile(userId);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!userId) return undefined;
    return subscribeToContractorReviews(userId, setReviews);
  }, [userId]);

  if (loading) {
    return (
      <PageContainer>
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading your profile...</p>
        </Card>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer>
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Profile not set up yet</h2>
          <p>Complete contractor onboarding to create your public business profile.</p>
        </Card>
      </PageContainer>
    );
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  const availabilityLabel = profile.availabilityStatus
    ? AVAILABILITY_LABELS[profile.availabilityStatus] || profile.availabilityStatus
    : 'Available for work';

  return (
    <PageContainer>
      {/* Hero */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: '1 1 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0 }}>{profile.businessName}</h1>
              <Badge variant="success">{availabilityLabel}</Badge>
            </div>
            {profile.displayName && (
              <p style={{ margin: '0 0 0.25rem', color: 'var(--color-text-muted, #666)', fontSize: '1rem' }}>
                {profile.displayName}
              </p>
            )}
            {profile.categories?.length > 0 && (
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
                {profile.categories.join(' · ')}
              </p>
            )}
            {averageRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <StarRating rating={Number(averageRating)} />
                <span style={{ fontWeight: 600 }}>{averageRating}</span>
                <span style={{ color: 'var(--color-text-muted, #666)', fontSize: '0.9rem' }}>
                  ({reviews.length} review{reviews.length === 1 ? '' : 's'})
                </span>
              </div>
            )}
          </div>
          <Link to={ROUTES.CONTRACTOR_PROFILE_EDIT}>
            <Button variant="secondary">Edit profile</Button>
          </Link>
        </div>
        {profile.bio && (
          <p style={{ marginTop: '1rem', lineHeight: 1.6 }}>{profile.bio}</p>
        )}
        {profile.tags?.length > 0 && (
          <div className="tag-list" style={{ marginTop: '1rem' }}>
            {profile.tags.map((tag) => (
              <span key={tag} className="tag-chip tag-chip--static">#{tag}</span>
            ))}
          </div>
        )}
      </Card>

      <div className="two-column-layout">
        {/* Left column */}
        <div>
          {/* Services */}
          {profile.servicesOffered?.length > 0 && (
            <Card style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem' }}>Services offered</h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {profile.servicesOffered.map((item) => (
                  <li key={item} style={{ marginBottom: '0.4rem' }}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

          {/* Portfolio */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem' }}>Portfolio</h3>
            {profile.imageUrls?.length ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {profile.imageUrls.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt="Portfolio work"
                    style={{ width: '100%', borderRadius: '8px', aspectRatio: '1', objectFit: 'cover' }}
                  />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted, #666)', margin: 0 }}>
                No portfolio images yet. Add photos of your work from the profile editor.
              </p>
            )}
          </Card>

          {/* Reviews */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Reviews</h3>
              {reviews.length > 0 && (
                <Badge>{reviews.length} review{reviews.length === 1 ? '' : 's'}</Badge>
              )}
            </div>
            {reviews.length ? (
              <div>
                {reviews.map((review) => (
                  <div key={review.id} style={{ borderBottom: '1px solid var(--color-border, #eee)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <StarRating rating={review.rating} />
                      <small style={{ color: 'var(--color-text-muted, #999)' }}>{formatDate(review.createdAt)}</small>
                    </div>
                    <p style={{ margin: '0.5rem 0 0' }}>{review.reviewText}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted, #666)', margin: 0 }}>
                No reviews yet. Reviews from clients will appear here after completed projects.
              </p>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div>
          {/* Business details */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem' }}>Business details</h3>
            <dl style={{ margin: 0 }}>
              {profile.postalCode && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <dt style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted, #666)', marginBottom: '0.2rem' }}>Location</dt>
                  <dd style={{ margin: 0, fontWeight: 500 }}>{profile.postalCode}</dd>
                </div>
              )}
              {formatWorkRadius(profile.workRadiusKm) && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <dt style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted, #666)', marginBottom: '0.2rem' }}>Service radius</dt>
                  <dd style={{ margin: 0, fontWeight: 500 }}>{formatWorkRadius(profile.workRadiusKm)}</dd>
                </div>
              )}
              {(profile.serviceAreaDescription || profile.serviceArea) && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <dt style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted, #666)', marginBottom: '0.2rem' }}>Service area</dt>
                  <dd style={{ margin: 0, fontWeight: 500 }}>{profile.serviceAreaDescription || profile.serviceArea}</dd>
                </div>
              )}
              {profile.phone && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <dt style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted, #666)', marginBottom: '0.2rem' }}>Phone</dt>
                  <dd style={{ margin: 0, fontWeight: 500 }}>{profile.phone}</dd>
                </div>
              )}
              {profile.website && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <dt style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted, #666)', marginBottom: '0.2rem' }}>Website</dt>
                  <dd style={{ margin: 0, fontWeight: 500 }}>
                    <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer">
                      {profile.website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Quick actions */}
          <Card>
            <h3 style={{ margin: '0 0 1rem' }}>Quick actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to={ROUTES.CONTRACTOR_PROFILE_EDIT}>
                <Button variant="secondary" style={{ width: '100%' }}>Edit profile</Button>
              </Link>
              <Link to={ROUTES.CONTRACTOR_FEED}>
                <Button variant="ghost" style={{ width: '100%' }}>Browse job feed</Button>
              </Link>
              <Link to={ROUTES.CONTRACTOR_INBOX}>
                <Button variant="ghost" style={{ width: '100%' }}>View inbox</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

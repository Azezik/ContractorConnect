import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { ContractorProfileCard } from '../../components/contractors/ContractorProfileCard';
import { ContractorSummaryPanel } from '../../components/contractors/ContractorSummaryPanel';
import { Card } from '../../components/ui/Card';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useContractorProfile } from '../../hooks/useContractorProfile';
import { subscribeToContractorReviews } from '../../services/reviewService';
import { formatDate } from '../../lib/formatters/dates';

export function ContractorProfilePage() {
  const { userId } = useCurrentUser();
  const { profile } = useContractorProfile(userId);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!userId) return undefined;
    return subscribeToContractorReviews(userId, setReviews);
  }, [userId]);

  if (!profile) {
    return (
      <PageContainer>
        <Card>
          <h1>Your profile is still being prepared</h1>
          <p>Complete contractor onboarding first, then refresh this page if your profile is not visible yet.</p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="two-column-layout">
        <div>
          <ContractorProfileCard profile={profile} />
          <Card>
            <h3>Services offered</h3>
            <ul className="plain-list">
              {profile.servicesOffered?.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Card>
          <Card>
            <h3>Portfolio</h3>
            {profile.imageUrls?.length ? (
              <div className="image-grid">
                {profile.imageUrls.map((url) => <img key={url} src={url} alt="Contractor portfolio" />)}
              </div>
            ) : (
              <p>No portfolio images uploaded yet.</p>
            )}
          </Card>
        </div>
        <div>
          <ContractorSummaryPanel profile={profile} />
          <Card>
            <h3>Reviews and trust</h3>
            <p>
              This contractor-only workspace shows the public reviews attached to your business profile without mixing in client account controls.
            </p>
            {reviews.length ? (
              <div className="review-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <strong>{review.rating}/5</strong>
                    <span>{formatDate(review.createdAt)}</span>
                    <p>{review.reviewText}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No public reviews yet.</p>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

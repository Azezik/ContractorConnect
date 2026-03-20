import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { ContractorProfileCard } from '../../components/contractors/ContractorProfileCard';
import { ContractorSummaryPanel } from '../../components/contractors/ContractorSummaryPanel';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Textarea';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useContractorProfile } from '../../hooks/useContractorProfile';
import { createReview, subscribeToContractorReviews } from '../../services/reviewService';
import { formatDate } from '../../lib/formatters/dates';

export function ContractorProfilePage() {
  const { userId, userDoc } = useCurrentUser();
  const { profile } = useContractorProfile(userId);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: '5', reviewText: '' });
  const canLeaveReview = useMemo(() => userDoc?.primaryRole === 'customer', [userDoc]);

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

  async function handleReviewSubmit(event) {
    event.preventDefault();
    if (!canLeaveReview) return;
    await createReview({
      contractorId: userId,
      reviewerId: userDoc.id,
      jobPostId: null,
      rating: Number(form.rating),
      reviewText: form.reviewText,
    });
    setForm({ rating: '5', reviewText: '' });
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
              Customer feedback appears here so future clients can quickly understand the quality of your work and communication.
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
          {canLeaveReview ? (
            <Card>
              <h3>Leave a review</h3>
              <form className="form-stack" onSubmit={handleReviewSubmit}>
                <Input label="Rating (1-5)" value={form.rating} onChange={(e) => setForm((current) => ({ ...current, rating: e.target.value }))} />
                <Textarea label="Review" rows={4} value={form.reviewText} onChange={(e) => setForm((current) => ({ ...current, reviewText: e.target.value }))} />
                <Button type="submit">Submit review</Button>
              </form>
            </Card>
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
}

import { StepLayout } from '../StepLayout';
import { ContractorTagList } from '../../contractors/ContractorTagList';

export function ProfileReviewStep({ values }) {
  return (
    <StepLayout title="Review your profile" description="This saves a real contractor profile tied to your account.">
      <div className="review-panel">
        <h3>{values.businessName}</h3>
        <p><strong>Display name:</strong> {values.displayName || 'Not provided'}</p>
        <p><strong>Categories:</strong> {values.categories.join(', ')}</p>
        <p><strong>Service area:</strong> {values.serviceArea}</p>
        <p><strong>Bio:</strong> {values.bio}</p>
        <p><strong>Availability:</strong> {values.availabilityStatus}</p>
        <p><strong>Services:</strong></p>
        <ContractorTagList items={values.servicesOffered} />
        <p><strong>Tags:</strong></p>
        <ContractorTagList items={values.tags} />
        <p><strong>Portfolio images selected:</strong> {values.imageFiles?.length || 0}</p>
      </div>
    </StepLayout>
  );
}

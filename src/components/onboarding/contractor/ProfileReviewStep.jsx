import { StepLayout } from '../StepLayout';
import { ContractorTagList } from '../../contractors/ContractorTagList';

export function ProfileReviewStep({ values }) {
  return (
    <StepLayout title="Review your profile" description="Check the customer-facing details and the matching data before you publish.">
      <div className="review-panel">
        <h3>{values.businessName}</h3>
        <p><strong>Display name:</strong> {values.displayName || 'Not provided'}</p>
        <p><strong>Business bio:</strong> {values.bio}</p>
        <p><strong>Categories:</strong> {values.categories.join(', ')}</p>
        <p><strong>Postal code:</strong> {values.postalCode}</p>
        <p><strong>Work radius:</strong> {values.workRadiusKm ? `${values.workRadiusKm} km${values.workRadiusKm === '500' ? '+' : ''}` : 'Not set'}</p>
        <p><strong>Service area description:</strong> {values.serviceAreaDescription || 'Not provided'}</p>
        <p><strong>Availability:</strong> {values.availabilityStatus}</p>
        <p><strong>Services:</strong></p>
        <ContractorTagList items={values.servicesOffered} />
        <p><strong>Search tags:</strong></p>
        <ContractorTagList items={values.tags} />
        <p><strong>Portfolio images selected:</strong> {values.imageFiles?.length || 0}</p>
      </div>
    </StepLayout>
  );
}

import { StepLayout } from '../StepLayout';
import { JobTagList } from '../../jobs/JobTagList';

export function JobReviewStep({ values }) {
  return (
    <StepLayout title="Review your post" description="This will publish a real job post to Firestore under your account.">
      <div className="review-panel">
        <h3>{values.title}</h3>
        <p><strong>Category:</strong> {values.category}</p>
        <p><strong>Description:</strong> {values.description}</p>
        <p><strong>Location:</strong> {values.city} • {values.postalCode}</p>
        <p><strong>Budget:</strong> {values.budget || 'Not specified'}</p>
        <p><strong>Timeline:</strong> {values.timeline || 'Flexible'}</p>
        <JobTagList tags={values.tags} />
        <p><strong>Images selected:</strong> {values.imageFiles?.length || 0}</p>
      </div>
    </StepLayout>
  );
}

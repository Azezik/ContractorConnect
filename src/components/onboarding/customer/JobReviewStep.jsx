import { StepLayout } from '../StepLayout';
import { JobTagList } from '../../jobs/JobTagList';
import { JobImagePicker } from './JobImagePicker';

export function JobReviewStep({ values, errors, onAddImages, onRemoveImage, onSelectPrimaryImage }) {
  return (
    <StepLayout title="Review your post" description="Give everything one last look before you publish it.">
      <div className="review-panel">
        <h3>{values.title}</h3>
        <p><strong>Category:</strong> {values.category}</p>
        <p><strong>Description:</strong> {values.description}</p>
        <p><strong>Location:</strong> {values.city} • {values.postalCode}</p>
        <p><strong>Budget:</strong> {values.budget || 'Not specified'}</p>
        <p><strong>Timeline:</strong> {values.timeline || 'Flexible'}</p>
        <div>
          <p><strong>Tags:</strong></p>
          <JobTagList tags={values.tags} />
        </div>
      </div>

      <div className="review-panel review-panel--images">
        <div className="review-panel__header">
          <div>
            <h3>Photos</h3>
            <p>Choose the main thumbnail and add more photos if you need to before publishing.</p>
          </div>
        </div>
        <JobImagePicker
          files={values.imageFiles}
          primaryImageIndex={values.primaryImageIndex}
          error={errors.imageFiles}
          onAddImages={onAddImages}
          onRemoveImage={onRemoveImage}
          onSelectPrimary={onSelectPrimaryImage}
          showPrimarySelection
        />
      </div>
    </StepLayout>
  );
}

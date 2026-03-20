import { StepLayout } from '../StepLayout';
import { JobImagePicker } from './JobImagePicker';

export function JobImagesStep({ values, errors, onAddImages, onRemoveImage }) {
  return (
    <StepLayout
      title="Add photos"
      description="Photos help contractors understand the scope faster and give you better responses."
    >
      <div className="info-callout">
        <p>
          A picture is worth a thousand words. Jobs with clear photos are much more likely to get responses.
        </p>
        <ul className="feature-list feature-list--compact">
          <li>Show the work area</li>
          <li>Show what needs to be done</li>
          <li>Include access points if relevant</li>
          <li>More context = better matches</li>
        </ul>
      </div>

      <JobImagePicker
        files={values.imageFiles}
        primaryImageIndex={values.primaryImageIndex}
        error={errors.imageFiles}
        onAddImages={onAddImages}
        onRemoveImage={onRemoveImage}
        onSelectPrimary={() => {}}
      />
    </StepLayout>
  );
}

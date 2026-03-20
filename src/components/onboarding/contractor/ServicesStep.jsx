import { StepLayout } from '../StepLayout';
import { TagInput } from '../../ui/TagInput';

export function ServicesStep({ values, errors, onChange }) {
  return (
    <StepLayout title="Services and tags" description="Use services for customer-facing offerings and tags for future matching/search.">
      <TagInput
        label="Services offered"
        value={values.servicesOffered}
        error={errors.servicesOffered}
        onChange={(next) => onChange('servicesOffered', next)}
        placeholder="Add a service"
      />
      <TagInput
        label="Tags"
        value={values.tags}
        error={errors.tags}
        onChange={(next) => onChange('tags', next)}
        placeholder="Add a tag"
      />
    </StepLayout>
  );
}

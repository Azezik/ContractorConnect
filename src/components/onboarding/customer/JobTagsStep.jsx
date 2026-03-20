import { StepLayout } from '../StepLayout';
import { TagInput } from '../../ui/TagInput';
import { FormField } from '../../ui/FormField';

export function JobTagsStep({ values, errors, onChange }) {
  return (
    <StepLayout title="Tags and optional photos" description="Tags power matching now and search relevance later.">
      <TagInput
        label="Tags"
        value={values.tags}
        error={errors.tags}
        hint="Examples: windows, faucet, deck repair, concrete, interlock"
        onChange={(next) => onChange('tags', next)}
      />
      <FormField label="Images (optional)" hint="Storage is fully wired. Upload a few images now if you have them.">
        <input type="file" multiple accept="image/*" onChange={(e) => onChange('imageFiles', Array.from(e.target.files || []))} />
      </FormField>
    </StepLayout>
  );
}

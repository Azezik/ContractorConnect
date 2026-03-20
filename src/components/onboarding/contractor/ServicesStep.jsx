import { StepLayout } from '../StepLayout';
import { TagInput } from '../../ui/TagInput';

export function ServicesStep({ values, errors, onChange }) {
  return (
    <StepLayout
      title="What kinds of jobs do you want to be found for?"
      description="These selections help decide which jobs you receive and how customers discover your business."
    >
      <TagInput
        label="Services offered"
        value={values.servicesOffered}
        error={errors.servicesOffered}
        hint="Add the specific job types you want inquiries for, like fence repair, panel upgrades, or kitchen tile."
        onChange={(next) => onChange('servicesOffered', next)}
        placeholder="Add a service"
      />
      <TagInput
        label="Search tags"
        value={values.tags}
        hint="Optional. Add a few extra terms customers might search for."
        onChange={(next) => onChange('tags', next)}
        placeholder="Add a tag"
      />
    </StepLayout>
  );
}

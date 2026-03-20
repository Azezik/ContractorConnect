import { StepLayout } from '../StepLayout';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { TagInput } from '../../ui/TagInput';

export function JobDetailsStep({ values, errors, onChange }) {
  return (
    <StepLayout title="Add details and location" description="Clear details, tags, and location help the right contractors find this job faster.">
      <Textarea
        label="Project description"
        value={values.description}
        error={errors.description}
        rows={6}
        hint="Describe the work, scope, and anything a contractor should know before reaching out."
        onChange={(e) => onChange('description', e.target.value)}
      />
      <TagInput
        label="Job tags"
        value={values.tags}
        error={errors.tags}
        hint="Add a few searchable terms like windows, faucet repair, deck, concrete, or interlock."
        onChange={(next) => onChange('tags', next)}
      />
      <div className="form-grid">
        <Input label="City" value={values.city} error={errors.city} onChange={(e) => onChange('city', e.target.value)} />
        <Input
          label="Postal code"
          value={values.postalCode}
          error={errors.postalCode}
          hint="Used to match your job with nearby contractors."
          onChange={(e) => onChange('postalCode', e.target.value)}
        />
      </div>
      <div className="form-grid">
        <Input label="Budget (optional)" value={values.budget} onChange={(e) => onChange('budget', e.target.value)} />
        <Input label="Timeline (optional)" value={values.timeline} onChange={(e) => onChange('timeline', e.target.value)} />
      </div>
    </StepLayout>
  );
}

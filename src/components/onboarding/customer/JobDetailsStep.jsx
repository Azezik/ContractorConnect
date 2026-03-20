import { StepLayout } from '../StepLayout';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { TagInput } from '../../ui/TagInput';

export function JobDetailsStep({ values, errors, onChange }) {
  return (
    <StepLayout title="Add details and location" description="Clear details and tags help the right contractors decide quickly if they’re a fit.">
      <Textarea
        label="Project description"
        value={values.description}
        error={errors.description}
        rows={6}
        onChange={(e) => onChange('description', e.target.value)}
      />
      <TagInput
        label="Tags"
        value={values.tags}
        error={errors.tags}
        hint="Examples: windows, faucet, deck repair, concrete, interlock"
        onChange={(next) => onChange('tags', next)}
      />
      <div className="form-grid">
        <Input label="City" value={values.city} error={errors.city} onChange={(e) => onChange('city', e.target.value)} />
        <Input
          label="Postal code"
          value={values.postalCode}
          error={errors.postalCode}
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

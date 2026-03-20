import { StepLayout } from '../StepLayout';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';

export function ServiceAreaStep({ values, errors, onChange }) {
  return (
    <StepLayout title="Where you work" description="Service area and business bio help customers decide whether to respond.">
      <Input
        label="Service area"
        value={values.serviceArea}
        error={errors.serviceArea}
        hint="Example: Toronto west end, Mississauga, Oakville"
        onChange={(e) => onChange('serviceArea', e.target.value)}
      />
      <Textarea label="Business bio" rows={6} value={values.bio} error={errors.bio} onChange={(e) => onChange('bio', e.target.value)} />
    </StepLayout>
  );
}

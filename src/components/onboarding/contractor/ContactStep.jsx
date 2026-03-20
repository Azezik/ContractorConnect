import { StepLayout } from '../StepLayout';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { FormField } from '../../ui/FormField';
import { AVAILABILITY_OPTIONS } from '../../../constants/availability';

export function ContactStep({ values, onChange }) {
  return (
    <StepLayout title="Contact and availability" description="Keep it platform-first, but optionally add business contact details for trust.">
      <div className="form-grid">
        <Input label="Phone (optional)" value={values.phone} onChange={(e) => onChange('phone', e.target.value)} />
        <Input label="Website (optional)" value={values.website} onChange={(e) => onChange('website', e.target.value)} />
      </div>
      <Select
        label="Availability"
        options={AVAILABILITY_OPTIONS}
        value={values.availabilityStatus}
        onChange={(e) => onChange('availabilityStatus', e.target.value)}
      />
      <FormField label="Portfolio images (optional)" hint="Storage is enabled now, even if your portfolio grows later.">
        <input type="file" multiple accept="image/*" onChange={(e) => onChange('imageFiles', Array.from(e.target.files || []))} />
      </FormField>
    </StepLayout>
  );
}

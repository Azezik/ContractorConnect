import { StepLayout } from '../StepLayout';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { WORK_RADIUS_OPTIONS } from '../../../constants/workRadius';

export function ServiceAreaStep({ values, errors, onChange }) {
  return (
    <StepLayout title="Location and coverage" description="Set the structured location data we’ll use for matching, then add an optional area label customers can read.">
      <div className="info-callout">
        <p><strong>Used for matching:</strong> postal code + work radius.</p>
        <p><strong>Shown on your profile:</strong> service area description.</p>
      </div>
      <div className="form-grid">
        <Input
          label="Postal code"
          value={values.postalCode}
          error={errors.postalCode}
          hint="Your postal code is used to match you with nearby jobs."
          onChange={(e) => onChange('postalCode', e.target.value)}
        />
        <Select
          label="Work radius"
          options={WORK_RADIUS_OPTIONS}
          value={values.workRadiusKm}
          error={errors.workRadiusKm}
          hint="How far are you willing to travel for work?"
          onChange={(e) => onChange('workRadiusKm', e.target.value)}
        />
      </div>
      <Input
        label="Service area description"
        value={values.serviceAreaDescription}
        hint="Optional display text, like ‘Toronto West End’, ‘Ottawa South’, or ‘Kanata and surrounding area’."
        onChange={(e) => onChange('serviceAreaDescription', e.target.value)}
      />
    </StepLayout>
  );
}

import { StepLayout } from '../StepLayout';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { FormField } from '../../ui/FormField';
import { CATEGORY_OPTIONS } from '../../../constants/categories';

export function BusinessInfoStep({ values, errors, onChange }) {
  function toggleCategory(category) {
    const next = values.categories.includes(category)
      ? values.categories.filter((item) => item !== category)
      : [...values.categories, category];
    onChange('categories', next);
  }

  return (
    <StepLayout title="Business identity" description="Start with who you are, then tell customers what kind of work your business takes on.">
      <div className="form-grid">
        <Input
          label="Business name"
          value={values.businessName}
          error={errors.businessName}
          onChange={(e) => onChange('businessName', e.target.value)}
        />
        <Input
          label="Display name"
          hint="Optional. Use this if customers know you by a shorter name or brand."
          value={values.displayName}
          onChange={(e) => onChange('displayName', e.target.value)}
        />
      </div>
      <Textarea
        label="Business bio"
        rows={6}
        value={values.bio}
        error={errors.bio}
        hint="A short, clear summary of the work you do and the customers you serve."
        onChange={(e) => onChange('bio', e.target.value)}
      />
      <FormField
        label="Categories"
        error={errors.categories}
        hint="Choose the main service groups your business should be matched and discovered under."
      >
        <div className="checkbox-grid">
          {CATEGORY_OPTIONS.map((category) => (
            <label key={category} className="checkbox-card">
              <input
                type="checkbox"
                checked={values.categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </FormField>
    </StepLayout>
  );
}

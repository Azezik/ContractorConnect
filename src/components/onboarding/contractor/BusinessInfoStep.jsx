import { StepLayout } from '../StepLayout';
import { Input } from '../../ui/Input';
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
    <StepLayout title="Business identity" description="Choose your core service categories and the business name customers should see.">
      <div className="form-grid">
        <Input
          label="Business name"
          value={values.businessName}
          error={errors.businessName}
          onChange={(e) => onChange('businessName', e.target.value)}
        />
        <Input label="Display name (optional)" value={values.displayName} onChange={(e) => onChange('displayName', e.target.value)} />
      </div>
      <FormField label="Categories" error={errors.categories}>
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

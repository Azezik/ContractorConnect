import { StepLayout } from '../StepLayout';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { CATEGORY_OPTIONS } from '../../../constants/categories';

export function JobBasicsStep({ values, errors, onChange }) {
  return (
    <StepLayout title="What do you need done?" description="Start with the basics so contractors can quickly understand the job.">
      <div className="form-grid">
        <Input label="Job title" value={values.title} error={errors.title} onChange={(e) => onChange('title', e.target.value)} />
        <Select
          label="Category"
          options={CATEGORY_OPTIONS}
          value={values.category}
          error={errors.category}
          onChange={(e) => onChange('category', e.target.value)}
        />
      </div>
    </StepLayout>
  );
}

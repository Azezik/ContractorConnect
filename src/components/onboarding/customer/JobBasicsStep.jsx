import { StepLayout } from '../StepLayout';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { CATEGORY_OPTIONS } from '../../../constants/categories';

export function JobBasicsStep({ values, errors, onChange }) {
  return (
    <StepLayout title="What do you need done?" description="Start with a clear title so contractors can understand the job at a glance.">
      <Input
        label="Job title"
        hint="Be specific, like ‘Replace two basement windows’ or ‘Repair leaking kitchen faucet.’"
        value={values.title}
        error={errors.title}
        placeholder="What should contractors help with?"
        onChange={(e) => onChange('title', e.target.value)}
      />
      <div className="form-grid">
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

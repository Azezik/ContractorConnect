import { StepLayout } from '../StepLayout';

export function ContractorIntroStep() {
  return (
    <StepLayout
      title="Build the profile customers will judge you by"
      description="Set up the profile that represents your business in search, outreach, and future job matching."
    >
      <div className="info-callout">
        <p>
          Think of this as your storefront. First impressions matter. This is the profile customers will see when you reach out,
          and it helps us match you with better, more relevant jobs.
        </p>
        <p>A more complete profile leads to higher-quality opportunities.</p>
      </div>
    </StepLayout>
  );
}

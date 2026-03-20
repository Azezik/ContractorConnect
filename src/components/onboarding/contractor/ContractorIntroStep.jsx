import { StepLayout } from '../StepLayout';

export function ContractorIntroStep() {
  return (
    <StepLayout
      title="Create a business profile customers can trust"
      description="This flow creates your contractor profile, service tags, and availability status for the live beta."
    >
      <div className="info-callout">
        <p>
          Customers should be able to see who you are, what you do, where you work, and how to message you through the platform.
        </p>
      </div>
    </StepLayout>
  );
}

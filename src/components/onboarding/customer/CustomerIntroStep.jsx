import { StepLayout } from '../StepLayout';

export function CustomerIntroStep() {
  return (
    <StepLayout
      title="Let contractors come to you"
      description="You’ll post one real project with clear details so the right local contractors can reach out."
    >
      <div className="info-callout">
        <p>
          You’ll publish a real job post that contractors in your area can respond to.
        </p>
      </div>
    </StepLayout>
  );
}

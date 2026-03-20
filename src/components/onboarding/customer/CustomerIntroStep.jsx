import { StepLayout } from '../StepLayout';

export function CustomerIntroStep() {
  return (
    <StepLayout
      title="Let contractors come to you"
      description="You’ll post one real project with clear details so the right local contractors can reach out."
    >
      <div className="info-callout">
        <p>
          This setup ends with a real Firestore job post tied to your account. Images are optional, but the data model
          already supports them.
        </p>
      </div>
    </StepLayout>
  );
}

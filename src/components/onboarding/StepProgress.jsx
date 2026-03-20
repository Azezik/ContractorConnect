export function StepProgress({ steps, currentStep }) {
  return (
    <div className="step-progress" aria-label="Progress">
      {steps.map((step, index) => (
        <div key={step} className={`step-progress__item ${index + 1 <= currentStep ? 'is-active' : ''}`}>
          <span>{index + 1}</span>
          <small>{step}</small>
        </div>
      ))}
    </div>
  );
}

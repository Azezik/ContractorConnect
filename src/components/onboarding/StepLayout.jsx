export function StepLayout({ title, description, children }) {
  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

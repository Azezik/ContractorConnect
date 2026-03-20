import { Card } from './Card';

export function MultiStepShell({ eyebrow, title, description, children, footer, progress }) {
  return (
    <Card className="multi-step-shell">
      <div className="multi-step-shell__header">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {progress}
      </div>
      <div className="multi-step-shell__body">{children}</div>
      {footer ? <div className="multi-step-shell__footer">{footer}</div> : null}
    </Card>
  );
}

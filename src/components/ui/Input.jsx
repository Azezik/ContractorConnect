import { useId } from 'react';

export function Input({
  label,
  error,
  hint,
  id,
  name,
  describedBy,
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? name ?? `input-${generatedId.replace(/:/g, '')}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const ariaDescribedBy = [describedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <label className="field" htmlFor={inputId}>
      {label ? <span className="field__label">{label}</span> : null}
      <input
        id={inputId}
        name={name}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        className={`input ${error ? 'input--error' : ''}`.trim()}
        {...props}
      />
      {hint ? <span className="field__hint" id={hintId}>{hint}</span> : null}
      {error ? <span className="field__error" id={errorId}>{error}</span> : null}
    </label>
  );
}

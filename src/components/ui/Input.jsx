export function Input({ label, error, hint, ...props }) {
  return (
    <label className="field">
      {label ? <span className="field__label">{label}</span> : null}
      <input className={`input ${error ? 'input--error' : ''}`.trim()} {...props} />
      {hint ? <span className="field__hint">{hint}</span> : null}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

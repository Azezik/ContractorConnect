export function Textarea({ label, error, hint, ...props }) {
  return (
    <label className="field">
      {label ? <span className="field__label">{label}</span> : null}
      <textarea className={`textarea ${error ? 'input--error' : ''}`.trim()} {...props} />
      {hint ? <span className="field__hint">{hint}</span> : null}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

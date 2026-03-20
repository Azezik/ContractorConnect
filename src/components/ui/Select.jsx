export function Select({ label, error, hint, options = [], placeholder = 'Select one', ...props }) {
  return (
    <label className="field">
      {label ? <span className="field__label">{label}</span> : null}
      <select className={`input ${error ? 'input--error' : ''}`.trim()} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => {
          if (typeof option === 'string') {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          }

          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      {hint ? <span className="field__hint">{hint}</span> : null}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

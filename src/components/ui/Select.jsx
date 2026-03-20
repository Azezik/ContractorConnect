export function Select({ label, error, options = [], placeholder = 'Select one', ...props }) {
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
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

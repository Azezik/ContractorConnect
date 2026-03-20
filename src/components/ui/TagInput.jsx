import { useState } from 'react';
import { Button } from './Button';
import { FormField } from './FormField';
import { slugifyTag } from '../../lib/formatters/text';

export function TagInput({ label, value = [], onChange, placeholder = 'Add a tag', error, hint }) {
  const [inputValue, setInputValue] = useState('');

  function addTag() {
    const normalized = slugifyTag(inputValue);
    if (!normalized || value.includes(normalized)) return;
    onChange([...value, normalized]);
    setInputValue('');
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag();
    }
  }

  function removeTag(tagToRemove) {
    onChange(value.filter((tag) => tag !== tagToRemove));
  }

  return (
    <FormField label={label} error={error} hint={hint}>
      <div className="tag-input">
        <input
          className={`input ${error ? 'input--error' : ''}`.trim()}
          value={inputValue}
          placeholder={placeholder}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" variant="secondary" onClick={addTag}>
          Add
        </Button>
      </div>
      <div className="tag-list">
        {value.map((tag) => (
          <button key={tag} type="button" className="tag-chip" onClick={() => removeTag(tag)}>
            #{tag} ×
          </button>
        ))}
      </div>
    </FormField>
  );
}

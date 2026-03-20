export function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

export function isRequired(value) {
  return String(value || '').trim().length > 0;
}

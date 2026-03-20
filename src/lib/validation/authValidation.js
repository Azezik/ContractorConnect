import { isEmail, isRequired } from './commonValidation';

export function validateSignup(values) {
  const errors = {};

  if (!isRequired(values.fullName)) errors.fullName = 'Full name is required.';
  if (!isRequired(values.username)) errors.username = 'Username is required.';
  if (!isEmail(values.email)) errors.email = 'Please enter a valid email.';
  if ((values.password || '').length < 6) errors.password = 'Password must be at least 6 characters.';
  if (!isRequired(values.city)) errors.city = 'City is required.';
  if (!isRequired(values.postalCode)) errors.postalCode = 'Postal code is required.';

  return errors;
}

export function validateLogin(values) {
  const errors = {};

  if (!isEmail(values.email)) errors.email = 'Please enter a valid email.';
  if (!isRequired(values.password)) errors.password = 'Password is required.';

  return errors;
}

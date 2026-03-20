import { isRequired } from './commonValidation';

export function validateCustomerOnboarding(values, step) {
  const errors = {};

  if (step >= 1) {
    if (!isRequired(values.title)) errors.title = 'Job title is required.';
    if (!isRequired(values.category)) errors.category = 'Select a category.';
  }

  if (step >= 2) {
    if (!isRequired(values.description)) errors.description = 'Description is required.';
    if (!isRequired(values.city)) errors.city = 'City is required.';
    if (!isRequired(values.postalCode)) errors.postalCode = 'Postal code is required.';
  }

  if (step >= 3 && !values.tags?.length) {
    errors.tags = 'Add at least one tag so contractors can find your post.';
  }

  return errors;
}

export function validateContractorOnboarding(values, step) {
  const errors = {};

  if (step >= 1) {
    if (!isRequired(values.businessName)) errors.businessName = 'Business name is required.';
    if (!values.categories?.length) errors.categories = 'Choose at least one category.';
  }

  if (step >= 2) {
    if (!isRequired(values.serviceArea)) errors.serviceArea = 'Service area is required.';
    if (!isRequired(values.bio)) errors.bio = 'Business bio is required.';
  }

  if (step >= 3) {
    if (!values.servicesOffered?.length) errors.servicesOffered = 'Add at least one service.';
    if (!values.tags?.length) errors.tags = 'Add at least one tag.';
  }

  return errors;
}

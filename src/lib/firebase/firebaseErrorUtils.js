export const FIRESTORE_PROFILE_PERMISSION_MESSAGE = 'Contractor Connect could not access your account profile in Firestore. Update your Firebase rules so signed-in users can read and write users/{uid}, then try again.';

const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'That email is already in use. Try logging in instead.',
  'auth/invalid-credential': 'That email or password did not match our records.',
  'auth/invalid-login-credentials': 'That email or password did not match our records.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/missing-password': 'Enter your password to continue.',
  'auth/network-request-failed': 'We could not reach Firebase. Check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts were made. Please wait a moment and try again.',
  'auth/user-disabled': 'This account has been disabled. Contact support if you think this is a mistake.',
  'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
};

export function isFirestorePermissionError(error) {
  return error?.code === 'permission-denied' || error?.code === 'firestore/permission-denied';
}

export function toUserFacingErrorMessage(error, fallbackMessage) {
  if (isFirestorePermissionError(error)) {
    return FIRESTORE_PROFILE_PERMISSION_MESSAGE;
  }

  if (error?.code && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code];
  }

  return fallbackMessage;
}

import { ACCOUNT_ROLES, ROLES } from '../../constants/roles';

const VALID_ACCOUNT_ROLES = new Set(Object.values(ACCOUNT_ROLES));

export function getAccountRole(userDoc) {
  const role = userDoc?.accountRole ?? userDoc?.primaryRole ?? null;
  return VALID_ACCOUNT_ROLES.has(role) ? role : null;
}

export function getUserRoles(userDoc) {
  const roles = new Set((userDoc?.roles || []).filter(Boolean));
  const accountRole = getAccountRole(userDoc);

  if (accountRole) {
    roles.add(accountRole);
  }

  if (userDoc?.primaryRole && VALID_ACCOUNT_ROLES.has(userDoc.primaryRole)) {
    roles.add(userDoc.primaryRole);
  }

  return Array.from(roles);
}

export function isAccountRole(userDoc, role) {
  return getAccountRole(userDoc) === role;
}

export function isClientAccount(userDoc) {
  return isAccountRole(userDoc, ROLES.CLIENT);
}

export function isContractorAccount(userDoc) {
  return isAccountRole(userDoc, ROLES.CONTRACTOR);
}

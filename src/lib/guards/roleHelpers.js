import { ROLES } from '../../constants/roles';

export function hasRole(userDoc, allowedRoles = []) {
  if (!userDoc) return false;
  const userRoles = userDoc.roles || [userDoc.primaryRole].filter(Boolean);
  return allowedRoles.some((role) => userRoles.includes(role));
}

export function isStaff(userDoc) {
  return hasRole(userDoc, [ROLES.MODERATOR, ROLES.ADMIN]);
}

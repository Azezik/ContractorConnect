import { ROLES } from '../../constants/roles';
import { getUserRoles } from '../auth/accountRole';

export function hasRole(userDoc, allowedRoles = []) {
  if (!userDoc) return false;
  const userRoles = getUserRoles(userDoc);
  return allowedRoles.some((role) => userRoles.includes(role));
}

export function isStaff(userDoc) {
  return hasRole(userDoc, [ROLES.MODERATOR, ROLES.ADMIN]);
}

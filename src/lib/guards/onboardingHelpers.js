import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export function getDefaultAuthedRoute(userDoc) {
  if (!userDoc?.primaryRole) return ROUTES.ROLE_SELECT;

  if (userDoc.primaryRole === ROLES.CUSTOMER) {
    return userDoc?.onboardingState?.customerComplete ? ROUTES.CUSTOMER_HOME : ROUTES.CUSTOMER_ONBOARDING;
  }

  if (userDoc.primaryRole === ROLES.CONTRACTOR) {
    return userDoc?.onboardingState?.contractorComplete ? ROUTES.FEED : ROUTES.CONTRACTOR_ONBOARDING;
  }

  return ROUTES.DASHBOARD;
}

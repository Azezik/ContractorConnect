import {
  ROUTES,
  buildClientConversationRoute,
  buildClientJobDetailsRoute,
  buildContractorConversationRoute,
  buildContractorJobDetailsRoute,
} from '../../constants/routes';
import { ACCOUNT_ROLES } from '../../constants/roles';
import { getAccountRole } from '../auth/accountRole';

export function isOnboardingCompleteForRole(userDoc, accountRole = getAccountRole(userDoc)) {
  if (!accountRole) return false;

  if (accountRole === ACCOUNT_ROLES.CLIENT) {
    return Boolean(userDoc?.onboardingState?.clientComplete ?? userDoc?.onboardingState?.customerComplete);
  }

  if (accountRole === ACCOUNT_ROLES.CONTRACTOR) {
    return Boolean(userDoc?.onboardingState?.contractorComplete);
  }

  return false;
}

export function getOnboardingRouteForRole(accountRole) {
  if (accountRole === ACCOUNT_ROLES.CLIENT) return ROUTES.CLIENT_ONBOARDING;
  if (accountRole === ACCOUNT_ROLES.CONTRACTOR) return ROUTES.CONTRACTOR_ONBOARDING;
  return ROUTES.ROLE_SELECT;
}

export function getHomeRouteForRole(accountRole) {
  if (accountRole === ACCOUNT_ROLES.CLIENT) return ROUTES.CLIENT_HOME;
  if (accountRole === ACCOUNT_ROLES.CONTRACTOR) return ROUTES.CONTRACTOR_FEED;
  return ROUTES.ROLE_SELECT;
}

export function getDefaultAuthedRoute(userDoc) {
  const accountRole = getAccountRole(userDoc);

  if (!accountRole) {
    return ROUTES.ROLE_SELECT;
  }

  return isOnboardingCompleteForRole(userDoc, accountRole)
    ? getHomeRouteForRole(accountRole)
    : getOnboardingRouteForRole(accountRole);
}

export function getInboxRouteForRole(accountRole) {
  if (accountRole === ACCOUNT_ROLES.CLIENT) return ROUTES.CLIENT_INBOX;
  if (accountRole === ACCOUNT_ROLES.CONTRACTOR) return ROUTES.CONTRACTOR_INBOX;
  return ROUTES.APP_HOME;
}

export function getSettingsRouteForRole(accountRole) {
  if (accountRole === ACCOUNT_ROLES.CLIENT) return ROUTES.CLIENT_SETTINGS;
  if (accountRole === ACCOUNT_ROLES.CONTRACTOR) return ROUTES.CONTRACTOR_SETTINGS;
  return ROUTES.APP_HOME;
}

export function getJobDetailsRouteForRole(accountRole, jobId) {
  if (accountRole === ACCOUNT_ROLES.CLIENT) return buildClientJobDetailsRoute(jobId);
  if (accountRole === ACCOUNT_ROLES.CONTRACTOR) return buildContractorJobDetailsRoute(jobId);
  return ROUTES.APP_HOME;
}

export function getConversationRouteForRole(accountRole, conversationId) {
  if (accountRole === ACCOUNT_ROLES.CLIENT) return buildClientConversationRoute(conversationId);
  if (accountRole === ACCOUNT_ROLES.CONTRACTOR) return buildContractorConversationRoute(conversationId);
  return ROUTES.APP_HOME;
}

export function getNavigationItems(accountRole) {
  if (accountRole === ACCOUNT_ROLES.CLIENT) {
    return [
      { to: ROUTES.CLIENT_HOME, label: 'Home' },
      { to: ROUTES.CLIENT_JOBS_NEW, label: 'Post Job' },
      { to: ROUTES.CLIENT_JOBS, label: 'My Jobs' },
      { to: ROUTES.CLIENT_INBOX, label: 'Inbox' },
      { to: ROUTES.CLIENT_SETTINGS, label: 'Settings' },
    ];
  }

  if (accountRole === ACCOUNT_ROLES.CONTRACTOR) {
    return [
      { to: ROUTES.CONTRACTOR_HOME, label: 'Home' },
      { to: ROUTES.CONTRACTOR_FEED, label: 'Job Feed' },
      { to: ROUTES.CONTRACTOR_PROFILE, label: 'Profile' },
      { to: ROUTES.CONTRACTOR_INBOX, label: 'Inbox' },
      { to: ROUTES.CONTRACTOR_SETTINGS, label: 'Settings' },
    ];
  }

  return [{ to: ROUTES.APP_HOME, label: 'Dashboard' }];
}

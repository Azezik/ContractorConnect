export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  APP_HOME: '/app',
  DASHBOARD: '/app',
  ROLE_SELECT: '/role-select',

  CLIENT_ROOT: '/client',
  CLIENT_ONBOARDING: '/client/onboarding',
  CLIENT_HOME: '/client/home',
  CLIENT_JOBS_NEW: '/client/jobs/new',
  CLIENT_JOBS: '/client/jobs',
  CLIENT_INBOX: '/client/inbox',
  CLIENT_SETTINGS: '/client/settings',

  CONTRACTOR_ROOT: '/contractor',
  CONTRACTOR_ONBOARDING: '/contractor/onboarding',
  CONTRACTOR_HOME: '/contractor/home',
  CONTRACTOR_FEED: '/contractor/jobs/feed',
  CONTRACTOR_PROFILE: '/contractor/profile',
  CONTRACTOR_INBOX: '/contractor/inbox',
  CONTRACTOR_SETTINGS: '/contractor/settings',

  MODERATION_QUEUE: '/moderation/queue',

  CUSTOMER_ONBOARDING: '/client/onboarding',
  CUSTOMER_HOME: '/client/home',
  JOBS_NEW: '/client/jobs/new',
  JOBS_MINE: '/client/jobs',
  FEED: '/contractor/jobs/feed',
};

export function buildClientJobDetailsRoute(jobId) {
  return `/client/jobs/${jobId}`;
}

export function buildContractorJobDetailsRoute(jobId) {
  return `/contractor/jobs/${jobId}`;
}

export function buildClientConversationRoute(conversationId) {
  return `/client/inbox/${conversationId}`;
}

export function buildContractorConversationRoute(conversationId) {
  return `/contractor/inbox/${conversationId}`;
}

import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { ROUTES } from '../../constants/routes';
import { ACCOUNT_ROLES, ROLES } from '../../constants/roles';
import { LandingPage } from '../../pages/LandingPage';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { RoleSelectionPage } from '../../pages/RoleSelectionPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CustomerOnboardingPage } from '../../pages/customer/CustomerOnboardingPage';
import { ContractorOnboardingPage } from '../../pages/contractor/ContractorOnboardingPage';
import { CustomerHomePage } from '../../pages/customer/CustomerHomePage';
import { ContractorHomePage } from '../../pages/contractor/ContractorHomePage';
import { CreateJobPage } from '../../pages/customer/CreateJobPage';
import { JobFeedPage } from '../../pages/contractor/JobFeedPage';
import { ContractorProfilePage } from '../../pages/contractor/ContractorProfilePage';
import { ContractorProfileEditPage } from '../../pages/contractor/ContractorProfileEditPage';
import { ClientJobDetailsPage } from '../../pages/jobs/ClientJobDetailsPage';
import { ContractorJobDetailsPage } from '../../pages/jobs/ContractorJobDetailsPage';
import { MyJobPostsPage } from '../../pages/jobs/MyJobPostsPage';
import { InboxPage } from '../../pages/inbox/InboxPage';
import { ConversationPage } from '../../pages/inbox/ConversationPage';
import { SettingsPage } from '../../pages/settings/SettingsPage';
import { ModerationQueuePage } from '../../pages/moderation/ModerationQueuePage';
import { NotFoundPage } from '../../pages/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGate } from './RoleGate';

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.APP_HOME} element={<DashboardPage />} />
          <Route path={ROUTES.ROLE_SELECT} element={<RoleSelectionPage />} />

          <Route element={<RoleGate allowedRoles={[ACCOUNT_ROLES.CLIENT]} redirectIfOnboardingComplete />}>
            <Route path={ROUTES.CLIENT_ONBOARDING} element={<CustomerOnboardingPage />} />
          </Route>
          <Route element={<RoleGate allowedRoles={[ACCOUNT_ROLES.CLIENT]} requireOnboarding />}>
            <Route path={ROUTES.CLIENT_ROOT} element={<Navigate to={ROUTES.CLIENT_HOME} replace />} />
            <Route path={ROUTES.CLIENT_HOME} element={<CustomerHomePage />} />
            <Route path={ROUTES.CLIENT_JOBS_NEW} element={<CreateJobPage />} />
            <Route path={ROUTES.CLIENT_JOBS} element={<MyJobPostsPage />} />
            <Route path="/client/jobs/:jobId" element={<ClientJobDetailsPage />} />
            <Route path={ROUTES.CLIENT_INBOX} element={<InboxPage />} />
            <Route path="/client/inbox/:conversationId" element={<ConversationPage />} />
            <Route path={ROUTES.CLIENT_SETTINGS} element={<SettingsPage />} />
          </Route>

          <Route element={<RoleGate allowedRoles={[ACCOUNT_ROLES.CONTRACTOR]} redirectIfOnboardingComplete />}>
            <Route path={ROUTES.CONTRACTOR_ONBOARDING} element={<ContractorOnboardingPage />} />
          </Route>
          <Route element={<RoleGate allowedRoles={[ACCOUNT_ROLES.CONTRACTOR]} requireOnboarding />}>
            <Route path={ROUTES.CONTRACTOR_ROOT} element={<Navigate to={ROUTES.CONTRACTOR_HOME} replace />} />
            <Route path={ROUTES.CONTRACTOR_HOME} element={<ContractorHomePage />} />
            <Route path={ROUTES.CONTRACTOR_FEED} element={<JobFeedPage />} />
            <Route path={ROUTES.CONTRACTOR_PROFILE} element={<ContractorProfilePage />} />
            <Route path={ROUTES.CONTRACTOR_PROFILE_EDIT} element={<ContractorProfileEditPage />} />
            <Route path="/contractor/jobs/:jobId" element={<ContractorJobDetailsPage />} />
            <Route path={ROUTES.CONTRACTOR_INBOX} element={<InboxPage />} />
            <Route path="/contractor/inbox/:conversationId" element={<ConversationPage />} />
            <Route path={ROUTES.CONTRACTOR_SETTINGS} element={<SettingsPage />} />
          </Route>

          <Route
            path={ROUTES.MODERATION_QUEUE}
            element={
              <RoleGate allowedRoles={[ROLES.MODERATOR, ROLES.ADMIN]}>
                <ModerationQueuePage />
              </RoleGate>
            }
          />

          <Route path="/dashboard" element={<Navigate to={ROUTES.APP_HOME} replace />} />
          <Route path="/onboarding/customer" element={<Navigate to={ROUTES.CLIENT_ONBOARDING} replace />} />
          <Route path="/customer/home" element={<Navigate to={ROUTES.CLIENT_HOME} replace />} />
          <Route path="/jobs/new" element={<Navigate to={ROUTES.CLIENT_JOBS_NEW} replace />} />
          <Route path="/jobs/mine" element={<Navigate to={ROUTES.CLIENT_JOBS} replace />} />
          <Route path="/feed" element={<Navigate to={ROUTES.CONTRACTOR_FEED} replace />} />
          <Route path="/jobs/:jobId" element={<DashboardPage />} />
          <Route path="/inbox" element={<DashboardPage />} />
          <Route path="/inbox/:conversationId" element={<DashboardPage />} />
          <Route path="/settings" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
}

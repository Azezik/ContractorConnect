import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGate } from './RoleGate';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
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
import { JobDetailsPage } from '../../pages/jobs/JobDetailsPage';
import { MyJobPostsPage } from '../../pages/jobs/MyJobPostsPage';
import { InboxPage } from '../../pages/inbox/InboxPage';
import { ConversationPage } from '../../pages/inbox/ConversationPage';
import { SettingsPage } from '../../pages/settings/SettingsPage';
import { ModerationQueuePage } from '../../pages/moderation/ModerationQueuePage';
import { NotFoundPage } from '../../pages/NotFoundPage';

export function AppRouter() {
  return (
    <AppShell>
      <Routes>
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ROLE_SELECT}
          element={
            <ProtectedRoute>
              <RoleSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CUSTOMER_ONBOARDING}
          element={
            <ProtectedRoute>
              <RoleGate allowedRoles={[ROLES.CUSTOMER]}>
                <CustomerOnboardingPage />
              </RoleGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CONTRACTOR_ONBOARDING}
          element={
            <ProtectedRoute>
              <RoleGate allowedRoles={[ROLES.CONTRACTOR]}>
                <ContractorOnboardingPage />
              </RoleGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CUSTOMER_HOME}
          element={
            <ProtectedRoute>
              <RoleGate allowedRoles={[ROLES.CUSTOMER]}>
                <CustomerHomePage />
              </RoleGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CONTRACTOR_HOME}
          element={
            <ProtectedRoute>
              <RoleGate allowedRoles={[ROLES.CONTRACTOR]}>
                <ContractorHomePage />
              </RoleGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.JOBS_NEW}
          element={
            <ProtectedRoute>
              <RoleGate allowedRoles={[ROLES.CUSTOMER]}>
                <CreateJobPage />
              </RoleGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.JOBS_MINE}
          element={
            <ProtectedRoute>
              <RoleGate allowedRoles={[ROLES.CUSTOMER]}>
                <MyJobPostsPage />
              </RoleGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.FEED}
          element={
            <ProtectedRoute>
              <RoleGate allowedRoles={[ROLES.CONTRACTOR]}>
                <JobFeedPage />
              </RoleGate>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CONTRACTOR_PROFILE}
          element={
            <ProtectedRoute>
              <RoleGate allowedRoles={[ROLES.CONTRACTOR]}>
                <ContractorProfilePage />
              </RoleGate>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:jobId"
          element={
            <ProtectedRoute>
              <JobDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.INBOX}
          element={
            <ProtectedRoute>
              <InboxPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox/:conversationId"
          element={
            <ProtectedRoute>
              <ConversationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MODERATION_QUEUE}
          element={
            <ProtectedRoute>
              <RoleGate allowedRoles={[ROLES.MODERATOR, ROLES.ADMIN]}>
                <ModerationQueuePage />
              </RoleGate>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="" element={<Navigate to={ROUTES.LANDING} replace />} />
      </Routes>
    </AppShell>
  );
}

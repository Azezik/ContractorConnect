import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updatePassword } from 'firebase/auth';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { updateUserProfile } from '../../services/userService';
import { logoutUser } from '../../services/authService';
import { getAccountRole } from '../../lib/auth/accountRole';
import { ACCOUNT_ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';

export function SettingsPage() {
  const navigate = useNavigate();
  const { authUser, userDoc, userId } = useCurrentUser();
  const accountRole = getAccountRole(userDoc);
  const [profile, setProfile] = useState({
    fullName: userDoc?.fullName || '',
    city: userDoc?.city || '',
    postalCode: userDoc?.postalCode || '',
  });
  const [password, setPassword] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  useEffect(() => {
    setProfile({
      fullName: userDoc?.fullName || '',
      city: userDoc?.city || '',
      postalCode: userDoc?.postalCode || '',
    });
  }, [userDoc]);

  async function handleProfileSave(event) {
    event.preventDefault();
    setProfileStatus('');
    try {
      await updateUserProfile(userId, profile);
      setProfileStatus('Profile saved successfully.');
    } catch {
      setProfileStatus('Failed to save profile. Please try again.');
    }
  }

  async function handlePasswordChange(event) {
    event.preventDefault();
    if (!password.trim()) return;
    setPasswordStatus('');
    try {
      await updatePassword(authUser, password);
      setPassword('');
      setPasswordStatus('Password updated successfully.');
    } catch (error) {
      setPasswordStatus(error?.message || 'Failed to update password.');
    }
  }

  async function handleLogout() {
    await logoutUser();
    navigate(ROUTES.LANDING);
  }

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Settings"
        title="Account settings"
        description="Manage your account details, security, and preferences."
      />

      {/* Account overview */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.25rem' }}>Account</h3>
            <p style={{ margin: 0, color: 'var(--color-text-muted, #666)', fontSize: '0.9rem' }}>
              {authUser?.email || 'No email'} · <Badge>{accountRole || 'No role'}</Badge>
            </p>
          </div>
          {accountRole === ACCOUNT_ROLES.CONTRACTOR && (
            <Link to={ROUTES.CONTRACTOR_PROFILE}>
              <Button variant="secondary">View public profile</Button>
            </Link>
          )}
        </div>
      </Card>

      <div className="two-column-layout">
        {/* Profile editing */}
        <div>
          <Card style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem' }}>Personal details</h3>
            <form className="form-stack" onSubmit={handleProfileSave}>
              <Input
                label="Full name"
                value={profile.fullName}
                onChange={(e) => setProfile((current) => ({ ...current, fullName: e.target.value }))}
              />
              <Input
                label="City"
                value={profile.city}
                onChange={(e) => setProfile((current) => ({ ...current, city: e.target.value }))}
              />
              <Input
                label="Postal code"
                value={profile.postalCode}
                onChange={(e) => setProfile((current) => ({ ...current, postalCode: e.target.value }))}
              />
              <Button type="submit">Save changes</Button>
              {profileStatus && <p className="inline-note">{profileStatus}</p>}
            </form>
          </Card>

          {/* Contractor profile link */}
          {accountRole === ACCOUNT_ROLES.CONTRACTOR && (
            <Card style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>Contractor profile</h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
                Your public contractor profile (business name, services, portfolio) is managed separately from your account settings.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link to={ROUTES.CONTRACTOR_PROFILE_EDIT}>
                  <Button variant="secondary">Edit contractor profile</Button>
                </Link>
                <Link to={ROUTES.CONTRACTOR_PROFILE}>
                  <Button variant="ghost">View public profile</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Security & actions */}
        <div>
          <Card style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem' }}>Security</h3>
            <form className="form-stack" onSubmit={handlePasswordChange}>
              <Input
                label="New password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" variant="secondary">Update password</Button>
              {passwordStatus && <p className="inline-note">{passwordStatus}</p>}
            </form>
          </Card>

          <Card style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Notifications</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
              Notification preferences will be available in a future update. All messaging notifications are currently delivered in-app.
            </p>
          </Card>

          <Card>
            <h3 style={{ margin: '0 0 0.5rem' }}>Session</h3>
            <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
              Sign out of your current session.
            </p>
            <Button variant="ghost" onClick={handleLogout}>Log out</Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

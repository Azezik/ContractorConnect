import { useEffect, useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { updateUserProfile } from '../../services/userService';

export function SettingsPage() {
  const { authUser, userDoc, userId } = useCurrentUser();
  const [profile, setProfile] = useState({
    fullName: userDoc?.fullName || '',
    city: userDoc?.city || '',
    postalCode: userDoc?.postalCode || '',
  });
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => {
    setProfile({
      fullName: userDoc?.fullName || '',
      city: userDoc?.city || '',
      postalCode: userDoc?.postalCode || '',
    });
  }, [userDoc]);

  async function handleProfileSave(event) {
    event.preventDefault();
    await updateUserProfile(userId, profile);
    setStatus('Profile updated.');
  }

  async function handlePasswordChange(event) {
    event.preventDefault();
    if (!password.trim()) return;
    await updatePassword(authUser, password);
    setPassword('');
    setStatus('Password updated.');
  }

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Settings"
        title="Account management"
        description="This is the foundation for Phase 6 profile editing, password updates, and role-specific maintenance flows."
      />
      <div className="two-column-layout">
        <Card>
          <h3>Edit profile</h3>
          <form className="form-stack" onSubmit={handleProfileSave}>
            <Input label="Full name" value={profile.fullName} onChange={(e) => setProfile((current) => ({ ...current, fullName: e.target.value }))} />
            <Input label="City" value={profile.city} onChange={(e) => setProfile((current) => ({ ...current, city: e.target.value }))} />
            <Input label="Postal code" value={profile.postalCode} onChange={(e) => setProfile((current) => ({ ...current, postalCode: e.target.value }))} />
            <Button type="submit">Save profile</Button>
          </form>
        </Card>
        <Card>
          <h3>Change password</h3>
          <form className="form-stack" onSubmit={handlePasswordChange}>
            <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" variant="secondary">Update password</Button>
          </form>
          {status ? <p className="inline-note">{status}</p> : null}
        </Card>
      </div>
    </PageContainer>
  );
}

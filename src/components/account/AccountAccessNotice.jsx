import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../layout/PageContainer';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { logoutUser } from '../../services/authService';
import { ROUTES } from '../../constants/routes';

export function AccountAccessNotice({ message }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logoutUser();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <PageContainer>
      <Card className="account-access-notice">
        <span className="eyebrow">Account setup issue</span>
        <h1>We couldn't finish loading your account</h1>
        <p>{message}</p>
        <p>
          The main app depends on your Firestore profile document. Once your Firebase rules allow signed-in users to access
          <code> users/{'{uid}'}</code>, signup and login should work normally again.
        </p>
        <div className="account-access-notice__actions">
          <Button onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? 'Logging out…' : 'Log out'}
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}

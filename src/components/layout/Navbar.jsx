import { Link, NavLink, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../constants/appConfig';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { logoutUser } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { hasRole } from '../../lib/guards/roleHelpers';
import { ROLES } from '../../constants/roles';

export function Navbar() {
  const navigate = useNavigate();
  const { authUser, userDoc } = useAuth();

  async function handleLogout() {
    await logoutUser();
    navigate(ROUTES.LANDING);
  }

  return (
    <header className="navbar">
      <div className="page-container navbar__inner">
        <Link to={authUser ? ROUTES.DASHBOARD : ROUTES.LANDING} className="navbar__brand">
          <span className="navbar__logo">CC</span>
          <div>
            <strong>{APP_NAME}</strong>
            <span>Local projects. Real contractors.</span>
          </div>
        </Link>

        <nav className="navbar__nav">
          {authUser ? (
            <>
              <NavLink to={ROUTES.DASHBOARD}>Dashboard</NavLink>
              {hasRole(userDoc, [ROLES.CONTRACTOR]) ? <NavLink to={ROUTES.FEED}>Job Feed</NavLink> : null}
              {hasRole(userDoc, [ROLES.CUSTOMER]) ? <NavLink to={ROUTES.JOBS_MINE}>My Jobs</NavLink> : null}
              {hasRole(userDoc, [ROLES.CONTRACTOR]) ? <NavLink to={ROUTES.CONTRACTOR_PROFILE}>Profile</NavLink> : null}
              <NavLink to={ROUTES.INBOX}>Inbox</NavLink>
              <NavLink to={ROUTES.SETTINGS}>Settings</NavLink>
              {hasRole(userDoc, [ROLES.MODERATOR, ROLES.ADMIN]) ? <NavLink to={ROUTES.MODERATION_QUEUE}>Moderation</NavLink> : null}
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <NavLink to={ROUTES.LOGIN}>Login</NavLink>
              <Link className="btn btn--primary" to={ROUTES.SIGNUP}>
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

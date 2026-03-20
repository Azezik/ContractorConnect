import { Link, NavLink, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../constants/appConfig';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { logoutUser } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { hasRole } from '../../lib/guards/roleHelpers';
import { getAccountRole } from '../../lib/auth/accountRole';
import { getNavigationItems } from '../../lib/guards/onboardingHelpers';
import { ROLES } from '../../constants/roles';

export function Navbar() {
  const navigate = useNavigate();
  const { authUser, userDoc } = useAuth();
  const accountRole = getAccountRole(userDoc);
  const navigationItems = getNavigationItems(accountRole);

  async function handleLogout() {
    await logoutUser();
    navigate(ROUTES.LANDING);
  }

  return (
    <header className="navbar">
      <div className="page-container navbar__inner">
        <Link to={authUser ? ROUTES.APP_HOME : ROUTES.LANDING} className="navbar__brand">
          <span className="navbar__logo">CC</span>
          <div>
            <strong>{APP_NAME}</strong>
            <span>Local projects. Real contractors.</span>
          </div>
        </Link>

        <nav className="navbar__nav">
          {authUser ? (
            <>
              {navigationItems.map((item) => (
                <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
              ))}
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

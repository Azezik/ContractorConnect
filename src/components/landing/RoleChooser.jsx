import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { ROUTES } from '../../constants/routes';

export function RoleChooser() {
  return (
    <section className="role-chooser">
      <Card className="role-card">
        <span className="eyebrow">Need help?</span>
        <h3>I need work done</h3>
        <p>Share a real job, add details, and let local contractors come to you.</p>
        <Link className="btn btn--primary" to={ROUTES.SIGNUP}>
          Start as customer
        </Link>
      </Card>
      <Card className="role-card">
        <span className="eyebrow">Looking for work?</span>
        <h3>I’m a contractor</h3>
        <p>Create a service profile, browse active jobs, and connect with customers nearby.</p>
        <Link className="btn btn--secondary" to={ROUTES.SIGNUP}>
          Start as contractor
        </Link>
      </Card>
    </section>
  );
}

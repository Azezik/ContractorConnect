import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ROUTES } from '../../constants/routes';

export function LandingCTA() {
  return (
    <section className="landing-cta card">
      <div>
        <span className="eyebrow">Ready to try the beta?</span>
        <h2>Build trust faster with real profiles, real jobs, and real account ownership.</h2>
        <p>
          Start with a customer job post or a contractor service profile now. Messaging, reviews, reporting,
          and moderation are already built into the platform foundation.
        </p>
      </div>
      <div className="landing-cta__actions">
        <Link to={ROUTES.SIGNUP}>
          <Button>Create your account</Button>
        </Link>
      </div>
    </section>
  );
}

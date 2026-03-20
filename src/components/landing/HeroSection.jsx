import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';

export function HeroSection() {
  return (
    <section className="hero">
      <div>
        <span className="eyebrow">Contractor marketplace</span>
        <h1>Contractor Connect</h1>
        <p className="hero__lead">A marketplace for connecting contractors with people who need work done.</p>
        <p className="hero__sublead">Post your project. Let the right contractors come to you.</p>
        <div className="hero__actions">
          <Link to={ROUTES.LOGIN}>
            <Button>Continue to login</Button>
          </Link>
          <Link to={ROUTES.SIGNUP}>
            <Button variant="secondary">Create an account</Button>
          </Link>
        </div>
      </div>
      <div className="hero__panel">
        <div className="hero-stat">
          <strong>Post once</strong>
          <span>Share your project details and let qualified contractors reach out.</span>
        </div>
        <div className="hero-stat">
          <strong>Browse local work</strong>
          <span>Contractors can find active jobs, filter by category, and message directly inside the app.</span>
        </div>
        <div className="hero-stat">
          <strong>Moderated trust layer</strong>
          <span>Profiles, reviews, reports, and platform moderation are built into the architecture from day one.</span>
        </div>
      </div>
    </section>
  );
}

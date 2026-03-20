import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { ROUTES } from '../constants/routes';

export function NotFoundPage() {
  return (
    <PageContainer>
      <Card>
        <h1>Page not found</h1>
        <p>The page you’re looking for doesn’t exist.</p>
        <Link to={ROUTES.LANDING}>Go home</Link>
      </Card>
    </PageContainer>
  );
}

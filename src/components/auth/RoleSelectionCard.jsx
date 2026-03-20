import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function RoleSelectionCard({ title, description, onSelect }) {
  return (
    <Card className="role-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <Button onClick={onSelect}>Choose this path</Button>
    </Card>
  );
}

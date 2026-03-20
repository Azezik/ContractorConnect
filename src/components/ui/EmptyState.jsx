import { Card } from './Card';

export function EmptyState({ title, description, action }) {
  return (
    <Card className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </Card>
  );
}

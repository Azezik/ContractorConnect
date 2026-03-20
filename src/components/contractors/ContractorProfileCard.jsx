import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function ContractorProfileCard({ profile }) {
  return (
    <Card className="contractor-profile-card">
      <div className="contractor-profile-card__header">
        <div>
          <span className="eyebrow">Contractor profile</span>
          <h1>{profile.businessName}</h1>
          <p>{profile.displayName || 'Professional contractor profile'}</p>
        </div>
        <Badge variant="success">{profile.availabilityStatus}</Badge>
      </div>
      <p>{profile.bio}</p>
      <div className="tag-list">
        {profile.tags?.map((tag) => (
          <span key={tag} className="tag-chip tag-chip--static">#{tag}</span>
        ))}
      </div>
    </Card>
  );
}

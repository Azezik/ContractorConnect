import { Card } from '../ui/Card';

function formatWorkRadius(workRadiusKm) {
  if (!workRadiusKm) return 'Not provided';
  return Number(workRadiusKm) === 500 ? '500+ km' : `${workRadiusKm} km`;
}

export function ContractorSummaryPanel({ profile }) {
  return (
    <Card>
      <h3>Business snapshot</h3>
      <dl>
        <div>
          <dt>Postal code</dt>
          <dd>{profile.postalCode || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Work radius</dt>
          <dd>{formatWorkRadius(profile.workRadiusKm)}</dd>
        </div>
        <div>
          <dt>Service area</dt>
          <dd>{profile.serviceAreaDescription || profile.serviceArea || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{profile.phone || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Website</dt>
          <dd>{profile.website || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Categories</dt>
          <dd>{profile.categories?.join(', ')}</dd>
        </div>
      </dl>
    </Card>
  );
}

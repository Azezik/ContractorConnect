import { Card } from '../ui/Card';

export function ContractorSummaryPanel({ profile }) {
  return (
    <Card>
      <h3>Business snapshot</h3>
      <dl>
        <div>
          <dt>Service area</dt>
          <dd>{profile.serviceArea}</dd>
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

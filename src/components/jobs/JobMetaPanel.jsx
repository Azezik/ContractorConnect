import { Card } from '../ui/Card';

export function JobMetaPanel({ job }) {
  return (
    <Card className="job-meta-panel">
      <h3>Project details</h3>
      <dl>
        <div>
          <dt>City</dt>
          <dd>{job.city}</dd>
        </div>
        <div>
          <dt>Postal code</dt>
          <dd>{job.postalCode}</dd>
        </div>
        <div>
          <dt>Budget</dt>
          <dd>{job.budget || 'Budget not specified'}</dd>
        </div>
        <div>
          <dt>Timeline</dt>
          <dd>{job.timeline || 'Timeline flexible'}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{job.status}</dd>
        </div>
      </dl>
    </Card>
  );
}

import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { truncateText } from '../../lib/formatters/text';
import { formatDate } from '../../lib/formatters/dates';
import { formatLocation } from '../../lib/formatters/location';

export function JobCard({ job }) {
  const sharedTerms = [
    ...(job.match?.highlights?.serviceOverlap || []),
    ...(job.match?.highlights?.tagOverlap || []),
  ].slice(0, 3);

  return (
    <Card className="job-card">
      <div className="job-card__top">
        <Badge>{job.category}</Badge>
        <span className="job-card__date">{formatDate(job.createdAt)}</span>
      </div>
      <h3>{job.title}</h3>
      <p>{truncateText(job.description, 150)}</p>
      {job.match ? (
        <p className="inline-note">
          {job.match.highlights.locationLabel}
          {sharedTerms.length ? ` · Shared terms: ${sharedTerms.join(', ')}` : ''}
        </p>
      ) : null}
      <div className="job-card__tags">
        {(job.tags || []).slice(0, 6).map((tag) => (
          <span key={tag} className="tag-chip tag-chip--static">#{tag}</span>
        ))}
      </div>
      <div className="job-card__footer">
        <span>{formatLocation(job.city, job.postalCode)}</span>
        <Link to={`/jobs/${job.id}`}>View details →</Link>
      </div>
    </Card>
  );
}

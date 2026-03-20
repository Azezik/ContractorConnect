import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/formatters/dates';

export function JobDetailsHero({ job }) {
  return (
    <section className="job-details-hero card">
      <div className="job-details-hero__header">
        <Badge>{job.category}</Badge>
        <span>{formatDate(job.createdAt)}</span>
      </div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
    </section>
  );
}

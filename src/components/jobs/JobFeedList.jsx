import { JobCard } from './JobCard';

export function JobFeedList({ jobs, viewerRole, onDismiss }) {
  return (
    <div className="job-grid">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} viewerRole={viewerRole} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

import { EmptyState } from '../ui/EmptyState';

export function EmptyJobState({ hasFilters = false, availableCount = 0, totalActiveJobs = 0 }) {
  if (hasFilters) {
    return (
      <EmptyState
        title="No jobs match these filters"
        description="Try widening your search or clearing a filter to see the opportunities already available to you."
        action={<p className="empty-state__meta">{availableCount} matched job{availableCount === 1 ? '' : 's'} available</p>}
      />
    );
  }

  return (
    <EmptyState
      title={totalActiveJobs ? 'No eligible jobs right now' : 'You’re all set'}
      description={totalActiveJobs
        ? 'Active jobs exist, but none currently meet your matching coverage and category requirements. Update your profile inputs if your service area or specialties have changed.'
        : 'Your contractor profile is live and working. Matched jobs will appear here as soon as new opportunities line up with your services and coverage area.'}
      action={<p className="empty-state__meta">{availableCount} eligible match{availableCount === 1 ? '' : 'es'} right now</p>}
    />
  );
}

import { EmptyState } from '../ui/EmptyState';

export function EmptyJobState() {
  return (
    <EmptyState
      title="No active jobs yet"
      description="Once customers publish jobs, they will appear here for contractors to browse."
    />
  );
}

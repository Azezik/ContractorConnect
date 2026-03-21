import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { getUserJobPosts } from '../../services/jobPostService';
import { JobFeedList } from '../../components/jobs/JobFeedList';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { ACCOUNT_ROLES } from '../../constants/roles';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Closed' },
];

export function MyJobPostsPage() {
  const { userId } = useCurrentUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserJobPosts(userId).then((result) => {
      setJobs(result);
      setLoading(false);
    });
  }, [userId]);

  const filteredJobs = statusFilter
    ? jobs.filter((job) => job.status === statusFilter)
    : jobs;

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="My jobs"
        title="Manage your job posts"
        description="View and manage the jobs you've posted. Track status and connect with interested contractors."
        action={<Link to={ROUTES.CLIENT_JOBS_NEW}><Button>Post a new job</Button></Link>}
      />
      {jobs.length > 0 && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Select
            label="Filter by status"
            options={STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
            <Badge>{jobs.length} total</Badge>
            <Badge variant="success">{jobs.filter((j) => j.status === 'active').length} active</Badge>
          </div>
        </div>
      )}
      {loading ? (
        <EmptyState
          title="Loading your jobs..."
          description="Fetching your posted jobs."
        />
      ) : filteredJobs.length ? (
        <JobFeedList jobs={filteredJobs} viewerRole={ACCOUNT_ROLES.CLIENT} />
      ) : jobs.length && statusFilter ? (
        <EmptyState
          title="No jobs match this filter"
          description={`You have ${jobs.length} job post${jobs.length === 1 ? '' : 's'}, but none with the "${statusFilter}" status.`}
          action={<Button variant="secondary" onClick={() => setStatusFilter('')}>Clear filter</Button>}
        />
      ) : (
        <EmptyState
          title="No job posts yet"
          description="You haven't posted any jobs yet. Create your first job post to start receiving interest from local contractors."
          action={<Link to={ROUTES.CLIENT_JOBS_NEW}><Button>Post your first job</Button></Link>}
        />
      )}
    </PageContainer>
  );
}

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ROUTES } from '../../constants/routes';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { getUserJobPosts } from '../../services/jobPostService';
import { JobFeedList } from '../../components/jobs/JobFeedList';
import { ACCOUNT_ROLES } from '../../constants/roles';

export function CustomerHomePage() {
  const { userId, userDoc } = useCurrentUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserJobPosts(userId).then((result) => {
      setJobs(result);
      setLoading(false);
    });
  }, [userId]);

  const activeJobs = jobs.filter((job) => job.status === 'active');
  const closedJobs = jobs.filter((job) => job.status === 'closed' || job.status === 'paused');

  return (
    <PageContainer>
      <SectionHeader
        eyebrow={<>Client dashboard <Badge>Client</Badge></>}
        title={`Welcome back, ${userDoc?.fullName?.split(' ')[0] || 'there'}`}
        description="Review your posted jobs, create new requests, and manage contractor conversations."
        action={
          <Link to={ROUTES.CLIENT_JOBS_NEW}>
            <Button>Post a new job</Button>
          </Link>
        }
      />
      <div className="stats-grid">
        <Card>
          <strong>{loading ? '—' : jobs.length}</strong>
          <span>Total job posts</span>
        </Card>
        <Card>
          <strong>{loading ? '—' : activeJobs.length}</strong>
          <span>Active jobs</span>
        </Card>
        <Card>
          <strong>{loading ? '—' : closedJobs.length}</strong>
          <span>Closed / paused</span>
        </Card>
      </div>
      {jobs.length > 0 && (
        <>
          <h2 style={{ margin: '2rem 0 1rem' }}>Recent job posts</h2>
          <JobFeedList jobs={jobs} viewerRole={ACCOUNT_ROLES.CLIENT} />
        </>
      )}
      {!loading && jobs.length === 0 && (
        <Card style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem' }}>
          <h3>No job posts yet</h3>
          <p>Create your first job post to start connecting with local contractors.</p>
          <Link to={ROUTES.CLIENT_JOBS_NEW}>
            <Button>Post a job</Button>
          </Link>
        </Card>
      )}
    </PageContainer>
  );
}

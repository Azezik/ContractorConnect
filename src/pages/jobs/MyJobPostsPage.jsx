import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { getUserJobPosts } from '../../services/jobPostService';
import { JobFeedList } from '../../components/jobs/JobFeedList';
import { EmptyJobState } from '../../components/jobs/EmptyJobState';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { ACCOUNT_ROLES } from '../../constants/roles';

export function MyJobPostsPage() {
  const { userId } = useCurrentUser();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!userId) return;
    getUserJobPosts(userId).then(setJobs);
  }, [userId]);

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Client jobs"
        title="Manage your job posts"
        description="This client-only area is for reviewing, reopening, and extending the projects your account has posted."
        action={<Link to={ROUTES.CLIENT_JOBS_NEW}><Button>Create another job</Button></Link>}
      />
      {jobs.length ? <JobFeedList jobs={jobs} viewerRole={ACCOUNT_ROLES.CLIENT} /> : <EmptyJobState />}
    </PageContainer>
  );
}

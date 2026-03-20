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
        eyebrow="Your jobs"
        title="Manage your job posts"
        description="This is the foundation for later Phase 6 tools like editing, closing, archiving, and reopening posts."
        action={<Link to={ROUTES.JOBS_NEW}><Button>Create another job</Button></Link>}
      />
      {jobs.length ? <JobFeedList jobs={jobs} /> : <EmptyJobState />}
    </PageContainer>
  );
}

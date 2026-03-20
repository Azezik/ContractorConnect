import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ROUTES } from '../../constants/routes';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { getUserJobPosts } from '../../services/jobPostService';
import { JobFeedList } from '../../components/jobs/JobFeedList';
import { ACCOUNT_ROLES } from '../../constants/roles';

export function CustomerHomePage() {
  const { userId, userDoc } = useCurrentUser();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!userId) return;
    getUserJobPosts(userId).then(setJobs);
  }, [userId]);

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Client dashboard"
        title={`Welcome back, ${userDoc?.fullName?.split(' ')[0] || 'there'}`}
        description="Your client workspace keeps job posting and job management separate from contractor tools. Review your posts, create another request, and continue contractor conversations from here."
        action={
          <Link to={ROUTES.CLIENT_JOBS_NEW}>
            <Button>Post a new job</Button>
          </Link>
        }
      />
      <div className="stats-grid">
        <Card><strong>{jobs.length}</strong><span>Total job posts</span></Card>
        <Card><strong>{jobs.filter((job) => job.status === 'active').length}</strong><span>Active jobs</span></Card>
        <Card><strong>{ACCOUNT_ROLES.CLIENT}</strong><span>This account is locked to the client experience.</span></Card>
      </div>
      {jobs.length ? <JobFeedList jobs={jobs} viewerRole={ACCOUNT_ROLES.CLIENT} /> : null}
    </PageContainer>
  );
}

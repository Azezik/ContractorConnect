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
        eyebrow="Customer home"
        title={`Welcome back, ${userDoc?.fullName?.split(' ')[0] || 'there'}`}
        description="Your first job is live. You can continue creating posts, review replies in your inbox, and manage account details from settings."
        action={
          <Link to={ROUTES.JOBS_NEW}>
            <Button>Create another job</Button>
          </Link>
        }
      />
      <div className="stats-grid">
        <Card><strong>{jobs.length}</strong><span>Total job posts</span></Card>
        <Card><strong>{jobs.filter((job) => job.status === 'active').length}</strong><span>Active jobs</span></Card>
        <Card><strong>Messaging ready</strong><span>Contractors can reach out from job details.</span></Card>
      </div>
      {jobs.length ? <JobFeedList jobs={jobs} /> : null}
    </PageContainer>
  );
}

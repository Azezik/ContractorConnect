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
import { subscribeToUserConversations } from '../../services/conversationService';

export function CustomerHomePage() {
  const { userId, userDoc } = useCurrentUser();
  const [jobs, setJobs] = useState([]);
  const [conversationCount, setConversationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserJobPosts(userId).then((result) => {
      setJobs(result);
      setLoading(false);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) return undefined;
    return subscribeToUserConversations(
      userId,
      (conversations) => {
        const real = conversations.filter((c) => c.lastMessageAt != null);
        setConversationCount(real.length);
      },
    );
  }, [userId]);

  const activeJobs = jobs.filter((job) => job.status === 'active');
  const closedJobs = jobs.filter((job) => job.status === 'closed' || job.status === 'paused');

  return (
    <PageContainer>
      <SectionHeader
        eyebrow={<>Dashboard <Badge>Client</Badge></>}
        title={`Welcome back, ${userDoc?.fullName?.split(' ')[0] || 'there'}`}
        description="Your project overview and quick actions."
        action={
          <Link to={ROUTES.CLIENT_JOBS_NEW}>
            <Button>Post a new job</Button>
          </Link>
        }
      />
      <div className="stats-grid">
        <Card>
          <strong>{loading ? '...' : jobs.length}</strong>
          <span>Total job posts</span>
        </Card>
        <Card>
          <strong>{loading ? '...' : activeJobs.length}</strong>
          <span>Active jobs</span>
        </Card>
        <Card>
          <strong>{loading ? '...' : closedJobs.length}</strong>
          <span>Closed / paused</span>
        </Card>
        <Card>
          <strong>{conversationCount}</strong>
          <span>Active conversations</span>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginTop: '2rem' }}>
        <Link to={ROUTES.CLIENT_JOBS} style={{ textDecoration: 'none' }}>
          <Card style={{ height: '100%' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Manage jobs</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
              View, edit, and manage your posted jobs. Track status and delete posts you no longer need.
            </p>
          </Card>
        </Link>
        <Link to={ROUTES.CLIENT_INBOX} style={{ textDecoration: 'none' }}>
          <Card style={{ height: '100%' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Inbox</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
              View and respond to messages from contractors interested in your projects.
            </p>
          </Card>
        </Link>
        <Link to={ROUTES.CLIENT_JOBS_NEW} style={{ textDecoration: 'none' }}>
          <Card style={{ height: '100%' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Post a new job</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted, #666)' }}>
              Create a new job listing to connect with local contractors for your project.
            </p>
          </Card>
        </Link>
      </div>
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

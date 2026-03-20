import { Navigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { JobDetailsHero } from '../../components/jobs/JobDetailsHero';
import { JobMetaPanel } from '../../components/jobs/JobMetaPanel';
import { JobTagList } from '../../components/jobs/JobTagList';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { useJobDetails } from '../../hooks/useJobDetails';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { createReport } from '../../services/reportService';
import { ROUTES } from '../../constants/routes';
import { useState } from 'react';

export function ClientJobDetailsPage() {
  const { jobId } = useParams();
  const { job, loading } = useJobDetails(jobId);
  const { userId } = useCurrentUser();
  const [status, setStatus] = useState('');

  if (loading) {
    return <Spinner label="Loading your job post…" />;
  }

  if (!job) {
    return (
      <PageContainer>
        <Card>
          <h1>Job not found</h1>
          <p>This job may have been removed or is no longer visible.</p>
        </Card>
      </PageContainer>
    );
  }

  if (job.ownerId !== userId) {
    return <Navigate to={ROUTES.CLIENT_JOBS} replace />;
  }

  async function handleReport() {
    await createReport({
      reporterId: userId,
      targetType: 'jobPost',
      targetId: job.id,
      reason: 'Needs moderator review',
      details: `Job ${job.title} was reported from the client job details page.`,
    });
    setStatus('Report submitted to the moderation queue.');
  }

  return (
    <PageContainer>
      <div className="two-column-layout two-column-layout--job">
        <div>
          <JobDetailsHero job={job} />
          <Card>
            <h3>Tags</h3>
            <JobTagList tags={job.tags || []} />
          </Card>
          <Card>
            <h3>Photos</h3>
            {job.imageUrls?.length ? (
              <div className="image-grid">
                {job.imageUrls.map((url) => <img key={url} src={url} alt={job.title} />)}
              </div>
            ) : (
              <p>This post does not include photos yet.</p>
            )}
          </Card>
        </div>
        <div>
          <JobMetaPanel job={job} />
          <Card>
            <h3>Client ownership</h3>
            <p>This page is available only inside the client workspace because your account owns this job post.</p>
          </Card>
          <Card>
            <h3>Moderation and trust</h3>
            <p>See something suspicious around this posting? Submit a report so it enters the moderation queue.</p>
            <Button variant="secondary" onClick={handleReport}>Report this post</Button>
            {status ? <p className="inline-note">{status}</p> : null}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

import { Navigate, useNavigate, useParams } from 'react-router-dom';
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
import { deleteJobPost } from '../../services/jobPostService';
import { ROUTES } from '../../constants/routes';
import { useState } from 'react';

export function ClientJobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { job, loading } = useJobDetails(jobId);
  const { userId } = useCurrentUser();
  const [status, setStatus] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return <Spinner label="Loading your job post..." />;
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

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteJobPost(job.id, userId);
      navigate(ROUTES.CLIENT_JOBS, { replace: true });
    } catch (error) {
      setStatus(error?.message || 'Failed to delete this job. Please try again.');
      setDeleting(false);
      setConfirmingDelete(false);
    }
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
            <h3>Moderation and trust</h3>
            <p>See something suspicious around this posting? Submit a report so it enters the moderation queue.</p>
            <Button variant="secondary" onClick={handleReport}>Report this post</Button>
            {status ? <p className="inline-note">{status}</p> : null}
          </Card>
          <Card>
            <h3>Delete this job</h3>
            <p style={{ color: 'var(--color-text-muted, #666)', fontSize: '0.9rem' }}>
              Permanently remove this job post from the platform. Existing conversations will be preserved.
            </p>
            {confirmingDelete ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{ color: '#a32222', borderColor: '#f5c5c5' }}
                >
                  {deleting ? 'Deleting...' : 'Yes, delete this job'}
                </Button>
                <Button variant="secondary" onClick={() => setConfirmingDelete(false)} disabled={deleting}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setConfirmingDelete(true)}
                style={{ color: '#a32222', borderColor: '#f5c5c5' }}
              >
                Delete job post
              </Button>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

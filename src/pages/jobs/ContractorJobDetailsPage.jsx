import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { JobDetailsHero } from '../../components/jobs/JobDetailsHero';
import { JobMetaPanel } from '../../components/jobs/JobMetaPanel';
import { JobTagList } from '../../components/jobs/JobTagList';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Textarea } from '../../components/ui/Textarea';
import { useJobDetails } from '../../hooks/useJobDetails';
import { useContractorProfile } from '../../hooks/useContractorProfile';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { createConversation } from '../../services/conversationService';
import { sendMessage } from '../../services/messageService';
import { createReport } from '../../services/reportService';
import { buildContractorConversationRoute, ROUTES } from '../../constants/routes';
import { ACCOUNT_ROLES } from '../../constants/roles';

export function ContractorJobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { job, loading } = useJobDetails(jobId);
  const { userId, userDoc } = useCurrentUser();
  const { profile: contractorProfile } = useContractorProfile(userId);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const canMessage = useMemo(
    () => job?.ownerId && job.ownerId !== userId,
    [job, userId],
  );

  if (loading) {
    return <Spinner label="Loading job details…" />;
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

  async function handleStartConversation() {
    if (!canMessage || !message.trim()) return;

    const conversationId = await createConversation({
      participants: [userId, job.ownerId],
      participantRoles: {
        [userId]: ACCOUNT_ROLES.CONTRACTOR,
        [job.ownerId]: ACCOUNT_ROLES.CLIENT,
      },
      relatedJobPostId: job.id,
      relatedContractorProfileId: userId,
      contextSnapshot: {
        jobTitle: job.title,
        contractorBusinessName:
          contractorProfile?.businessName || contractorProfile?.displayName || userDoc?.fullName || 'Contractor',
        contractorCategories: contractorProfile?.categories || [],
        serviceArea:
          contractorProfile?.serviceArea || contractorProfile?.serviceAreaDescription || userDoc?.city || job.city || null,
      },
    });

    await sendMessage({ conversationId, senderId: userId, content: message.trim() });
    navigate(buildContractorConversationRoute(conversationId));
  }

  async function handleReport() {
    await createReport({
      reporterId: userId,
      targetType: 'jobPost',
      targetId: job.id,
      reason: 'Needs moderator review',
      details: `Job ${job.title} was reported from the contractor details page.`,
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
              <p>Image support is architected now. This post does not include photos yet.</p>
            )}
          </Card>
        </div>
        <div>
          <JobMetaPanel job={job} />
          {canMessage ? (
            <Card>
              <h3>Message this client</h3>
              <p>
                Messaging is account-based and stays inside the contractor workspace. Client email addresses are never exposed publicly.
              </p>
              <Textarea label="Opening message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button onClick={handleStartConversation}>Start conversation</Button>
            </Card>
          ) : null}
          <Card>
            <h3>Moderation and trust</h3>
            <p>See something suspicious? Submit a report so it enters the moderation queue.</p>
            <Button variant="secondary" onClick={handleReport}>Report this post</Button>
            {status ? <p className="inline-note">{status}</p> : null}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { subscribeToMessages, sendMessage } from '../../services/messageService';
import { formatDate } from '../../lib/formatters/dates';
import { createReport } from '../../services/reportService';
import { getConversation } from '../../services/conversationService';
import { getAccountRole } from '../../lib/auth/accountRole';
import { getHomeRouteForRole } from '../../lib/guards/onboardingHelpers';

export function ConversationPage() {
  const { conversationId } = useParams();
  const { userId, userDoc } = useCurrentUser();
  const [conversation, setConversation] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [reportStatus, setReportStatus] = useState('');
  const accountRole = getAccountRole(userDoc);

  useEffect(() => {
    let active = true;

    async function loadConversation() {
      const nextConversation = await getConversation(conversationId);
      if (active) {
        setConversation(nextConversation);
      }
    }

    if (conversationId) {
      loadConversation();
    }

    return () => {
      active = false;
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return undefined;
    return subscribeToMessages(conversationId, setMessages);
  }, [conversationId]);

  if (conversation === undefined) {
    return (
      <PageContainer>
        <Card>
          <h1>Loading conversation…</h1>
        </Card>
      </PageContainer>
    );
  }

  const isParticipant = Boolean(conversation?.participants?.includes(userId));

  if (!conversation || !isParticipant) {
    return <Navigate to={getHomeRouteForRole(accountRole)} replace />;
  }

  async function handleSend(event) {
    event.preventDefault();
    if (!content.trim()) return;
    await sendMessage({ conversationId, senderId: userId, content: content.trim() });
    setContent('');
  }

  async function handleReportConversation() {
    await createReport({
      reporterId: userId,
      targetType: 'conversation',
      targetId: conversationId,
      reason: 'Conversation review requested',
      details: 'Conversation was reported from the thread view.',
      relatedConversationId: conversationId,
    });
    setReportStatus('Conversation reported. Moderation queue item created.');
  }

  return (
    <PageContainer>
      <div className="conversation-thread-layout">
        <Card>
          <h1>{conversation?.contextSnapshot?.jobTitle || 'Conversation'}</h1>
          <p>{conversation?.contextSnapshot?.contractorBusinessName || 'Messaging context'}</p>
          <Button variant="secondary" onClick={handleReportConversation}>Report conversation</Button>
          {reportStatus ? <p className="inline-note">{reportStatus}</p> : null}
        </Card>
        <Card className="message-thread">
          {messages.length ? (
            messages.map((message) => (
              <div key={message.id} className={`message-bubble ${message.senderId === userId ? 'is-own' : ''}`}>
                <p>{message.content}</p>
                <small>{formatDate(message.createdAt)}</small>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </Card>
        <Card>
          <form className="form-stack" onSubmit={handleSend}>
            <Textarea label="Reply" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
            <Button type="submit">Send message</Button>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}

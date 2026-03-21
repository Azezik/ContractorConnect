import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { markConversationAsRead, subscribeToMessages, sendMessage } from '../../services/messageService';
import { formatDate } from '../../lib/formatters/dates';
import { createReport } from '../../services/reportService';
import { getConversation } from '../../services/conversationService';
import { getAccountRole } from '../../lib/auth/accountRole';
import { getInboxRouteForRole } from '../../lib/guards/onboardingHelpers';

export function ConversationPage() {
  const { conversationId } = useParams();
  const { userId, userDoc } = useCurrentUser();
  const [conversation, setConversation] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [reportStatus, setReportStatus] = useState('');
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [conversationError, setConversationError] = useState('');
  const [messageError, setMessageError] = useState('');
  const accountRole = getAccountRole(userDoc);
  const inboxRoute = getInboxRouteForRole(accountRole);
  const isParticipant = useMemo(
    () => Boolean(conversation?.participants?.includes(userId)),
    [conversation, userId],
  );

  useEffect(() => {
    let active = true;

    async function loadConversation() {
      setLoadingConversation(true);
      setConversationError('');

      try {
        const nextConversation = await getConversation(conversationId);
        if (!active) return;

        if (!nextConversation) {
          setConversation(null);
          setConversationError('This conversation could not be found.');
          return;
        }

        if (!nextConversation.participants?.includes(userId)) {
          setConversation(nextConversation);
          setConversationError('You do not have access to this conversation.');
          return;
        }

        setConversation(nextConversation);
      } catch (error) {
        if (!active) return;
        setConversation(null);
        setConversationError(error?.message || 'We could not open this conversation right now.');
      } finally {
        if (active) {
          setLoadingConversation(false);
        }
      }
    }

    if (conversationId) {
      loadConversation();
    } else {
      setConversation(null);
      setConversationError('A conversation ID is required to open a thread.');
      setLoadingConversation(false);
    }

    return () => {
      active = false;
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !conversation || !isParticipant) return undefined;

    setMessageError('');
    return subscribeToMessages(
      conversationId,
      setMessages,
      (error) => {
        setMessageError(error?.message || 'Messages are unavailable right now.');
      },
    );
  }, [conversation, conversationId, isParticipant]);

  useEffect(() => {
    if (!conversationId || !isParticipant || !messages.length) return;

    markConversationAsRead(conversationId, userId, messages).catch((error) => {
      console.error('Unable to mark conversation as read.', error);
    });
  }, [conversationId, isParticipant, messages, userId]);

  if (loadingConversation || conversation === undefined) {
    return (
      <PageContainer>
        <EmptyState
          title="Loading conversation…"
          description="We are confirming the thread details and your access before connecting live messages."
        />
      </PageContainer>
    );
  }

  if (conversationError) {
    return (
      <PageContainer>
        <EmptyState
          title="Conversation unavailable"
          description={conversationError}
          action={<Link to={inboxRoute}>Return to inbox</Link>}
        />
      </PageContainer>
    );
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
      details: 'Conversation was reported from the message thread view.',
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
          {messageError ? <p className="form-error-banner">{messageError}</p> : null}
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

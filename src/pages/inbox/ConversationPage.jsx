import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
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
  const [sending, setSending] = useState(false);
  const [reportStatus, setReportStatus] = useState('');
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [conversationError, setConversationError] = useState('');
  const [messageError, setMessageError] = useState('');
  const messagesEndRef = useRef(null);
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
          setConversation(null);
          setConversationError('You do not have permission to view this conversation.');
          return;
        }

        setConversation(nextConversation);
      } catch (error) {
        if (!active) return;
        setConversation(null);
        const msg = error?.message || '';
        if (msg.includes('permission') || msg.includes('Missing or insufficient')) {
          setConversationError('You do not have permission to view this conversation.');
        } else {
          setConversationError('Unable to load this conversation. Please try again.');
        }
      } finally {
        if (active) {
          setLoadingConversation(false);
        }
      }
    }

    if (conversationId && userId) {
      loadConversation();
    } else if (!conversationId) {
      setConversation(null);
      setConversationError('A conversation ID is required.');
      setLoadingConversation(false);
    }

    return () => {
      active = false;
    };
  }, [conversationId, userId]);

  useEffect(() => {
    if (!conversationId || !conversation || !isParticipant) return undefined;

    setMessageError('');
    return subscribeToMessages(
      conversationId,
      setMessages,
      (error) => {
        const msg = error?.message || '';
        if (msg.includes('permission') || msg.includes('Missing or insufficient')) {
          setMessageError('Unable to load messages — permission denied.');
        } else {
          setMessageError('Messages are unavailable right now.');
        }
      },
    );
  }, [conversation, conversationId, isParticipant]);

  useEffect(() => {
    if (!conversationId || !isParticipant || !messages.length) return;

    markConversationAsRead(conversationId, userId, messages).catch(() => {});
  }, [conversationId, isParticipant, messages, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loadingConversation || conversation === undefined) {
    return (
      <PageContainer>
        <Spinner label="Loading conversation..." />
      </PageContainer>
    );
  }

  if (conversationError) {
    return (
      <PageContainer>
        <EmptyState
          title="Conversation unavailable"
          description={conversationError}
          action={<Link to={inboxRoute}><Button variant="secondary">Back to inbox</Button></Link>}
        />
      </PageContainer>
    );
  }

  async function handleSend(event) {
    event.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage({ conversationId, senderId: userId, content: content.trim() });
      setContent('');
    } catch (error) {
      setMessageError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  async function handleReportConversation() {
    try {
      await createReport({
        reporterId: userId,
        targetType: 'conversation',
        targetId: conversationId,
        reason: 'Conversation review requested',
        details: 'Conversation was reported from the message thread view.',
        relatedConversationId: conversationId,
      });
      setReportStatus('Reported — our team will review this conversation.');
    } catch {
      setReportStatus('Unable to submit report. Please try again.');
    }
  }

  return (
    <PageContainer>
      <div style={{ marginBottom: '1rem' }}>
        <Link to={inboxRoute} style={{ fontSize: '0.9rem' }}>&larr; Back to inbox</Link>
      </div>
      <div className="conversation-thread-layout">
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.25rem' }}>{conversation?.contextSnapshot?.jobTitle || 'Conversation'}</h1>
              {conversation?.contextSnapshot?.contractorBusinessName && (
                <p style={{ margin: 0, color: 'var(--color-text-muted, #666)' }}>
                  {conversation.contextSnapshot.contractorBusinessName}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Badge>{conversation?.status || 'active'}</Badge>
              <Button variant="ghost" onClick={handleReportConversation} style={{ fontSize: '0.8rem' }}>
                Report
              </Button>
            </div>
          </div>
          {reportStatus ? <p className="inline-note" style={{ marginTop: '0.5rem' }}>{reportStatus}</p> : null}
        </Card>
        <Card className="message-thread" style={{ minHeight: '200px', maxHeight: '60vh', overflowY: 'auto' }}>
          {messageError ? <p className="form-error-banner">{messageError}</p> : null}
          {messages.length ? (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`message-bubble ${message.senderId === userId ? 'is-own' : ''}`}>
                  <p>{message.content}</p>
                  <small>{formatDate(message.createdAt)}</small>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted, #999)' }}>
              <p>No messages yet. Send the first message to start the conversation.</p>
            </div>
          )}
        </Card>
        <Card>
          <form className="form-stack" onSubmit={handleSend}>
            <Textarea
              label="Message"
              rows={3}
              placeholder="Type your message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button type="submit" disabled={sending || !content.trim()}>
              {sending ? 'Sending...' : 'Send message'}
            </Button>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}

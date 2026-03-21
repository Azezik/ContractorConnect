import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useConversationUnreadCount } from '../../hooks/useConversationUnreadCount';
import { subscribeToUserConversations } from '../../services/conversationService';
import { formatDate } from '../../lib/formatters/dates';
import { getAccountRole } from '../../lib/auth/accountRole';
import { getConversationRouteForRole } from '../../lib/guards/onboardingHelpers';
import { ACCOUNT_ROLES } from '../../constants/roles';

function ConversationListItem({ conversation, accountRole, userId }) {
  const unreadCount = useConversationUnreadCount(conversation.id, userId);
  const hasUnread = unreadCount > 0;

  const otherPartyLabel = accountRole === ACCOUNT_ROLES.CLIENT
    ? conversation.contextSnapshot?.contractorBusinessName || 'Contractor'
    : conversation.contextSnapshot?.clientName || 'Client';

  const previewText = conversation.lastMessagePreview
    ? conversation.lastMessagePreview
    : 'No messages yet — start the conversation.';

  return (
    <Link to={getConversationRouteForRole(accountRole, conversation.id)} style={{ textDecoration: 'none' }}>
      <Card className="conversation-list__item" style={{ marginBottom: '0.75rem', cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ minWidth: 0 }}>
            <strong style={{ display: 'block' }}>{conversation.contextSnapshot?.jobTitle || 'Conversation'}</strong>
            <small style={{ color: 'var(--color-text-muted, #666)' }}>{otherPartyLabel}</small>
          </div>
          {hasUnread ? <Badge variant="success">{unreadCount} new</Badge> : null}
        </div>
        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: hasUnread ? 'inherit' : 'var(--color-text-muted, #666)' }}>
          {previewText}
        </p>
        <small style={{ color: 'var(--color-text-muted, #999)' }}>
          {formatDate(conversation.lastMessageAt || conversation.updatedAt)}
        </small>
      </Card>
    </Link>
  );
}

export function InboxPage() {
  const { userId, userDoc } = useCurrentUser();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const accountRole = getAccountRole(userDoc);

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError('');

    return subscribeToUserConversations(
      userId,
      (nextConversations) => {
        const participantConversations = nextConversations.filter(
          (c) => Array.isArray(c.participants) && c.participants.includes(userId),
        );
        setConversations(participantConversations);
        setLoading(false);
      },
      (subscriptionError) => {
        setError(subscriptionError?.message || 'We could not load your conversations right now.');
        setLoading(false);
      },
    );
  }, [userId]);

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Inbox"
        title="Messages"
        description="Your conversations with clients and contractors, organized by job post."
      />
      <div className="conversation-list">
        {loading ? (
          <Spinner label="Loading conversations..." />
        ) : error ? (
          <EmptyState
            title="Unable to load inbox"
            description="Something went wrong loading your conversations. Please refresh and try again."
            action={<p className="empty-state__meta empty-state__meta--error">{error}</p>}
          />
        ) : conversations.length ? (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              accountRole={accountRole}
              userId={userId}
            />
          ))
        ) : (
          <EmptyState
            title="No conversations yet"
            description="Conversations are created when you reach out from a job post. Your message threads will appear here."
          />
        )}
      </div>
    </PageContainer>
  );
}

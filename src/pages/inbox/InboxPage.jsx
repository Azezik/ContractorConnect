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
    : conversation.contextSnapshot?.clientName || conversation.contextSnapshot?.jobTitle || 'Client';

  const previewText = conversation.lastMessagePreview || null;
  const jobTitle = conversation.contextSnapshot?.jobTitle || 'Conversation';

  return (
    <Link to={getConversationRouteForRole(accountRole, conversation.id)} style={{ textDecoration: 'none' }}>
      <Card className="conversation-list__item" style={{ marginBottom: '0.75rem', cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0, flex: '1 1 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <strong style={{ display: 'block' }}>{jobTitle}</strong>
              {hasUnread && <Badge variant="success">{unreadCount} new</Badge>}
            </div>
            <small style={{ color: 'var(--color-text-muted, #666)' }}>{otherPartyLabel}</small>
          </div>
          <small style={{ color: 'var(--color-text-muted, #999)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {formatDate(conversation.lastMessageAt || conversation.updatedAt)}
          </small>
        </div>
        {previewText && (
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: hasUnread ? 'inherit' : 'var(--color-text-muted, #666)' }}>
            {previewText}
          </p>
        )}
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
        const realConversations = nextConversations.filter(
          (c) =>
            Array.isArray(c.participants) &&
            c.participants.includes(userId) &&
            c.lastMessageAt != null,
        );
        setConversations(realConversations);
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
        description="Your conversations, organized by job post."
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
            description="Conversations appear here when you or another party sends a message from a job post."
          />
        )}
      </div>
    </PageContainer>
  );
}

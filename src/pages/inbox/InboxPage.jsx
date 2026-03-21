import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useConversationUnreadCount } from '../../hooks/useConversationUnreadCount';
import { subscribeToUserConversations } from '../../services/conversationService';
import { formatDate } from '../../lib/formatters/dates';
import { getAccountRole } from '../../lib/auth/accountRole';
import { getConversationRouteForRole } from '../../lib/guards/onboardingHelpers';

function ConversationListItem({ conversation, accountRole, userId }) {
  const unreadCount = useConversationUnreadCount(conversation.id, userId);
  const hasUnread = unreadCount > 0;

  return (
    <Link key={conversation.id} to={getConversationRouteForRole(accountRole, conversation.id)}>
      <Card className="conversation-list__item">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
          <strong>{conversation.contextSnapshot?.jobTitle || 'Conversation'}</strong>
          {hasUnread ? <Badge variant="success">{unreadCount} unread</Badge> : <Badge>Read</Badge>}
        </div>
        <p>{conversation.lastMessagePreview || 'No messages yet. Start the thread from a job post to begin messaging.'}</p>
        <small>
          {formatDate(conversation.lastMessageAt || conversation.updatedAt)}
          {conversation.contextSnapshot?.contractorBusinessName ? ` · ${conversation.contextSnapshot.contractorBusinessName}` : ''}
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
        setConversations(nextConversations);
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
        title="Platform messaging"
        description="Messaging is shared capability, but the route remains inside your current account bucket so client and contractor navigation stay separate."
      />
      <div className="conversation-list">
        {loading ? (
          <EmptyState
            title="Loading conversations…"
            description="We are checking your inbox and unread state now."
          />
        ) : error ? (
          <EmptyState
            title="Inbox unavailable"
            description="Your inbox request failed instead of silently hanging. Please try again in a moment."
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
            description="When you message from a job post, the thread will appear here with unread tracking automatically."
          />
        )}
      </div>
    </PageContainer>
  );
}

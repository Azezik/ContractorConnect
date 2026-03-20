import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { subscribeToUserConversations } from '../../services/conversationService';
import { formatDate } from '../../lib/formatters/dates';
import { getAccountRole } from '../../lib/auth/accountRole';
import { getConversationRouteForRole } from '../../lib/guards/onboardingHelpers';

export function InboxPage() {
  const { userId, userDoc } = useCurrentUser();
  const [conversations, setConversations] = useState([]);
  const accountRole = getAccountRole(userDoc);

  useEffect(() => {
    if (!userId) return undefined;
    return subscribeToUserConversations(userId, setConversations);
  }, [userId]);

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Inbox"
        title="Platform messaging"
        description="Messaging is shared capability, but the route remains inside your current account bucket so client and contractor navigation stay separate."
      />
      <div className="conversation-list">
        {conversations.length ? (
          conversations.map((conversation) => (
            <Link key={conversation.id} to={getConversationRouteForRole(accountRole, conversation.id)}>
              <Card className="conversation-list__item">
                <strong>{conversation.contextSnapshot?.jobTitle || 'Conversation'}</strong>
                <p>{conversation.lastMessagePreview || 'No messages yet'}</p>
                <small>{formatDate(conversation.lastMessageAt || conversation.updatedAt)}</small>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <h3>No conversations yet</h3>
            <p>When you message from a job post, the thread will appear here.</p>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}

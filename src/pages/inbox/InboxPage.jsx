import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { subscribeToUserConversations } from '../../services/conversationService';
import { formatDate } from '../../lib/formatters/dates';

export function InboxPage() {
  const { userId } = useCurrentUser();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!userId) return undefined;
    return subscribeToUserConversations(userId, setConversations);
  }, [userId]);

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Inbox"
        title="Platform messaging"
        description="This first-pass inbox shows account-based conversations. Later phases can add unread indicators, attachments, moderation review context, and stronger permissions."
      />
      <div className="conversation-list">
        {conversations.length ? (
          conversations.map((conversation) => (
            <Link key={conversation.id} to={`/inbox/${conversation.id}`}>
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

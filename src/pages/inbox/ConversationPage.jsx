import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { subscribeToMessages, sendMessage } from '../../services/messageService';
import { formatDate } from '../../lib/formatters/dates';
import { createReport } from '../../services/reportService';

export function ConversationPage() {
  const { conversationId } = useParams();
  const { userId } = useCurrentUser();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [reportStatus, setReportStatus] = useState('');

  useEffect(() => {
    getDoc(doc(db, 'conversations', conversationId)).then((snapshot) => {
      setConversation(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    });
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return undefined;
    return subscribeToMessages(conversationId, setMessages);
  }, [conversationId]);

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

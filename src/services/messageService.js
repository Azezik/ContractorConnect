import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { touchConversation } from './conversationService';

export async function sendMessage({ conversationId, senderId, content }) {
  const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
  await addDoc(messagesCollection, {
    senderId,
    content,
    createdAt: serverTimestamp(),
    readBy: [senderId],
    moderationStatus: 'visible',
    status: 'sent',
  });

  await touchConversation(conversationId, content.slice(0, 120));
}

export function subscribeToMessages(conversationId, callback, onError) {
  const messagesQuery = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'asc'),
  );

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      callback(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
    },
    (error) => {
      console.error('Unable to subscribe to messages.', error);
      onError?.(error);
    },
  );
}

export function subscribeToUnreadMessageCount(conversationId, userId, callback, onError) {
  const messagesQuery = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      const unreadCount = snapshot.docs.reduce((count, document) => {
        const message = document.data();
        const isOwnMessage = message.senderId === userId;
        const isRead = Array.isArray(message.readBy) && message.readBy.includes(userId);
        const isVisible = message.moderationStatus !== 'hidden';
        const isActive = message.status !== 'deleted';

        return !isOwnMessage && !isRead && isVisible && isActive ? count + 1 : count;
      }, 0);

      callback(unreadCount);
    },
    (error) => {
      console.error('Unable to subscribe to unread message count.', error);
      callback(0);
      onError?.(error);
    },
  );
}

export async function markConversationAsRead(conversationId, userId, messages = []) {
  const unreadMessages = messages.filter((message) => {
    const isOwnMessage = message.senderId === userId;
    const isRead = Array.isArray(message.readBy) && message.readBy.includes(userId);
    const isVisible = message.moderationStatus !== 'hidden';
    const isActive = message.status !== 'deleted';

    return !isOwnMessage && !isRead && isVisible && isActive;
  });

  if (!unreadMessages.length) return;

  if (unreadMessages.length === 1) {
    await updateDoc(doc(db, 'conversations', conversationId, 'messages', unreadMessages[0].id), {
      readBy: arrayUnion(userId),
    });
    return;
  }

  const batch = writeBatch(db);
  unreadMessages.forEach((message) => {
    batch.update(doc(db, 'conversations', conversationId, 'messages', message.id), {
      readBy: arrayUnion(userId),
    });
  });
  await batch.commit();
}

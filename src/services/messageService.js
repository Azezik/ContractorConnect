import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
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

export function subscribeToMessages(conversationId, callback) {
  const messagesQuery = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'asc'),
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    callback(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
  });
}

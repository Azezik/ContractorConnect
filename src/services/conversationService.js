import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const conversationsCollection = collection(db, 'conversations');

export async function findExistingConversation({ participantA, participantB, relatedJobPostId }) {
  const conversationQuery = query(
    conversationsCollection,
    where('participants', 'array-contains', participantA),
    where('relatedJobPostId', '==', relatedJobPostId || null),
  );

  const snapshot = await getDocs(conversationQuery);
  return (
    snapshot.docs
      .map((document) => ({ id: document.id, ...document.data() }))
      .find((conversation) => conversation.participants.includes(participantB)) || null
  );
}

export async function createConversation(payload) {
  const existing = await findExistingConversation({
    participantA: payload.participants[0],
    participantB: payload.participants[1],
    relatedJobPostId: payload.relatedJobPostId,
  });

  if (existing) return existing.id;

  const docRef = await addDoc(conversationsCollection, {
    participants: payload.participants,
    participantRoles: payload.participantRoles,
    relatedJobPostId: payload.relatedJobPostId || null,
    relatedContractorProfileId: payload.relatedContractorProfileId || null,
    contextSnapshot: payload.contextSnapshot || {},
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessagePreview: '',
    lastMessageAt: null,
    status: 'active',
  });

  return docRef.id;
}

export async function getConversation(conversationId) {
  const snapshot = await getDoc(doc(db, 'conversations', conversationId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export function subscribeToUserConversations(userId, callback) {
  const conversationsQuery = query(
    conversationsCollection,
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(conversationsQuery, (snapshot) => {
    callback(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
  });
}

export async function touchConversation(conversationId, preview) {
  await updateDoc(doc(db, 'conversations', conversationId), {
    updatedAt: serverTimestamp(),
    lastMessagePreview: preview,
    lastMessageAt: serverTimestamp(),
  });
}

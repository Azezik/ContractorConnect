import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export async function createReport({ reporterId, targetType, targetId, reason, details, relatedConversationId = null }) {
  const reportRef = await addDoc(collection(db, 'reports'), {
    reporterId,
    targetType,
    targetId,
    reason,
    details,
    relatedConversationId,
    createdAt: serverTimestamp(),
    status: 'open',
  });

  await addDoc(collection(db, 'moderationQueue'), {
    reportId: reportRef.id,
    targetType,
    targetId,
    priority: 'medium',
    status: 'open',
    createdAt: serverTimestamp(),
    assignedTo: null,
    actionTaken: null,
  });

  return reportRef.id;
}

export async function getModerationQueue() {
  const moderationQuery = query(collection(db, 'moderationQueue'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(moderationQuery);
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
}

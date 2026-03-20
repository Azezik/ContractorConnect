import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export async function updateModerationQueueItem(itemId, updates) {
  await updateDoc(doc(db, 'moderationQueue', itemId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

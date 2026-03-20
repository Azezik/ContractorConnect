import { addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const reviewsCollection = collection(db, 'reviews');

export async function createReview({ contractorId, reviewerId, jobPostId, rating, reviewText }) {
  await addDoc(reviewsCollection, {
    contractorId,
    reviewerId,
    jobPostId: jobPostId || null,
    rating,
    reviewText,
    createdAt: serverTimestamp(),
    moderationStatus: 'visible',
  });
}

export function subscribeToContractorReviews(contractorId, callback) {
  const reviewsQuery = query(
    reviewsCollection,
    where('contractorId', '==', contractorId),
    where('moderationStatus', '==', 'visible'),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(reviewsQuery, (snapshot) => {
    callback(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
  });
}

export async function getContractorReviewStats(contractorId) {
  const reviewsQuery = query(reviewsCollection, where('contractorId', '==', contractorId), where('moderationStatus', '==', 'visible'));
  const snapshot = await getDocs(reviewsQuery);
  const reviews = snapshot.docs.map((document) => document.data());
  const reviewCount = reviews.length;
  const averageRating = reviewCount ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount : 0;
  return { reviewCount, averageRating };
}

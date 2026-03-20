import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { JOB_STATUS } from '../constants/jobStatus';
import { MODERATION_STATUS } from '../constants/moderationStatus';
import { buildJobPostStoragePath } from './storagePaths';
import { STORAGE_UPLOAD_POLICIES, uploadFiles } from './storageService';

const jobPostsCollection = collection(db, 'jobPosts');

export async function createJobPost({ ownerId, ownerSnapshot, values, imageFiles = [], primaryImageIndex = 0 }) {
  const docRef = await addDoc(jobPostsCollection, {
    ownerId,
    ownerSnapshot,
    title: values.title,
    category: values.category,
    description: values.description,
    city: values.city,
    postalCode: values.postalCode,
    tags: values.tags,
    budget: values.budget || null,
    timeline: values.timeline || null,
    imageUrls: [],
    imageMeta: [],
    primaryImageUrl: null,
    status: JOB_STATUS.ACTIVE,
    moderationStatus: MODERATION_STATUS.VISIBLE,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (imageFiles.length) {
    const uploads = await uploadFiles({
      files: imageFiles,
      pathPrefix: buildJobPostStoragePath(ownerId, docRef.id),
      policy: STORAGE_UPLOAD_POLICIES.publicImage,
    });
    const primaryImage = uploads[primaryImageIndex] || uploads[0] || null;

    await updateDoc(doc(db, 'jobPosts', docRef.id), {
      imageUrls: uploads.map((file) => file.url),
      imageMeta: uploads,
      primaryImageUrl: primaryImage?.url || null,
      updatedAt: serverTimestamp(),
    });
  }

  return docRef.id;
}

export function subscribeToActiveJobs(callback) {
  const jobsQuery = query(
    jobPostsCollection,
    where('status', '==', JOB_STATUS.ACTIVE),
    where('moderationStatus', '==', MODERATION_STATUS.VISIBLE),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(jobsQuery, (snapshot) => {
    callback(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
  });
}

export async function getRecentJobs() {
  const jobsQuery = query(
    jobPostsCollection,
    where('status', '==', JOB_STATUS.ACTIVE),
    where('moderationStatus', '==', MODERATION_STATUS.VISIBLE),
    orderBy('createdAt', 'desc'),
    limit(6),
  );
  const snapshot = await getDocs(jobsQuery);
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
}

export async function getJobPost(jobId) {
  const snapshot = await getDoc(doc(db, 'jobPosts', jobId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function getUserJobPosts(userId) {
  const jobsQuery = query(jobPostsCollection, where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(jobsQuery);
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
}

import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { MODERATION_STATUS } from '../constants/moderationStatus';
import { buildContractorProfileStoragePath } from './storagePaths';
import { STORAGE_UPLOAD_POLICIES, uploadFiles } from './storageService';

export async function upsertContractorProfile({ ownerId, values, imageFiles = [] }) {
  const profileRef = doc(db, 'contractorProfiles', ownerId);

  let uploads = [];
  if (imageFiles.length) {
    uploads = await uploadFiles({
      files: imageFiles,
      pathPrefix: buildContractorProfileStoragePath(ownerId),
      policy: STORAGE_UPLOAD_POLICIES.publicImage,
    });
  }

  await setDoc(
    profileRef,
    {
      ownerId,
      businessName: values.businessName,
      displayName: values.displayName || '',
      categories: values.categories,
      serviceArea: values.serviceArea,
      bio: values.bio,
      servicesOffered: values.servicesOffered,
      tags: values.tags,
      phone: values.phone || null,
      website: values.website || null,
      availabilityStatus: values.availabilityStatus,
      imageUrls: uploads.map((file) => file.url),
      imageMeta: uploads,
      averageRating: 0,
      reviewCount: 0,
      moderationStatus: MODERATION_STATUS.VISIBLE,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getContractorProfile(profileId) {
  const snapshot = await getDoc(doc(db, 'contractorProfiles', profileId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export function subscribeToContractorProfile(profileId, callback) {
  return onSnapshot(doc(db, 'contractorProfiles', profileId), (snapshot) => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
  });
}

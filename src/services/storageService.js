import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/firebase';

export const STORAGE_UPLOAD_POLICIES = {
  publicImage: {
    maxFileSizeBytes: 5 * 1024 * 1024,
    acceptedMimePrefixes: ['image/'],
  },
  privateAttachment: {
    maxFileSizeBytes: 10 * 1024 * 1024,
    acceptedMimePrefixes: ['image/'],
  },
};

function sanitizeFileName(fileName) {
  const trimmedName = fileName?.trim() || 'upload';
  return trimmedName.replace(/[^a-zA-Z0-9._-]/g, '-');
}

function createStorageFileName(file) {
  const timestamp = Date.now();
  const suffix = typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

  return `${timestamp}-${suffix}-${sanitizeFileName(file.name)}`;
}

function assertUploadAllowed(file, validation) {
  if (!file) {
    throw new Error('Cannot upload an empty file.');
  }

  const hasAcceptedMimeType = validation.acceptedMimePrefixes.some((prefix) => file.type?.startsWith(prefix));
  if (!hasAcceptedMimeType) {
    throw new Error('Only image uploads are supported for this file type.');
  }

  if (file.size > validation.maxFileSizeBytes) {
    const maxSizeMb = Math.floor(validation.maxFileSizeBytes / (1024 * 1024));
    throw new Error(`Files must be ${maxSizeMb}MB or smaller.`);
  }
}

export async function uploadFiles({ files, pathPrefix, policy = STORAGE_UPLOAD_POLICIES.publicImage }) {
  if (!files?.length) return [];

  const uploads = files.map(async (file) => {
    assertUploadAllowed(file, policy);

    const storageRef = ref(storage, `${pathPrefix}/${createStorageFileName(file)}`);
    await uploadBytes(storageRef, file, { contentType: file.type || 'application/octet-stream' });
    const url = await getDownloadURL(storageRef);

    return {
      name: file.name,
      type: file.type,
      size: file.size,
      url,
      storagePath: storageRef.fullPath,
    };
  });

  return Promise.all(uploads);
}

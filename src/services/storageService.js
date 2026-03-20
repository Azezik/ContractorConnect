import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/firebase';

export async function uploadFiles({ files, pathPrefix }) {
  if (!files?.length) return [];

  const uploads = files.map(async (file) => {
    const storageRef = ref(storage, `${pathPrefix}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
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

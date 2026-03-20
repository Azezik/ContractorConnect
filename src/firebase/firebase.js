import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCpCxChQM78DfHJkKFQXwPxawrBVQD3_58',
  authDomain: 'contractorconnect-be5d8.firebaseapp.com',
  projectId: 'contractorconnect-be5d8',
  storageBucket: 'contractorconnect-be5d8.firebasestorage.app',
  messagingSenderId: '819192733518',
  appId: '1:819192733518:web:86b2af7800190ce045881f',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

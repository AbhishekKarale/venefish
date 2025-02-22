import { getApps, getApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration is already in firebase-providers.tsx
// We'll just initialize the services we need
const app = getApps().length ? getApp() : getApp('default');
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage }; 
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCAFtpwq9zf5w0LUlSECsOjDwoR_j-CKRE",
  authDomain: "shopflow-firebase.firebaseapp.com",
  projectId: "shopflow-firebase",
  storageBucket: "shopflow-firebase.firebasestorage.app",
  messagingSenderId: "1001235189204",
  appId: "1:1001235189204:web:aa9a205598fd1e8f939a41",
  measurementId: "G-R05MDSPWSH"
};

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export const initializeFirebase = (): { app: FirebaseApp; auth: Auth; db: Firestore } | null => {
  if (firebaseApp && auth && db) {
    return { app: firebaseApp, auth, db };
  }

  try {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }

    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    
    if (typeof window !== 'undefined') {
      getAnalytics(firebaseApp);
    }

    return { app: firebaseApp, auth, db };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
};

export const getFirebaseInstances = () => {
  if (!firebaseApp || !auth || !db) {
    return initializeFirebase();
  }
  return { app: firebaseApp, auth, db };
};

export const getFirestorePaths = () => {
  return {
    reviews: 'shopflow_reviews',
    userLicenses: (uid: string) => `users/${uid}/licenses`,
    userProfile: (uid: string) => `users/${uid}`,
    contactMessages: 'contact_messages',
  };
};

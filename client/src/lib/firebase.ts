import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

declare global {
  interface Window {
    __app_id?: string;
    __firebase_config?: FirebaseConfig;
    __initial_auth_token?: string;
  }
}

export const getAppId = (): string => {
  return window.__app_id || 'default-app-id';
};

export const getFirebaseConfig = (): FirebaseConfig | null => {
  return window.__firebase_config || null;
};

export const getInitialAuthToken = (): string | undefined => {
  return window.__initial_auth_token;
};

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export const initializeFirebase = (): { app: FirebaseApp; auth: Auth; db: Firestore } | null => {
  if (firebaseApp && auth && db) {
    return { app: firebaseApp, auth, db };
  }

  const config = getFirebaseConfig();
  if (!config) {
    console.warn('Firebase config not found. Using mock mode.');
    return null;
  }

  try {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApps()[0];
    }

    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);

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
  const appId = getAppId();
  return {
    reviews: `artifacts/${appId}/public/data/shopflow_reviews`,
    userLicenses: (uid: string) => `artifacts/${appId}/users/${uid}/shopflow_licenses`,
    userProfile: (uid: string) => `users/${uid}`,
  };
};

// Firebase configuration types and initialization
// Note: Firebase will be initialized at runtime using CDN and global variables

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Global variables injected by host environment
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

// Firestore paths helper
export const getFirestorePaths = (userId?: string) => {
  const appId = getAppId();
  return {
    reviews: `artifacts/${appId}/public/data/shopflow_reviews`,
    userLicenses: (uid: string) => `artifacts/${appId}/users/${uid}/shopflow_licenses`,
    userProfile: (uid: string) => `users/${uid}`,
  };
};

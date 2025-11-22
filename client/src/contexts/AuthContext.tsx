import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInAnonymously,
  signInWithCustomToken,
  signInWithPopup,
  GoogleAuthProvider,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, Unsubscribe, collection, getDocs, query, where } from 'firebase/firestore';
import type { FirebaseUserProfile, FirebaseLicense } from '@shared/schema';
import {
  initializeFirebase,
  getFirebaseInstances,
  getFirestorePaths,
} from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userProfile: FirebaseUserProfile | null;
  userLicense: FirebaseLicense | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(null);
  const [userLicense, setUserLicense] = useState<FirebaseLicense | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const firebase = initializeFirebase();
    if (!firebase) {
      console.warn('Firebase not initialized. Running in mock mode.');
      const mockUser = {
        uid: 'mock-user-id',
        email: 'mock@example.com',
        displayName: 'Mock User',
      } as User;
      setUser(mockUser);
      setUserProfile({
        email: 'mock@example.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      setUserLicense({
        userId: 'mock-user-id',
        type: 'Enterprise',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setLoading(false);
      return;
    }

    const { auth, db } = firebase;
    let profileUnsubscribe: Unsubscribe | null = null;
    let licenseUnsubscribe: Unsubscribe | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }
      if (licenseUnsubscribe) {
        licenseUnsubscribe();
        licenseUnsubscribe = null;
      }

      if (firebaseUser) {
        const paths = getFirestorePaths();

        try {
          const profileRef = doc(db, paths.userProfile(firebaseUser.uid));
          profileUnsubscribe = onSnapshot(profileRef, async (profileSnap) => {
            if (profileSnap.exists()) {
              setUserProfile(profileSnap.data() as FirebaseUserProfile);
            } else {
              const isFirstUser = await checkIfFirstUser(db);
              const newProfile: FirebaseUserProfile = {
                email: firebaseUser.email || '',
                role: isFirstUser ? 'admin' : 'user',
                createdAt: new Date().toISOString(),
              };
              await setDoc(profileRef, newProfile);
              setUserProfile(newProfile);
            }
          });

          const licensesRef = collection(db, paths.userLicenses(firebaseUser.uid));
          licenseUnsubscribe = onSnapshot(licensesRef, (snapshot) => {
            if (!snapshot.empty) {
              const licenses = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirebaseLicense & { id: string }));
              const activeLicense = licenses.find(l => l.isActive) || licenses[0];
              setUserLicense(activeLicense);
            } else {
              setUserLicense(null);
            }
          });
        } catch (error) {
          console.error('Error setting up Firestore listeners:', error);
        }
      } else {
        setUserProfile(null);
        setUserLicense(null);
      }

      setLoading(false);
    });

    const tryCustomTokenAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (anonError) {
        console.error('Anonymous auth failed:', anonError);
      }
    };

    tryCustomTokenAuth();

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
      if (licenseUnsubscribe) licenseUnsubscribe();
    };
  }, []);

  const checkIfFirstUser = async (db: any): Promise<boolean> => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.empty;
    } catch (error) {
      console.error('Error checking first user:', error);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    const firebase = getFirebaseInstances();
    if (!firebase) {
      toast({
        title: 'Error',
        description: 'Firebase not initialized',
        variant: 'destructive',
      });
      throw new Error('Firebase not initialized');
    }

    try {
      await signInWithEmailAndPassword(firebase.auth, email, password);
      toast({
        title: 'Success',
        description: 'Signed in successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Sign In Failed',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    const firebase = getFirebaseInstances();
    if (!firebase) {
      toast({
        title: 'Error',
        description: 'Firebase not initialized',
        variant: 'destructive',
      });
      throw new Error('Firebase not initialized');
    }

    try {
      await createUserWithEmailAndPassword(firebase.auth, email, password);
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signOut = async () => {
    const firebase = getFirebaseInstances();
    if (!firebase) return;

    try {
      await firebaseSignOut(firebase.auth);
      toast({
        title: 'Signed Out',
        description: 'You have been signed out successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const firebase = getFirebaseInstances();
    if (!firebase) {
      toast({
        title: 'Error',
        description: 'Firebase not initialized',
        variant: 'destructive',
      });
      throw new Error('Firebase not initialized');
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebase.auth, provider);
      toast({
        title: 'Success',
        description: 'Signed in with Google successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Google Sign In Failed',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    const firebase = getFirebaseInstances();
    if (!firebase || !user || !user.email) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      });
      throw new Error('User not authenticated');
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await firebaseUpdatePassword(user, newPassword);
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Password Update Failed',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        userLicense,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        updatePassword,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

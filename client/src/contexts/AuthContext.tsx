import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { FirebaseUserProfile, FirebaseLicense } from '@shared/schema';

interface AuthContextType {
  user: any | null;
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
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(null);
  const [userLicense, setUserLicense] = useState<FirebaseLicense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Firebase Auth listener
    // This will be implemented in Task 2 with actual Firebase integration
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Will be implemented with Firebase
    console.log('Sign in:', email);
  };

  const signUp = async (email: string, password: string) => {
    // Will be implemented with Firebase
    console.log('Sign up:', email);
  };

  const signOut = async () => {
    // Will be implemented with Firebase
    setUser(null);
    setUserProfile(null);
    setUserLicense(null);
  };

  const signInWithGoogle = async () => {
    // Will be implemented with Firebase
    console.log('Google sign in');
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    // Will be implemented with Firebase
    console.log('Update password');
  };

  // Check if user is admin (first user or specific admin ID)
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

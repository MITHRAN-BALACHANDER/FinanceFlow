
'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode, Dispatch, SetStateAction } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
    uid: 'mock-user-id',
    email: 'mock.user@example.com',
    displayName: 'Mock User',
    photoURL: 'https://placehold.co/40x40',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    providerId: 'mock',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({ token: 'mock-token', expirationTime: '', authTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null, claims: {} }),
    reload: async () => {},
    toJSON: () => ({}),
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
        console.log("Using mock user for development.");
        setUser(mockUser);
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logIn = async () => {
    if (!auth) {
        console.error("Firebase is not configured. Cannot log in.");
        setUser(mockUser); // Set mock user on login attempt
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const logOut = async () => {
    if (!auth) {
        console.log("Simulating logout.");
        setUser(null);
        return;
    }
    try {
      await signOut(auth);
    } catch (error)
        {
      console.error("Error signing out", error);
    }
  };

  const value = { user, setUser, loading, logIn, logOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

'use client';

import React, { useMemo, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { getRedirectResult } from 'firebase/auth';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle the redirect result from Google Sign-In
  useEffect(() => {
    if (firebaseServices.auth) {
      getRedirectResult(firebaseServices.auth)
        .then((result) => {
          if (result) {
            // This confirms the user-signed in with the redirect.
            // The onAuthStateChanged observer will receive the user object.
            console.log("FirebaseClientProvider: Successfully handled redirect result for user:", result.user.uid);
          }
        })
        .catch((error) => {
          console.error("FirebaseClientProvider: Error handling redirect result:", error);
        });
    }
  }, [firebaseServices]);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
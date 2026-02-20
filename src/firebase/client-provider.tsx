'use client';

import React, { useMemo, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { getGoogleRedirectResult } from '@/firebase/non-blocking-login';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (firebaseServices.auth) {
      getGoogleRedirectResult(firebaseServices.auth)
        .then(userCredential => {
          if (userCredential) {
            // The onAuthStateChanged listener in FirebaseProvider should now
            // have the user. We don't need to do anything extra here.
            console.log("Redirect login successful");
          }
        })
        .catch(error => {
          console.error("Error processing redirect result:", error);
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
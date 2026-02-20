'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  UserCredential,
  getRedirectResult,
} from 'firebase/auth';

/** Initiate anonymous sign-in. Returns promise to allow error handling. */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<UserCredential> {
  return signInAnonymously(authInstance);
}

/** Initiate email/password sign-up. Returns promise to allow error handling. */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in. Returns promise to allow error handling. */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(authInstance, email, password);
}

/** 
 * Initiate Google sign-in using redirect to avoid popup blockers.
 * Note: signInWithRedirect returns void, it doesn't return a UserCredential immediately.
 * The result is handled by Firebase on return to the page.
 */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(authInstance, provider);
}

/** 
 * Get the result of a redirect sign-in operation.
 * This should be called when the component mounts.
 */
export function getGoogleRedirectResult(authInstance: Auth): Promise<UserCredential | null> {
  return getRedirectResult(authInstance);
}

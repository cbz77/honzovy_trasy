
import {
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

// Use this function to initiate the Google sign-in flow.
export async function initiateGoogleSignIn(auth: Auth | null) {
  if (!auth) {
    console.error("initiateGoogleSignIn: Firebase Auth object is not available.");
    throw new Error("Firebase Auth není k dispozici.");
  }
  // Set persistence to be local across the browser session.
  await setPersistence(auth, browserLocalPersistence);
  return signInWithRedirect(auth, provider);
}

// Use this function to initiate the email/password sign-up flow.
export async function initiateEmailSignUp(auth: Auth | null, email: string, pass: string) {
  if (!auth) {
    console.error("initiateEmailSignUp: Firebase Auth object is not available.");
    throw new Error("Firebase Auth není k dispozici.");
  }
  await setPersistence(auth, browserLocalPersistence);
  return createUserWithEmailAndPassword(auth, email, pass);
}

// Use this function to initiate the email/password sign-in flow.
export async function initiateEmailSignIn(auth: Auth | null, email: string, pass: string) {
  if (!auth) {
    console.error("initiateEmailSignIn: Firebase Auth object is not available.");
    throw new Error("Firebase Auth není k dispozici.");
  }
  await setPersistence(auth, browserLocalPersistence);
  return signInWithEmailAndPassword(auth, email, pass);
}

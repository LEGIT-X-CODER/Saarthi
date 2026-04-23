// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Check if we're in demo mode
const isDemoMode = import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key';

// Your web app's Firebase configuration for SAARTHI
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if not in demo mode
let app;
if (!isDemoMode) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    console.log('Running in demo mode - Firebase features disabled');
  }
} else {
  console.log('Demo mode detected - Firebase features disabled');
}

// Initialize Firebase services
export let auth = null;
export let db = null;
export let storage = null;
export let analytics = null;

if (app && !isDemoMode) {
  try {
    auth = getAuth(app);
    console.log('Firebase Auth initialized successfully');
  } catch (error) {
    console.error('Firebase Auth initialization failed:', error);
  }

  // Initialize Firestore with error handling
  try {
    db = getFirestore(app);
    console.log('Firestore initialized successfully');
  } catch (error) {
    console.error('Firestore initialization failed:', error);
  }

  try {
    storage = getStorage(app);
    console.log('Firebase Storage initialized successfully');
  } catch (error) {
    console.error('Firebase Storage initialization failed:', error);
  }

  // Initialize Analytics (only in browser environment)
  if (typeof window !== "undefined") {
    try {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully');
    } catch (error) {
      console.error('Firebase Analytics initialization failed:', error);
    }
  }
} else {
  console.log('Firebase services not initialized - running in demo mode');
}

// Connect to emulators in development
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  // Firebase emulators are not being used in this project
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, "localhost", 8080);
  // connectStorageEmulator(storage, "localhost", 9199);
}
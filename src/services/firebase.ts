
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

let app: FirebaseApp;
let firestore: Firestore;
let storage: FirebaseStorage;
let realtimeDb: Database;
let auth: Auth;

// Firebase app initialization
export const initializeFirebase = () => {
  try {
    app = initializeApp(firebaseConfig);
    firestore = getFirestore(app);
    storage = getStorage(app);
    realtimeDb = getDatabase(app);
    auth = getAuth(app);
    
    console.log('Firebase initialized successfully');
    return app;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Export Firebase services
export const getFirestoreInstance = () => {
  if (!firestore) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firestore;
};

export const getStorageInstance = () => {
  if (!storage) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return storage;
};

export const getRealtimeDbInstance = () => {
  if (!realtimeDb) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return realtimeDb;
};

export const getAuthInstance = () => {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
};

export default initializeFirebase;

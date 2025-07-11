import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const allConfigPresent = Object.values(firebaseConfig).every(Boolean);

let app, auth, db;

if (allConfigPresent) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    console.warn("Firebase configuration is incomplete. Using mock data. Please check your .env file.");
    // Provide mock/null objects so the rest of the app doesn't crash
    const mockConfig = {
      apiKey: "mock-key",
      authDomain: "mock.firebaseapp.com",
      projectId: "mock-project",
      storageBucket: "mock.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:mock-app-id"
    };
    app = !getApps().length ? initializeApp(mockConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
}


export { app, auth, db };

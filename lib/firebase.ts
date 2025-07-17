// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgs9zlNbCxPtO09RYGKD_ufShwhXm_M3c",
  authDomain: "wordle-armaco.firebaseapp.com",
  projectId: "wordle-armaco",
  storageBucket: "wordle-armaco.firebasestorage.app",
  messagingSenderId: "763696599310",
  appId: "1:763696599310:web:b3b5e0d0bc42733963075f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // 👈 exportamos esto
export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1Te4tGVh851HgWCFctS73nHIlnvotFnU",
  authDomain: "hackathon-app-1949c.firebaseapp.com",
  projectId: "hackathon-app-1949c",
  storageBucket: "hackathon-app-1949c.firebasestorage.app",
  messagingSenderId: "870601591037",
  appId: "1:870601591037:web:8a266e7998ea7ea02f5694",
  measurementId: "G-GKH0J24DMR"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
const analytics = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIRESTORE_DB = getFirestore(FIREBASE_APP)

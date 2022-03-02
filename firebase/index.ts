
import { initializeApp, getApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, signInWithPopup} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize firebase
export const app = initializeApp(firebaseConfig);
const firebaseApp = getApp()
// Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(firebaseApp, process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

export const signInWithFacebook = () => {
  const provider = new  FacebookAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
  console.log(result);
  
  })
  .catch((error) => {
    console.log(error);
  });
}

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Analytics, getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDxvivBfaCWTeA0Rpjux0RJqiC8HIooBgY",
  authDomain: "chatbotp3-d549b.firebaseapp.com",
  projectId: "chatbotp3-d549b",
  storageBucket: "chatbotp3-d549b.appspot.com",
  messagingSenderId: "754861544876",
  appId: "1:754861544876:web:a8378f9a3f266c6673d609",
  measurementId: "G-Y34L6WVWNR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
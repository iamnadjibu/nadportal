import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJI93K3sZI-d5SC8Rotl9Ex_6mnVGyggE",
  authDomain: "nadportfolio.firebaseapp.com",
  projectId: "nadportfolio",
  storageBucket: "nadportfolio.firebasestorage.app",
  messagingSenderId: "1055308326353",
  appId: "1:1055308326353:web:1f37d0f8f7be1124ebacf0",
  measurementId: "G-HJ3WWDPSSD"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

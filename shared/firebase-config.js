import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, collection };

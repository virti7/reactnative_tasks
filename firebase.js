// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPReHZXwPY2SdYwAcx67G5PhhJqbUD8M0",
  authDomain: "react-native-a5f2f.firebaseapp.com",
  projectId: "react-native-a5f2f",
  storageBucket: "react-native-a5f2f.firebasestorage.app", // <-- might be wrong, see note below
  messagingSenderId: "182128957467",
  appId: "1:182128957467:web:530cc1067be2cc311340be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance
const db = getFirestore(app);

export { db };

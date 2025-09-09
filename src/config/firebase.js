import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl0NdpQg-rG9w25QyEniqm_uWIjhe5EtY",
  authDomain: "organizador-torneio-b-tennis.firebaseapp.com",
  projectId: "organizador-torneio-b-tennis",
  storageBucket: "organizador-torneio-b-tennis.firebasestorage.app",
  messagingSenderId: "729351809777",
  appId: "1:729351809777:web:179020d48174790fe8d750",
  measurementId: "G-LCWYV9RQM7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;

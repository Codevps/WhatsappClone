// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC38lhaZjgSIjFD6NEQKzNGJJZYROZFFO4",
  authDomain: "whatsappclone-b4c7a.firebaseapp.com",
  projectId: "whatsappclone-b4c7a",
  storageBucket: "whatsappclone-b4c7a.appspot.com",
  messagingSenderId: "880447247252",
  appId: "1:880447247252:web:c6a8b03e3d6d856b793581",
  measurementId: "G-W5L95683H6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

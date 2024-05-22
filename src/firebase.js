// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0b6stzuvxR3qB20Gob5j1d5mDJTK1rrM",
  authDomain: "mark-down-notes-45630.firebaseapp.com",
  projectId: "mark-down-notes-45630",
  storageBucket: "mark-down-notes-45630.appspot.com",
  messagingSenderId: "665160181826",
  appId: "1:665160181826:web:6d71dbd878b8e1f48ce5db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);                    //database creation 
export const notesCollection = collection(db, "notes"); //collection creation
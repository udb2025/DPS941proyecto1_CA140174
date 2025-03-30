// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCH2cHqaev1uvAjHYCf_m-EzR5jR2SYKXY",
  authDomain: "udb-ca140174-dps941.firebaseapp.com",
  projectId: "udb-ca140174-dps941",
  storageBucket: "udb-ca140174-dps941.firebasestorage.app",
  messagingSenderId: "831254193227",
  appId: "1:831254193227:web:ce1024274b89945802d9ce",
  measurementId: "G-H788DCHL7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  
export const db = getFirestore(app);
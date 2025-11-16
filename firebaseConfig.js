// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkw6mHLRumVP6Bi2XSIoDCdI4M_hxTHWM",
  authDomain: "ecowatt-pi6.firebaseapp.com",
  projectId: "ecowatt-pi6",
  storageBucket: "ecowatt-pi6.firebasestorage.app",
  messagingSenderId: "188128638230",
  appId: "1:188128638230:web:528e234c4d02cd9e5f4c37",
  measurementId: "G-GCQP28Q6ZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
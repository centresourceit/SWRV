// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCifU83R2E7V5j9fEJe9qScdK_0OfBVWLY",
  authDomain: "swrv-e0728.firebaseapp.com",
  projectId: "swrv-e0728",
  storageBucket: "swrv-e0728.appspot.com",
  messagingSenderId: "800973877444",
  appId: "1:800973877444:web:90b8bdf932bc9fe8c01991",
  measurementId: "G-BJWBJE138H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

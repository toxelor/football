import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDN8BNF5YdTlwX9YhGJADDslLZQHu3u5s8",
  authDomain: "football-a1d67.firebaseapp.com",
  projectId: "football-a1d67",
  storageBucket: "football-a1d67.appspot.com",
  messagingSenderId: "828505442648",
  appId: "1:828505442648:web:aaff5235b1e425daf7fd2d",
  measurementId: "G-9MQMJ607P6"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export const db = getFirestore(app)
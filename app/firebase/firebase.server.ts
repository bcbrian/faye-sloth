import { getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";

import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

let app, auth, db;

if(!getApps().length) {
  const firebaseConfig = {
    apiKey: "AIzaSyA34ZWGXJfZlR6u8zsfK5nbsHpigr_aM58",
    authDomain: "codesagas.firebaseapp.com",
    projectId: "codesagas",
    storageBucket: "codesagas.appspot.com",
    messagingSenderId: "434743911554",
    appId: "1:434743911554:web:4c4b74f039bb5f2a98809b",
    measurementId: "G-RFN47JK38N",
  };
  app = initializeApp(firebaseConfig);
  auth = getAuth();
  db = getFirestore();
 if(process.env.NODE_ENV === "development") {
   connectFirestoreEmulator(db, 'localhost', 8080);
   connectAuthEmulator(auth, "http://localhost:9099");
 }
}

export { app, auth, db, getAuth, getFirestore };

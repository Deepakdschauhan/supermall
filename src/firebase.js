import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyASD6g_J7QtdO-u5ymlTaccscVHnS3togQ",
    authDomain: "super-mall-app-c021b.firebaseapp.com",
    projectId: "super-mall-app-c021b",
    storageBucket: "super-mall-app-c021b.firebasestorage.app",
    messagingSenderId: "340283999142",
    appId: "1:340283999142:web:7ee0c620542bd5c81c4567",
    measurementId: "G-ELGKLH2HEL"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth }; //

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwinrnhl1cIFb-HuSib6R2vLgwUqY6Vg0",
  authDomain: "inventory-management-36ec8.firebaseapp.com",
  projectId: "inventory-management-36ec8",
  storageBucket: "inventory-management-36ec8.appspot.com",
  messagingSenderId: "218620605354",
  appId: "1:218620605354:web:798e95d46267d2e42131d3",
  measurementId: "G-5NLYXYHE3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}
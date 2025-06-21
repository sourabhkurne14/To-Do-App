// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyACSyiTNjtKBdxc299K6ssAxDonFVjJQJY",
  authDomain: "to-do-list-app-65a70.firebaseapp.com",
  projectId: "to-do-list-app-65a70",
  storageBucket: "to-do-list-app-65a70.firebasestorage.app",
  messagingSenderId: "1030731387134",
  appId: "1:1030731387134:web:de3d53a084a351717715af",
  measurementId: "G-L7Q5WZGQHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)

export {auth};
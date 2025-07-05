// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSCmprAHDV1MQcdTa_7YaS9cu-CXrsqJ4",
  authDomain: "core-d4ca4.firebaseapp.com",
  projectId: "core-d4ca4",
  storageBucket: "core-d4ca4.firebasestorage.app",
  messagingSenderId: "509237418993",
  appId: "1:509237418993:web:031b66f3b8967aaa714250",
  measurementId: "G-35J082BKEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

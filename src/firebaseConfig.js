// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA6cEzCSYOPJofpr_N7oIGW7qMcZ66QeJw",
  authDomain: "influsage-8adc3.firebaseapp.com",
  projectId: "influsage-8adc3",
  storageBucket: "influsage-8adc3.firebasestorage.app",
  messagingSenderId: "254773167173",
  appId: "1:254773167173:web:c7350e6a838d217da6cf2c",
  measurementId: "G-5C76H463P3",
};

const app = initializeApp(firebaseConfig);
// Check if Firebase Messaging is supported
let messaging = null;

isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
    console.log("✅ Firebase Messaging is supported and initialized.");
  } else {
    console.warn("⚠️ Firebase Messaging is not supported in this browser/context.");
  }
});

export { app, messaging };
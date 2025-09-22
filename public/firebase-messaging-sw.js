// Use Firebase compat scripts via CDN
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6cEzCSYOPJofpr_N7oIGW7qMcZ66QeJw",
  authDomain: "influsage-8adc3.firebaseapp.com",
  projectId: "influsage-8adc3",
  storageBucket: "influsage-8adc3.firebasestorage.app",
  messagingSenderId: "254773167173",
  appId: "1:254773167173:web:c7350e6a838d217da6cf2c",
  measurementId: "G-5C76H463P3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', // optional
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

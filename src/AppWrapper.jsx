import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setNotifications, addNotification } from "./features/notifications/notificationSlice";
import { messaging } from "./firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AppWrapper({ children }) {
  const dispatch = useDispatch();
  const { token, userId } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!token || !userId) return;

    // 1️⃣ Fetch existing notifications from backend
    fetch(`${BASE_URL}/chat/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => dispatch(setNotifications(data)));

    // 2️⃣ Connect Socket.IO
    const socket = io(BASE_URL, { auth: { token } });
    socket.emit("register", userId);
    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification));
    });

    // 3️⃣ FCM: register service worker and request permission
    const requestFCMPermission = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        const fcmToken = await getToken(messaging, {
          vapidKey: "BC3o2GoDs5qgRB7NzIwKCbPhcGOpRuBSQ6EFxqKAtwpNXT52ZZYEBiwrvC7LUT6BJ8JaN4YlySDoCe-LaXYWwv8",
          serviceWorkerRegistration: registration,
        });
        console.log("FCM Token:", fcmToken);
        // Send this token to backend to save for this user
      } catch (err) {
        console.error("FCM permission error:", err);
      }
    };
    requestFCMPermission();

    // 4️⃣ FCM: listen for foreground messages
    const unsubscribeOnMessage = onMessage(messaging, (payload) => {
      console.log("FCM Message received: ", payload);
      dispatch(addNotification(payload));
    });

    // 5️⃣ Cleanup
    return () => {
      socket.disconnect();
      unsubscribeOnMessage();
    };
  }, [dispatch, token, userId]);

  return children;
}

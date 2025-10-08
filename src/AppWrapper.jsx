import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setNotifications, addNotification } from "./features/socket/notificationSlice";
import { messaging } from "./firebaseConfig";
import { getToken, onMessage, isSupported } from "firebase/messaging";

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

    // 3️⃣ FCM: check support and request permission
    let unsubscribeOnMessage = () => {};

    const initFCM = async () => {
      const supported = await isSupported();
      if (!supported || !messaging) {
        console.warn("Firebase Messaging not supported in this browser/context.");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        const fcmToken = await getToken(messaging, {
          vapidKey: "BC3o2GoDs5qgRB7NzIwKCbPhcGOpRuBSQ6EFxqKAtwpNXT52ZZYEBiwrvC7LUT6BJ8JaN4YlySDoCe-LaXYWwv8",
          serviceWorkerRegistration: registration,
        });

        if (fcmToken) {
          console.log("✅ FCM Token:", fcmToken);
          // TODO: Send token to your backend if needed
        } else {
          console.warn("No FCM token retrieved.");
        }

        unsubscribeOnMessage = onMessage(messaging, (payload) => {
          console.log("📥 FCM Message received: ", payload);
          dispatch(addNotification(payload));
        });
      } catch (err) {
        console.error("🔥 FCM initialization error:", err);
      }
    };

    initFCM();

    // 4️⃣ Cleanup
    return () => {
      socket.disconnect();
      if (unsubscribeOnMessage) {
        unsubscribeOnMessage();
      }
    };
  }, [dispatch, token, userId]);

  return children;
}

  import React, { useEffect } from "react";
  import { useSelector, useDispatch } from "react-redux";
  import { initSocket, getSocket } from "./socket";
  import { setConnected, setOnlineUsers } from "../features/socket/socketSlice";
  import { addNotification, incrementUnread } from "../features/socket/notificationSlice";

  const SocketProvider = ({ children }) => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userId); 
    const token = useSelector((state) => state.auth.token);

    const notificationsInStore = useSelector(
      (state) => state.notifications.items
    );

    useEffect(() => {
      if (!token || !userId) {
        // console.log("⏳ Waiting for token & userId...");
        return;
      }

      let socket = getSocket();

      if (!socket) {
        socket = initSocket(token);
        socket.connect();
      }

      socket.on("connect", () => {
        dispatch(setConnected(true));
        socket.emit("register", userId);
      });

      socket.on("receiveNotification", (payload) => {
        if (!payload) return;

        const notifications = Array.isArray(payload) ? payload : [payload];

        notifications.forEach((ntf) => {
          const notification = {
            id: ntf.notificationid,
            title: ntf.title,
            message: ntf.description,
            isRead: ntf.isread ?? false,
            time: ntf.createddate,
          };

          const exists = notificationsInStore.some(
            (n) => n.id === notification.id
          );

          if (!exists) {
            console.log(notification)
            dispatch(addNotification(notification));
            if (!notification.isRead) {
              dispatch(incrementUnread());
            }
          }
        });
      });

      socket.on("onlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
        console.log("onlineUsers using this userid", userId);
      });

      socket.on("disconnect", () => {
        dispatch(setConnected(false));
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("onlineUsers");
        socket.off("receiveNotification");
      };
    }, [token, userId, dispatch, notificationsInStore]);

    return children;
  };

  export default SocketProvider;

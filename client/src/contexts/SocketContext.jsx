// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth"; // your auth hook

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    const SOCKET_URL =
      process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") || "" },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      if (user && user._id) {
        socket.emit("join-customer-room", user._id);
      }
    });

    // Re-join when user changes (login/logout)
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

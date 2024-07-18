import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import createWebSocket from "../utils/websocket";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token && !socket) {
      const newSocket = createWebSocket(token);
      setSocket(newSocket);

      newSocket.onmessage = (e) => {
        const newMessage = e.data;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      newSocket.onclose = () => setSocket(null);

      return () => {
        if (newSocket.readyState === WebSocket.OPEN) newSocket.close();
      };
    }
  }, [token, socket]);

  const sendMessage = (message) => {
    if (socket) socket.send(JSON.stringify(message));
  };

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

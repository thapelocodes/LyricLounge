import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../features/chat/chatSlice";

const WebSocketContext = createContext();

let message = "";

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !socket) {
      const newSocket = new WebSocket("ws://localhost:5000");

      newSocket.onopen = () => {
        console.log("WebSocket connection opened");
        newSocket.send(JSON.stringify({ type: "authenticate", token }));
      };

      newSocket.onmessage = (e) => {
        console.log("Event:", e);
        message = JSON.parse(e.data);
        console.log("WebSocket message received:", message);
        if (message.type === "chatMessage") {
          dispatch(addMessage(message.data));
        }
      };

      newSocket.onclose = () => {
        console.log("WebSocket connection closed");
        setSocket(null);
      };

      setSocket(newSocket);

      return () => {
        if (newSocket.readyState === WebSocket.OPEN) newSocket.close();
      };
    }
  }, [token, socket, dispatch]);

  const sendMessage = (message) => {
    if (socket) {
      const chatMessage = {
        token,
        type: "chatMessage",
        data: message,
      };
      socket.send(JSON.stringify(chatMessage));
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  fetchMessagesByMembership,
  markMessagesAsSeen,
} from "../features/chat/chatSlice";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { openChatroomId } = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth.user);

  // Use a ref to keep track of the latest value of openChatroomId
  const openChatroomIdRef = useRef(openChatroomId);

  useEffect(() => {
    openChatroomIdRef.current = openChatroomId;
  }, [openChatroomId]);

  useEffect(() => {
    if (token && !socket) {
      const newSocket = new WebSocket("ws://localhost:5000");

      newSocket.onopen = () => {
        newSocket.send(JSON.stringify({ type: "authenticate", token }));
      };

      newSocket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        if (message.type === "chatMessage") {
          if (
            openChatroomIdRef.current &&
            message.data.chatroomId === openChatroomIdRef.current
          ) {
            dispatch(markMessagesAsSeen(openChatroomIdRef.current));
          }
          dispatch(addMessage({ ...message.data, receivedBy: [user._id] }));
          dispatch(fetchMessagesByMembership());
        }
      };

      newSocket.onclose = () => {
        setSocket(null);
      };

      setSocket(newSocket);

      return () => {
        if (newSocket.readyState === WebSocket.OPEN) newSocket.close();
      };
    }
  }, [token, socket, dispatch, user]);

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

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../utils/websocket";
import axios from "axios";

export const ChatRoomPage = () => {
  const { chatRoomId } = useParams();
  const { messages, setMessages } = useState([]);
  const { newMessage, setNewMessage } = useState("");

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `/api/chatrooms/${chatRoomId}/messages`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching the chat history:", error);
      }
    };

    fetchChatHistory();

    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.chatRoomId === chatRoomId) {
        setMessages((messages) => [...messages, message]);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [chatRoomId, setMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = { content: newMessage, chatRoomId };
      socket.send(JSON.stringify(message));
      setNewMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

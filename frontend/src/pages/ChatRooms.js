import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ChatRoom from "../components/ChatRoom";

export const ChatRooms = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        console.log("Fetching chat rooms...");
        const response = await axios.get("/api/chatrooms", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log("Chat rooms fetched:", response.data);
        setChatRooms(response.data.chatrooms);
      } catch (error) {
        console.error("Error fetching chat rooms", error);
      }
    };

    fetchChatRooms();
  }, [user]);

  return (
    <div>
      <h1>Chat Rooms</h1>
      {chatRooms.length > 0 ? (
        chatRooms.map((chatRoom) => (
          <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
        ))
      ) : (
        <p>No chat rooms available</p>
      )}
    </div>
  );
};

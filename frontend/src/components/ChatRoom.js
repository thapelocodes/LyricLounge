import React from "react";
import { useNavigate } from "react-router-dom";

const ChatRoom = ({ chatRoom }) => {
  const navigate = useNavigate();

  const handleEnterChatRoom = () => {
    navigate.push(`/chatroom/${chatRoom._id}`);
  };

  return (
    <div onClick={handleEnterChatRoom}>
      <h2>{chatRoom.name}</h2>
      <p>{chatRoom.unreadMessages}</p>
    </div>
  );
};

export default ChatRoom;

import React from "react";
import { useHistory } from "react-router-dom";

export const ChatRoom = ({ chatRoom }) => {
  const history = useHistory();

  const handleEnterChatRoom = () => {
    history.push(`/chatroom/${chatRoom._id}`);
  };

  return (
    <div onClick={handleEnterChatRoom}>
      <h2>{chatRoom.name}</h2>
      <p>{chatRoom.unreadMessages}</p>
    </div>
  );
};

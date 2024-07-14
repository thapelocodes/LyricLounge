import React from "react";
import { useSelector } from "react-redux";

const ChatRoom = ({ chatRoom, onJoin, onLeave }) => {
  const userChatrooms = useSelector((state) => state.chat.userChatrooms);
  const isMember = userChatrooms.some((c) => c._id === chatRoom._id);
  return (
    <div>
      <h3>{chatRoom.name}</h3>
      <p>{chatRoom.description}</p>
      {isMember ? (
        <>
          <button onClick={() => onLeave(chatRoom._id)}>Leave</button>
          <button>Chat</button>
        </>
      ) : (
        <button onClick={() => onJoin(chatRoom._id)}>Join</button>
      )}
    </div>
  );
};

export default ChatRoom;

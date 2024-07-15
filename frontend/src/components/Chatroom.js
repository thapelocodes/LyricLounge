import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinChatroom, leaveChatroom } from "../features/chat/chatSlice";

const ChatRoom = ({ chatRoom }) => {
  const dispatch = useDispatch();
  const userChatrooms = useSelector((state) => state.user.chatrooms);
  const isMember = userChatrooms.some((c) => c._id === chatRoom._id);
  const onJoin = (chatroomId) => {
    dispatch(joinChatroom(chatroomId));
  };
  const onLeave = (chatroomId) => {
    dispatch(leaveChatroom(chatroomId));
  };

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

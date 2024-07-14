import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChatrooms, fetchUserChatrooms } from "../store/chatroom/actions";
import ChatRoom from "../components/Chatroom";

export const Chatrooms = () => {
  const dispatch = useDispatch();
  const chatrooms = useSelector((state) => state.chat.chatrooms);
  const userChatrooms = useSelector((state) => state.chat.userChatrooms);

  useEffect(() => {
    dispatch(fetchChatrooms());
    dispatch(fetchUserChatrooms());
  }, [dispatch]);

  return (
    <div>
      <h1>Chatrooms</h1>
      <div>
        <h2>Public Chatrooms</h2>
        {chatrooms.map((chatRoom) => (
          <ChatRoom
            key={chatRoom._id}
            chatRoom={chatRoom}
            onJoin={() => {}}
            onLeave={() => {}}
          />
        ))}
      </div>
      <div>
        <h2>Your Chatrooms</h2>
        {userChatrooms.map((chatRoom) => (
          <ChatRoom
            key={chatRoom._id}
            chatRoom={chatRoom}
            onJoin={() => {}}
            onLeave={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

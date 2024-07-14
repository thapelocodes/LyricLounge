import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChatrooms, fetchUserChatrooms } from "../features/chat/chatSlice";
import ChatRoom from "../components/Chatroom";

export const Chatrooms = () => {
  const dispatch = useDispatch();
  const { chatrooms, userChatrooms, loading } = useSelector(
    (state) => state.chat
  );

  useEffect(() => {
    dispatch(fetchChatrooms());
    dispatch(fetchUserChatrooms());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

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

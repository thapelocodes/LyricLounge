import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChatrooms, fetchUserChatrooms } from "../features/chat/chatSlice";
import ChatRoom from "../components/Chatroom";
import CreateChatroom from "../components/CreateChatroom";

export const Chatrooms = () => {
  const dispatch = useDispatch();
  const { chatrooms, userChatrooms, loading, error } = useSelector(
    (state) => state.chat
  );

  useEffect(() => {
    dispatch(fetchChatrooms());
    dispatch(fetchUserChatrooms());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Chatrooms</h1>
      <div>
        <h2>Your Chatrooms</h2>
        {userChatrooms.map((chatRoom) => (
          <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
        ))}
      </div>
      <div>
        <h2>Public Chatrooms</h2>
        {chatrooms.map((chatRoom) => (
          <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
        ))}
      </div>
      <CreateChatroom />
    </div>
  );
};

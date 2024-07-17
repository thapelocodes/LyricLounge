import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChatrooms, fetchUserChatrooms } from "../features/chat/chatSlice";
import ChatRoom from "../components/Chatroom";
import CreateChatroom from "../components/CreateChatroom";
import OpenChatRoom from "../components/OpenChatroom";

export const Chatrooms = () => {
  const dispatch = useDispatch();
  const { chatrooms, userChatrooms, loading, error, openChatroomId } =
    useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchChatrooms());
    dispatch(fetchUserChatrooms());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const openChatroom =
    chatrooms.find((c) => c._id === openChatroomId) ||
    userChatrooms.find((c) => c._id === openChatroomId);

  return (
    <div>
      <h1>Chatrooms</h1>
      <div>
        <h2>Your Chatrooms</h2>
        {userChatrooms.map((chatRoom) => (
          <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
        ))}
      </div>
      {openChatroomId && openChatroom && (
        <OpenChatRoom chatRoom={openChatroom} />
      )}
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

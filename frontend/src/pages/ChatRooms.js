import React, { useEffect } from "react";
import { fetchChatRooms } from "../features/chatroom/chatroomSlice";
import { useDispatch, useSelector } from "react-redux";
import ChatRoom from "../components/ChatRoom";

export const ChatRooms = () => {
  const dispatch = useDispatch();
  const { chatrooms, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching chat rooms:{error.message}</p>;

  return (
    <div>
      <h1>Chat Rooms</h1>
      {chatrooms ? (
        chatrooms.map((chatRoom) => (
          <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
        ))
      ) : (
        <p>No chat rooms available</p>
      )}
    </div>
  );
};

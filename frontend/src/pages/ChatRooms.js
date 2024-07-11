import React, { useEffect, useState } from "react";
import { fetchChatRooms } from "../features/chatroom/chatroomSlice";
import { useDispatch, useSelector } from "react-redux";
import ChatRoom from "../components/ChatRoom";
import SearchChatRooms from "../components/SearchChatRoom";

export const ChatRooms = () => {
  const dispatch = useDispatch();
  const { chatrooms, loading, error } = useSelector((state) => state.auth);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

  const handleOpenSearch = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching chat rooms:{error.message}</p>;

  return (
    <div>
      <h1>Chat Rooms</h1>
      <button onClick={handleOpenSearch}>Search</button>
      {showSearch && <SearchChatRooms onClose={handleCloseSearch} />}
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

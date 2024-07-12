import React, { useEffect, useState } from "react";
import {
  fetchChatRooms,
  searchChatRooms,
} from "../features/chatroom/chatroomSlice";
import { useDispatch, useSelector } from "react-redux";
import ChatRoom from "../components/ChatRoom";
import SearchChatRooms from "../components/SearchChatRoom";

export const ChatRooms = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { chatrooms, searchResults, loading, error } = useSelector(
    (state) => state.chat
  );
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (token) dispatch(fetchChatRooms());
  }, [token, dispatch]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    dispatch(searchChatRooms(searchTerm));
  };

  const displayChatRooms = searchTerm ? searchResults : chatrooms;

  return (
    <div>
      <h1>Chat Rooms</h1>
      <button onClick={() => setShowSearch(true)}>Discover Chat Rooms</button>
      {showSearch && (
        <SearchChatRooms
          onClose={() => setShowSearch(false)}
          onSearch={handleSearch}
        />
      )}
      {displayChatRooms && displayChatRooms.length > 0 ? (
        displayChatRooms.map((chatRoom) => (
          <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
        ))
      ) : (
        <p>No chat rooms available</p>
      )}
      {loading && <p>Loading chat rooms...</p>}
      {error && <p>Error fetching chat rooms: {error}</p>}
    </div>
  );
};

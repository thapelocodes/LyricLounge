import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const SearchChatRooms = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const handleSearch = async () => {
    try {
      if (!user || !user.token) {
        console.error("User token is missing.");
        return;
      }

      console.log(`User token: ${user.token}`);
      const response = await axios.get(
        `/api/chatrooms/search?query=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Search results: ", response.data.chatrooms);
      setResults(response.data.chatrooms);
    } catch (error) {
      console.error("Error searching chat rooms: ", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    }
  };

  return (
    <div className="search-popup">
      <div className="search-popup-content">
        <button onClick={onClose}>Close</button>
        <input
          type="text"
          placeholder="Search chat rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <div className="search-results">
          {results.length > 0 ? (
            results.map((chatRoom) => (
              <div key={chatRoom._id}>
                <h4>{chatRoom.name}</h4>
                <p>{chatRoom.description}</p>
                <button>Join</button>
              </div>
            ))
          ) : (
            <p>No chat rooms found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchChatRooms;

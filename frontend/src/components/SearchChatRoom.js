import React, { useState } from "react";

const SearchChatRooms = ({ onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
    onClose();
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
      </div>
    </div>
  );
};

export default SearchChatRooms;

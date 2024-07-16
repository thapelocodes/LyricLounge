import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChatroom } from "../features/chat/chatSlice";

const CreateChatroom = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.chat);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createChatroom({ name, description }));
  };

  return (
    <div>
      <h2>Create a Chatroom</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreateChatroom;

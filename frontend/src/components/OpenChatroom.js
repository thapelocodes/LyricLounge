import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../features/chat/chatSlice";

const OpenChatRoom = ({ chatRoom }) => {
  const dispatch = useDispatch();
  const messages =
    useSelector((state) => state.chat.messages[chatRoom._id]) || [];
  const [content, setContent] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    dispatch(sendMessage({ chatroomId: chatRoom._id, content }));
    setContent("");
  };

  return (
    <div>
      <h3>{chatRoom.name}</h3>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <p>
              {message.sender}: {message.content}{" "}
              <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
            </p>
            {message.isEdited && <small>(edited)</small>}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default OpenChatRoom;

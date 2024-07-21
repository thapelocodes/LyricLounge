import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../features/chat/chatSlice";
import { useWebSocket } from "../context/WebSocketContext";

const OpenChatRoom = ({ chatRoom }) => {
  const dispatch = useDispatch();
  const messages =
    useSelector((state) => state.chat.messages[chatRoom._id]) || [];
  const [content, setContent] = useState("");
  const { sendMessage: sendWebSocketMessage } = useWebSocket();
  const username = useSelector((state) => state.auth.user.username);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = {
      chatroomId: chatRoom._id,
      sender: username,
      content,
      timestamp: new Date(),
    };
    dispatch(sendMessage(message));
    sendWebSocketMessage(message);
    setContent("");
  };

  return (
    <div>
      <h3>{chatRoom.name}</h3>
      <div>
        {messages.map((message) =>
          message && message.sender && message.content ? (
            <div key={message._id}>
              <p>
                {message.sender}: {message.content}{" "}
                <small>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </small>
              </p>
              {message.isEdited && <small>(edited)</small>}
            </div>
          ) : (
            <p key={Math.random()} style={{ color: "red" }}>
              Invalid message format.
            </p>
          )
        )}
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

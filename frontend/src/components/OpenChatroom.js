import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenChatroom, sendMessage } from "../features/chat/chatSlice";
import { useWebSocket } from "../context/WebSocketContext";
import { Box, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const MessageBox = styled(Box)(({ theme }) => ({
  maxHeight: 400,
  overflowY: "auto",
  marginBottom: theme.spacing(2),
}));

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

  const handleCloseChatroom = () => dispatch(setOpenChatroom(null));

  return (
    <Box>
      <Typography variant="h6">{chatRoom.name}</Typography>
      <Button variant="outlined" color="error" onClick={handleCloseChatroom}>
        Close
      </Button>
      <MessageBox>
        {messages.map((message) =>
          message && message.sender && message.content ? (
            <Box key={message._id} mb={1}>
              <Typography variant="body2">
                {message.sender}: {message.content}{" "}
                <small>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </small>
                {message.isEdited && <small> (edited)</small>}
              </Typography>
            </Box>
          ) : (
            <Typography key={Math.random()} color="error">
              Invalid message format.
            </Typography>
          )
        )}
      </MessageBox>
      <form onSubmit={handleSendMessage}>
        <TextField
          fullWidth
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </form>
    </Box>
  );
};

export default OpenChatRoom;

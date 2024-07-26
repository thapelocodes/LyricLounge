import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenChatroom, sendMessage } from "../features/chat/chatSlice";
import { useWebSocket } from "../context/WebSocketContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const MessageBox = styled(Box)(({ theme }) => ({
  maxHeight: 400,
  overflowY: "auto",
  marginBottom: theme.spacing(2),
}));

const MessageCard = styled(Card)(({ theme, owner }) => ({
  maxWidth: "65%",
  maxHeight: "100px",
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  backgroundColor: owner ? "#f0f0f0" : "#fefefe",
}));

const SenderName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
}));

const MessageContent = styled(Typography)(({ theme }) => ({
  fontWeight: 200,
}));

const MessageTimestamp = styled(CardActions)(({ theme }) => ({
  justifyContent: "flex-end",
  padding: theme.spacing(1),
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

  const formatter = new Intl.DateTimeFormat("en", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <Box>
      <Typography variant="h6">{chatRoom.name}</Typography>
      <Button variant="outlined" color="error" onClick={handleCloseChatroom}>
        Close
      </Button>
      <MessageBox>
        {messages.map((message) =>
          message && message.sender && message.content ? (
            <MessageCard key={message._id} owner={message.sender === username}>
              <CardContent>
                <SenderName variant="body2">{message.sender}</SenderName>
                <MessageContent variant="body2">
                  {message.content}{" "}
                  {message.isEdited && <small> (edited)</small>}
                </MessageContent>
                <MessageTimestamp>
                  <Typography variant="caption" color="textSecondary">
                    {formatter.format(new Date(message.timestamp))}
                  </Typography>
                </MessageTimestamp>
              </CardContent>
            </MessageCard>
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

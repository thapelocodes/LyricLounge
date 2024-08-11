import React, { useEffect, useRef, useState } from "react";
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
  position: "relative",
}));

const MessageCard = styled(Card)(({ theme, owner }) => ({
  maxWidth: "65%",
  // maxHeight: "100px",
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  backgroundColor: owner ? "#f0f0f0" : "#fefefe",
  marginLeft: owner ? "auto" : 10,
  marginRight: owner ? 10 : "auto",
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

const StyledMessageForm = styled("form")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 25,
    height: 50,
    marginBottom: theme.spacing(1),
    maxWidth: "calc(100% - 20px)",
  },
  height: 50,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const OpenChatRoom = ({ chatRoom }) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const messages =
    useSelector((state) => state.chat.messages[chatRoom._id]) || [];
  const [content, setContent] = useState("");
  const { sendMessage: sendWebSocketMessage } = useWebSocket();
  const username = useSelector((state) => state.auth.user.username);
  const messageBoxRef = useRef(null);

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

  useEffect(() => {
    messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
  }, [messages]);

  return (
    <Box>
      <Typography variant="h6">{chatRoom.name}</Typography>
      <StyledButton
        variant="outlined"
        color="error"
        onClick={handleCloseChatroom}
      >
        Close
      </StyledButton>
      <MessageBox ref={messageBoxRef}>
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
      <StyledMessageForm onSubmit={handleSendMessage}>
        <StyledTextField
          fullWidth
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <StyledButton variant="contained" color="primary" type="submit">
          Send
        </StyledButton>
      </StyledMessageForm>
    </Box>
  );
};

export default OpenChatRoom;

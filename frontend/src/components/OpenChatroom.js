import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenChatroom, sendMessage } from "../features/chat/chatSlice";
import { useWebSocket } from "../context/WebSocketContext";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmojiPicker from "emoji-picker-react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";

const MessageBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(10),
  paddingTop: theme.spacing(2),
  overflowY: "auto",
  marginBottom: theme.spacing(8),
  position: "relative",
}));

const MessageBoxHeader = styled(AppBar)(({ theme }) => ({
  height: 60,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

const MessageCard = styled(Card)(({ theme, owner }) => ({
  maxWidth: "65%",
  minHeight: 25,
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
  position: "fixed",
  bottom: 0,
  width: "100%",
  height: 50,
  backgroundColor: "#f0f0f0",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 25,
    height: 40,
    // marginBottom: theme.spacing(1),
    // marginLeft: theme.spacing(1),
    // maxWidth: "calc(100% - 30px)",
  },
  height: 40,
}));

const StyledButton = styled(Button)(({ theme, color }) => ({
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(1),

  ...(color === "secondary" && {
    marginRight: theme.spacing(0),
  }),
}));

const EmojiButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(1),
}));

const OpenChatRoom = ({ chatRoom }) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const messages =
    useSelector((state) => state.chat.messages[chatRoom._id]) || [];
  const [content, setContent] = useState("");
  const { sendMessage: sendWebSocketMessage } = useWebSocket();
  const username = useSelector((state) => state.auth.user.username);
  const messageBoxRef = useRef(null);
  const inputRef = useRef(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false); // Emoji picker visibility state

  const handlePickerVisibility = () => {
    inputRef.current.focus();
    setIsPickerVisible(!isPickerVisible);
  };

  const onEmojiClick = (emojiObject) => {
    setContent((prevContent) => prevContent + emojiObject.emoji); // Append emoji to the message content
  };

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
    setIsPickerVisible(false);
  };

  const handleCloseChatroom = () => dispatch(setOpenChatroom(null));

  const formatter = new Intl.DateTimeFormat("en", {
    dateStyle: "short",
    timeStyle: "short",
  });

  useEffect(() => {
    messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    window.scroll(0, document.body.scrollHeight);
  }, [messages]);

  return (
    <Box>
      <MessageBoxHeader>
        <StyledToolbar>
          <Typography variant="h6" color="white">
            {chatRoom.name}
          </Typography>
          <StyledButton
            variant="contained"
            color="secondary"
            onClick={handleCloseChatroom}
          >
            Close
          </StyledButton>
        </StyledToolbar>
      </MessageBoxHeader>
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
        <EmojiButton variant="none" onClick={handlePickerVisibility}>
          <InsertEmoticonOutlinedIcon />
        </EmojiButton>
        <StyledTextField
          fullWidth
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          ref={inputRef}
        />
        {isPickerVisible && (
          <Box sx={{ position: "absolute", bottom: "60px", right: "10px" }}>
            <EmojiPicker onEmojiClick={onEmojiClick} /*emojiStyle="native"*/ />
          </Box>
        )}
        <StyledButton variant="none" color="primary" type="submit">
          <SendRoundedIcon />
        </StyledButton>
      </StyledMessageForm>
    </Box>
  );
};

export default OpenChatRoom;

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  leaveChatroom,
  setOpenChatroom,
  sendMessage,
} from "../features/chat/chatSlice";
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
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmojiPicker from "emoji-picker-react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import BackIcon from "@mui/icons-material/ArrowBack";
import OptionsIcon from "@mui/icons-material/MoreVert";

const MessageBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(10),
  paddingTop: theme.spacing(2),
  overflowY: "auto",
  marginBottom: theme.spacing(8),
  position: "relative",
  height: window.innerWidth < 1024 ? "100%" : "70vh",
}));

const MessageBoxHeader = styled(AppBar)(({ theme }) => ({
  height: 60,
  // display: window.innerWidth < 1024 ? "block" : "none",
  width: window.innerWidth < 1024 ? "100%" : "50%",
  top: window.innerWidth < 1024 ? "none" : theme.spacing(8),
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
  width: window.innerWidth < 1024 ? "100%" : "50%",
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

  ...(color === "primary" && {
    marginRight: theme.spacing(0),
  }),
}));

const StyledHeaderButton = styled("div")(({ theme }) => ({
  borderRadius: "50%",
  padding: theme.spacing(1),
  "&:hover": {
    backgroundColor: "rgb(240, 240, 240, 0.1)",
    cursor: "pointer",
    // boxShadow: "0px 1px 2px",
  },
}));

const EmojiButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(1),
}));

const StyledMenu = styled(Menu)(({ theme }) => ({}));

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
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLeaveChatroom = (chatroomId) => {
    handleCloseChatroom();
    dispatch(leaveChatroom(chatroomId));
  };

  const formatter = new Intl.DateTimeFormat("en", {
    dateStyle: "short",
    timeStyle: "short",
  });

  useEffect(() => {
    messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    window.scroll(0, document.body.scrollHeight);
  }, [messages]);

  return (
    <Box style={{ height: window.innerWidth < 1024 ? "100%" : "50vh" }}>
      <MessageBoxHeader>
        <StyledToolbar>
          <StyledHeaderButton onClick={handleCloseChatroom}>
            <BackIcon />
          </StyledHeaderButton>
          <Typography variant="h6" color="white">
            {chatRoom.name}
          </Typography>
          <StyledHeaderButton
            id="chat-menu-button"
            aria-controls={isMenuOpen ? "chat-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? "true" : undefined}
            onClick={isMenuOpen ? handleMenuClose : handleMenuOpen}
          >
            <OptionsIcon />
          </StyledHeaderButton>
          <StyledMenu
            id="chat-menu"
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 70, horizontal: "right" }}
            onClick={handleMenuClose}
            MenuListProps={{ "aria-labelledby": "chat-menu-button" }}
          >
            <MenuItem onClick={() => handleLeaveChatroom(chatRoom._id)}>
              Leave
            </MenuItem>
          </StyledMenu>
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

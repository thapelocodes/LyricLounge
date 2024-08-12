import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  joinChatroom,
  leaveChatroom,
  setOpenChatroom,
  fetchChatHistory,
} from "../features/chat/chatSlice";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "flex",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  ".chat-button[color='primary']": {
    justifyContent: "end",
    alignSelf: "end",
  },
}));

const StyledNotification = styled(Typography)(({ theme }) => ({
  color: "whitesmoke",
  backgroundColor: theme.palette.secondary.main,
  textAlign: "center",
  maxWidth: "1.4rem",
  borderRadius: "50%",
  right: 0,
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translateY(0)",
    },
    "40%": {
      transform: "translateY(-30px)",
    },
    "60%": {
      transform: "translateY(-15px)",
    },
  },
  animation: "none",
  "&:hover": {
    animation: "bounce 1s",
  },
  marginTop: theme.spacing(1),
}));

const ChatRoom = ({ chatRoom }) => {
  const dispatch = useDispatch();
  const { userChatrooms, notifications } = useSelector((state) => state.chat);
  const isMember = userChatrooms.some((c) => c._id === chatRoom._id);
  const notificationsRef = useRef();
  const chatroomNotifications = notifications[chatRoom._id];

  const onJoin = (chatroomId) => {
    dispatch(joinChatroom(chatroomId));
  };

  const onLeave = (chatroomId) => {
    dispatch(leaveChatroom(chatroomId));
  };

  const onOpen = (chatroomId) => {
    dispatch(setOpenChatroom(chatroomId));
    dispatch(fetchChatHistory(chatroomId));
  };

  useEffect(() => {
    if (notificationsRef.current) {
      notificationsRef.current.style.animation = "bounce 1s";
      const timeout = setTimeout(() => {
        notificationsRef.current.style.animation = "none";
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [chatroomNotifications]);

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6">{chatRoom.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {chatRoom.description}
        </Typography>
        <StyledNotification ref={notificationsRef}>
          {notifications[chatRoom._id] > 0 && notifications[chatRoom._id]}
        </StyledNotification>
        <Box mt={2}>
          {isMember ? (
            <>
              <StyledButton
                variant="outlined"
                color="error"
                onClick={() => onLeave(chatRoom._id)}
              >
                Leave
              </StyledButton>
              <StyledButton
                className="chat-button"
                variant="contained"
                color="primary"
                onClick={() => onOpen(chatRoom._id)}
              >
                Chat
              </StyledButton>
            </>
          ) : (
            <StyledButton
              variant="contained"
              color="primary"
              onClick={() => onJoin(chatRoom._id)}
            >
              Join
            </StyledButton>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ChatRoom;

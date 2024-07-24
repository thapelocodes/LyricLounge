import React from "react";
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
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const ChatRoom = ({ chatRoom }) => {
  const dispatch = useDispatch();
  const userChatrooms = useSelector((state) => state.chat.userChatrooms);
  const isMember = userChatrooms.some((c) => c._id === chatRoom._id);

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

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6">{chatRoom.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {chatRoom.description}
        </Typography>
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

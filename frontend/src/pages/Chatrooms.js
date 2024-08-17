import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  fetchChatrooms,
  fetchUserChatrooms,
  fetchMessagesByMembership,
} from "../features/chat/chatSlice";
import ChatRoom from "../components/Chatroom";
import CreateChatroom from "../components/CreateChatroom";
import OpenChatRoom from "../components/OpenChatroom";

// Styled components
const Container = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(8),
  backgroundColor: theme.palette.background.default,
  height: "100%",
}));

const SectionCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  marginBottom: theme.spacing(3),
}));

const LoadingContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}));

const ErrorContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}));

export const Chatrooms = () => {
  const dispatch = useDispatch();
  const { chatrooms, userChatrooms, loading, error, openChatroomId } =
    useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchChatrooms());
    dispatch(fetchUserChatrooms());
    dispatch(fetchMessagesByMembership());
  }, [dispatch]);

  if (loading)
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  if (error)
    return (
      <ErrorContainer>
        <Alert severity="error">{error}</Alert>
      </ErrorContainer>
    );

  const openChatroom =
    chatrooms.find((c) => c._id === openChatroomId) ||
    userChatrooms.find((c) => c._id === openChatroomId);

  return openChatroomId && openChatroom ? (
    <Grid item xs={12} md={6}>
      {openChatroomId && openChatroom && (
        <OpenChatRoom chatRoom={openChatroom} />
      )}
    </Grid>
  ) : (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SectionCard>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Your Chatrooms
              </Typography>
              {userChatrooms.map((chatRoom) => (
                <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
              ))}
            </CardContent>
          </SectionCard>
        </Grid>
        <Grid item xs={12}>
          <SectionCard>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Public Chatrooms
              </Typography>
              {chatrooms.map((chatRoom) => (
                <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
              ))}
            </CardContent>
          </SectionCard>
        </Grid>
        <Grid item xs={12}>
          <CreateChatroom />
        </Grid>
      </Grid>
    </Container>
  );
};

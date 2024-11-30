import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
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
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

// Styled components
const Container = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(12),
  borderRadius: "0px",
  height: window.innerWidth < 1024 ? "100%" : "calc(100vh - 66px)",
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: "20px",
  boxShadow: "none",
  backgroundColor: theme.palette.background.default,
  height: window.innerWidth < 640 ? "50vh" : "70vh",
  overflowY: "auto",
  scrollbarWidth: "none",
  // "&:not(:last-child)": {
  // borderBottom: `1px solid ${theme.palette.border.dark}`,
  // },
  border: `1px solid ${theme.palette.border.dark}`,
  margin: "10px",
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

const StyledButton = styled(Button)(({ theme }) => ({
  display: "flex",
  padding: "10px",
  alignItems: "center",
  justifyContent: "center",
  margin: "0px auto 20px auto",
  backgroundColor: "#e2e4f7",
  // top: window.innerWidth < 960 ? -20 : 0,
}));

export const Chatrooms = () => {
  const dispatch = useDispatch();
  const { chatrooms, userChatrooms, loading, error, openChatroomId } =
    useSelector((state) => state.chat);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(!isFormOpen);
  };

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

  return openChatroomId && openChatroom && window.innerWidth < 1024 ? (
    <Grid item xs={12} md={6}>
      {openChatroomId && openChatroom && (
        <OpenChatRoom chatRoom={openChatroom} />
      )}
    </Grid>
  ) : (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={10} md={6} lg={3}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            textAlign="center"
          >
            Your Chatrooms
          </Typography>
          <SectionCard>
            <CardContent>
              {userChatrooms.map((chatRoom) => (
                <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
              ))}
            </CardContent>
          </SectionCard>
        </Grid>
        <Grid item xs={12} sm={10} md={6} lg={3}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            textAlign="center"
          >
            Public Chatrooms
          </Typography>
          <SectionCard>
            <CardContent>
              {chatrooms.map((chatRoom) => (
                <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
              ))}
            </CardContent>
          </SectionCard>
        </Grid>
        {window.innerWidth >= 1024 && (
          <Grid item lg={6}>
            {openChatroomId && openChatroom && (
              <OpenChatRoom chatRoom={openChatroom} />
            )}
          </Grid>
        )}
        <Grid item xs={12} lg={6}>
          {!isFormOpen ? (
            <StyledButton onClick={handleOpenForm}>
              <AddIcon />
              New Chatroom
            </StyledButton>
          ) : (
            <div>
              <StyledButton onClick={handleOpenForm}>
                <CloseIcon />
              </StyledButton>
              <CreateChatroom />
            </div>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

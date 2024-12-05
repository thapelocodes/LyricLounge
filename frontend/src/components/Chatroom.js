import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  joinChatroom,
  setOpenChatroom,
  fetchChatHistory,
} from "../features/chat/chatSlice";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  // marginBottom: theme.spacing(2),
  "&:not(:last-child)": {
    borderBottom: `1px solid ${theme.palette.border.dark}`,
  },
  // display: "flex",
  borderRadius: 0,
  boxShadow: "none",
  backgroundColor: theme.palette.background.default,
  height: "80px",
  "&:hover": {
    // backgroundColor: theme.palette.background.paper,
    cursor: "pointer",
  },
  // "&:hover :only-child": {
  //   backgroundColor: theme.palette.background.paper,
  // },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  ".chat-button[color='primary']": {
    justifyContent: "end",
    alignSelf: "end",
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  margin: "auto auto auto 0",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "70%",
  // border: `1px solid ${theme.palette.secondary.main}`,
}));

const StyledNotification = styled(Typography)(({ theme }) => ({
  color: "whitesmoke",
  border: `1px solid ${theme.palette.secondary.main}`,
  backgroundColor: theme.palette.secondary.light,
  textAlign: "center",
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "50%",
  left: -10,
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
  margin: theme.spacing(2),
}));

const JoinAlert = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  top: "45%",
  left: "10%",
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 10,
  boxShadow: `-1px -1px 3px ${theme.palette.primary.main}, 1px 1px 3px ${theme.palette.secondary.main}`,
}));

const ChatRoom = ({ chatRoom }) => {
  const dispatch = useDispatch();
  const { userChatrooms, notifications } = useSelector((state) => state.chat);
  const isMember = userChatrooms.some((c) => c._id === chatRoom._id);
  const notificationsRef = useRef();
  const chatroomNotifications = notifications[chatRoom._id];
  const [windowSize, setWindowSize] = useState();
  const [openOptions, setOpenOptions] = useState(false);
  const openOptionsRef = useRef();

  const onJoin = (chatroomId) => {
    setOpenOptions(false);
    dispatch(joinChatroom(chatroomId));
  };

  const onOpen = (chatroomId) => {
    dispatch(setOpenChatroom(chatroomId));
    dispatch(fetchChatHistory(chatroomId));
  };

  const onOpenOptions = () => {
    setOpenOptions(!openOptions);
  };

  const handleOutsideClick = (event) => {
    if (
      openOptionsRef.current &&
      !openOptionsRef.current.contains(event.target)
    )
      setOpenOptions(false);
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

  useEffect(() => {
    if (window !== undefined) {
      setWindowSize(window.innerWidth);
      const handleResize = () => {
        setWindowSize(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (openOptions) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  return (
    <StyledCard
      onClick={() => (isMember ? onOpen(chatRoom._id) : onOpenOptions())}
    >
      <CardContent
        style={{
          padding: 0,
          paddingLeft: 7.5,
          margin: 0,
          width: "100%",
          height: "100%",
          // borderRadius: windowSize < 768 ? 5 : 25,
          display: "flex",
        }}
      >
        <StyledBox>
          <Typography variant={windowSize < 768 ? "body1" : "h6"}>
            {chatRoom.name}
          </Typography>
          <Typography
            variant={windowSize < 768 ? "body1" : "h6"}
            color="textSecondary"
          >
            {chatRoom.description}
          </Typography>
        </StyledBox>
        <StyledNotification
          ref={notificationsRef}
          style={{ visibility: chatroomNotifications ? "visible" : "hidden" }}
        >
          {chatroomNotifications > 0 && chatroomNotifications}
        </StyledNotification>
        {openOptions && !isMember && (
          <JoinAlert
            ref={openOptionsRef}
            style={{
              position: windowSize < 1024 ? "fixed" : "absolute",
              width: windowSize < 1024 ? "75%" : "25%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                marginRight: "auto",
                marginLeft: "auto",
                display: windowSize < 1024 ? "block" : "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant={windowSize < 768 ? "body3" : "body2"}>
                You are not a member. Join {chatRoom.name}?
              </Typography>
              <div>
                <StyledButton
                  variant="outlined"
                  color="error"
                  onClick={() => onOpenOptions()}
                  style={{
                    transform: windowSize < 768 ? "scale(0.55)" : "scale(1)",
                    margin: "auto",
                    alignSelf: "center",
                  }}
                >
                  Cancel
                </StyledButton>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={() => onJoin(chatRoom._id)}
                  style={{
                    transform: windowSize < 768 ? "scale(0.55)" : "scale(1)",
                    margin: "auto",
                    alignSelf: "center",
                  }}
                >
                  Join
                </StyledButton>
              </div>
            </div>
          </JoinAlert>
        )}
        {/* <Box mt={2}>
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
        </Box> */}
      </CardContent>
    </StyledCard>
  );
};

export default ChatRoom;

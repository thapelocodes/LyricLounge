import React from "react";
import { Footer } from "../components/Footer";
import { Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const MainContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  minHeight: "100vh",
  paddingTop: "15vh",
  "MuiTabScrollButton-root": {
    display: "none",
    width: "none",
  },
  "&::moz-scrollbar": {
    display: "none",
  },
  "&::webkit-scrollbar": {
    display: "none",
  },
  msOverflowStyle: "none",
  msScrollRails: "none",
  msScrollbarFaceColor: "none",
  msScrollbarTrackColor: "none",
  msScrollbarArrowColor: "none",
  scrollbarWidth: "none",
}));

export const Home = () => {
  return (
    <div>
      <MainContainer>
        <Typography variant="h6" gutterBottom>
          Welcome to
        </Typography>
        <Typography variant="h4" gutterBottom>
          LyricLounge
        </Typography>
        <Typography variant="body1" gutterBottom>
          Where music meets conversation.
        </Typography>
      </MainContainer>
      <Footer />
    </div>
  );
};

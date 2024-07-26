import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const MainContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  height: "calc(100vh - 128px)",
}));

export const Home = () => {
  return (
    <div>
      <Header />
      <MainContainer>
        <Typography variant="h4" gutterBottom>
          Welcome to LyricLounge
        </Typography>
        <Typography variant="body1" gutterBottom>
          Where music meets conversation
        </Typography>
      </MainContainer>
      <Footer />
    </div>
  );
};

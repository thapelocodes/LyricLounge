import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  textAlign: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const Header = () => {
  return (
    <StyledHeader>
      <Typography variant="h4">LyricLounge</Typography>
    </StyledHeader>
  );
};

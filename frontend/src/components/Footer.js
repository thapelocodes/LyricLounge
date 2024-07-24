import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  marginTop: theme.spacing(4),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const Footer = () => {
  return (
    <StyledFooter>
      <Typography variant="body2">&copy; 2024 LyricLounge</Typography>
    </StyledFooter>
  );
};

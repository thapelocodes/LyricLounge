import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { clearProfile } from "../features/profile/profileSlice";
import { logoutUser } from "../features/auth/authSlice";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

export const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearProfile());
    dispatch(logoutUser());
  };

  return (
    <AppBar>
      <StyledToolbar>
        <Typography variant="h6">LyricLounge</Typography>
        <div>
          <IconButton component={Link} to="/" color="inherit">
            <HomeIcon />
          </IconButton>
          {isAuthenticated ? (
            <>
              <IconButton component={Link} to="/profile" color="inherit">
                <PersonIcon />
              </IconButton>
              <IconButton component={Link} to="/chat" color="inherit">
                <ChatIcon />
              </IconButton>
              <IconButton onClick={handleLogout} color="inherit">
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton component={Link} to="/login" color="inherit">
                <LoginIcon />
              </IconButton>
              <IconButton component={Link} to="/register" color="inherit">
                <AppRegistrationIcon />
              </IconButton>
            </>
          )}
        </div>
      </StyledToolbar>
    </AppBar>
  );
};

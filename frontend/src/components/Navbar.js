import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { clearProfile } from "../features/profile/profileSlice";
import { logoutUser } from "../features/auth/authSlice";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.01)",
  },
  "&:hover .nav-desc": {
    opacity: 1,
    visibility: "visible",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  top: 40,
  opacity: 0,
  visibility: "hidden",
  position: "absolute",
  transition: "opacity 0.3s ease-in, visibility 0.3s ease-in",
  borderRadius: 7.5,
  backgroundColor: "rgb(255, 255, 255, 0.5)",
  padding: "4px 9px",
}));

export const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { openChatroomId } = useSelector((state) => state.chat);
  const [windowSize, setWindowSize] = useState();
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(clearProfile());
    dispatch(logoutUser());
  };

  const navigate = useNavigate();
  const clickHome = () => {
    navigate("/");
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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

  return (
    <AppBar>
      <StyledToolbar
        style={{
          display: openChatroomId && windowSize < 1024 ? "none" : "flex",
        }}
      >
        <div
          onClick={clickHome}
          style={{
            width: windowSize < 640 ? "110px" : "145px",
            height: "100%",
            display: "flex",
            padding: "5px",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={require("../assets/LyricLounge logo.png")}
            alt="LyricLounge Logo"
            width={windowSize < 768 ? "19" : "25"}
            height={windowSize < 768 ? "24.7" : "32.5"}
          />
          <Typography variant={windowSize < 768 ? "body1" : "h6"}>
            LyricLounge
          </Typography>
        </div>
        {windowSize >= 768 ? (
          <div>
            <StyledIconButton component={Link} to="/" color="inherit">
              <HomeIcon />
              <StyledTypography variant="body1" className="nav-desc">
                Home
              </StyledTypography>
            </StyledIconButton>
            {isAuthenticated ? (
              <>
                <StyledIconButton component={Link} to="/chat" color="inherit" a>
                  <ChatIcon />
                  <StyledTypography variant="body1" className="nav-desc">
                    Chat
                  </StyledTypography>
                </StyledIconButton>
                <StyledIconButton
                  component={Link}
                  to="/profile"
                  color="inherit"
                >
                  <PersonIcon />
                  <StyledTypography variant="body1" className="nav-desc">
                    Profile
                  </StyledTypography>
                </StyledIconButton>
                <StyledIconButton
                  onClick={handleLogout}
                  color="inherit"
                  className="nav-desc"
                >
                  <LogoutIcon />
                  <StyledTypography variant="body1" className="nav-desc">
                    Logout
                  </StyledTypography>
                </StyledIconButton>
              </>
            ) : (
              <>
                <StyledIconButton component={Link} to="/login" color="inherit">
                  <LoginIcon />
                  <StyledTypography variant="body1" className="nav-desc">
                    Login
                  </StyledTypography>
                </StyledIconButton>
                <StyledIconButton
                  component={Link}
                  to="/register"
                  color="inherit"
                >
                  <AppRegistrationIcon />
                  <StyledTypography variant="body1" className="nav-desc">
                    Register
                  </StyledTypography>
                </StyledIconButton>
              </>
            )}
          </div>
        ) : (
          <div>
            <IconButton
              id="menu-button"
              aria-controls={isMenuOpen ? "navbar-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? "true" : undefined}
              onClick={handleOpenMenu}
            >
              {!isMenuOpen ? <MenuIcon /> : <MenuOpenIcon />}
            </IconButton>
            <div>
              <Menu
                id="navbar-menu"
                open={isMenuOpen}
                onClose={handleCloseMenu}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 70, horizontal: "right" }}
                onClick={handleCloseMenu}
                MenuListProps={{ "aria-labelledby": "menu-button" }}
              >
                <MenuItem component={Link} to="/">
                  <HomeIcon />
                  <Typography variant="body1">Home</Typography>
                </MenuItem>
                {isAuthenticated ? (
                  <>
                    <MenuItem component={Link} to="/chat" color="inherit">
                      <ChatIcon />
                      <Typography variant="body1">Chat</Typography>
                    </MenuItem>
                    <MenuItem component={Link} to="/profile" color="inherit">
                      <PersonIcon />
                      <Typography variant="body1">Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout} color="inherit">
                      <LogoutIcon />
                      <Typography variant="body1">Logout</Typography>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem component={Link} to="/login" color="inherit">
                      <LoginIcon />
                      <Typography variant="body1">Login</Typography>
                    </MenuItem>
                    <MenuItem component={Link} to="/register" color="inherit">
                      <AppRegistrationIcon />
                      <Typography variant="body1">Register</Typography>
                    </MenuItem>
                  </>
                )}
              </Menu>
            </div>
          </div>
        )}
      </StyledToolbar>
    </AppBar>
  );
};

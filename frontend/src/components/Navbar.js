import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { clearProfile } from "../features/profile/profileSlice";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearProfile());
    dispatch(logoutUser());
  };

  return (
    <nav>
      <ul>
        <Link to="/">Home</Link>
        <br />
        {isAuthenticated ? (
          <>
            <>
              <Link to="/profile">Profile</Link>
            </>
            <br />
            <>
              <Link to="/chat">Chat</Link>
            </>
            <br />
            <>
              <button onClick={handleLogout}>Logout</button>
            </>
          </>
        ) : (
          <>
            <>
              <Link to="/login">Login</Link>
            </>
            <br />
            <>
              <Link to="/register">Register</Link>
            </>
          </>
        )}
      </ul>
    </nav>
  );
};

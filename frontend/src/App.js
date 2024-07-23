import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./routes/protectedRoutes";
import { Profile } from "./pages/Profile";
import { Navbar } from "./components/Navbar";
import { Chatrooms } from "./pages/Chatrooms";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "./features/profile/profileSlice";
import { refreshToken, logoutUser } from "./features/auth/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile()).catch(() => {
        dispatch(refreshToken()).catch(() => {
          dispatch(logoutUser());
        });
      });
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="" element={<Profile />} />
        </Route>
        <Route path="/chat" element={<PrivateRoute />}>
          <Route path="" element={<Chatrooms />} />
        </Route>
      </Routes>
    </Router>
  );
}
